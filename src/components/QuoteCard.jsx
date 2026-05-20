export function QuoteCard({ message, type }) {
  const label =
    type === "warning" ? "Important" : type === "motivation" ? "Encouragement" : "For you";

  return (
    <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/8 to-beige/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-teal">{label}</p>
      <p className="mt-3 text-ink font-display text-lg leading-snug">&ldquo;{message}&rdquo;</p>
    </div>
  );
}
