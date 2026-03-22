import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IdeaSelector from "../../components/IdeaSelector.jsx";

const ideas = [
  { id: "self-trust",    label: "Self-Trust",    description: "Trust your own mind." },
  { id: "nonconformity", label: "Nonconformity", description: "Resist social pressure." },
  { id: "originality",   label: "Originality",   description: "Live authentically." },
];

function renderComponent(overrides = {}) {
  const props = {
    ideas,
    selectedIdea: "self-trust",
    onSelect: vi.fn(),
    showDirectory: false,
    onToggleDirectory: vi.fn(),
    ...overrides,
  };
  return { ...render(<IdeaSelector {...props} />), props };
}

describe("IdeaSelector — rendering", () => {
  it("renders the app title", () => {
    renderComponent();
    expect(screen.getByText(/Self-Reliance Network/i)).toBeInTheDocument();
  });

  it("renders a button for every idea", () => {
    renderComponent();
    for (const idea of ideas) {
      expect(screen.getByRole("button", { name: idea.label })).toBeInTheDocument();
    }
  });

  it("shows the description of the currently selected idea", () => {
    renderComponent({ selectedIdea: "self-trust" });
    expect(screen.getByText("Trust your own mind.")).toBeInTheDocument();
  });

  it("shows the description for a different selected idea", () => {
    renderComponent({ selectedIdea: "nonconformity" });
    expect(screen.getByText("Resist social pressure.")).toBeInTheDocument();
  });

  it("renders all three legend items with exact labels", () => {
    renderComponent();
    // Use exact text to avoid "Disagrees" matching /Agrees/i
    expect(screen.getByText("Agrees")).toBeInTheDocument();
    expect(screen.getByText("Disagrees")).toBeInTheDocument();
    expect(screen.getByText("Mixed")).toBeInTheDocument();
  });

  it("shows 'Hide directory' when showDirectory is true", () => {
    renderComponent({ showDirectory: true });
    expect(screen.getByRole("button", { name: /hide directory/i })).toBeInTheDocument();
  });

  it("shows 'Show directory' when showDirectory is false", () => {
    renderComponent({ showDirectory: false });
    expect(screen.getByRole("button", { name: /show directory/i })).toBeInTheDocument();
  });
});

describe("IdeaSelector — interactions", () => {
  it("calls onSelect with the correct idea id when clicking an inactive idea", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent({ selectedIdea: "self-trust" });
    await user.click(screen.getByRole("button", { name: "Nonconformity" }));
    expect(props.onSelect).toHaveBeenCalledWith("nonconformity");
  });

  it("calls onSelect with the correct id for Originality", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent({ selectedIdea: "self-trust" });
    await user.click(screen.getByRole("button", { name: /Originality/i }));
    expect(props.onSelect).toHaveBeenCalledWith("originality");
  });

  it("calls onToggleDirectory when the directory button is clicked", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    await user.click(screen.getByRole("button", { name: /directory/i }));
    expect(props.onToggleDirectory).toHaveBeenCalledOnce();
  });

  it("does not call onToggleDirectory when clicking an idea button", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    await user.click(screen.getByRole("button", { name: "Nonconformity" }));
    expect(props.onToggleDirectory).not.toHaveBeenCalled();
  });
});
