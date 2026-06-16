import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { StaffResultDetail } from "../components/StaffResultDetail.jsx";
import { Button, Card, Modal, Select } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import * as resultsApi from "../api/results.js";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CounselorReviewsPage() {
  const { user } = useAuth();
  const orgName =
    typeof user?.organizationId === "object" ? user.organizationId?.name : null;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const { setHeaderInfo } = useOutletContext();

  useEffect(() => {
    setHeaderInfo({
      title: "Reviews",
      subtitle: orgName ? `${orgName} — quiz outcomes` : "Quiz outcomes",
      wide: true
    });
  }, [orgName, setHeaderInfo]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const params = { limit: 50 };
        if (riskFilter !== "all") params.riskLevel = riskFilter;
        const rows = await resultsApi.listOrgResults(params);
        if (!cancelled) setResults(rows);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? "Could not load results");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [riskFilter]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      setDetailError("");
      try {
        const row = await resultsApi.getResult(selectedId);
        if (!cancelled) setDetail(row);
      } catch (err) {
        if (!cancelled) setDetailError(err.response?.data?.error ?? "Could not load result");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selectedRow = useMemo(
    () => results.find((r) => r.id === selectedId),
    [results, selectedId],
  );

  const highCount = results.filter((r) => r.riskLevel === "High").length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-ink/60">
          {results.length} completed assessments
          {highCount > 0 && (
            <span className="text-red-600 font-medium"> · {highCount} high risk</span>
          )}
        </p>
        <Select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All risk levels</option>
          <option value="High">High only</option>
          <option value="Medium">Medium only</option>
          <option value="Low">Low only</option>
        </Select>
      </div>

      {loading && <p className="text-sm text-ink/50">Loading results…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <Card>
          <p className="text-sm text-ink/60">No completed quiz results yet for your organization.</p>
        </Card>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setSelectedId(r.id)}
              className="w-full text-left rounded-xl bg-white/70 border border-ink/8 px-4 py-3 hover:border-teal/30 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">
                    {r.user?.fullName ?? "Member"}
                  </p>
                  <p className="text-xs text-ink/50 truncate">
                    {r.quizTitle ?? "Quiz"} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <RiskBadge level={r.riskLevel} />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title={selectedRow?.user?.fullName ?? "Quiz result"}
        subtitle={selectedRow?.quizTitle ?? "Assessment"}
        width="max-w-lg"
      >
        <StaffResultDetail result={detail} loading={detailLoading} error={detailError} />
        <div className="mt-4">
          <Button variant="ghost" onClick={() => setSelectedId(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
