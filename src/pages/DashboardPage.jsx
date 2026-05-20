import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { EmptyState } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { memberLabels } from "../utils/copy.js";
import * as quizApi from "../api/quizzes.js";
import * as resultsApi from "../api/results.js";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const org = user?.organizationId;
  const orgName = typeof org === "object" && org?.name ? org.name : null;
  const orgType = typeof org === "object" ? org?.type : null;
  const labels = memberLabels(orgType);
  const memberLabel = user?.memberType === "employee" ? labels.member : labels.member;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [list, history] = await Promise.all([
          quizApi.listPublishedQuizzes(),
          resultsApi.listMyResults({ limit: 10 }),
        ]);
        if (!cancelled) {
          setQuizzes(list);
          setResults(history);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? "Could not load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const riskTrend = results
    .slice()
    .reverse()
    .map((r, i) => ({
      label: `#${i + 1}`,
      score: Number(r.normalizedScore),
      risk: r.riskLevel,
    }));

  return (
    <AppShell
      title={`Hello, ${user?.fullName?.split(" ")[0] ?? "there"}`}
      subtitle={orgName ? `${memberLabel} at ${orgName}` : memberLabel}
    >
      <div className="rounded-2xl bg-white/70 border border-ink/8 p-5 shadow-soft">
        <h2 className="font-semibold text-ink">Your profile</h2>
        <dl className="mt-3 space-y-2 text-sm text-ink/80">
          <div className="flex justify-between gap-4">
            <dt>Email</dt>
            <dd className="font-mono text-right break-all">{user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Member type</dt>
            <dd className="capitalize">{user?.memberType ?? "—"}</dd>
          </div>
        </dl>
      </div>

      {results.length > 0 && (
        <div className="mt-4 rounded-2xl bg-white/70 border border-ink/8 p-5 shadow-soft">
          <h2 className="font-semibold text-ink">Recent results</h2>
          {riskTrend.length > 1 && (
            <div className="mt-4 flex items-end gap-1 h-16">
              {riskTrend.map((p) => (
                <div
                  key={p.label}
                  className="flex-1 rounded-t bg-teal/30 min-h-[4px]"
                  style={{ height: `${(p.score / 4) * 100}%` }}
                  title={`${p.risk} · ${p.score.toFixed(2)}`}
                />
              ))}
            </div>
          )}
          <ul className="mt-4 space-y-3">
            {results.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-ink/5 last:border-0"
              >
                <div>
                  <p className="font-medium text-ink text-sm">{r.quizTitle ?? "Quiz"}</p>
                  <p className="text-xs text-ink/50">{formatDate(r.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={r.riskLevel} />
                  {r.attemptId && (
                    <Link
                      to={`/results/${r.attemptId}`}
                      className="text-xs text-teal font-medium hover:underline"
                    >
                      View
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <h2 className="font-semibold text-ink">Available quizzes</h2>
        {loading && <p className="text-sm text-ink/50">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && quizzes.length === 0 && (
          <EmptyState
            title="No quizzes yet"
            description="Your organization has not published a quiz. Check back later."
          />
        )}
        <div className="space-y-3">
          {quizzes.map((q) => (
            <QuizCard key={q.id} quiz={q} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
