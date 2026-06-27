import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { QuestionCard, QuestionNav } from "../components/QuestionCard.jsx";
import { Card } from "../components/UI.jsx";
import * as quizApi from "../api/quizzes.js";
import * as attemptApi from "../api/attempts.js";

function flattenQuestions(quiz) {
  const items = [];
  for (const group of quiz?.groups ?? []) {
    for (const q of group.questions ?? []) {
      items.push({ ...q, groupName: group.name, groupId: group.id });
    }
  }
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function QuizAttemptPage() {
  const navigate = useNavigate();
  const { quizId, attemptId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [, setAttempt] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { setHeaderInfo } = useOutletContext();

  const questions = useMemo(() => flattenQuestions(quiz), [quiz]);
  const current = questions[index];

  useEffect(() => {
    if (loading) {
      setHeaderInfo({
        title: "Quiz",
        subtitle: "Loading attempt…",
        wide: true
      });
    } else if (!quiz || !current) {
      setHeaderInfo({
        title: "Quiz",
        subtitle: "",
        wide: true
      });
    } else {
      setHeaderInfo({
        title: quiz.title,
        subtitle: "Answer honestly — there are no wrong answers",
        wide: true
      });
    }
  }, [loading, quiz, current, setHeaderInfo]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [quizData, attemptData] = await Promise.all([
        quizApi.getQuizForPlay(quizId),
        attemptApi.getAttempt(attemptId),
      ]);
      setQuiz(quizData);
      setAttempt(attemptData);

      if (attemptData.status === "completed") {
        navigate(`/results/${attemptId}`, { replace: true });
        return;
      }

      const map = {};
      for (const a of attemptData.answers ?? []) {
        map[a.questionId] = a.selectedValue;
      }
      setAnswers(map);

      const firstUnanswered = flattenQuestions(quizData).findIndex(
        (q) => map[q.id] == null,
      );
      setIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load attempt");
    } finally {
      setLoading(false);
    }
  }, [quizId, attemptId]);

  useEffect(() => {
    load();
  }, [load]);

  const persistAnswer = async (questionId, value) => {
    setSaving(true);
    try {
      const updated = await attemptApi.saveAnswers(attemptId, [
        { questionId, selectedValue: value },
      ]);
      setAttempt(updated);
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not save answer");
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = async (value) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    await persistAnswer(current.id, value);
  };

  const handleNext = async () => {
    if (!current || answers[current.id] == null) return;

    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await attemptApi.submitAttempt(attemptId);
      navigate(`/results/${attemptId}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error ?? "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (loading) {
    return (
      <p className="text-sm text-ink/50">Loading…</p>
    );
  }

  if (!quiz || !current) {
    return (
      <>
        <p className="text-sm text-red-600">{error || "No questions in this quiz."}</p>
        <Link to="/home" className="text-sm text-teal mt-4 inline-block">
          ← Back
        </Link>
      </>
    );
  }

  return (
    <>
      <ProgressBar current={index + 1} total={questions.length} className="mb-6" />

      <Card>
        <QuestionCard
          question={current}
          groupName={current.groupName}
          selectedValue={answers[current.id]}
          onSelect={handleSelect}
        />
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        <QuestionNav
          onBack={index > 0 ? handleBack : null}
          onNext={handleNext}
          canNext={answers[current.id] != null && !submitting}
          isLast={index === questions.length - 1}
          saving={saving || submitting}
        />
      </Card>
    </>
  );
}
