/**
 * Format a birth–death year pair, handling BCE dates.
 * @param {number} birth  - Year of birth (negative = BCE)
 * @param {number} death  - Year of death (negative = BCE)
 * @returns {string}  e.g. "1817–1862" or "427 BCE–347 BCE"
 */
export function formatYears(birth, death) {
  const fmt = (y) => (y < 0 ? `${Math.abs(y)} BCE` : `${y}`);
  return `${fmt(birth)}–${fmt(death)}`;
}

/**
 * Compute the SVG position for a thinker node within a 200×120 viewBox
 * (Emerson center at 100, 60).
 *
 * x: symmetric spread around center — dist 1 = 28 units away, dist 5 = 68 units away.
 * y: evenly distributed from y=6 to y=114 across all nodes on that side.
 *
 * @param {{ side: "agree"|"disagree", distance: number }} person
 * @param {number} index  - 0-based index within the sorted list for this side
 * @param {number} total  - Total nodes on this side
 * @returns {{ x: number, y: number }}
 */
export function positionFor(person, index, total) {
  const distFromCenter = 18 + person.distance * 10;
  const x = person.side === "agree" ? 100 - distFromCenter : 100 + distFromCenter;
  const y = total <= 1 ? 60 : 6 + (index * 108) / Math.max(1, total - 1);
  return { x, y };
}

/**
 * Validate the entire dataset for consistency.
 * Returns an array of human-readable problem strings (empty = all good).
 *
 * Checks:
 *  - Exactly 3 ideas
 *  - Exactly 20 people
 *  - Exactly 10 agree / 10 disagree
 *  - No duplicate person ids
 *  - Each distance is within 1–5
 *  - Each person maps to at least one idea
 *  - No person references an unknown idea id
 *  - Every person has a topic summary for all 3 ideas
 *
 * @param {{ ideas: Array, people: Array }} data
 * @returns {string[]}
 */
export function validateDataset(data) {
  const problems = [];

  if (data.ideas.length !== 3) problems.push("Expected exactly 3 Emerson ideas.");
  if (data.people.length !== 20) problems.push("Expected exactly 20 thinkers.");

  const ideaIds = new Set(data.ideas.map((i) => i.id));
  const personIds = new Set();
  let agreeCount = 0;
  let disagreeCount = 0;

  for (const p of data.people) {
    if (personIds.has(p.id)) problems.push(`Duplicate person id: ${p.id}`);
    personIds.add(p.id);

    if (p.side === "agree") agreeCount++;
    if (p.side === "disagree") disagreeCount++;

    if (p.distance < 1 || p.distance > 5)
      problems.push(`Distance out of range (1–5) for ${p.name}: ${p.distance}`);

    if (!p.ideas || p.ideas.length === 0)
      problems.push(`${p.name} must map to at least one idea.`);

    for (const id of p.ideas ?? [])
      if (!ideaIds.has(id)) problems.push(`${p.name} references unknown idea "${id}".`);

    for (const idea of data.ideas)
      if (!p.topicSummaries?.[idea.id])
        problems.push(`${p.name} is missing a topic summary for "${idea.id}".`);
  }

  if (agreeCount !== 10 || disagreeCount !== 10)
    problems.push(
      `Expected 10 agree and 10 disagree thinkers, got ${agreeCount} agree and ${disagreeCount} disagree.`
    );

  return problems;
}
