import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { QuizCard } from "../components/QuizCard.jsx";
import { RiskBadge } from "../components/RiskBadge.jsx";
import { EmptyState } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { memberLabels } from "../utils/copy.js";
import * as quizApi from "../api/quizzes.js";
import * as resultsApi from "../api/results.js";
import * as moodApi from "../api/mood.js";

const MOOD_EMOJIS = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😐", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "😁", label: "Great" }
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MoodSparkline({ data }) {
  if (!data || data.length < 2) return null;
  const w = 240;
  const h = 60;
  const max = 5;
  const min = 1;
  const range = max - min;

  // Calculate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * w;
    const y = h - ((val - min) / range) * (h - 14) - 7;
    return [x, y];
  });

  // Build SVG path
  const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const fillD = `${pathD} L ${w},${h} L 0,${h} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <line x1="0" y1={h - 7} x2={w} y2={h - 7} stroke="rgba(48,47,47,0.06)" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="0" y1={7} x2={w} y2={7} stroke="rgba(48,47,47,0.06)" strokeWidth="1" strokeDasharray="3,3" />
      
      <path d={fillD} fill="url(#moodFill)" />
      <path d={pathD} fill="none" stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {points.map((p, i) => {
        const score = data[i];
        const emojis = ["😔", "😐", "🙂", "😊", "😁"];
        const emoji = emojis[score - 1] ?? "😐";
        return (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p[0]}
              cy={p[1]}
              r="4.5"
              className="fill-teal stroke-white"
              strokeWidth="2"
            />
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <rect
                x={p[0] - 12}
                y={p[1] - 26}
                width="24"
                height="20"
                rx="6"
                fill="var(--color-ink)"
                className="shadow-soft"
              />
              <text
                x={p[0]}
                y={p[1] - 13}
                textAnchor="middle"
                fontSize="12"
                alignmentBaseline="middle"
              >
                {emoji}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Mood form state
  const [selectedMood, setSelectedMood] = useState(3);
  const [note, setNote] = useState("");
  const [submittingMood, setSubmittingMood] = useState(false);
  const [moodSuccess, setMoodSuccess] = useState(false);

  const org = user?.organizationId;
  const orgName = typeof org === "object" && org?.name ? org.name : null;
  const orgType = typeof org === "object" ? org?.type : null;
  const labels = memberLabels(orgType);
  const memberLabel = user?.memberType === "employee" ? labels.member : labels.member;

  const { setHeaderInfo } = useOutletContext();

  useEffect(() => {
    setHeaderInfo({
      title: `Welcome back, ${user?.fullName?.split(" ")[0] ?? "there"}`,
      subtitle: orgName ? `${memberLabel} at ${orgName}` : memberLabel,
      wide: true
    });
  }, [user, orgName, memberLabel, setHeaderInfo]);

  const fetchDashboardData = async () => {
    try {
      const [list, history, moodHistory] = await Promise.all([
        quizApi.listPublishedQuizzes(),
        resultsApi.listMyResults({ limit: 10 }),
        moodApi.getMoodHistory(10)
      ]);
      setQuizzes(list);
      setResults(history);
      setMoods(moodHistory);
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    setSubmittingMood(true);
    setMoodSuccess(false);
    try {
      await moodApi.createMoodCheckIn(selectedMood, note);
      setNote("");
      setMoodSuccess(true);
      // Refresh dashboard info to update charts/lists
      const moodHistory = await moodApi.getMoodHistory(10);
      setMoods(moodHistory);
      setTimeout(() => setMoodSuccess(false), 3000);
    } catch (err) {
      setError("Failed to log mood check-in.");
    } finally {
      setSubmittingMood(false);
    }
  };

  const riskTrend = results
    .slice()
    .reverse()
    .map((r, i) => ({
      label: `#${i + 1}`,
      score: Number(r.normalizedScore),
      risk: r.riskLevel,
    }));

  return (
    <>
      {results[0]?.riskLevel === "High" && (
        <div className="bg-gradient-to-r from-red-500/10 via-orange/5 to-transparent border border-red-500/15 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 fade-in">
          <div className="flex items-center gap-4">
            <span className="text-3xl shrink-0">🤝</span>
            <div>
              <h3 className="font-semibold text-ink text-sm">We are here for you</h3>
              <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                Your recent assessment indicates you might be going through a challenging time. Please remember that seeking help is a sign of strength. Our support network and organization counselors are always here to talk.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 shrink-0 w-full md:w-auto justify-end">
            <Link
              to="/wellness-hub"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-beige-deep border border-ink/15 text-ink transition shadow-soft"
            >
              Distress Resources
            </Link>
            <a
              href="tel:1-800-273-8255"
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 transition shadow-soft"
            >
              Crisis Hotline
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Columns (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Check-In Panel */}
          <div className="bg-white/60 border border-ink/8 p-6 rounded-2xl shadow-soft">
            <h2 className="font-semibold text-ink text-base flex items-center gap-1.5">
              <span>🧠</span> How are you feeling today?
            </h2>
            <p className="text-xs text-ink/60 mt-1">Check-in daily to monitor your mental wellness patterns over time.</p>

            <form onSubmit={handleMoodSubmit} className="mt-4 space-y-4">
              {moodSuccess && (
                <div className="text-xs font-semibold text-teal bg-teal/10 p-2.5 rounded-xl animate-pulse">
                  ✓ Mood logged! Thank you for checking in.
                </div>
              )}
              
              {/* Emojis selection */}
              <div className="flex justify-between items-center bg-white/40 border border-ink/5 p-2 rounded-2xl">
                {MOOD_EMOJIS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedMood(item.value)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${
                      selectedMood === item.value
                        ? "bg-teal text-white scale-110 shadow-soft"
                        : "hover:bg-white/60 text-ink/70"
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Notes Input */}
              <div>
                <input
                  type="text"
                  placeholder="Optional notes: What's making you feel this way? (e.g. finished exams, feeling tired...)"
                  className="w-full text-xs h-10 border border-ink/10 rounded-xl px-3 focus:outline-none focus:border-teal bg-white/40 focus:bg-white transition"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={150}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingMood}
                  className="px-4 py-2 text-xs font-semibold rounded-full text-white bg-teal hover:bg-teal-deep btn-gradient shadow-soft disabled:opacity-75"
                >
                  {submittingMood ? "Saving..." : "Log Mood"}
                </button>
              </div>
            </form>
          </div>

          {/* Assessment History & Trend */}
          {results.length > 0 && (
            <div className="bg-white/60 border border-ink/8 p-6 rounded-2xl shadow-soft">
              <h2 className="font-semibold text-ink text-base">Wellness & Assessment Trend</h2>
              <p className="text-xs text-ink/50 mt-0.5">Your psychometric score trend (normalized 1 - 4 scale).</p>
              
              {riskTrend.length > 1 && (
                <div className="mt-4 flex items-end gap-1.5 h-20 border-b border-ink/5 pb-2 px-2">
                  {riskTrend.map((p) => (
                    <div
                      key={p.label}
                      className="flex-1 rounded-t bg-teal/20 hover:bg-teal/40 transition min-h-[6px] relative group"
                      style={{ height: `${(p.score / 4) * 100}%` }}
                    >
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-ink text-white text-[9px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none mb-1">
                        {p.risk} ({p.score.toFixed(2)})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <ul className="mt-4 divide-y divide-ink/5">
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-ink text-sm">{r.quizTitle ?? "Quiz"}</p>
                      <p className="text-xs text-ink/50">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <RiskBadge level={r.riskLevel} />
                      {r.attemptId && (
                        <Link
                          to={`/results/${r.attemptId}`}
                          className="text-xs text-teal font-semibold hover:underline"
                        >
                          Details
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Quizzes */}
          <div className="space-y-4">
            <h2 className="font-semibold text-ink text-base">Required & General Assessments</h2>
            {loading && <p className="text-sm text-ink/50">Loading quizzes…</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!loading && !error && quizzes.length === 0 && (
              <EmptyState
                title="No quizzes yet"
                description="Your organization has not published a quiz. Check back later."
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizzes.map((q) => (
                <QuizCard key={q.id} quiz={q} />
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar Column (1/3) */}
        <div className="space-y-6">
          
          {/* Profile Quick Card */}
          <div className="bg-white/70 border border-ink/8 p-5 rounded-2xl shadow-soft">
            <h3 className="font-semibold text-ink text-sm">Your Identity</h3>
            <div className="mt-3 space-y-2.5 text-xs text-ink/85">
              <div className="flex justify-between border-b border-ink/5 pb-1.5">
                <span className="text-ink/55">Name</span>
                <span className="font-medium">{user?.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-1.5">
                <span className="text-ink/55">Email</span>
                <span className="font-mono">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/55">Group Type</span>
                <span className="capitalize font-medium">{user?.memberType ?? "—"}</span>
              </div>
            </div>
          </div>

          {/* Daily Mood Log Timeline */}
          <div className="bg-white/70 border border-ink/8 p-5 rounded-2xl shadow-soft">
            <h3 className="font-semibold text-ink text-sm flex items-center justify-between">
              <span>Daily Mood Logs</span>
              <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-medium">History</span>
            </h3>
            
            {moods.length > 1 && (
              <div className="mt-4 p-3 bg-white/40 border border-ink/5 rounded-2xl">
                <p className="text-[10px] uppercase tracking-wider font-bold text-ink/40 mb-3">Mood Trajectory</p>
                <div className="h-16 flex items-center justify-center">
                  <MoodSparkline data={moods.slice(0, 7).reverse().map((m) => m.score)} />
                </div>
              </div>
            )}
            
            {moods.length === 0 ? (
              <p className="text-xs text-ink/40 mt-4 text-center">No mood logs saved yet.</p>
            ) : (
              <div className="mt-4 space-y-3 max-h-56 overflow-y-auto pr-1">
                {moods.map((m) => {
                  const moodObj = MOOD_EMOJIS.find((emo) => emo.value === m.score);
                  return (
                    <div key={m.id} className="bg-white/50 border border-ink/5 p-2.5 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-1.5">
                          <span className="text-lg">{moodObj?.emoji ?? "😐"}</span>
                          <span className="font-semibold text-ink text-xs">{moodObj?.label ?? "Okay"}</span>
                        </span>
                        <span className="text-[9px] text-ink/40 font-medium">
                          {formatDate(m.createdAt)} · {formatTime(m.createdAt)}
                        </span>
                      </div>
                      {m.note && (
                        <p className="text-[11px] text-ink/75 italic mt-1 bg-white/40 px-2 py-1 rounded-lg">
                          "{m.note}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Exercises Panel */}
          <div className="bg-gradient-to-br from-teal/20 via-orange/10 to-yellow/10 border border-white p-5 rounded-2xl shadow-soft">
            <h3 className="font-semibold text-ink text-sm flex items-center gap-1.5">
              <span>🧘</span> Breathing Space
            </h3>
            <p className="text-xs text-ink/75 mt-1.5 leading-relaxed">
              Take a short breathing break to calm your nervous system and refocus your energy.
            </p>
            <Link
              to="/wellness-hub"
              className="mt-4 block w-full py-2 text-center text-xs text-white font-bold rounded-xl btn-gradient shadow-soft"
            >
              Enter Breathing Space
            </Link>
          </div>

        </div>

      </div>
    </>
  );
}
