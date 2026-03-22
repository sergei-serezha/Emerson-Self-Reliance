import React, { useEffect, useMemo, useState } from "react";

type IdeaId = "self-trust" | "nonconformity" | "originality";
type Side = "agree" | "disagree";

type TopicSummary = {
  stance: "agree" | "mixed" | "disagree";
  summary: string;
};

type Person = {
  id: string;
  name: string;
  birth: number;
  death: number;
  side: Side;
  distance: number;
  ideas: IdeaId[];
  reason: string;
  topicSummaries: Record<IdeaId, TopicSummary>;
};

const data: {
  ideas: { id: IdeaId; label: string; description: string }[];
  people: Person[];
} = {
  ideas: [
    {
      id: "self-trust",
      label: "Self-Trust",
      description:
        "Trust your own mind and moral intuition rather than deferring automatically to public opinion, institutions, or inherited formulas.",
    },
    {
      id: "nonconformity",
      label: "Nonconformity",
      description:
        "Resist social pressure when conformity would require betraying what you honestly judge to be true.",
    },
    {
      id: "originality",
      label: "Originality / Anti-Imitation",
      description:
        "Do not live by copying others. A worthwhile life must be expressed from one’s own nature and voice.",
    },
  ],
  people: [
    {
      id: "thoreau",
      name: "Henry David Thoreau",
      birth: 1817,
      death: 1862,
      side: "agree",
      distance: 1,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "Thoreau most directly extends Emerson into lived practice. Walden and Civil Disobedience make inward conviction, resistance to pressure, and an unborrowed life central themes.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Thoreau treats conscience and firsthand experience as higher guides than convention. His writing repeatedly says a person must test life directly rather than inherit it secondhand.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "He openly defends principled refusal, most famously in Civil Disobedience. For Thoreau, society becomes morally dangerous when obedience outruns judgment.",
        },
        originality: {
          stance: "agree",
          summary:
            "Walden is partly an experiment in refusing imitation. Thoreau thinks style, labor, and daily living should arise from one’s own deliberate pattern of life.",
        },
      },
    },
    {
      id: "fuller",
      name: "Margaret Fuller",
      birth: 1810,
      death: 1850,
      side: "agree",
      distance: 1,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "Fuller shares Emerson’s belief in self-culture and the authority of the developing person. She pushes those themes into questions of women’s freedom, education, and intellectual independence.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Fuller argues that people, especially women constrained by custom, must cultivate inward powers rather than accept borrowed limits. She sees self-development as morally serious, not merely personal preference.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "Her critique of fixed gender roles is a direct challenge to social conformity. She treats convention as something that can stunt human possibility.",
        },
        originality: {
          stance: "agree",
          summary:
            "Fuller values the unfolding of each person’s own capacities. She agrees with Emerson that growth is damaged when life is reduced to imitation of assigned models.",
        },
      },
    },
    {
      id: "whitman",
      name: "Walt Whitman",
      birth: 1819,
      death: 1892,
      side: "agree",
      distance: 2,
      ideas: ["self-trust", "originality"],
      reason:
        "Whitman turns Emersonian independence into a poetic voice that is expansive, democratic, and unmistakably personal. He is less systematic than Emerson, but strongly aligned in spirit.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Whitman speaks from the authority of the self and treats the individual voice as worthy of public utterance. He assumes that inward experience can carry universal weight.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "His poetry breaks moral and literary conventions, including norms around form and subject matter. That break is not rebellion for its own sake but confidence in a freer mode of expression.",
        },
        originality: {
          stance: "agree",
          summary:
            "Leaves of Grass is almost a manifesto for originality in style and subject. Whitman rejects imitation of inherited poetic standards in favor of an unmistakably new voice.",
        },
      },
    },
    {
      id: "nietzsche",
      name: "Friedrich Nietzsche",
      birth: 1844,
      death: 1900,
      side: "agree",
      distance: 2,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "Nietzsche overlaps with Emerson in his attack on herd values and his praise of self-creation. He is harsher and more aristocratic than Emerson, but close on the value of inward independence.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Nietzsche wants strong individuals to create value rather than submit passively to received morality. He treats self-overcoming as a mark of intellectual and moral strength.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "Few thinkers criticize conformity more aggressively. Nietzsche sees the herd as hostile to excellence and suspicious of any life that rises above average expectations.",
        },
        originality: {
          stance: "agree",
          summary:
            "He prizes becoming what one is, not copying a ready-made ideal. Originality for Nietzsche is existential, involving the creation of a singular form of life.",
        },
      },
    },
    {
      id: "kierkegaard",
      name: "Søren Kierkegaard",
      birth: 1813,
      death: 1855,
      side: "agree",
      distance: 2,
      ideas: ["self-trust", "nonconformity"],
      reason:
        "Kierkegaard strongly shares Emerson’s distrust of the crowd and his emphasis on the single individual. He differs because his deepest standard is religious obedience, not Emerson’s freer inward law.",
      topicSummaries: {
        "self-trust": {
          stance: "mixed",
          summary:
            "Kierkegaard values inwardness and personal responsibility, but he does not simply tell the self to trust itself. The self must stand transparently before God, not treat its own impulses as final authority.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "He famously attacks the crowd and mass opinion as evasions of real responsibility. In that respect he is very close to Emerson’s resistance to social flattening.",
        },
        originality: {
          stance: "mixed",
          summary:
            "Kierkegaard values singular existence, but not originality as self-display. What matters is becoming an individual in truth, even if that path is hidden and inward rather than stylistically novel.",
        },
      },
    },
    {
      id: "william-james",
      name: "William James",
      birth: 1842,
      death: 1910,
      side: "agree",
      distance: 2,
      ideas: ["self-trust", "originality"],
      reason:
        "James inherits Emerson’s confidence in lived experience and the individual act. He is more empirical and pluralist, but he shares the sense that persons help make truth and value practical.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "James gives real weight to personal experience, choice, and temperament in belief. He does not reduce judgment to impersonal systems detached from lived life.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "His pluralism resists the pressure to force all experience into one system. That leaves room for intellectual independence and skepticism toward totalizing consensus.",
        },
        originality: {
          stance: "agree",
          summary:
            "James values novelty, individual initiative, and the unexpected contribution of concrete persons. He sees the individual event as capable of changing the course of history.",
        },
      },
    },
    {
      id: "montaigne",
      name: "Michel de Montaigne",
      birth: 1533,
      death: 1592,
      side: "agree",
      distance: 2,
      ideas: ["self-trust", "originality"],
      reason:
        "Montaigne models the honest first-person thinker Emerson admired. He is more skeptical and less programmatic, but he legitimizes inward reflection and an unborrowed voice.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Montaigne trusts examination of his own experience as philosophically meaningful. He makes the self a valid site of inquiry rather than treating authority as wholly external.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "He is independent-minded, but usually in a moderate and skeptical register rather than an activist one. His nonconformity lies more in candor and detachment than open confrontation.",
        },
        originality: {
          stance: "agree",
          summary:
            "The Essays create a strikingly personal literary form. Montaigne’s originality comes from speaking in his own voice and refusing rigid scholastic impersonality.",
        },
      },
    },
    {
      id: "rousseau",
      name: "Jean-Jacques Rousseau",
      birth: 1712,
      death: 1778,
      side: "agree",
      distance: 3,
      ideas: ["nonconformity", "originality"],
      reason:
        "Rousseau overlaps with Emerson in attacking corrupt social forms and valuing authenticity. He is less aligned on self-trust because he also emphasizes civic formation and the general will.",
      topicSummaries: {
        "self-trust": {
          stance: "mixed",
          summary:
            "Rousseau wants persons to recover a more natural and less corrupted relation to themselves. But he does not make private judgment alone the standard, since political life also requires submission to a collective moral order.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "He is deeply suspicious of society’s vanity, dependence, and corruption. That critique often sounds close to Emerson’s attack on social pressure and secondhand living.",
        },
        originality: {
          stance: "agree",
          summary:
            "Rousseau prizes authenticity over performance and often writes in a sharply singular voice. He values a more natural and less imitative way of being.",
        },
      },
    },
    {
      id: "tolstoy",
      name: "Leo Tolstoy",
      birth: 1828,
      death: 1910,
      side: "agree",
      distance: 3,
      ideas: ["self-trust", "nonconformity"],
      reason:
        "Tolstoy shares Emerson’s distrust of institutions and his emphasis on conscience, though his mature thought is more explicitly Christian and morally demanding. He agrees on inward moral authority more than on expressive originality.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Tolstoy insists that moral truth must be grasped inwardly and lived sincerely. He distrusts elite systems, abstractions, and official authority when they obscure plain moral insight.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "His later religious and political positions put him sharply at odds with church, state, and social respectability. Conscience matters more to him than compliance.",
        },
        originality: {
          stance: "mixed",
          summary:
            "Tolstoy is artistically original, but morally he does not celebrate originality for its own sake. He wants truthfulness and simplicity more than novelty or self-fashioning.",
        },
      },
    },
    {
      id: "douglass",
      name: "Frederick Douglass",
      birth: 1818,
      death: 1895,
      side: "agree",
      distance: 3,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "Douglass is not a transcendentalist copy, but he powerfully affirms intellectual self-possession and resistance to dehumanizing custom. His case for freedom makes Emerson’s themes concrete and political.",
      topicSummaries: {
        "self-trust": {
          stance: "agree",
          summary:
            "Douglass treats literacy, self-assertion, and independent judgment as tools of liberation. He shows that trusting one’s own humanity can be an act of resistance against a system built on denial of personhood.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "His life and writing oppose the racial order of his time at every level. For Douglass, conformity to unjust custom is not civility but complicity.",
        },
        originality: {
          stance: "agree",
          summary:
            "Douglass develops a public voice that is unmistakably his own and refuses imposed identities. Originality for him is tied to reclaiming authorship of one’s life and speech.",
        },
      },
    },
    {
      id: "burke",
      name: "Edmund Burke",
      birth: 1729,
      death: 1797,
      side: "disagree",
      distance: 5,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "Burke is the clearest counterpoint because he treats inherited institutions and social continuity as reservoirs of wisdom. He distrusts the idea that private judgment can safely replace historical experience.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Burke does not think individuals should trust private reason against the weight of inherited institutions. He sees tradition as a practical intelligence accumulated across generations.",
        },
        nonconformity: {
          stance: "disagree",
          summary:
            "He permits reform, but only cautious reform within the grain of existing institutions. Radical nonconformity looks to him like political arrogance with dangerous consequences.",
        },
        originality: {
          stance: "disagree",
          summary:
            "Burke is suspicious of novelty elevated above continuity. In politics especially, originality can become recklessness when it ignores the slow wisdom of social inheritance.",
        },
      },
    },
    {
      id: "hegel",
      name: "G. W. F. Hegel",
      birth: 1770,
      death: 1831,
      side: "disagree",
      distance: 4,
      ideas: ["self-trust", "nonconformity"],
      reason:
        "Hegel grants freedom a high place, but he locates freedom in ethical life, institutions, and history rather than in Emerson’s independent inward center. That makes him a structured critic of Emersonian spontaneity.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "For Hegel, the individual alone is not fully self-grounding. True freedom comes when the self is formed and recognized within rational institutions and historical life.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "Hegel does not glorify conformity, but he distrusts purely private opposition detached from ethical life. Resistance matters only when it is intelligible within a larger rational order.",
        },
        originality: {
          stance: "mixed",
          summary:
            "He values world-historical individuality, yet not originality as a general moral rule for everyone. Singular greatness matters because it expresses history, not because it simply rejects imitation.",
        },
      },
    },
    {
      id: "hobbes",
      name: "Thomas Hobbes",
      birth: 1588,
      death: 1679,
      side: "disagree",
      distance: 4,
      ideas: ["self-trust", "nonconformity"],
      reason:
        "Hobbes sees unregulated private judgment as a threat to peace. He opposes Emerson’s faith in inward authority because civil order depends, for him, on strong public power.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Hobbes thinks private judgment left to itself leads to conflict, rivalry, and insecurity. He therefore places much more confidence in sovereign authority than in the independent moral self.",
        },
        nonconformity: {
          stance: "disagree",
          summary:
            "Open resistance to public authority is usually destabilizing in Hobbes’s framework. Safety requires broad compliance with political order even when individuals dislike it.",
        },
        originality: {
          stance: "mixed",
          summary:
            "Hobbes is intellectually original, but he does not praise originality as a social ethic. In public life he values stability and rule more than self-expressive difference.",
        },
      },
    },
    {
      id: "calvin",
      name: "John Calvin",
      birth: 1509,
      death: 1564,
      side: "disagree",
      distance: 5,
      ideas: ["self-trust", "originality"],
      reason:
        "Calvin’s center of authority is divine revelation and disciplined doctrine, not autonomous inward judgment. That places him sharply against Emerson’s sacralizing of the self.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Calvin does not trust the unaided self as a sufficient guide to truth. Human beings, in his theology, are radically dependent on grace and on God’s revealed word.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "Calvin can oppose corrupt institutions, as a Reformer, but not in Emerson’s name of private inward freedom. His dissent is disciplined by scriptural authority and church order.",
        },
        originality: {
          stance: "disagree",
          summary:
            "Originality has no privileged standing in Calvin’s moral universe. What matters is fidelity to divine truth, not the production of a unique personal voice.",
        },
      },
    },
    {
      id: "de-maistre",
      name: "Joseph de Maistre",
      birth: 1753,
      death: 1821,
      side: "disagree",
      distance: 5,
      ideas: ["nonconformity", "originality"],
      reason:
        "De Maistre is one of the strongest anti-Emerson figures because he defends throne, altar, hierarchy, and authority against revolutionary individualism. He sees order as prior to self-assertion.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "De Maistre does not think the individual self should function as final judge. He treats authority, tradition, and religious order as safeguards against destructive private reason.",
        },
        nonconformity: {
          stance: "disagree",
          summary:
            "He reads modern revolt as socially corrosive rather than liberating. Emersonian nonconformity would look to him like one more symptom of revolutionary disorder.",
        },
        originality: {
          stance: "disagree",
          summary:
            "He is skeptical of novelty as a political or moral ideal. Continuity and obedience matter more than inventing new forms of selfhood.",
        },
      },
    },
    {
      id: "comte",
      name: "Auguste Comte",
      birth: 1798,
      death: 1857,
      side: "disagree",
      distance: 4,
      ideas: ["self-trust", "originality"],
      reason:
        "Comte subordinates private intuition to the scientific study of society and ordered social development. He is far from Emerson because he looks for law, system, and collective organization.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Comte does not center truth on inward insight. He wants disciplined knowledge governed by scientific method and by laws of intellectual and social development.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "He can challenge old theology and metaphysics, but not in the name of individual self-reliance. His preferred alternative is a new collective order, not freer private judgment.",
        },
        originality: {
          stance: "disagree",
          summary:
            "Originality matters only insofar as it serves positive science and social reorganization. Emerson’s anti-imitation ethos is much more personal and less technocratic.",
        },
      },
    },
    {
      id: "marx",
      name: "Karl Marx",
      birth: 1818,
      death: 1883,
      side: "disagree",
      distance: 3,
      ideas: ["self-trust", "nonconformity"],
      reason:
        "Marx shares Emerson’s hostility to alienation and dead forms, but he rejects the idea that liberation starts mainly with inward independence. Material and social structures come first for him.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Marx does not treat private moral intuition as the main engine of freedom. Consciousness is shaped by material life, so emancipation must transform social relations, not merely attitudes.",
        },
        nonconformity: {
          stance: "agree",
          summary:
            "He strongly supports opposition to oppressive social orders. Yet this is collective and structural dissent, not Emerson’s primary focus on inward self-reliance.",
        },
        originality: {
          stance: "mixed",
          summary:
            "Marx envisions richer human development beyond class domination, but not originality as a romantic ideal of unique self-expression. The point is species flourishing under changed conditions.",
        },
      },
    },
    {
      id: "macintyre",
      name: "Alasdair MacIntyre",
      birth: 1929,
      death: 2025,
      side: "disagree",
      distance: 4,
      ideas: ["self-trust", "nonconformity", "originality"],
      reason:
        "MacIntyre pushes back because he thinks moral reasoning is tradition-constituted. Emerson’s suspicion of inherited authority looks, from his angle, like one cause of modern moral fragmentation.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "MacIntyre argues that selves are formed within practices, histories, and traditions. He is wary of the modern image of the isolated chooser treating itself as morally self-sufficient.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "He can criticize dominant institutions sharply, but always from within a substantive tradition of goods and virtues. Nonconformity without such grounding becomes, for him, emotivism or drift.",
        },
        originality: {
          stance: "disagree",
          summary:
            "He does not elevate originality over fidelity to practices and standards of excellence. The good life is narratively and communally situated, not built mainly out of anti-imitation.",
        },
      },
    },
    {
      id: "confucius",
      name: "Confucius",
      birth: -551,
      death: -479,
      side: "disagree",
      distance: 4,
      ideas: ["nonconformity", "originality"],
      reason:
        "Confucius emphasizes role ethics, ritual formation, and reciprocal obligations. He values moral cultivation, but not Emerson’s tendency to privilege the solitary inner law over shared forms.",
      topicSummaries: {
        "self-trust": {
          stance: "mixed",
          summary:
            "Confucius values self-cultivation, but that cultivation is guided by ritual, learning, and exemplary models. The self is not an isolated source of authority; it is shaped through disciplined relations.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "A Confucian can resist corrupt rulers or customs, but usually from a deeper fidelity to ritual propriety and humane order. He does not celebrate nonconformity as an ideal in itself.",
        },
        originality: {
          stance: "disagree",
          summary:
            "Confucius privileges transmission, refinement, and moral formation over expressive novelty. The aim is not to invent oneself from scratch but to become excellent within humane traditions.",
        },
      },
    },
    {
      id: "plato",
      name: "Plato",
      birth: -427,
      death: -347,
      side: "disagree",
      distance: 3,
      ideas: ["self-trust", "originality"],
      reason:
        "Plato does not ground truth in private inward certainty but in dialectic, virtue, and realities beyond opinion. He is less anti-individual than Burke, but still resists Emerson’s epistemic starting point.",
      topicSummaries: {
        "self-trust": {
          stance: "disagree",
          summary:
            "Plato distrusts unexamined opinion, including one’s own. Knowledge requires education, dialectic, and alignment with truths that do not originate in private feeling.",
        },
        nonconformity: {
          stance: "mixed",
          summary:
            "Socratic philosophy is certainly nonconforming, but not because individuality is sacred. It resists convention in the name of reason and the good, not self-expression.",
        },
        originality: {
          stance: "mixed",
          summary:
            "Plato is a literary and philosophical original, yet he does not teach originality as a moral principle. The ideal soul is ordered by truth and virtue more than by uniqueness.",
        },
      },
    },
  ],
};

