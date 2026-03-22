import { formatYears } from "../utils.js";

const STANCE_BADGE = {
  agree: "bg-green-100 text-green-800 border border-green-200",
  disagree: "bg-red-100 text-red-800 border border-red-200",
  mixed: "bg-amber-100 text-amber-800 border border-amber-200",
};

export default function PersonPanel({ person, selectedIdea, ideas, onSelectIdea }) {
  if (!person) {
    return (
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6 xl:self-start">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Selected thinker
        </p>
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <span className="text-3xl">☍</span>
          <p className="text-sm text-slate-400">Click a node or directory card</p>
        </div>
      </aside>
    );
  }

  const activeTopic = person.topicSummaries[selectedIdea];

  return (
    <aside data-testid="person-panel" className="rounded-3xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Selected thinker
        </p>
        <h2 className="text-2xl font-bold leading-tight text-slate-900">{person.name}</h2>
        <p className="mt-1 text-sm text-slate-400">{formatYears(person.birth, person.death)}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              person.side === "agree"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {person.side === "agree" ? "Overall agreement" : "Overall disagreement"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Distance {person.distance}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Why placed here */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Why here
          </p>
          <p className="text-sm leading-6 text-slate-600">{person.reason}</p>
        </div>

        {/* All 3 idea stances */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Stance on each idea
          </p>
          <div className="space-y-2.5">
            {ideas.map((idea) => {
              const topic = person.topicSummaries[idea.id];
              const isActive = idea.id === selectedIdea;
              return (
                <button
                  key={idea.id}
                  onClick={() => onSelectIdea(idea.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-900"}`}>
                        {idea.label}
                      </p>
                      <p className={`mt-0.5 text-[11px] ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                        {isActive ? "Currently shown in graph" : "Click to switch graph"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive ? "bg-white/10 text-white" : STANCE_BADGE[topic.stance]
                      }`}
                    >
                      {topic.stance}
                    </span>
                  </div>
                  <p className={`text-sm leading-6 ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                    {topic.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
