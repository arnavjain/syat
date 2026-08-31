import { getTimelessTopic } from "./timeless-topics";

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
  media: PreviewMedia;
  timeline: PreviewTimelineEvent[];
  evidence: PreviewEvidence[];
  perspectives: PreviewPerspective[];
  associatedPeople: PreviewAssociation[];
  contextBridge: { targetSlug: string; question: string; connection: string };
  sources: PreviewSource[];
  actions: {
    sourceTrailTarget: "source-trail";
    reframe: ReframeAction;
    relatedTimelessTopicSlug: string;
  };
};

export type PreviewMedia = {
  kind: "authored_diagram";
  label: string;
  subjectTitle: string;
  mapAriaLabel: string;
  mapLabels: [string, string, string, string];
  mapCenter: string;
  creator: string;
  source: string;
  rightsBasis: string;
  reviewStatus: "fixture metadata complete";
  publicationStatus: "not publishable";
  limitation: string;
};

export type PreviewTimelineEvent = {
  order: number;
  eventType: "Published rule" | "Start period" | "Lived-question" | "Outcome to check" | "Recurring question";
  time: { kind: "exact"; label: string } | { kind: "period"; label: string } | { kind: "unknown"; label: "Time not yet known" };
  text: string;
  sourceIds: string[];
  uncertainty: string;
};

export type PreviewEvidence = {
  type: "documented" | "interpreted" | "unresolved";
  text: string;
  sourceIds: string[];
  scope: string;
  basis: { id: string; statementType: "documented" | "interpreted" | "unresolved"; basis: string; sourceScope: string; limits: string };
};

export type PreviewPerspective = {
  label: string;
  startingPoint: string;
  reading: string;
  boundary: string;
  sourceIds: string[];
};

export type PreviewAssociation = {
  id: string;
  kind: "person" | "institution" | "community" | "unknown_unverified";
  label: string;
  fixtureLabel?: "Fictional teaching record";
  association: string;
  sourceId: string;
};

export type ReframeAction = { topic: string; claim?: never } | { topic?: never; claim: string };

export function isValidReframeAction(action: { topic?: string; claim?: string }): action is ReframeAction {
  const hasTopic = typeof action.topic === "string";
  const hasClaim = typeof action.claim === "string";
  if (hasTopic === hasClaim) return false;

  if (hasTopic && action.topic) return Boolean(getTimelessTopic(action.topic));
  if (hasClaim && action.claim) return action.claim.trim().length > 0 && action.claim.length <= 320;
  return false;
}

