import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { Avatar, Badge, Button, Card, cn } from "../components/UI.jsx";
import { IconUsers } from "../components/Icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import * as orgApi from "../api/organizations.js";
import * as resultsApi from "../api/results.js";

export function OrgAdminWorkspacePage() {
  const { user } = useAuth();
  const [org, setOrg] = useState(null);
  const [counselors, setCounselors] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const orgId = user?.organizationId?.id ?? user?.organizationId;

  useEffect(() => {
    orgApi
      .getMyOrganization()
      .then(setOrg)
      .catch((err) => setError(err.response?.data?.error ?? "Could not load organization"));

    if (orgId) {
      orgApi
        .listCounselors(orgId)
        .then(setCounselors)
        .catch(() => {});
      resultsApi
        .listOrgResults({ limit: 5 })
        .then(setRecentResults)
        .catch(() => setRecentResults([]));
    }
  }, [orgId]);

  const code = org?.code ?? user?.organizationId?.code;
  const orgName = org?.name ?? user?.organizationId?.name;
  const memberLabel = org?.type === "corporate" ? "Employees" : "Students";
  const activeCounselors = counselors.filter((c) => c.status !== "inactive");

  const { setHeaderInfo } = useOutletContext();

  useEffect(() => {
    setHeaderInfo({
      title: "Organization",
      subtitle: orgName ?? "Your workspace",
      wide: true
    });
  }, [orgName, setHeaderInfo]);

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl bg-orange/10 border border-orange/25 px-4 py-3 text-sm text-ink">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-ink to-ink-soft text-beige p-6 shadow-soft">
        <p className="text-xs uppercase tracking-wider text-beige/60 font-semibold">
          Registration code
        </p>
        <p className="font-mono text-3xl font-bold mt-2 tracking-wider text-yellow">{code ?? "…"}</p>
        <p className="text-sm text-beige/80 mt-3 leading-relaxed">
          Share with {memberLabel.toLowerCase()} for self-registration. Counselors use accounts you
          create — not this code.
        </p>
        {code && (
          <button
            type="button"
            onClick={copyCode}
            className="mt-4 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold transition"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Card className="text-center">
          <p className="text-xs text-ink/50 uppercase font-semibold">{memberLabel}</p>
          <p className="font-display text-3xl text-ink mt-1">{org?.stats?.members ?? 0}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-ink/50 uppercase font-semibold">Counselors</p>
          <p className="font-display text-3xl text-teal mt-1">{org?.stats?.counselors ?? 0}</p>
        </Card>
      </div>

      <Card className="mt-4" padded>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-ink">Counselor team</h2>
            <p className="text-sm text-ink/55 mt-0.5">
              {activeCounselors.length} active
              {counselors.length > activeCounselors.length &&
                ` · ${counselors.length - activeCounselors.length} inactive`}
            </p>
          </div>
          <Link to="/team">
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </Link>
        </div>

        {counselors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/15 py-8 text-center">
            <div className="flex justify-center text-ink/25 mb-2">
              <IconUsers size={36} />
            </div>
            <p className="text-sm text-ink/55">No counselors yet</p>
            <Link to="/team" className="inline-block mt-3">
              <Button size="sm" icon={<span className="text-lg leading-none">+</span>}>
                Add first counselor
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {counselors.slice(0, 4).map((c) => (
              <li
                key={c.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 border",
                  c.status === "inactive"
                    ? "border-ink/8 bg-ink/5 opacity-75"
                    : "border-ink/8 bg-beige/30",
                )}
              >
                <Avatar name={c.fullName} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.fullName}</p>
                  <p className="text-xs text-ink/45 truncate">{c.email}</p>
                </div>
                <Badge tone={c.status === "inactive" ? "red" : "green"}>
                  {c.status === "inactive" ? "Off" : "On"}
                </Badge>
              </li>
            ))}
            {counselors.length > 4 && (
              <li className="text-center pt-1">
                <Link to="/team" className="text-sm text-teal font-medium hover:underline">
                  View all {counselors.length} counselors
                </Link>
              </li>
            )}
          </ul>
        )}
      </Card>

      <Link
        to="/team"
        className="mt-4 block w-full py-3.5 text-center rounded-xl text-white font-semibold btn-gradient shadow-soft"
      >
        Manage counselors
      </Link>

      <Card className="mt-4" padded>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold text-ink">Recent quiz results</h2>
          <Link to="/reviews" className="text-sm text-teal font-medium hover:underline">
            View all
          </Link>
        </div>
        {recentResults.length === 0 ? (
          <p className="text-sm text-ink/55">No completed assessments yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentResults.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-ink/5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {r.user?.fullName ?? "Member"}
                  </p>
                  <p className="text-xs text-ink/50 truncate">{r.quizTitle ?? "Quiz"}</p>
                </div>
                <RiskBadge level={r.riskLevel} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
