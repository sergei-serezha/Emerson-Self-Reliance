import { describe, it, expect } from "vitest";
import { formatYears, positionFor, validateDataset } from "../utils.js";

// ─────────────────────────────────────────────────────────────
// formatYears
// ─────────────────────────────────────────────────────────────
describe("formatYears", () => {
  it("formats a standard CE range", () => {
    expect(formatYears(1817, 1862)).toBe("1817–1862");
  });

  it("formats both BCE dates", () => {
    expect(formatYears(-427, -347)).toBe("427 BCE–347 BCE");
  });

  it("formats a BCE birth with CE death", () => {
    expect(formatYears(-4, 65)).toBe("4 BCE–65");
  });

  it("uses an en-dash, not a hyphen", () => {
    const result = formatYears(1800, 1900);
    expect(result).toContain("–");
    expect(result).not.toContain("-");
  });
});

// ─────────────────────────────────────────────────────────────
// positionFor
// ─────────────────────────────────────────────────────────────
describe("positionFor", () => {
  const agree   = (d) => ({ side: "agree",    distance: d });
  const disagree = (d) => ({ side: "disagree", distance: d });

  it("places agree nodes to the left of center (x < 100)", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      const { x } = positionFor(agree(d), 0, 1);
      expect(x).toBeLessThan(100);
    }
  });

  it("places disagree nodes to the right of center (x > 100)", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      const { x } = positionFor(disagree(d), 0, 1);
      expect(x).toBeGreaterThan(100);
    }
  });

  it("agree nodes are further left at greater distance", () => {
    const x1 = positionFor(agree(1), 0, 1).x;
    const x5 = positionFor(agree(5), 0, 1).x;
    expect(x5).toBeLessThan(x1);
  });

  it("disagree nodes are further right at greater distance", () => {
    const x1 = positionFor(disagree(1), 0, 1).x;
    const x5 = positionFor(disagree(5), 0, 1).x;
    expect(x5).toBeGreaterThan(x1);
  });

  it("single node returns y = 60 (vertical center)", () => {
    expect(positionFor(agree(1), 0, 1).y).toBe(60);
    expect(positionFor(disagree(3), 0, 1).y).toBe(60);
  });

  it("first node of many starts at y = 6", () => {
    expect(positionFor(agree(1), 0, 10).y).toBe(6);
  });

  it("last node of many ends at y = 114", () => {
    expect(positionFor(agree(1), 9, 10).y).toBe(114);
  });

  it("nodes are evenly spread across the y range", () => {
    const total = 5;
    const ys = Array.from({ length: total }, (_, i) => positionFor(agree(1), i, total).y);
    const gaps = ys.slice(1).map((y, i) => y - ys[i]);
    gaps.forEach((gap) => expect(gap).toBeCloseTo(gaps[0], 5));
  });

  it("agree and disagree nodes at the same distance are symmetric around x=100", () => {
    for (const d of [1, 2, 3, 4, 5]) {
      const xA = positionFor(agree(d),    0, 1).x;
      const xD = positionFor(disagree(d), 0, 1).x;
      expect(xA + xD).toBeCloseTo(200, 5);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// validateDataset
// ─────────────────────────────────────────────────────────────

/** Build a minimal valid dataset for testing. */
function makeDataset({ peopleCount = 20, agreeCount = 10, disagreeCount = 10 } = {}) {
  const ideas = [
    { id: "self-trust",    label: "Self-Trust",    description: "desc" },
    { id: "nonconformity", label: "Nonconformity", description: "desc" },
    { id: "originality",   label: "Originality",   description: "desc" },
  ];

  const makePerson = (i, side) => ({
    id: `person-${i}`,
    name: `Person ${i}`,
    birth: 1800 + i,
    death: 1880 + i,
    side,
    distance: (i % 5) + 1,
    ideas: ["self-trust"],
    topicSummaries: {
      "self-trust":    { stance: "agree",    summary: "s" },
      "nonconformity": { stance: "disagree", summary: "s" },
      "originality":   { stance: "mixed",    summary: "s" },
    },
  });

  const people = [
    ...Array.from({ length: agreeCount },    (_, i) => makePerson(i,               "agree")),
    ...Array.from({ length: disagreeCount }, (_, i) => makePerson(i + agreeCount,   "disagree")),
  ].slice(0, peopleCount);

  return { ideas, people };
}

describe("validateDataset", () => {
  it("returns no problems for a valid dataset", () => {
    expect(validateDataset(makeDataset())).toEqual([]);
  });

  it("flags wrong idea count", () => {
    const d = makeDataset();
    d.ideas = d.ideas.slice(0, 2);
    expect(validateDataset(d)).toContain("Expected exactly 3 Emerson ideas.");
  });

  it("flags wrong people count", () => {
    const d = makeDataset();
    d.people = d.people.slice(0, 18);
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("20 thinkers"))).toBe(true);
  });

  it("flags unbalanced agree/disagree count", () => {
    const d = makeDataset({ agreeCount: 12, disagreeCount: 8 });
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("10 agree and 10 disagree"))).toBe(true);
  });

  it("flags duplicate person ids", () => {
    const d = makeDataset();
    d.people[1].id = d.people[0].id;
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("Duplicate"))).toBe(true);
  });

  it("flags distance below 1", () => {
    const d = makeDataset();
    d.people[0].distance = 0;
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("Distance out of range"))).toBe(true);
  });

  it("flags distance above 5", () => {
    const d = makeDataset();
    d.people[0].distance = 6;
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("Distance out of range"))).toBe(true);
  });

  it("accepts boundary distances 1 and 5", () => {
    const d = makeDataset();
    d.people[0].distance = 1;
    d.people[1].distance = 5;
    expect(validateDataset(d)).toEqual([]);
  });

  it("flags unknown idea id in person.ideas", () => {
    const d = makeDataset();
    d.people[0].ideas = ["nonexistent-idea"];
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("unknown idea"))).toBe(true);
  });

  it("flags missing topic summary", () => {
    const d = makeDataset();
    delete d.people[0].topicSummaries["self-trust"];
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("missing a topic summary"))).toBe(true);
  });

  it("flags person with no ideas", () => {
    const d = makeDataset();
    d.people[0].ideas = [];
    const problems = validateDataset(d);
    expect(problems.some((p) => p.includes("at least one idea"))).toBe(true);
  });
});
