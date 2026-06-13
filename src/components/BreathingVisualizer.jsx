import { useState, useEffect, useRef } from "react";

const PHASES = [
  { name: "Inhale", duration: 4000, instruction: "Breathe in slowly through your nose...", color: "from-teal to-teal-deep", scale: "scale-125" },
  { name: "Hold", duration: 4000, instruction: "Hold your breath gently...", color: "from-teal-deep to-ink", scale: "scale-125" },
  { name: "Exhale", duration: 4000, instruction: "Exhale slowly through your mouth...", color: "from-orange to-yellow", scale: "scale-90" },
  { name: "Hold", duration: 4000, instruction: "Hold and relax...", color: "from-yellow to-teal", scale: "scale-90" }
];

export function BreathingVisualizer() {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const timerRef = useRef(null);
  const phaseTimerRef = useRef(null);

  const currentPhase = PHASES[currentPhaseIndex];

  useEffect(() => {
    if (isActive) {
      // Countdown timer for display
      setTimeLeft(4);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) return 4;
          return prev - 1;
        });
      }, 1000);

      // Phase cycle timer
      const runCycle = () => {
        phaseTimerRef.current = setTimeout(() => {
          setCurrentPhaseIndex((prev) => (prev + 1) % PHASES.length);
          setTimeLeft(4);
          runCycle();
        }, 4000);
      };

      runCycle();
    } else {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimerRef.current);
      setCurrentPhaseIndex(0);
      setTimeLeft(4);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(phaseTimerRef.current);
    };
  }, [isActive]);

  const toggleActive = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/60 border border-ink/8 rounded-2xl shadow-soft">
      <h3 className="font-semibold text-ink text-lg text-center mb-1">Mindful Breathing Space</h3>
      <p className="text-xs text-ink/60 text-center mb-6">Reduce anxiety and center yourself with 4-4-4-4 Box Breathing.</p>

      {/* Visual circle */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        {/* Pulsing ring */}
        <div
          className={`absolute inset-0 rounded-full bg-teal/5 transition-transform duration-[4000ms] ease-in-out ${
            isActive ? currentPhase.scale : "scale-100"
          }`}
        />
        
        {/* Core circle */}
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentPhase.color} text-white flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-lift ${
            isActive ? currentPhase.scale : "scale-100"
          }`}
        >
          <span className="text-xl font-bold tracking-wider uppercase transition-all duration-300">
            {isActive ? currentPhase.name : "Ready"}
          </span>
          {isActive && (
            <span className="text-2xl font-mono mt-1 font-semibold animate-pulse">{timeLeft}s</span>
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-ink-soft text-center min-h-[40px] px-4">
        {isActive ? currentPhase.instruction : "Click Start to begin your breathing exercise."}
      </p>

      <button
        onClick={toggleActive}
        className={`mt-4 px-6 py-2.5 rounded-full font-semibold transition shadow-soft ${
          isActive
            ? "bg-ink/10 text-ink hover:bg-ink/15"
            : "bg-teal text-white hover:bg-teal-deep btn-gradient"
        }`}
      >
        {isActive ? "Pause Exercise" : "Start Breathing"}
      </button>
    </div>
  );
}
