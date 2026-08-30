export type PreviewSource = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedLabel: string;
  use: string;
};

export type PreviewStory = {
  slug: string;
  mode: "news" | "timeless";
  locale: "en-IN" | "hi-IN";
  status: "editorial_fixture" | "source_intake";
  kicker: string;
  title: string;
  dek: string;
  updatedLabel: string;
  whatChanged: string;
  whyItMatters: string;
  visual: { kind: "authored_diagram"; label: string; credit: string; limitation: string };
  timeline: Array<{ date: string; text: string; sourceIds: string[] }>;
  evidence: Array<{ type: "documented" | "interpreted" | "unresolved"; text: string; sourceIds: string[]; scope: string }>;
  perspectives: Array<{ label: string; sees: string; values: string; uses: string; mayMiss: string }>;
  sources: PreviewSource[];
};

export const previewStories: readonly PreviewStory[] = [
  {
    slug: "city-toll-daily-realities",
    mode: "news",
    locale: "en-IN",
    status: "editorial_fixture",
    kicker: "Editorial fixture · how a Syāt story is read",
    title: "A city toll can be one policy and six different daily realities",
    dek: "This deliberately fictional teaching story shows the reading method. It is not a report of a real city, policy, or person.",
    updatedLabel: "Fixture revised 31 August 2026",
    whatChanged: "A fictional city introduces a charge for entering its centre during peak hours. The policy text is one starting point; its effects depend on who has alternatives, flexibility, and support.",
    whyItMatters: "The example makes a simple promise visible: the event, the evidence, and a person’s lived experience are not interchangeable kinds of knowledge.",
    visual: {
      kind: "authored_diagram",
      label: "Perspective map: routes, the toll boundary, and four starting points",
      credit: "Diagram by Syāt. Fictional teaching illustration.",
      limitation: "It illustrates a method. It does not map a real place or measure a real policy outcome."
    },
    timeline: [
      { date: "Week 0", text: "The fictional council publishes a proposal and a map of the charge area.", sourceIds: ["fixture-policy"] },
      { date: "Week 6", text: "The fictional policy starts; readers can separate the published rule from expected effects.", sourceIds: ["fixture-policy"] },
      { date: "Week 8", text: "Different routines make different costs and practical barriers visible.", sourceIds: ["fixture-experience"] }
    ],
    evidence: [
      { type: "documented", text: "The teaching-policy document describes a peak-hour charge and named exemptions.", sourceIds: ["fixture-policy"], scope: "Directly supported by the fictional policy document." },
      { type: "interpreted", text: "A charge may reduce some car journeys while shifting pressure onto people who cannot change their route or work hours.", sourceIds: ["fixture-policy", "fixture-experience"], scope: "A reasoned interpretation, not a measured outcome." },
      { type: "unresolved", text: "Will accessible transport, hardship support, and enforcement work for the people the exemptions aim to protect?", sourceIds: ["fixture-policy"], scope: "Needs outcome data and affected residents’ evidence." }
    ],
    perspectives: [
      { label: "Daily commuter", sees: "A new cost attached to a familiar route.", values: "Reliable time and an affordable trip.", uses: "Work hours, bus frequency, and the published rules.", mayMiss: "The city-wide effects beyond one routine." },
      { label: "Small business", sees: "Changes to deliveries, footfall, and staff travel.", values: "Predictable costs and viable trade.", uses: "Invoices, customer patterns, and exemptions.", mayMiss: "Benefits that arrive outside the immediate trading area." },
      { label: "Disabled resident", sees: "Whether an exemption works in practice, not only on paper.", values: "Access, dignity, and dependable assistance.", uses: "The application process and each trip’s constraints.", mayMiss: "Other residents’ different access needs." },
      { label: "City planner", sees: "A tool within a wider transport system.", values: "Cleaner air, public transport, and fair allocation.", uses: "The policy, budgets, and aggregate measures.", mayMiss: "Friction and harm within an individual journey." }
    ],
    sources: [
      { id: "fixture-policy", publisher: "Syāt teaching desk", title: "Fictional city-centre charge: sample policy note", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Shows the example policy’s stated terms." },
      { id: "fixture-experience", publisher: "Syāt teaching desk", title: "Fictional routine notes: sample standpoint prompts", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Shows why experience is framed as experience, not proof for everyone." }
    ]
  },
  {
    slug: "how-cities-move",
    mode: "timeless",
    locale: "en-IN",
    status: "editorial_fixture",
    kicker: "Timeless fixture · a recurring public question",
    title: "Why do cities keep asking the same question about movement?",
    dek: "A teaching subject about access, work, public space, and the competing meanings of a journey.",
    updatedLabel: "Fixture revised 31 August 2026",
    whatChanged: "The question returns whenever a city changes how streets, fares, or time are shared. The answer cannot be reduced to traffic alone.",
    whyItMatters: "A timeless subject helps readers carry a question across places and eras without pretending every situation is the same.",
    visual: { kind: "authored_diagram", label: "A four-route question map", credit: "Diagram by Syāt. Teaching illustration.", limitation: "A conceptual aid, not a transit map or dataset." },
    timeline: [
      { date: "Then", text: "Cities have repeatedly reorganised movement around new tools, rules, and public expectations.", sourceIds: ["fixture-method"] },
      { date: "Now", text: "A single journey still carries questions of access, cost, time, and care.", sourceIds: ["fixture-method"] }
    ],
    evidence: [
      { type: "documented", text: "This fixture uses no claim about a particular city or historical record.", sourceIds: ["fixture-method"], scope: "Teaching scope only." },
      { type: "interpreted", text: "Movement is both a technical and a social question.", sourceIds: ["fixture-method"], scope: "An editorial framing proposition." },
      { type: "unresolved", text: "Which measures best show whether access has improved for people with the least flexibility?", sourceIds: ["fixture-method"], scope: "Requires a specific place, period, and data." }
    ],
    perspectives: [
      { label: "Historian", sees: "How past choices still shape present routes.", values: "Context and continuity.", uses: "Archives and comparison.", mayMiss: "The urgency of an individual trip." },
      { label: "Parent", sees: "The chain of trips needed to hold a day together.", values: "Safety and reliable time.", uses: "Daily routines and local knowledge.", mayMiss: "System-wide constraints." }
    ],
    sources: [{ id: "fixture-method", publisher: "Syāt teaching desk", title: "Method fixture: a question across contexts", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Explains the scope of this non-reporting fixture." }]
  }
] as const;

export function getPreviewStory(slug: string) {
  return previewStories.find((story) => story.slug === slug);
}
