import React from "react";
import { positionFor, formatYears } from "../utils.js";

export default function Graph({
  filteredPeople,
  selectedIdea,
  selectedPersonId,
  onSelectPerson,
  ideas,
}) {
  const agree = filteredPeople
    .filter((p) => p.side === "agree")
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));

  const disagree = filteredPeople
    .filter((p) => p.side === "disagree")
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name));

  const ideaMeta = ideas.find((i) => i.id === selectedIdea);

  const renderNode = (person, index, total) => {
    const pos = positionFor(person, index, total);
    const isSel = person.id === selectedPersonId;
    const isAgree = person.side === "agree";

    const nodeFill  = isAgree ? "#16A34A" : "#DC2626";
    const nodeRing  = isAgree ? "#BBF7D0" : "#FECACA";
    const lineColor = isAgree ? "#86EFAC" : "#FCA5A5";
    const r = isSel ? 4.5 : 3.5;

    // Labels go to the outer side of each node — agree: left, disagree: right
    const labelX   = isAgree ? pos.x - r - 2 : pos.x + r + 2;
    const anchor   = isAgree ? "end" : "start";
    const nameColor = isSel ? "#0F172A" : "#1E293B";
    const yearColor = isSel ? "#475569" : "#94A3B8";

    return (
      <g key={person.id} data-testid={`node-${person.id}`} onClick={() => onSelectPerson(person.id)} style={{ cursor: "pointer" }}>
        {/* Connection line from Emerson */}
        <line
          x1="100" y1="60"
          x2={pos.x} y2={pos.y}
          stroke={isSel ? lineColor : "#CBD5E1"}
          strokeWidth={isSel ? 0.5 : 0.3}
          opacity={isSel ? 1 : 0.7}
        />

        {/* Selection ring */}
        {isSel && (
          <circle
            cx={pos.x} cy={pos.y}
            r={r + 2.5}
            fill="none"
            stroke={nodeRing}
            strokeWidth="0.8"
          />
        )}

        {/* Invisible hit target */}
        <circle cx={pos.x} cy={pos.y} r={6} fill="transparent" />

        {/* Main node circle */}
        <circle
          cx={pos.x} cy={pos.y} r={r}
          fill={nodeFill}
          opacity={isSel ? 1 : 0.88}
        />

        {/* Distance number — white, centred inside circle */}
        <text
          x={pos.x} y={pos.y + r * 0.37}
          textAnchor="middle"
          style={{
            fontSize: `${r * 0.9}px`,
            fill: "#ffffff",
            fontWeight: 800,
            pointerEvents: "none",
          }}
        >
          {person.distance}
        </text>

        {/* Name — to the side, vertically centred on node */}
        <text
          x={labelX} y={pos.y - 1.0}
          textAnchor={anchor}
          style={{
            fontSize: "2.3px",
            fill: nameColor,
            fontWeight: isSel ? 700 : 500,
            pointerEvents: "none",
          }}
        >
          {person.name}
        </text>

        {/* Years — one line below name */}
        <text
          x={labelX} y={pos.y + 2.4}
          textAnchor={anchor}
          style={{
            fontSize: "1.7px",
            fill: yearColor,
            pointerEvents: "none",
          }}
        >
          {formatYears(person.birth, person.death)}
        </text>
      </g>
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Active idea
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-slate-900">{ideaMeta?.label}</h2>
          <p className="mt-0.5 max-w-lg text-sm leading-5 text-slate-500">
            {ideaMeta?.description}
          </p>
        </div>
        <div className="mt-1 shrink-0 text-right">
          <div className="text-sm font-bold text-green-600">{agree.length} agree</div>
          <div className="text-sm font-bold text-red-500">{disagree.length} disagree</div>
        </div>
      </div>

      {/* SVG canvas — 5:3 aspect ratio matches the 200×120 viewBox exactly */}
      <div style={{ aspectRatio: "5 / 3", width: "100%" }}>
        <svg
          viewBox="0 0 200 120"
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id="graphBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#EFF2F7" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="200" height="120" fill="url(#graphBg)" />

          {/* Subtle vertical distance guides */}
          {[1, 2, 3, 4, 5].map((d) => {
            const offset = 18 + d * 10;
            return (
              <React.Fragment key={d}>
                <line
                  x1={100 - offset} y1="3"
                  x2={100 - offset} y2="117"
                  stroke="#E2E8F0" strokeWidth="0.35"
                />
                <line
                  x1={100 + offset} y1="3"
                  x2={100 + offset} y2="117"
                  stroke="#E2E8F0" strokeWidth="0.35"
                />
              </React.Fragment>
            );
          })}

          {/* Centre divider */}
          <line
            x1="100" y1="3" x2="100" y2="117"
            stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="2.5 1.8"
          />

          {/* Direction labels — outside the node cluster */}
          <text x="8" y="5.5" textAnchor="start"
            style={{ fontSize: "3px", fill: "#16A34A", fontWeight: 700 }}>
            ← Agrees
          </text>
          <text x="192" y="5.5" textAnchor="end"
            style={{ fontSize: "3px", fill: "#DC2626", fontWeight: 700 }}>
            Disagrees →
          </text>

          {/* Nodes — drawn before Emerson so the pill stays on top */}
          {agree.map((p, i) => renderNode(p, i, agree.length))}
          {disagree.map((p, i) => renderNode(p, i, disagree.length))}

          {/* Emerson centre pill */}
          <rect x="74" y="53.5" width="52" height="13" rx="6.5" fill="#0F172A" />
          <text x="100" y="59.5" textAnchor="middle"
            style={{ fontSize: "2.4px", fill: "#F8FAFC", fontWeight: 700 }}>
            Ralph Waldo Emerson
          </text>
          <text x="100" y="63.2" textAnchor="middle"
            style={{ fontSize: "1.8px", fill: "#94A3B8" }}>
            1803–1882
          </text>
        </svg>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-6 py-2.5 text-center text-xs text-slate-400">
        Click any node to explore a thinker's stances on all three ideas →
      </div>
    </section>
  );
}
