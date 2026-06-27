import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { BreathingVisualizer } from "../components/BreathingVisualizer.jsx";

const WELLNESS_RESOURCES = [
  {
    id: "grounding-54321",
    title: "5-4-3-2-1 Grounding Method",
    category: "Distress Management",
    desc: "Ease anxiety by identifying 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    readTime: "3 min read",
    icon: "🌱"
  },
  {
    id: "connections",
    title: "Building Positive Connections",
    category: "Mental Flourishing",
    desc: "Nurture relationships with people who uplift you. Shared positive emotions strengthen psychological resilience.",
    readTime: "4 min read",
    icon: "🤝"
  },
  {
    id: "boundaries",
    title: "Setting Healthy Boundaries",
    category: "Self-Care",
    desc: "Learn to identify your limits, express them clearly to colleagues or peers, and say 'no' without feeling guilty.",
    readTime: "5 min read",
    icon: "🛡️"
  },
  {
    id: "sleep-hygiene",
    title: "Optimizing Sleep Hygiene",
    category: "Sleep",
    desc: "Establish a calming evening routine. Dim lights 1 hour before sleep and avoid screens to boost melatonin production.",
    readTime: "3 min read",
    icon: "🌙"
  },
  {
    id: "mindful-journaling",
    title: "Daily Mindful Journaling",
    category: "Self-Care",
    desc: "Write down three things you are grateful for each morning. This trains your brain to focus on positive experiences.",
    readTime: "4 min read",
    icon: "📝"
  },
  {
    id: "box-breathing",
    title: "4-4-4 Box Breathing Technique",
    category: "Distress Management",
    desc: "Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat to reset your central nervous system.",
    readTime: "3 min read",
    icon: "💨"
  }
];

export function WellnessHubPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [completedArticles, setCompletedArticles] = useState([]);

  const { setHeaderInfo } = useOutletContext();

  useEffect(() => {
    setHeaderInfo({
      title: "Wellness Hub",
      subtitle: "Mindfulness exercises and self-care resources",
      wide: true
    });

    const saved = localStorage.getItem("completed_wellness_articles");
    if (saved) {
      try {
        setCompletedArticles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load completed articles", e);
      }
    }
  }, [setHeaderInfo]);

  const toggleCompleted = (id) => {
    const updated = completedArticles.includes(id)
      ? completedArticles.filter((item) => item !== id)
      : [...completedArticles, id];
    
    setCompletedArticles(updated);
    localStorage.setItem("completed_wellness_articles", JSON.stringify(updated));
  };

  const categories = ["All", ...new Set(WELLNESS_RESOURCES.map((r) => r.category))];

  const filteredResources = WELLNESS_RESOURCES.filter((res) => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completionPercentage = Math.round((completedArticles.length / WELLNESS_RESOURCES.length) * 100);

  return (
    <>
      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-teal/10 via-teal/5 to-transparent border border-ink/8 p-5 rounded-2xl shadow-soft mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal text-white flex items-center justify-center text-xl font-bold">
            🏆
          </div>
          <div>
            <h4 className="font-semibold text-ink text-sm">Mindfulness Journey Progress</h4>
            <p className="text-xs text-ink/60 mt-0.5">
              You've completed {completedArticles.length} of {WELLNESS_RESOURCES.length} self-care guides
            </p>
          </div>
        </div>
        <div className="w-full md:w-64 space-y-1.5 shrink-0">
          <div className="flex justify-between text-xs font-semibold text-ink/75">
            <span>Wellness Level Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

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
          <div className="bg-white/60 border border-ink/8 p-6 rounded-2xl shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-semibold text-ink text-lg">Mindfulness & Mental Wellness Library</h3>
              {/* Search input */}
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Search self-care library..."
                  className="w-full h-9 text-xs rounded-xl border border-ink/10 bg-white/40 pl-8 pr-3 focus:outline-none focus:border-teal focus:bg-white transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40">
                  🔍
                </span>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-ink/5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    activeCategory === cat
                      ? "bg-teal text-white shadow-soft"
                      : "bg-white/40 hover:bg-white/70 text-ink/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredResources.length === 0 ? (
                <p className="text-xs text-ink/40 col-span-2 py-8 text-center">No self-care resources match your search.</p>
              ) : (
                filteredResources.map((res) => {
                  const isCompleted = completedArticles.includes(res.id);
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedArticle(res)}
                      className={`relative bg-white/80 border p-4 rounded-xl shadow-soft cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md ${
                        isCompleted ? "border-teal/20" : "border-ink/5 hover:border-teal/30"
                      }`}
                    >
                      {isCompleted && (
                        <span className="absolute top-3 right-3 text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full font-semibold">
                          ✓ Completed
                        </span>
                      )}
                      <span className="text-2xl">{res.icon}</span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-teal block mt-2">
                        {res.category}
                      </span>
                      <h4 className="font-semibold text-ink text-sm mt-1">{res.title}</h4>
                      <p className="text-xs text-ink/60 mt-1.5 line-clamp-2">{res.desc}</p>
                      <div className="mt-3 text-[11px] text-ink/40 font-medium">{res.readTime}</div>
                    </div>
                  );
                })
              )}
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
              <div className="mt-6 pt-4 border-t border-ink/5 flex items-center justify-between">
                <span className="text-xs text-ink/40">Read time: {selectedArticle.readTime}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompleted(selectedArticle.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-soft transition ${
                    completedArticles.includes(selectedArticle.id)
                      ? "bg-teal-deep text-white hover:bg-teal-deep/90"
                      : "bg-teal text-white hover:bg-teal-deep btn-gradient"
                  }`}
                >
                  {completedArticles.includes(selectedArticle.id) ? "Mark Incomplete" : "Mark as Completed"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
