import { describe, it, expect } from "vitest";
import { data } from "../data.js";
import { validateDataset } from "../utils.js";

// ─────────────────────────────────────────────────────────────
// Dataset integrity — these tests guard against accidental edits
// that break the data contract the app relies on.
// ─────────────────────────────────────────────────────────────

describe("data.ideas", () => {
  it("has exactly 3 ideas", () => {
    expect(data.ideas).toHaveLength(3);
  });

  it("contains the three required idea ids", () => {
    const ids = data.ideas.map((i) => i.id);
    expect(ids).toContain("self-trust");
    expect(ids).toContain("nonconformity");
    expect(ids).toContain("originality");
  });

  it("every idea has a non-empty label and description", () => {
    for (const idea of data.ideas) {
      expect(idea.label.length).toBeGreaterThan(0);
      expect(idea.description.length).toBeGreaterThan(0);
    }
  });
});

describe("data.people", () => {
  it("has exactly 20 thinkers", () => {
    expect(data.people).toHaveLength(20);
  });

  it("has exactly 10 on each side", () => {
    const agree    = data.people.filter((p) => p.side === "agree");
    const disagree = data.people.filter((p) => p.side === "disagree");
    expect(agree).toHaveLength(10);
    expect(disagree).toHaveLength(10);
  });

  it("has unique ids for every person", () => {
    const ids = data.people.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique names for every person", () => {
    const names = data.people.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every person has a distance between 1 and 5 inclusive", () => {
    for (const p of data.people) {
      expect(p.distance).toBeGreaterThanOrEqual(1);
      expect(p.distance).toBeLessThanOrEqual(5);
    }
  });

  it("every person maps to at least one known idea", () => {
    const ideaIds = new Set(data.ideas.map((i) => i.id));
    for (const p of data.people) {
      expect(p.ideas.length).toBeGreaterThan(0);
      for (const id of p.ideas) {
        expect(ideaIds.has(id)).toBe(true);
      }
    }
  });

  it("every person has a topicSummary for all 3 ideas", () => {
    for (const p of data.people) {
      for (const idea of data.ideas) {
        const summary = p.topicSummaries[idea.id];
        expect(summary, `${p.name} missing summary for ${idea.id}`).toBeDefined();
        expect(["agree", "disagree", "mixed"]).toContain(summary.stance);
        expect(summary.summary.length).toBeGreaterThan(0);
      }
    }
  });

  it("every person has birth and death years as numbers", () => {
    for (const p of data.people) {
      expect(typeof p.birth).toBe("number");
      expect(typeof p.death).toBe("number");
    }
  });

  it("every person has a non-empty reason string", () => {
    for (const p of data.people) {
      expect(typeof p.reason).toBe("string");
      expect(p.reason.length).toBeGreaterThan(0);
    }
  });

  it("passes the full validateDataset check with no problems", () => {
    expect(validateDataset(data)).toEqual([]);
  });
});

describe("data filtering", () => {
  it("every idea id has at least one agreeing and one disagreeing thinker", () => {
    for (const idea of data.ideas) {
      const withIdea = data.people.filter((p) => p.ideas.includes(idea.id));
      expect(withIdea.some((p) => p.side === "agree"),    `no agree for ${idea.id}`).toBe(true);
      expect(withIdea.some((p) => p.side === "disagree"), `no disagree for ${idea.id}`).toBe(true);
    }
  });
});
