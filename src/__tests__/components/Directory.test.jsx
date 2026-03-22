import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Directory from "../../components/Directory.jsx";

const ideas = [
  { id: "self-trust",    label: "Self-Trust",    description: "d" },
  { id: "nonconformity", label: "Nonconformity", description: "d" },
  { id: "originality",   label: "Originality",   description: "d" },
];

const makePerson = (id, name, side, distance, stance = "agree") => ({
  id,
  name,
  birth: 1800,
  death: 1880,
  side,
  distance,
  ideas: ["self-trust"],
  topicSummaries: {
    "self-trust":    { stance, summary: `${name} summary` },
    "nonconformity": { stance, summary: `${name} summary` },
    "originality":   { stance, summary: `${name} summary` },
  },
});

const people = [
  makePerson("thoreau",  "Thoreau",  "agree",    1, "agree"),
  makePerson("fuller",   "Fuller",   "agree",    1, "agree"),
  makePerson("marx",     "Marx",     "disagree", 3, "disagree"),
  makePerson("hobbes",   "Hobbes",   "disagree", 4, "disagree"),
];

function renderDir(overrides = {}) {
  const props = {
    filteredPeople: people,
    selectedIdea: "self-trust",
    selectedPersonId: null,
    onSelectPerson: vi.fn(),
    ideas,
    ...overrides,
  };
  return { ...render(<Directory {...props} />), props };
}

describe("Directory — rendering", () => {
  it("renders every thinker's name", () => {
    renderDir();
    for (const p of people) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
  });

  it("shows a 'With Emerson' section with the correct count", () => {
    renderDir();
    expect(screen.getByText(/With Emerson \(2\)/i)).toBeInTheDocument();
  });

  it("shows an 'Against Emerson' section with the correct count", () => {
    renderDir();
    expect(screen.getByText(/Against Emerson \(2\)/i)).toBeInTheDocument();
  });

  it("shows the active idea label in the section heading", () => {
    renderDir({ selectedIdea: "self-trust" });
    expect(screen.getByText(/Self-Trust/)).toBeInTheDocument();
  });

  it("renders stance badges for each card", () => {
    renderDir();
    const agreeBadges = screen.getAllByText("agree");
    expect(agreeBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("shows an empty-state message when the agree list is empty", () => {
    renderDir({ filteredPeople: people.filter((p) => p.side === "disagree") });
    expect(screen.getByText(/No thinkers for this idea/i)).toBeInTheDocument();
  });

  it("shows an empty-state message when the disagree list is empty", () => {
    renderDir({ filteredPeople: people.filter((p) => p.side === "agree") });
    expect(screen.getByText(/No thinkers for this idea/i)).toBeInTheDocument();
  });

  it("shows the topic summary text for each card", () => {
    renderDir();
    expect(screen.getByText("Thoreau summary")).toBeInTheDocument();
  });
});

describe("Directory — interactions", () => {
  it("calls onSelectPerson with the correct id when a card is clicked", async () => {
    const user = userEvent.setup();
    const { props } = renderDir();
    await user.click(screen.getByText("Thoreau"));
    expect(props.onSelectPerson).toHaveBeenCalledWith("thoreau");
  });

  it("calls onSelectPerson with the disagree thinker's id", async () => {
    const user = userEvent.setup();
    const { props } = renderDir();
    await user.click(screen.getByText("Marx"));
    expect(props.onSelectPerson).toHaveBeenCalledWith("marx");
  });
});

describe("Directory — sort order", () => {
  it("agrees are sorted by distance ascending", () => {
    const mixed = [
      makePerson("c", "C", "agree", 3),
      makePerson("a", "A", "agree", 1),
      makePerson("b", "B", "agree", 2),
    ];
    renderDir({ filteredPeople: mixed });
    const names = screen.getAllByRole("button").map((b) => b.textContent);
    const aIdx = names.findIndex((t) => t?.includes("A"));
    const bIdx = names.findIndex((t) => t?.includes("B"));
    const cIdx = names.findIndex((t) => t?.includes("C"));
    expect(aIdx).toBeLessThan(bIdx);
    expect(bIdx).toBeLessThan(cIdx);
  });
});
