import { formatYears } from "../utils.js";

const STANCE_BADGE = {
  agree: "bg-green-100 text-green-800 border border-green-200",
  disagree: "bg-red-100 text-red-800 border border-red-200",
  mixed: "bg-amber-100 text-amber-800 border border-amber-200",
};

function ThinkerCard({ person, selectedIdea, isSelected, onSelect }) {
  const topic = person.topicSummaries[selectedIdea];

  return (
    <button
      onClick={() => onSelect(person.id)}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        isSelected
          ? "border-slate-900 bg-slate-900 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
            {person.name}
          </p>
          <p className={`mt-0.5 text-xs ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
            {formatYears(person.birth, person.death)} · dist {person.distance}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isSelected ? "bg-white/10 text-white" : STANCE_BADGE[topic.stance]
          }`}
        >
          {topic.stance}
        </span>
      </div>
      <p className={`text-xs leading-5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
        {topic.summary}
      </p>
    </button>
  );
}

export default function Directory({ filteredPeople, selectedIdea, selectedPersonId, onSelectPerson, ideas }) {
  const ideaLabel = ideas.find((i) => i.id === selectedIdea)?.label;

  const agree = filteredPeople
    .filter((p) => p.side === "agree")
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));

  const disagree = filteredPeople
    .filter((p) => p.side === "disagree")
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Thinker directory
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          Stances on <span className="italic text-slate-700">{ideaLabel}</span>
        </h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Click any card to open the full profile in the panel →
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Agree column */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm font-bold text-green-800">
              With Emerson ({agree.length})
            </span>
          </div>
          <div className="space-y-2">
            {agree.map((p) => (
              <ThinkerCard
                key={p.id}
                person={p}
                selectedIdea={selectedIdea}
                isSelected={p.id === selectedPersonId}
                onSelect={onSelectPerson}
              />
            ))}
            {agree.length === 0 && (
              <p className="text-sm italic text-slate-400">No thinkers for this idea.</p>
            )}
          </div>
        </div>

        {/* Disagree column */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-sm font-bold text-red-800">
              Against Emerson ({disagree.length})
            </span>
          </div>
          <div className="space-y-2">
            {disagree.map((p) => (
              <ThinkerCard
                key={p.id}
                person={p}
                selectedIdea={selectedIdea}
                isSelected={p.id === selectedPersonId}
                onSelect={onSelectPerson}
              />
            ))}
            {disagree.length === 0 && (
              <p className="text-sm italic text-slate-400">No thinkers for this idea.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
