import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell.jsx";
import { Card } from "../components/UI.jsx";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { QuoteCard } from "../components/QuoteCard.jsx";
import { ResultChart } from "../components/ResultChart.jsx";
import * as resultsApi from "../api/results.js";

export function QuizResultPage() {
  const { attemptId } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await resultsApi.getAttemptResult(attemptId);
        if (!cancelled) setPayload(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? "Could not load result");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  const result = payload?.result;

  return (
    <AppShell
      title="Your results"
      subtitle={result?.quizTitle ?? "Assessment complete"}
      wide
    >
      {loading && <p className="text-sm text-ink/50">Loading results…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge level={result.riskLevel} />
            <span className="text-sm text-ink/60">
              Overall score{" "}
              <strong className="text-ink font-mono">
                {Number(result.normalizedScore).toFixed(2)}
              </strong>
            </span>
          </div>

          {result.quote && (
            <QuoteCard message={result.quote} type={result.quoteType} />
          )}

          <ResultChart groupScores={result.groupScores} />

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/home" className="text-sm text-teal font-medium hover:underline">
              Back to dashboard
            </Link>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
