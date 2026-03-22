# Self-Reliance Network

An interactive web app that maps how 20 historical thinkers agree or disagree with Ralph Waldo Emerson on three central ideas from *Self-Reliance*.

## Product Overview

Self-Reliance Network gives you an instant, visual answer to the question: *who thought like Emerson, and who pushed back?*

You pick one of Emerson's three core ideas. The graph re-draws to show every thinker who engages that idea, placed left (agrees) or right (disagrees) of Emerson's central node, with a distance number (1–5) showing how closely their position overlaps. Click any node to read a full explanation in the detail panel on the right.

### The Three Ideas

| Idea | Core claim |
|---|---|
| **Self-Trust** | Trust your own mind and moral intuition rather than deferring automatically to public opinion, institutions, or inherited formulas. |
| **Nonconformity** | Resist social pressure when conformity would require betraying what you honestly judge to be true. |
| **Originality / Anti-Imitation** | Do not live by copying others. A worthwhile life must be expressed from one's own nature and voice. |

### The 20 Thinkers

**Agree side** (10): Henry David Thoreau, Margaret Fuller, Walt Whitman, Friedrich Nietzsche, Søren Kierkegaard, William James, Michel de Montaigne, Jean-Jacques Rousseau, Leo Tolstoy, Frederick Douglass

**Disagree side** (10): Edmund Burke, G. W. F. Hegel, Thomas Hobbes, John Calvin, Joseph de Maistre, Auguste Comte, Karl Marx, Alasdair MacIntyre, Confucius, Plato

### Distance Scale

| Distance | Meaning |
|---|---|
| 1 | Closest ally — nearly identical position |
| 2 | Strong overlap with minor differences |
| 3 | Partial overlap — shares the concern, diverges on framing or scope |
| 4 | Disagrees with the central claim but not hostile |
| 5 | Sharpest critic — directly opposes the core idea |

### Features

- **Idea selector** — switch between Self-Trust, Nonconformity, and Originality; the graph and all content update instantly
- **Interactive graph** — click any node to load that thinker in the detail panel; the selected node is highlighted with a ring
- **Detail panel** — shows the thinker's name, birth/death years, overall stance badge, distance, a "why here" explanation, and a per-idea summary for all three ideas; clicking an idea section switches the active graph view
- **Thinker directory** — toggle a full grid of all thinkers; click any card to load them in the detail panel
- Auto-selects the first thinker on load so the panel is never empty

---

## Technical Documentation

### Tech Stack

| Layer | Tool | Version |
|---|---|---|
| UI framework | React | 18 |
| Build tool | Vite | 5 |
| Styling | Tailwind CSS | 3 |
| Graph visualization | SVG (hand-rolled) | — |
| Testing | Vitest + @testing-library/react | 4 + 16 |
| Deployment | Netlify | — |

### Project Structure

```
emerson-self-reliance-network/
├── index.html                  # Vite entry HTML
├── vite.config.js              # Vite + Vitest config
├── tailwind.config.js          # Tailwind content paths
├── postcss.config.js           # PostCSS (autoprefixer)
├── package.json
├── netlify.toml                # SPA redirect rule
└── src/
    ├── main.jsx                # ReactDOM.createRoot entry point
    ├── index.css               # Tailwind directives (@tailwind base/components/utilities)
    ├── App.jsx                 # Root component (named export: App)
    ├── data.js                 # All content: ideas + 20 thinkers
    ├── utils.js                # Pure helpers: positionFor, formatYears, validateDataset
    ├── test-setup.js           # Imports @testing-library/jest-dom matchers
    ├── components/
    │   ├── IdeaSelector.jsx    # Top bar: branding, idea tabs, legend, directory toggle
    │   ├── Graph.jsx           # SVG network visualization
    │   ├── PersonPanel.jsx     # Thinker detail panel (aside)
    │   └── Directory.jsx       # Full thinker grid
    └── __tests__/
        ├── utils.test.js
        ├── data.test.js
        ├── App.test.jsx
        └── components/
            ├── IdeaSelector.test.jsx
            ├── Graph.test.jsx
            ├── PersonPanel.test.jsx
            └── Directory.test.jsx
```

### Component API

#### `<App />`

Named export. Holds all state; renders the full page layout.

| State | Type | Default | Description |
|---|---|---|---|
| `selectedIdea` | string | `"self-trust"` | Active idea id |
| `selectedPersonId` | string \| null | first person in filtered list | Selected thinker |
| `showDirectory` | boolean | `false` | Whether the directory is visible |

`filteredPeople` is derived: `data.people.filter(p => p.ideas.includes(selectedIdea))`.

#### `<IdeaSelector />`

| Prop | Type | Description |
|---|---|---|
| `ideas` | Idea[] | All idea objects |
| `selectedIdea` | string | Active idea id |
| `onSelect` | (id: string) => void | Called when an idea tab is clicked |
| `showDirectory` | boolean | Controls button label ("Show"/"Hide") |
| `onToggleDirectory` | () => void | Called when the directory button is clicked; omit to hide the button |