export const previewStories: readonly PreviewStory[] = [
  {
    slug: "street-plan-daily-realities",
    mode: "news",
    locale: "en-IN",
    status: "editorial_fixture",
    kicker: "Editorial fixture · India-first reading method",
    title: "One street plan, four different daily realities",
    dek: "This deliberately fictional Indian teaching story shows the reading method. It is not a report about a real city, policy, or person.",
    updatedLabel: "Fixture revised 31 August 2026",
    whatChanged: "A fictional municipal council in Nadi Nagar reserves part of Bazaar Road for buses, walking, and short deliveries during the day. The notice is one starting point; its effects depend on work, care, access, and the options people actually have.",
    whyItMatters: "The example is Indian in everyday setting, but it makes no claim about a real Indian city. It shows a simple promise: the event, the evidence, and a person’s lived experience are not interchangeable kinds of knowledge.",
    media: {
      kind: "authored_diagram",
      label: "Perspective map: bus corridor, market edge, school gate, and clinic approach",
      subjectTitle: "A street rule is a starting point. Daily life is the question.",
      mapAriaLabel: "A conceptual teaching map of bus corridor, market edge, school gate, and clinic approach",
      mapLabels: ["Bus corridor", "Market edge", "School gate", "Clinic approach"],
      mapCenter: "One street rule",
      creator: "Syāt teaching desk",
      source: "Authored for this fictional Nadi Nagar teaching fixture",
      rightsBasis: "Syāt-authored fixture; no external asset or person depicted",
      reviewStatus: "fixture metadata complete",
      publicationStatus: "not publishable",
      limitation: "It illustrates a method. It does not map a real place, community, or policy outcome."
    },
    timeline: [
      { order: 1, eventType: "Published rule", time: { kind: "period", label: "Before the plan begins" }, text: "The fictional council publishes a street plan, delivery window, and bus-corridor map.", sourceIds: ["fixture-policy"], uncertainty: "The fixture policy note states a rule; it does not establish an outcome." },
      { order: 2, eventType: "Start period", time: { kind: "period", label: "When the fictional plan starts" }, text: "Readers can separate the published rule from the effects that still need to be checked.", sourceIds: ["fixture-policy"], uncertainty: "No exact date is declared in this teaching fixture." },
      { order: 3, eventType: "Lived-question", time: { kind: "unknown", label: "Time not yet known" }, text: "Different routines may reveal access, time, and practical barriers that a plan cannot settle alone.", sourceIds: ["fixture-experience"], uncertainty: "This is a prompt for evidence, not a record of what happened." }
    ],
    evidence: [
      { type: "documented", text: "The teaching-policy document describes a daytime bus corridor, walking space, and delivery window.", sourceIds: ["fixture-policy"], scope: "Directly supported by the fictional policy document.", basis: { id: "basis-policy-rule", statementType: "documented", basis: "A made-up sample policy note.", sourceScope: "The fictional Nadi Nagar policy note only.", limits: "It says what the fixture rule is; it does not show implementation or outcomes." } },
      { type: "interpreted", text: "A street plan may make some journeys safer or quicker while shifting practical pressure onto people who cannot change their timing, route, or work pattern.", sourceIds: ["fixture-policy", "fixture-experience"], scope: "A reasoned interpretation, not a measured outcome.", basis: { id: "basis-adjustment-pressure", statementType: "interpreted", basis: "A reading of the made-up policy note alongside fictional standpoint prompts.", sourceScope: "This teaching fixture compares possible constraints; it does not represent residents.", limits: "It is not a measured outcome, public testimony, or prediction." } },
      { type: "unresolved", text: "Will footpaths, crossings, deliveries, buses, and access support work for people with the least room to adjust?", sourceIds: ["fixture-policy"], scope: "Needs outcome data and affected residents’ evidence.", basis: { id: "basis-access-question", statementType: "unresolved", basis: "A question raised by the fixture rule.", sourceScope: "The fictional policy note identifies the area of change only.", limits: "The fixture has no outcome data or affected residents’ evidence." } }
    ],
    perspectives: [
      { label: "A bus commuter’s starting point", startingPoint: "A fictional prompt about catching one dependable, affordable trip.", reading: "The question becomes whether the route works at the hour a shift begins—not only whether a corridor exists on a map.", boundary: "This role is a starting standpoint, not a whole community or a claim about real commuters.", sourceIds: ["fixture-experience"] },
      { label: "A market-edge worker’s starting point", startingPoint: "A fictional prompt about deliveries, customers, and a day’s trade.", reading: "A delivery window can look orderly in a rule while still pressing against the timing of stock, footfall, and care work.", boundary: "This role is a starting standpoint, not a whole community or a claim about real workers.", sourceIds: ["fixture-experience"] },
      { label: "An access route’s starting point", startingPoint: "A fictional prompt about whether a route remains continuous beyond the plan.", reading: "Kerbs, crossings, obstructions, and assistance turn an abstract promise of access into a chain of practical conditions.", boundary: "This role is a starting standpoint, not a whole community or a claim about disabled people’s experience.", sourceIds: ["fixture-experience"] },
      { label: "A planner’s starting point", startingPoint: "The fictional notice’s stated allocation of street space.", reading: "The plan brings routes, budgets, and allocation into one frame, while leaving a particular journey’s friction unresolved.", boundary: "This role is a starting standpoint, not a whole institution or a claim about real officials.", sourceIds: ["fixture-policy"] }
    ],
    associatedPeople: [
      { id: "fixture-asha", kind: "person", label: "Asha", fixtureLabel: "Fictional teaching record", association: "A named fictional commuter prompt keeps one journey’s timing visible without claiming to represent real riders.", sourceId: "fixture-experience" },
      { id: "fixture-council", kind: "institution", label: "Nadi Nagar municipal council", association: "This fictional institution issues the sample street-plan notice.", sourceId: "fixture-policy" },
      { id: "fixture-market", kind: "community", label: "Market-edge workers", association: "An unnamed fictional community prompt keeps delivery and customer access in view.", sourceId: "fixture-experience" },
      { id: "fixture-unknown", kind: "unknown_unverified", label: "People affected beyond the fixture", association: "The fixture does not identify them; real reporting would need direct evidence before naming anyone.", sourceId: "fixture-policy" }
    ],
    contextBridge: { targetSlug: "street-vending", question: "What makes a public street workable for the people who use it?", connection: "This fictional plan changes a street for a day. The Timeless question asks how public space, work, access, and care keep shaping one another across places." },
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
    media: { kind: "authored_diagram", label: "A four-route question map", subjectTitle: "A journey is more than a route. It is a question of time, access, and care.", mapAriaLabel: "A conceptual teaching map of past choices, daily chains, shared space, and open measures", mapLabels: ["Past choices", "Shared space", "Daily chains", "Open measures"], mapCenter: "One recurring question", creator: "Syāt teaching desk", source: "Authored for this Indian-context teaching fixture", rightsBasis: "Syāt-authored fixture; no external asset or real place depicted", reviewStatus: "fixture metadata complete", publicationStatus: "not publishable", limitation: "A conceptual aid, not a transit map or dataset." },
    timeline: [
      { order: 1, eventType: "Recurring question", time: { kind: "period", label: "Across different periods" }, text: "This fixture keeps open how cities reorganise movement around tools, rules, and public expectations.", sourceIds: ["fixture-method"], uncertainty: "It makes no claim about a particular city or historical record." },
      { order: 2, eventType: "Outcome to check", time: { kind: "unknown", label: "Time not yet known" }, text: "A specific place and period would be needed to ask whether access improved for people with the least flexibility.", sourceIds: ["fixture-method"], uncertainty: "This is an open research question, not a dateable event." }
    ],
    evidence: [
      { type: "documented", text: "This fixture uses no claim about a particular city or historical record.", sourceIds: ["fixture-method"], scope: "Teaching scope only.", basis: { id: "basis-method-scope", statementType: "documented", basis: "A made-up method fixture.", sourceScope: "This teaching page only.", limits: "It is not an archive, transit dataset, or report." } },
      { type: "interpreted", text: "Movement is both a technical and a social question.", sourceIds: ["fixture-method"], scope: "An editorial framing proposition.", basis: { id: "basis-movement-frame", statementType: "interpreted", basis: "An editorial framing proposition in the fixture.", sourceScope: "It offers a way to ask a question, not a factual finding.", limits: "It cannot describe every city, journey, or resident." } },
      { type: "unresolved", text: "Which measures best show whether access has improved for people with the least flexibility?", sourceIds: ["fixture-method"], scope: "Requires a specific place, period, and data.", basis: { id: "basis-access-measure", statementType: "unresolved", basis: "An open question from the fixture.", sourceScope: "No place, period, or dataset is attached.", limits: "It is not answered on this page." } }
    ],
    perspectives: [
      { label: "An archive reader’s starting point", startingPoint: "A fictional prompt about past choices remaining visible in present routes.", reading: "A route can carry old priorities forward, which makes comparison useful before calling a present change entirely new.", boundary: "This role is a starting standpoint, not a whole profession or a substitute for records from a named place.", sourceIds: ["fixture-method"] },
      { label: "A caregiver’s starting point", startingPoint: "A fictional prompt about holding school, work, and care trips together.", reading: "A journey becomes a chain of dependencies, where a small delay can move through someone else’s day.", boundary: "This role is a starting standpoint, not a whole community or a claim about real caregivers.", sourceIds: ["fixture-method"] }
    ],
    associatedPeople: [
      { id: "fixture-archive-reader", kind: "person", label: "Mira", fixtureLabel: "Fictional teaching record", association: "A fictional archive-reader prompt introduces the need for historical context without inventing a biography.", sourceId: "fixture-method" },
      { id: "fixture-public-space", kind: "community", label: "People sharing a route", association: "The fixture deliberately leaves this community unnamed because it does not have evidence about any real group.", sourceId: "fixture-method" },
      { id: "fixture-unknown-city", kind: "unknown_unverified", label: "A city not yet specified", association: "No institution is named because the fixture does not describe a real place or authority.", sourceId: "fixture-method" }
    ],
    contextBridge: { targetSlug: "street-vending", question: "What makes a public street workable for the people who use it?", connection: "The recurring question stays open across places. The topic gives one practical way to keep following work, access, and public space without claiming that every city is the same." },
    sources: [{ id: "fixture-method", publisher: "Syāt teaching desk", title: "Method fixture: a question across contexts", url: "/en/about#editorial-fixtures", publishedLabel: "Teaching document", use: "Explains the scope of this non-reporting fixture." }],
    actions: { sourceTrailTarget: "source-trail", reframe: { topic: "street-vending" }, relatedTimelessTopicSlug: "street-vending" }
  }
] as const;

export function getPreviewStory(slug: string) {
  return previewStories.find((story) => story.slug === slug);
}

export function getPreviewStoryStaticParams(mode: PreviewStory["mode"]): Array<{ slug: string }> {
  return previewStories.filter((story) => story.mode === mode).map(({ slug }) => ({ slug }));
}
