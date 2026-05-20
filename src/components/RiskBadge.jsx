const TONES = {
  Low: "bg-teal/15 text-teal border-teal/20",
  Medium: "bg-yellow/30 text-ink border-yellow/40",
  High: "bg-red-50 text-red-700 border-red-100",
};

export function RiskBadge({ level, className = "" }) {
  const tone = TONES[level] ?? TONES.Medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tone} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {level} risk
    </span>
  );
}
