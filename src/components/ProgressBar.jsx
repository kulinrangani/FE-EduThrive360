export function ProgressBar({ current, total, className = "" }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="flex justify-between text-xs text-ink/50 mb-1.5">
        <span>
          Question {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-ink/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
