import { useState } from "react";
import { AppShell } from "../components/AppShell.jsx";
import { BreathingVisualizer } from "../components/BreathingVisualizer.jsx";

const WELLNESS_RESOURCES = [
  {
    title: "5-4-3-2-1 Grounding Method",
    category: "Distress Management",
    desc: "Ease anxiety by identifying 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    readTime: "3 min read",
    icon: "🌱"
  },
  {
    title: "Building Positive Connections",
    category: "Mental Flourishing",
    desc: "Nurture relationships with people who uplift you. Shared positive emotions strengthen psychological resilience.",
    readTime: "4 min read",
    icon: "🤝"
  },
  {
    title: "Setting Health Boundaries",
    category: "Self-Care",
    desc: "Learn to identify your limits, express them clearly to colleagues or peers, and say 'no' without feeling guilty.",
    readTime: "5 min read",
    icon: "🛡️"
  },
  {
    title: "Optimizing Sleep Hygiene",
    category: "Physical & Mental Health",
    desc: "Establish a calming evening routine. Dim lights 1 hour before sleep and avoid screens to boost melatonin production.",
    readTime: "3 min read",
    icon: "🌙"
  }
];

export function WellnessHubPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <AppShell title="Wellness Hub" subtitle="Mindfulness exercises and self-care resources" wide={true}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Breathing Guide */}
        <div className="md:col-span-1 space-y-6">
          <BreathingVisualizer />
          
          {/* Direct Support Card */}
          <div className="bg-gradient-to-br from-teal/10 to-orange/15 border border-white/40 p-5 rounded-2xl shadow-soft">
            <h4 className="font-semibold text-ink text-sm flex items-center gap-1.5">
              <span>🩺</span> Need Professional Support?
            </h4>
            <p className="text-xs text-ink/75 mt-2 leading-relaxed">
              Your organization counselors are ready to support you confidentially. Check your organization's workspace for counselors, or call a wellness hotline.
            </p>
            <div className="mt-4 space-y-1.5 text-xs text-ink/80 font-mono">
              <div>📞 National Helpline: 1-800-273-TALK</div>
              <div>💬 Text Line: HOME to 741741</div>
            </div>
          </div>
        </div>

        {/* Right Columns: Resources & Self Care */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/60 border border-ink/8 p-6 rounded-2xl shadow-soft">
            <h3 className="font-semibold text-ink text-lg mb-4">Mindfulness & Mental Wellness Library</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WELLNESS_RESOURCES.map((res, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedArticle(res)}
                  className="bg-white/80 border border-ink/5 hover:border-teal/30 p-4 rounded-xl shadow-soft cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-2xl">{res.icon}</span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-teal block mt-2">
                    {res.category}
                  </span>
                  <h4 className="font-semibold text-ink text-sm mt-1">{res.title}</h4>
                  <p className="text-xs text-ink/60 mt-1.5 line-clamp-2">{res.desc}</p>
                  <div className="mt-3 text-[11px] text-ink/40 font-medium">{res.readTime}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal/Detail view for article */}
          {selectedArticle && (
            <div className="bg-white border border-teal/20 p-6 rounded-2xl shadow-soft animate-fade-in">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-3xl">{selectedArticle.icon}</span>
                  <span className="text-xs uppercase font-semibold text-teal block mt-1">{selectedArticle.category}</span>
                  <h3 className="font-display text-xl text-ink font-bold mt-1">{selectedArticle.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-xs text-ink/40 hover:text-teal font-medium border border-ink/10 rounded-full px-2.5 py-1"
                >
                  Close
                </button>
              </div>
              <p className="text-sm text-ink/80 mt-4 leading-relaxed whitespace-pre-line">
                {selectedArticle.desc} 
                {"\n\n"}
                <strong>Why this works:</strong> Engaging in structured self-care techniques triggers the parasympathetic nervous system, lowering cortisol levels and blood pressure. Setting regular routines helps you maintain emotional balance through times of stress.
                {"\n\n"}
                Try to dedicate just 5 minutes today to practice this mindfulness routine. Your mental health is a journey, not a destination.
              </p>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