function formatYears(birth: number, death: number) {
  const fmt = (year: number) => (year < 0 ? `${Math.abs(year)} BCE` : `${year}`);
  return `${fmt(birth)}–${fmt(death)}`;
}

function positionFor(person: Person, side: Side, index: number, total: number) {
  const xBase = side === "agree" ? 26 : 74;
  const xOffset = (person.distance - 3) * (side === "agree" ? -6 : 6);
  const y = total === 1 ? 50 : 18 + (index * 64) / Math.max(1, total - 1);
  return { x: xBase + xOffset, y };
}

function stanceTone(stance: TopicSummary["stance"]) {
  if (stance === "agree") return "bg-green-100 text-green-800 border-green-200";
  if (stance === "disagree") return "bg-red-100 text-red-800 border-red-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function validateDataset() {
  const problems: string[] = [];

  if (data.ideas.length !== 3) problems.push("Expected exactly 3 Emerson ideas.");
  if (data.people.length !== 20) problems.push("Expected exactly 20 thinkers.");

  const ideaIds = new Set(data.ideas.map((idea) => idea.id));
  const personIds = new Set<string>();
  let agreeCount = 0;
  let disagreeCount = 0;

  for (const person of data.people) {
    if (personIds.has(person.id)) problems.push(`Duplicate person id: ${person.id}`);
    personIds.add(person.id);

    if (person.side === "agree") agreeCount += 1;
    if (person.side === "disagree") disagreeCount += 1;
    if (person.distance < 1 || person.distance > 5) problems.push(`Distance must be 1-5 for ${person.name}.`);
    if (person.ideas.length === 0) problems.push(`${person.name} must map to at least one idea.`);

    for (const ideaId of person.ideas) {
      if (!ideaIds.has(ideaId)) problems.push(`${person.name} references unknown idea ${ideaId}.`);
    }

    for (const idea of data.ideas) {
      if (!person.topicSummaries[idea.id]) {
        problems.push(`${person.name} is missing a topic summary for ${idea.id}.`);
      }
    }
  }

  if (agreeCount !== 10 || disagreeCount !== 10) {
    problems.push(`Expected 10 agree and 10 disagree thinkers, got ${agreeCount} agree and ${disagreeCount} disagree.`);
  }

  return problems;
}

