import { Link } from "react-router-dom";
import { Badge, Card, cn } from "./UI.jsx";

export function QuizCard({ quiz }) {
  const minutes = quiz.settings?.estimatedTime ?? 15;
  const questions = quiz.settings?.totalQuestions ?? 0;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink">{quiz.title}</h3>
        <Badge tone="teal">Published</Badge>
      </div>
      {quiz.description && (
        <p className="text-sm text-ink/60 line-clamp-2">{quiz.description}</p>
      )}
      <p className="text-xs text-ink/45">
        ~{minutes} min · {questions} question{questions === 1 ? "" : "s"}
      </p>
      <Link
        to={`/quizzes/${quiz.id}`}
        className={cn(
          "w-full mt-1 h-11 rounded-xl inline-flex items-center justify-center",
          "btn-gradient text-white shadow-soft font-semibold text-sm",
        )}
      >
        Start
      </Link>
    </Card>
  );
}
