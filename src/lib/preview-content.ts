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
  actions: {
    sourceTrailTarget: "source-trail";
    reframe: { topic?: string; claim?: string };
    relatedTimelessTopicSlug: string;
  };
};

export const previewStories: readonly PreviewStory[] = [
  {
    slug: "street-plan-daily-realities",
    mode: "news",
    locale: "en-IN",
    status: "editorial_fixture",
    kicker: "Editorial fixture · India-first reading method",
    title: "One street plan, five different daily realities",
    dek: "This deliberately fictional Indian teaching story shows the reading method. It is not a report about a real city, policy, or person.",
    updatedLabel: "Fixture revised 31 August 2026",
    whatChanged: "A fictional municipal council in Nadi Nagar reserves part of Bazaar Road for buses, walking, and short deliveries during the day. The notice is one starting point; its effects depend on work, care, access, and the options people actually have.",
    whyItMatters: "The example is Indian in everyday setting, but it makes no claim about a real Indian city. It shows a simple promise: the event, the evidence, and a person’s lived experience are not interchangeable kinds of knowledge.",
    visual: {
      kind: "authored_diagram",
      label: "Perspective map: bus corridor, market edge, school gate, and clinic approach",
      credit: "Diagram by Syāt. Fictional Indian teaching illustration.",
      limitation: "It illustrates a method. It does not map a real place, community, or policy outcome."
    },
    timeline: [
      { date: "Week 0", text: "The fictional council publishes a street plan, delivery window, and bus-corridor map.", sourceIds: ["fixture-policy"] },
      { date: "Week 6", text: "The fictional plan starts; readers can separate the published rule from expected effects.", sourceIds: ["fixture-policy"] },
      { date: "Week 8", text: "Different routines make different access, time, and practical barriers visible.", sourceIds: ["fixture-experience"] }
    ],
    evidence: [
      { type: "documented", text: "The teaching-policy document describes a daytime bus corridor, walking space, and delivery window.", sourceIds: ["fixture-policy"], scope: "Directly supported by the fictional policy document." },
      { type: "interpreted", text: "A street plan may make some journeys safer or quicker while shifting practical pressure onto people who cannot change their timing, route, or work pattern.", sourceIds: ["fixture-policy", "fixture-experience"], scope: "A reasoned interpretation, not a measured outcome." },
      { type: "unresolved", text: "Will footpaths, crossings, deliveries, buses, and access support work for people with the least room to adjust?", sourceIds: ["fixture-policy"], scope: "Needs outcome data and affected residents’ evidence." }
    ],
    perspectives: [
      { label: "Bus commuter", sees: "Whether one bus journey becomes more dependable or more crowded.", values: "Reliable time and an affordable trip.", uses: "Shift hours, bus frequency, and the published plan.", mayMiss: "The limits faced by people who cannot use that route." },
      { label: "Street vendor", sees: "Whether a customer can still reach the stall and a supplier can still deliver.", values: "A viable day’s trade and predictable access.", uses: "Delivery windows, footfall, and local relationships.", mayMiss: "Benefits that arrive outside the immediate market edge." },
      { label: "Wheelchair user", sees: "Whether the promised route is continuous in practice, not only on the map.", values: "Access, dignity, and dependable assistance.", uses: "Kerbs, crossings, obstructions, and each trip’s constraints.", mayMiss: "Other residents’ different access needs." },
      { label: "School caregiver", sees: "How a changed road meets the chain of pick-up, work, and care.", values: "Safety and reliable time.", uses: "School hours, walking conditions, and family routines.", mayMiss: "System-wide effects beyond one family’s day." },
      { label: "City planner", sees: "A street allocation within a wider transport system.", values: "Safer streets, useful buses, and fair allocation.", uses: "The plan, budgets, and aggregate measures.", mayMiss: "Friction and harm within an individual journey." }
    ],
    sources: [
      { id: "fixture-policy", publisher: "Syāt teaching desk", title: "Fictional Nadi Nagar street plan: sample policy note", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Shows the example plan’s stated terms." },
      { id: "fixture-experience", publisher: "Syāt teaching desk", title: "Fictional everyday-route notes: sample standpoint prompts", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Shows why experience is framed as experience, not proof for everyone." }
    ],
    actions: { sourceTrailTarget: "source-trail", reframe: { claim: "How does a street plan change daily life for people with different room to adjust?" }, relatedTimelessTopicSlug: "street-vending" }
  },
  {
    slug: "how-cities-move",
    mode: "timeless",
    locale: "en-IN",
    status: "editorial_fixture",
    kicker: "Timeless fixture · a recurring public question",
    title: "How do Indian cities decide who gets time on a street?",
    dek: "A teaching subject about access, work, public space, care, and the competing meanings of a journey.",
    updatedLabel: "Fixture revised 31 August 2026",
    whatChanged: "The question returns whenever an Indian city changes how a street, fare, or public time is shared. The answer cannot be reduced to traffic alone.",
    whyItMatters: "A timeless subject helps readers carry a question across Indian places and eras without pretending every situation is the same.",
    visual: { kind: "authored_diagram", label: "A four-route question map", credit: "Diagram by Syāt. Indian-context teaching illustration.", limitation: "A conceptual aid, not a transit map or dataset." },
    timeline: [
      { date: "Then", text: "Indian cities have repeatedly reorganised movement around new tools, rules, and public expectations.", sourceIds: ["fixture-method"] },
      { date: "Now", text: "A single journey still carries questions of access, cost, time, care, and public space.", sourceIds: ["fixture-method"] }
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
    sources: [{ id: "fixture-method", publisher: "Syāt teaching desk", title: "Method fixture: a question across contexts", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Explains the scope of this non-reporting fixture." }],
    actions: { sourceTrailTarget: "source-trail", reframe: { topic: "street-vending" }, relatedTimelessTopicSlug: "street-vending" }
  }
] as const;

export function getPreviewStory(slug: string) {
  return previewStories.find((story) => story.slug === slug);
}
