export default function IdeaSelector({ ideas, selectedIdea, onSelect, showDirectory, onToggleDirectory }) {
  const selected = ideas.find((i) => i.id === selectedIdea);

  return (
    <div data-testid="idea-selector" className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">

        {/* Branding — left anchor */}
        <div className="shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Emerson Explorer
          </p>
          <h1 className="mt-1 text-xl font-bold leading-tight text-slate-900">
            Self-Reliance<br className="hidden sm:block" /> Network
          </h1>
        </div>

        {/* Idea tabs + active description — fills the middle */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {ideas.map((idea) => (
              <button
                key={idea.id}
                onClick={() => onSelect(idea.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  idea.id === selectedIdea
                    ? "bg-slate-900 text-white shadow"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                {idea.label}
              </button>
            ))}
          </div>
          {selected && (
            <p className="text-sm leading-6 text-slate-500">{selected.description}</p>
          )}
        </div>

        {/* Legend + directory toggle — right anchor */}
        <div className="shrink-0 space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              Agrees
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Disagrees
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Mixed
            </span>
          </div>
          <p className="text-xs text-slate-400">Number inside node = distance 1–5</p>
          {onToggleDirectory !== undefined && (
            <button
              onClick={onToggleDirectory}
              className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              {showDirectory ? "Hide" : "Show"} directory
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
