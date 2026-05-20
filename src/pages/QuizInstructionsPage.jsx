import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell.jsx";
import { Badge, Button, Card } from "../components/UI.jsx";
import * as quizApi from "../api/quizzes.js";
import * as attemptApi from "../api/attempts.js";

export function QuizInstructionsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await quizApi.getQuizForPlay(quizId);
        if (!cancelled) setQuiz(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error ?? "Could not load quiz");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const questionCount =
    quiz?.groups?.reduce((n, g) => n + (g.questions?.length ?? 0), 0) ?? 0;

  const handleStart = async () => {
    setStarting(true);
    setError("");
    try {
      const attempt = await attemptApi.startAttempt(quizId);
      navigate(`/quizzes/${quizId}/attempt/${attempt.id}`);
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not start attempt");
    } finally {
      setStarting(false);
    }
  };

  return (
    <AppShell
      title={quiz?.title ?? "Quiz"}
      subtitle="Read before you begin"
      wide
    >
      <Link to="/home" className="text-sm text-teal hover:underline mb-4 inline-block">
        ← Back to quizzes
      </Link>

      {loading && <p className="text-sm text-ink/50">Loading…</p>}
      {error && !quiz && <p className="text-sm text-red-600">{error}</p>}

      {quiz && (
        <Card className="space-y-4">
          {quiz.description && (
            <p className="text-sm text-ink/70 leading-relaxed">{quiz.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge tone="beige">
              {questionCount} question{questionCount === 1 ? "" : "s"}
            </Badge>
            <Badge tone="beige">~{quiz.settings?.estimatedTime ?? 15} minutes</Badge>
          </div>
          <ul className="text-sm text-ink/60 space-y-2 list-disc pl-5">
            <li>One question at a time — use Next to continue.</li>
            <li>Your answers are saved as you go.</li>
            <li>Answer every question before submitting.</li>
          </ul>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleStart} disabled={starting || questionCount === 0}>
            {starting ? "Starting…" : "Begin quiz"}
          </Button>
        </Card>
      )}
    </AppShell>
  );
}
