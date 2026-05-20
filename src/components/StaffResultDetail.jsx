import { RiskBadge } from "./RiskBadge.jsx";
import { QuoteCard } from "./QuoteCard.jsx";
import { ResultChart } from "./ResultChart.jsx";

export function StaffResultDetail({ result, loading, error }) {
  if (loading) return <p className="text-sm text-ink/50">Loading result…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!result) return null;

  return (
    <div className="space-y-5">
      {result.user && (
        <p className="text-sm text-ink/60">
          {result.user.fullName} · {result.user.email}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <RiskBadge level={result.riskLevel} />
        <span className="text-sm text-ink/60">
          Overall{" "}
          <strong className="font-mono text-ink">
            {Number(result.normalizedScore).toFixed(2)}
          </strong>
        </span>
      </div>
      {result.quote && <QuoteCard message={result.quote} type={result.quoteType} />}
      <ResultChart groupScores={result.groupScores} />
    </div>
  );
}