`data-testid="idea-selector"` on root div for test scoping.

#### `<Graph />`

| Prop | Type | Description |
|---|---|---|
| `filteredPeople` | Person[] | People who engage the active idea |
| `selectedIdea` | string | Active idea id |
| `selectedPersonId` | string \| null | Highlighted node |
| `onSelectPerson` | (id: string) => void | Called on node click |
| `ideas` | Idea[] | All idea objects (for header label/description) |

SVG viewBox: `0 0 200 120`. Container has `aspectRatio: "5/3"` to prevent distortion. `preserveAspectRatio="xMidYMid meet"`. Each node `<g>` has `data-testid={`node-${person.id}`}`.

#### `<PersonPanel />`

| Prop | Type | Description |
|---|---|---|
| `person` | Person \| null | Thinker to display; null shows empty state |
| `selectedIdea` | string | Highlighted idea section |
| `ideas` | Idea[] | All idea objects |
| `onSelectIdea` | (id: string) => void | Called when an idea section is clicked |

`data-testid="person-panel"` on `<aside>`.

#### `<Directory />`

| Prop | Type | Description |
|---|---|---|
| `people` | Person[] | All thinkers to display |
| `onSelectPerson` | (id: string) => void | Called on card click |

### Data Model

```js
// src/data.js

Idea {
  id: string          // "self-trust" | "nonconformity" | "originality"
  label: string       // Display name
  description: string // One-sentence description
}

Person {
  id: string          // Unique slug, e.g. "thoreau", "marx"
  name: string        // Full display name
  birth: number       // Year (negative = BCE)
  death: number       // Year (negative = BCE)
  side: "agree" | "disagree"
  distance: 1 | 2 | 3 | 4 | 5
  ideas: string[]     // Which ideas this person engages (subset of idea ids)
  reason: string      // "Why here" paragraph shown in PersonPanel header
  topicSummaries: {
    [ideaId: string]: {
      stance: "agree" | "disagree" | "mixed"
      summary: string
    }
  }
}
```

### Utility Functions (`src/utils.js`)

#### `positionFor(person, index, total) → { x, y }`

Converts a person's `side` and `distance` into SVG coordinates within the `200 × 120` viewBox.

- `distFromCenter = 18 + person.distance * 10` — agree nodes go left (`x = 100 - dist`), disagree go right (`x = 100 + dist`)
- `y = 6 + (index * 108) / Math.max(1, total - 1)` — distributes nodes evenly top-to-bottom

#### `formatYears(birth, death) → string`

Returns `"551–479 BCE"` for negative years, `"1817–1862"` for positive.

#### `validateDataset(data) → string[]`

Returns an array of problem strings (empty = valid). Checks:
- Exactly 3 ideas
- Exactly 20 people
- 10 agree / 10 disagree balance
- No duplicate person IDs
- All distances in range 1–5
- All three idea summaries present for every person

### Graph Visualization

The graph is pure SVG — no external charting library. Key design decisions:

- **Aspect ratio lock**: the container `div` has `style={{ aspectRatio: "5/3" }}` which matches the `200×120` viewBox exactly. This prevents the browser from squashing circles into ovals.
- **Node labels to the sides**: agree-side names are right-aligned to the left of the node (`textAnchor="end"`), disagree-side names are left-aligned to the right (`textAnchor="start"`). This eliminates vertical overlap between labels.
- **Invisible hit targets**: each node `<g>` includes a transparent `<circle r="6">` so the click target is larger than the visible node.
- **Selection ring**: the selected node gets an outer ring in a lighter shade of its fill color, plus a slightly larger radius (4.5 vs 3.5).

### Testing

**99 tests across 7 files.**

```
src/__tests__/utils.test.js                      23 tests  (formatYears, positionFor, validateDataset)
src/__tests__/data.test.js                       12 tests  (real data integrity)
src/__tests__/components/IdeaSelector.test.jsx   11 tests
src/__tests__/components/Graph.test.jsx          13 tests
src/__tests__/components/PersonPanel.test.jsx    15 tests
src/__tests__/components/Directory.test.jsx      12 tests
src/__tests__/App.test.jsx                       13 tests  (integration)
```

Run all tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

**Testing notes:**

- SVG `<text>` elements with `pointerEvents: "none"` do not receive click events in jsdom. Node interactions use `container.querySelector('[data-testid="node-{id}"]')` to click the parent `<g>`.
- IdeaSelector queries are scoped with `within(screen.getByTestId("idea-selector"))` to avoid matching idea buttons that also appear in PersonPanel.
- PersonPanel's `<aside>` has `data-testid="person-panel"` because `getByRole("complementary")` is ambiguous when the page renders multiple `<aside>` elements.

### Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
```

Output goes to `dist/`. The `netlify.toml` includes a redirect rule (`/* → /index.html 200`) so client-side routing works on Netlify.

### Deployment

The app is deployed as a static site on Netlify. Any push to `main` triggers a rebuild (`npm run build`). No server or database required — all content is bundled in `src/data.js`.
