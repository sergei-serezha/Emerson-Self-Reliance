import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Graph from "../../components/Graph.jsx";

const ideas = [
  { id: "self-trust",    label: "Self-Trust",    description: "Trust your own mind." },
  { id: "nonconformity", label: "Nonconformity", description: "Resist social pressure." },
  { id: "originality",   label: "Originality",   description: "Live authentically." },
];

const makePerson = (id, name, side, distance) => ({
  id,
  name,
  birth: 1800,
  death: 1880,
  side,
  distance,
  ideas: ["self-trust"],
  topicSummaries: {
    "self-trust":    { stance: "agree", summary: "s" },
    "nonconformity": { stance: "agree", summary: "s" },
    "originality":   { stance: "agree", summary: "s" },
  },
});

const people = [
  makePerson("thoreau", "Henry David Thoreau", "agree",    1),
  makePerson("fuller",  "Margaret Fuller",     "agree",    1),
  makePerson("marx",    "Karl Marx",           "disagree", 3),
  makePerson("hobbes",  "Thomas Hobbes",       "disagree", 4),
];

function renderGraph(overrides = {}) {
  const props = {
    filteredPeople: people,
    selectedIdea: "self-trust",
    selectedPersonId: null,
    onSelectPerson: vi.fn(),
    ideas,
    ...overrides,
  };
  return { ...render(<Graph {...props} />), props };
}

describe("Graph — header", () => {
  it("shows the active idea label", () => {
    renderGraph();
    expect(screen.getByText("Self-Trust")).toBeInTheDocument();
  });

  it("shows the active idea description", () => {
    renderGraph();
    expect(screen.getByText("Trust your own mind.")).toBeInTheDocument();
  });

  it("shows agree and disagree counts", () => {
    renderGraph();
    expect(screen.getByText("2 agree")).toBeInTheDocument();
    expect(screen.getByText("2 disagree")).toBeInTheDocument();
  });

  it("updates counts when filteredPeople changes", () => {
    const narrowPeople = [makePerson("t", "T", "agree", 1)];
    renderGraph({ filteredPeople: narrowPeople });
    expect(screen.getByText("1 agree")).toBeInTheDocument();
    expect(screen.getByText("0 disagree")).toBeInTheDocument();
  });
});

describe("Graph — nodes", () => {
  it("renders the Emerson centre label", () => {
    renderGraph();
    expect(screen.getByText("Ralph Waldo Emerson")).toBeInTheDocument();
    expect(screen.getByText("1803–1882")).toBeInTheDocument();
  });

  it("renders the name of every thinker", () => {
    renderGraph();
    for (const p of people) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
  });

  it("renders a data-testid for every node", () => {
    const { container } = renderGraph();
    for (const p of people) {
      expect(container.querySelector(`[data-testid="node-${p.id}"]`)).not.toBeNull();
    }
  });

  it("renders direction labels", () => {
    renderGraph();
    expect(screen.getByText(/← Agrees/)).toBeInTheDocument();
    expect(screen.getByText(/Disagrees →/)).toBeInTheDocument();
  });
});

describe("Graph — interactions", () => {
  it("calls onSelectPerson when an agree node is clicked", async () => {
    const user = userEvent.setup();
    const { props, container } = renderGraph();
    await user.click(container.querySelector('[data-testid="node-thoreau"]'));
    expect(props.onSelectPerson).toHaveBeenCalledWith("thoreau");
  });

  it("calls onSelectPerson for a disagree-side node", async () => {
    const user = userEvent.setup();
    const { props, container } = renderGraph();
    await user.click(container.querySelector('[data-testid="node-marx"]'));
    expect(props.onSelectPerson).toHaveBeenCalledWith("marx");
  });

  it("does not call onSelectPerson when clicking the Emerson label", async () => {
    const user = userEvent.setup();
    const { props } = renderGraph();
    await user.click(screen.getByText("1803–1882"));
    expect(props.onSelectPerson).not.toHaveBeenCalled();
  });
});

describe("Graph — footer", () => {
  it("shows the click hint", () => {
    renderGraph();
    expect(screen.getByText(/click any node/i)).toBeInTheDocument();
  });
});
