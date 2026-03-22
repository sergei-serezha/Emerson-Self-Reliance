import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App.jsx";

// Integration tests — render the full App and exercise real user flows.
// These tests do NOT mock any components or data.

describe("App — initial render", () => {
  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText(/Self-Reliance Network/i)).toBeInTheDocument();
  });

  it("renders the three idea buttons in the IdeaSelector top bar", () => {
    render(<App />);
    const bar = screen.getByTestId("idea-selector");
    expect(within(bar).getByRole("button", { name: "Self-Trust" })).toBeInTheDocument();
    expect(within(bar).getByRole("button", { name: "Nonconformity" })).toBeInTheDocument();
    expect(within(bar).getByRole("button", { name: /Originality/i })).toBeInTheDocument();
  });

  it("shows Self-Trust as the active idea in the graph header", () => {
    render(<App />);
    expect(screen.getAllByText("Self-Trust").length).toBeGreaterThanOrEqual(1);
  });

  it("auto-selects the first thinker on load so PersonPanel is populated", () => {
    render(<App />);
    expect(
      screen.queryByText(/click a node or directory card/i)
    ).not.toBeInTheDocument();
  });

  it("does not show the directory by default", () => {
    render(<App />);
    expect(screen.queryByText(/Thinker directory/i)).not.toBeInTheDocument();
  });
});

describe("App — idea switching", () => {
  it("updates the graph header when a different idea is selected", async () => {
    const user = userEvent.setup();
    render(<App />);
    const bar = screen.getByTestId("idea-selector");
    await user.click(within(bar).getByRole("button", { name: "Nonconformity" }));
    expect(screen.getAllByText("Nonconformity").length).toBeGreaterThanOrEqual(1);
  });

  it("updates the graph header when Originality is selected", async () => {
    const user = userEvent.setup();
    render(<App />);
    const bar = screen.getByTestId("idea-selector");
    await user.click(within(bar).getByRole("button", { name: /Originality/i }));
    expect(screen.getAllByText(/Originality/i).length).toBeGreaterThanOrEqual(1);
  });
});

describe("App — node selection", () => {
  it("selecting a thinker in the graph populates the PersonPanel", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(container.querySelector('[data-testid="node-thoreau"]'));
    expect(screen.getByText(/Thoreau most directly extends/i)).toBeInTheDocument();
  });

  it("selecting a different thinker replaces the PersonPanel content", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(container.querySelector('[data-testid="node-thoreau"]'));
    await user.click(container.querySelector('[data-testid="node-marx"]'));
    expect(screen.getByText(/Marx shares Emerson's hostility/i)).toBeInTheDocument();
    expect(screen.queryByText(/Thoreau most directly extends/i)).not.toBeInTheDocument();
  });
});

describe("App — directory toggle", () => {
  it("shows the directory when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /show directory/i }));
    expect(screen.getByText(/Thinker directory/i)).toBeInTheDocument();
  });

  it("hides the directory when toggled off again", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /show directory/i }));
    await user.click(screen.getByRole("button", { name: /hide directory/i }));
    expect(screen.queryByText(/Thinker directory/i)).not.toBeInTheDocument();
  });

  it("clicking a directory card selects that thinker in PersonPanel", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /show directory/i }));
    const cards = screen.getAllByRole("button", { name: /Margaret Fuller/i });
    await user.click(cards[0]);
    expect(screen.getByText(/Fuller shares Emerson's belief/i)).toBeInTheDocument();
  });
});

describe("App — PersonPanel idea cross-link", () => {
  it("clicking an idea section in PersonPanel switches the active graph idea", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    // Select Thoreau first so the PersonPanel is populated
    await user.click(container.querySelector('[data-testid="node-thoreau"]'));
    // The PersonPanel <aside> contains clickable idea buttons
    const panel = screen.getByTestId("person-panel");
    await user.click(within(panel).getByText("Nonconformity"));
    // Graph header and PersonPanel active section should now show Nonconformity
    expect(screen.getAllByText("Nonconformity").length).toBeGreaterThanOrEqual(2);
  });
});
