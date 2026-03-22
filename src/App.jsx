import React, { useEffect, useMemo, useState } from "react";
import { data } from "./data.js";
import { validateDataset } from "./utils.js";
import Graph from "./components/Graph.jsx";
import Directory from "./components/Directory.jsx";
import IdeaSelector from "./components/IdeaSelector.jsx";
import PersonPanel from "./components/PersonPanel.jsx";

export function App() {
  const [selectedIdea, setSelectedIdea] = useState("self-trust");
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [showDirectory, setShowDirectory] = useState(false);

  const validationProblems = useMemo(() => validateDataset(data), []);

  const filteredPeople = useMemo(
    () => data.people.filter((p) => p.ideas.includes(selectedIdea)),
    [selectedIdea]
  );

  // Auto-select the first visible person whenever the idea changes.
  useEffect(() => {
    if (!selectedPersonId || !filteredPeople.some((p) => p.id === selectedPersonId)) {
      setSelectedPersonId(filteredPeople[0]?.id ?? null);
    }
  }, [filteredPeople, selectedPersonId]);

  const selectedPerson = filteredPeople.find((p) => p.id === selectedPersonId) ?? null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 md:p-6">
      <div className="mx-auto max-w-[1500px] space-y-4">

        {/* ── Top bar ── */}
        <IdeaSelector
          ideas={data.ideas}
          selectedIdea={selectedIdea}
          onSelect={setSelectedIdea}
          showDirectory={showDirectory}
          onToggleDirectory={() => setShowDirectory((v) => !v)}
        />

        {validationProblems.length > 0 && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <span className="font-semibold">Dataset issues: </span>
            {validationProblems.join(" · ")}
          </div>
        )}

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">

          <main className="space-y-4">
            <Graph
              filteredPeople={filteredPeople}
              selectedIdea={selectedIdea}
              selectedPersonId={selectedPersonId}
              onSelectPerson={setSelectedPersonId}
              ideas={data.ideas}
            />
            {showDirectory && (
              <Directory
                filteredPeople={filteredPeople}
                selectedIdea={selectedIdea}
                selectedPersonId={selectedPersonId}
                onSelectPerson={setSelectedPersonId}
                ideas={data.ideas}
              />
            )}
          </main>

          <aside>
            <PersonPanel
              person={selectedPerson}
              selectedIdea={selectedIdea}
              ideas={data.ideas}
              onSelectIdea={setSelectedIdea}
            />
          </aside>

        </div>
      </div>
    </div>
  );
}
