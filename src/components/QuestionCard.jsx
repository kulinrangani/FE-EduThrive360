import { Button } from "./UI.jsx";

export function QuestionCard({ question, selectedValue, onSelect, groupName }) {
  return (
    <div className="space-y-5">
      {groupName && (
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">{groupName}</p>
      )}
      <h2 className="font-display text-xl text-ink leading-snug">{question.questionText}</h2>
      <div className="space-y-2" role="radiogroup" aria-label="Answer options">
        {(question.options ?? []).map((opt) => {
          const active = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition ${
                active
                  ? "border-teal bg-teal/10 text-ink font-medium ring-4 ring-teal/10"
                  : "border-ink/12 bg-white hover:border-teal/40 text-ink/80"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuestionNav({ onBack, onNext, canNext, isLast, saving }) {
  return (
    <div className="flex gap-3 pt-4">
      <Button variant="outline" className="flex-1" onClick={onBack} disabled={!onBack}>
        Back
      </Button>
      <Button
        className="flex-1"
        onClick={onNext}
        disabled={!canNext || saving}
      >
        {saving ? "Saving…" : isLast ? "Submit quiz" : "Next"}
      </Button>
    </div>
  );
}