function Node({
  person,
  side,
  index,
  total,
  isSelected,
  onSelect,
}: {
  person: Person;
  side: Side;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const pos = positionFor(person, side, index, total);
  const lineColor = side === "agree" ? "#16a34a" : "#dc2626";
  const fillColor = side === "agree" ? "#dcfce7" : "#fee2e2";
  const strokeColor = side === "agree" ? "#16a34a" : "#dc2626";

  return (
    <g onClick={() => onSelect(person.id)} className="cursor-pointer">
      <line x1="50" y1="50" x2={pos.x} y2={pos.y} stroke={lineColor} strokeWidth={isSelected ? 0.55 : 0.4} opacity="0.8" />
      <circle cx={pos.x} cy={pos.y} r={isSelected ? 3.5 : 2.9} fill={fillColor} stroke={strokeColor} strokeWidth={isSelected ? 0.45 : 0.35} />
      <text x={pos.x} y={pos.y - 4.2} textAnchor="middle" style={{ fontSize: 2.1, fill: "#334155", fontWeight: 600 }}>
        {person.name}
      </text>
      <text x={pos.x} y={pos.y - 2.2} textAnchor="middle" style={{ fontSize: 1.7, fill: "#64748b" }}>
        {formatYears(person.birth, person.death)}
      </text>
      <text x={pos.x} y={pos.y + 0.9} textAnchor="middle" style={{ fontSize: 2.2, fill: "#0f172a", fontWeight: 700 }}>
        {person.distance}
      </text>
    </g>
  );
}

export default function EmersonNetworkApp() {
  const [selectedIdea, setSelectedIdea] = useState<IdeaId>("self-trust");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showDirectory, setShowDirectory] = useState(true);

  const validationProblems = useMemo(() => validateDataset(), []);

  const selectedIdeaMeta = useMemo(
    () => data.ideas.find((idea) => idea.id === selectedIdea) ?? data.ideas[0],
    [selectedIdea]
  );

  const filteredPeople = useMemo(
    () => data.people.filter((person) => person.ideas.includes(selectedIdea)),
    [selectedIdea]
  );

  useEffect(() => {
    if (!selectedPersonId || !filteredPeople.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(filteredPeople[0]?.id ?? null);
    }
  }, [filteredPeople, selectedPersonId]);

  const agree = useMemo(
    () => filteredPeople.filter((p) => p.side === "agree").sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name)),
    [filteredPeople]
  );

  const disagree = useMemo(
    () => filteredPeople.filter((p) => p.side === "disagree").sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name)),
    [filteredPeople]
  );

  const selectedPerson = filteredPeople.find((person) => person.id === selectedPersonId) ?? null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)_420px]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 text-sm uppercase tracking-wide text-slate-500">Emerson explorer</div>
          <h1 className="mb-3 text-2xl font-semibold">Self-Reliance Network</h1>
          <p className="mb-5 text-sm text-slate-600">
            Select one Emerson idea to compare thinkers. Click any node or directory card to read a researched summary of that person’s stance on all three ideas.
          </p>

          <div className="space-y-3">
            {data.ideas.map((idea) => {
              const active = selectedIdea === idea.id;
              return (
                <button
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-semibold">{idea.label}</div>
                  <p className={`mt-1 text-sm ${active ? "text-slate-200" : "text-slate-600"}`}>{idea.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="mb-2 font-semibold text-slate-800">Legend</div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-600" /> Agreement
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-red-600" /> Disagreement
            </div>
            <div>Distance 1 = very close, 5 = very far.</div>
          </div>

          <button
            onClick={() => setShowDirectory((v) => !v)}
            className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {showDirectory ? "Hide" : "Show"} thinker directory
          </button>

          {validationProblems.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="mb-2 font-semibold">Dataset checks</div>
              <ul className="list-disc space-y-1 pl-5">
                {validationProblems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <main className="space-y-6">
          <section className="relative min-h-[760px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-500">Selected idea</div>
                <h2 className="text-2xl font-semibold">{selectedIdeaMeta.label}</h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">{selectedIdeaMeta.description}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <div>{agree.length} agree</div>
                <div>{disagree.length} disagree</div>
              </div>
            </div>

            <div className="relative h-[680px] overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
              <div className="absolute left-6 top-5 text-sm font-medium text-green-700">Agreement</div>
              <div className="absolute right-6 top-5 text-sm font-medium text-red-700">Disagreement</div>

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <line x1="50" y1="10" x2="50" y2="90" stroke="#e2e8f0" strokeWidth="0.35" strokeDasharray="1.2 1.2" />

                {agree.map((person, index) => (
                  <Node
                    key={person.id}
                    person={person}
                    side="agree"
                    index={index}
                    total={agree.length}
                    isSelected={selectedPerson?.id === person.id}
                    onSelect={setSelectedPersonId}
                  />
                ))}

                {disagree.map((person, index) => (
                  <Node
                    key={person.id}
                    person={person}
                    side="disagree"
                    index={index}
                    total={disagree.length}
                    isSelected={selectedPerson?.id === person.id}
                    onSelect={setSelectedPersonId}
                  />
                ))}
              </svg>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold leading-tight text-white shadow-lg">
                Ralph Waldo Emerson
                <div className="text-[11px] text-slate-300">1803–1882</div>
              </div>
            </div>
          </section>

          {showDirectory && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-wide text-slate-500">Thinker directory</div>
                  <h3 className="text-xl font-semibold">Explore all thinkers linked to {selectedIdeaMeta.label}</h3>
                </div>
                <div className="text-sm text-slate-500">Click a card to open details</div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredPeople.map((person) => {
                  const topic = person.topicSummaries[selectedIdea];
                  const active = selectedPerson?.id === person.id;
                  return (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPersonId(person.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{person.name}</div>
                          <div className={`text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>{formatYears(person.birth, person.death)}</div>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${active ? "border-white/20 bg-white/10 text-white" : stanceTone(topic.stance)}`}>
                          {topic.stance}
                        </span>
                      </div>
                      <p className={`mt-3 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-600"}`}>{topic.summary}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 text-sm uppercase tracking-wide text-slate-500">Selected thinker</div>

          {selectedPerson ? (
            <>
              <h3 className="text-2xl font-semibold">{selectedPerson.name}</h3>
              <div className="mt-1 text-slate-500">{formatYears(selectedPerson.birth, selectedPerson.death)}</div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-sm ${selectedPerson.side === "agree" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {selectedPerson.side === "agree" ? "Overall agreement" : "Overall disagreement"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Distance {selectedPerson.distance}</span>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 text-sm font-semibold text-slate-800">Why this person is placed here</div>
                <p className="text-sm leading-6 text-slate-700">{selectedPerson.reason}</p>
              </div>

              <div className="mt-6 space-y-4">
                {data.ideas.map((idea) => {
                  const topic = selectedPerson.topicSummaries[idea.id];
                  const active = selectedIdea === idea.id;
                  return (
                    <div key={idea.id} className={`rounded-2xl border p-4 ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <button onClick={() => setSelectedIdea(idea.id)} className="text-left">
                          <div className="font-semibold">{idea.label}</div>
                          <div className={`mt-1 text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>Click to filter the graph by this idea</div>
                        </button>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${active ? "border-white/20 bg-white/10 text-white" : stanceTone(topic.stance)}`}>
                          {topic.stance}
                        </span>
                      </div>
                      <p className={`mt-3 text-sm leading-6 ${active ? "text-slate-200" : "text-slate-700"}`}>{topic.summary}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="mb-2 font-semibold text-slate-800">Built-in checks</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Exactly 3 Emerson ideas.</li>
                  <li>Exactly 20 thinkers.</li>
                  <li>Exactly 10 agree and 10 disagree entries.</li>
                  <li>Every thinker has a researched summary for all 3 ideas.</li>
                  <li>Every distance stays within 1 to 5.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-slate-500">No thinker selected.</div>
          )}
        </aside>
      </div>
    </div>
  );
}
