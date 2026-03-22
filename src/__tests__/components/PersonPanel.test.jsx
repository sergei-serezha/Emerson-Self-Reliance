import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonPanel from "../../components/PersonPanel.jsx";

const ideas = [
  { id: "self-trust",    label: "Self-Trust",    description: "Trust your own mind." },
  { id: "nonconformity", label: "Nonconformity", description: "Resist social pressure." },
  { id: "originality",   label: "Originality",   description: "Live authentically." },
];

const thoreau = {
  id: "thoreau",
  name: "Henry David Thoreau",
  birth: 1817,
  death: 1862,
  side: "agree",
  distance: 1,
  reason: "Thoreau most directly extends Emerson into lived practice.",
  topicSummaries: {
    "self-trust":    { stance: "agree",    summary: "Conscience above convention." },
    "nonconformity": { stance: "agree",    summary: "Principled refusal." },
    "originality":   { stance: "agree",    summary: "An unborrowed life." },
  },
};

const marx = {
  id: "marx",
  name: "Karl Marx",
  birth: 1818,
  death: 1883,
  side: "disagree",
  distance: 3,
  reason: "Marx locates the self in material conditions, not inward independence.",
  topicSummaries: {
    "self-trust":    { stance: "disagree", summary: "Class conditions shape consciousness." },
    "nonconformity": { stance: "disagree", summary: "Individual resistance misses the point." },
    "originality":   { stance: "mixed",    summary: "Creative capacity exists but is constrained." },
  },
};

describe("PersonPanel — empty state", () => {
  it("shows a prompt when no person is selected", () => {
    render(<PersonPanel person={null} selectedIdea="self-trust" ideas={ideas} onSelectIdea={vi.fn()} />);
    expect(screen.getByText(/click a node or directory card/i)).toBeInTheDocument();
  });

  it("does not render a name heading in empty state", () => {
    render(<PersonPanel person={null} selectedIdea="self-trust" ideas={ideas} onSelectIdea={vi.fn()} />);
    expect(screen.queryByText("Henry David Thoreau")).not.toBeInTheDocument();
  });
});

describe("PersonPanel — with a person selected", () => {
  function renderThoreau(overrides = {}) {
    const props = {
      person: thoreau,
      selectedIdea: "self-trust",
      ideas,
      onSelectIdea: vi.fn(),
      ...overrides,
    };
    return { ...render(<PersonPanel {...props} />), props };
  }

  it("displays the person's name", () => {
    renderThoreau();
    expect(screen.getByText("Henry David Thoreau")).toBeInTheDocument();
  });

  it("displays the formatted birth–death years", () => {
    renderThoreau();
    expect(screen.getByText("1817–1862")).toBeInTheDocument();
  });

  it("displays the distance badge", () => {
    renderThoreau();
    expect(screen.getByText(/Distance 1/i)).toBeInTheDocument();
  });

  it("shows 'Overall agreement' for an agree-side thinker", () => {
    renderThoreau();
    expect(screen.getByText(/Overall agreement/i)).toBeInTheDocument();
  });

  it("shows 'Overall disagreement' for a disagree-side thinker", () => {
    render(<PersonPanel person={marx} selectedIdea="self-trust" ideas={ideas} onSelectIdea={vi.fn()} />);
    expect(screen.getByText(/Overall disagreement/i)).toBeInTheDocument();
  });

  it("displays the reason text", () => {
    renderThoreau();
    expect(screen.getByText(/Thoreau most directly extends/i)).toBeInTheDocument();
  });

  it("renders a section for every idea", () => {
    renderThoreau();
    for (const idea of ideas) {
      expect(screen.getByText(idea.label)).toBeInTheDocument();
    }
  });

  it("shows the topic summary for the selected idea", () => {
    renderThoreau({ selectedIdea: "self-trust" });
    expect(screen.getByText("Conscience above convention.")).toBeInTheDocument();
  });

  it("shows the stance badge for each idea", () => {
    renderThoreau();
    // Thoreau agrees on all three, so 'agree' badges appear multiple times
    const badges = screen.getAllByText("agree");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("shows a mixed stance badge when appropriate", () => {
    render(<PersonPanel person={marx} selectedIdea="originality" ideas={ideas} onSelectIdea={vi.fn()} />);
    expect(screen.getByText("mixed")).toBeInTheDocument();
  });

  it("calls onSelectIdea with the correct id when an idea section is clicked", async () => {
    const user = userEvent.setup();
    const { props } = renderThoreau({ selectedIdea: "self-trust" });
    await user.click(screen.getByText("Nonconformity"));
    expect(props.onSelectIdea).toHaveBeenCalledWith("nonconformity");
  });

  it("displays BCE years correctly", () => {
    const plato = {
      ...thoreau,
      id: "plato",
      name: "Plato",
      birth: -427,
      death: -347,
    };
    render(<PersonPanel person={plato} selectedIdea="self-trust" ideas={ideas} onSelectIdea={vi.fn()} />);
    expect(screen.getByText("427 BCE–347 BCE")).toBeInTheDocument();
  });
});
