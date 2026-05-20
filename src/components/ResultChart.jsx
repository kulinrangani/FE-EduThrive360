export function ResultChart({ groupScores = [] }) {
  if (groupScores.length === 0) return null;

  const max = 4;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase text-ink/50">Category breakdown</p>
      {groupScores.map((g) => {
        const pct = Math.min(100, Math.round((g.normalizedScore / max) * 100));
        return (
          <div key={g.groupId}>
            <div className="flex justify-between text-sm mb-1 gap-2">
              <span className="text-ink/80 truncate">{g.groupName ?? "Category"}</span>
              <span className="font-medium text-ink shrink-0">{g.riskLevel}</span>
            </div>
            <div className="h-2 rounded-full bg-beige overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[10px] text-ink/40 mt-0.5 font-mono">
              Score {Number(g.normalizedScore).toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
