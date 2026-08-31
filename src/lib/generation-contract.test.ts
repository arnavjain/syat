import { describe, expect, it } from "vitest";

import {
  buildStoryDraftV2Prompt,
  parseGeneratedStoryV2,
  parseGeneratedStoryV2Json,
  type GeneratedStoryV2,
  type SourceDossierRecord
} from "./generation-contract";

const sourceDossier: SourceDossierRecord[] = [
  {
    id: "pib-road-note",
    publisherId: "pib",
    publisher: "Press Information Bureau",
    title: "Public transport trial note",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000001",
    sourceKind: "official_statement",
    publishedAt: "2026-08-28T06:00:00.000Z",
    accessedAt: "2026-08-31T06:00:00.000Z",
    evidenceText: "The transport ministry record says a bus-priority trial starts on 1 September on Bazaar Road in Nadi Nagar.",
    linkAllowed: true,
    modelInputAllowed: true,
    mediaReuseAllowed: false,
    rightsBasis: "government_reproduction_policy",
    policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3",
    reviewedAt: "2026-08-31T06:00:00.000Z",
    creditLine: "Source: Press Information Bureau"
  }
];

function makeDraft(overrides: Partial<GeneratedStoryV2> = {}): GeneratedStoryV2 {
  return {
    contractVersion: "syat.story-draft.v2",
    language: "en-IN",
    editorialStatus: "needs_editorial_review",
    format: "explainer",
    story: {
      mode: "news",
      title: "A bus-priority trial is due to begin on Bazaar Road",
      dek: "The official note sets out the route and date, while effects on commuters and traders remain untested.",
      theme: "Cities and public life",
      indiaConnection: "The transport trial concerns an Indian municipal road and the people who use it.",
      eventTime: { kind: "exact_date", value: "2026-09-01", label: "From 1 September 2026" },
      reframe: { kind: "question", value: "What would show whether the bus-priority trial works for different road users?" }
    },
    bodySections: [
      { id: "what-changes", title: "What changes on the road", paragraphs: [{ id: "opening", text: "A bus-priority trial is due to begin on Bazaar Road on 1 September, according to the transport ministry note.", claimIds: ["trial-date"], sourceIds: ["pib-road-note"] }] },
      { id: "what-is-known", title: "What the note establishes", paragraphs: [{ id: "record-scope", text: "The record identifies the road and planned start date but does not report measured effects from the trial.", claimIds: ["trial-date"], sourceIds: ["pib-road-note"] }] },
      { id: "what-remains", title: "What remains unanswered", paragraphs: [{ id: "evidence-gap", text: "Travel-time data and access checks would be needed to assess how the change works for bus riders, traders and walkers.", claimIds: ["outcome-unknown"], sourceIds: ["pib-road-note"] }] }
    ],
    timeline: [{ id: "trial-begins", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The official note says the bus-priority trial is due to begin.", sourceIds: ["pib-road-note"] }],
    statements: [
      { id: "trial-date", type: "documented", basis: "official_claim", text: "The ministry note says the trial is due to begin on 1 September.", sourceIds: ["pib-road-note"], sourceScope: "This records what the ministry note says about the planned start date.", limits: "It does not establish that the trial began as planned or produced any result." },
      { id: "outcome-unknown", type: "unresolved", basis: "evidence_gap", text: "The effect of the trial on different road users is not yet established.", sourceIds: ["pib-road-note"], sourceScope: "The supplied official note describes the plan but contains no measured outcome data.", limits: "No independent observation or affected-person account is included in the source pack." }
    ],
    perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The note proposes a bus-priority change that would directly affect this journey.", sees: "A possible change to a regular trip through Bazaar Road.", values: "Reliable, affordable and predictable travel.", uses: "The route and timing described in the official note.", mayMiss: "How the change affects work and access beside the road.", sourceIds: ["pib-road-note"] }],
    people: [{ id: "transport-ministry", kind: "institution", label: "Transport ministry", association: "The institution issued the note that describes the planned trial.", sourceIds: ["pib-road-note"] }],
    unresolved: [{ id: "access-results", question: "How will the trial affect people with different mobility needs?", whatWouldHelp: "Published access checks and independent observations during the trial.", sourceIds: ["pib-road-note"] }],
    contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The trial turns a public decision into a change that different road users may experience differently." },
    authoredVisual: { kind: "process", title: "From announcement to evidence", description: "A three-step view of the announced start, observation period and later assessment.", limitation: "This visual shows the evidence path, not whether the trial succeeds.", claimIds: ["trial-date", "outcome-unknown"], sourceIds: ["pib-road-note"] },
    mediaPlan: [],
    modelNotes: ["Independent observation remains necessary before final reporting."],
    ...overrides
  };
}

describe("syat.story-draft.v2", () => {
  it("supports exact, period, and unknown timeline time without invented dates", () => {
    const draft = makeDraft({ timeline: [
      { id: "exact", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The trial is due to begin on the date named in the note.", sourceIds: ["pib-road-note"] },
      { id: "period", time: { kind: "period", value: "September 2026", label: "During September 2026" }, text: "Observation can take place during the trial period.", sourceIds: ["pib-road-note"] },
      { id: "unknown", time: { kind: "unknown", label: "Outcome date not yet known" }, text: "The date for publishing measured outcomes is not stated.", sourceIds: ["pib-road-note"] }
    ] });

    expect(parseGeneratedStoryV2Json(JSON.stringify(draft), sourceDossier).timeline.map((entry) => entry.time.kind)).toEqual(["exact_date", "period", "unknown"]);
  });

  it("requires a basis, source scope, and limit for every statement", () => {
    const draft = makeDraft();
    const withoutLimit = { ...draft, statements: [{ ...draft.statements[0], limits: "" }, draft.statements[1]] };
    expect(() => parseGeneratedStoryV2(withoutLimit, sourceDossier)).toThrow();
  });

  it("rejects unknown source, claim, and Timeless-topic references", () => {
    const original = makeDraft();
    const unknownSource = makeDraft({ timeline: [{ ...original.timeline[0], sourceIds: ["remembered-source"] }] });
    const unknownClaim = makeDraft({ authoredVisual: { ...original.authoredVisual, claimIds: ["invented-claim"] } });
    const unknownTopic = makeDraft({ contextBridge: { ...original.contextBridge, topicSlug: "invented-topic" } });

    expect(() => parseGeneratedStoryV2(unknownSource, sourceDossier)).toThrow(/not in the supplied dossier/i);
    expect(() => parseGeneratedStoryV2(unknownClaim, sourceDossier)).toThrow(/claim/i);
    expect(() => parseGeneratedStoryV2(unknownTopic, sourceDossier)).toThrow(/Timeless topic/i);
  });

  it("rejects publishable fields and any source that lacks model-input permission", () => {
    const publishable = { ...makeDraft(), publicationAllowed: true };
    const linkOnlySource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "", modelInputAllowed: false, rightsBasis: "link_only" };
    expect(() => parseGeneratedStoryV2(publishable, sourceDossier)).toThrow();
    expect(() => parseGeneratedStoryV2(makeDraft(), [linkOnlySource])).toThrow(/model input/i);
  });

  it("rejects a paragraph that closely copies reusable source wording", () => {
    const copiedText = "The transport ministry record says the bus-priority trial starts on 1 September on Bazaar Road and assigns one lane to scheduled city buses during the morning period.";
    const copiedSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: copiedText };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = copiedText;

    expect(() => parseGeneratedStoryV2(draft, [copiedSource])).toThrow(/closely cop(?:y|ies)/i);
  });

  it("rejects more body paragraphs than the ReaderStory contract can hold", () => {
    const draft = makeDraft();
    draft.bodySections = Array.from({ length: 5 }, (_, sectionIndex) => ({
      id: `section-${sectionIndex + 1}`,
      title: `Evidence section ${sectionIndex + 1}`,
      paragraphs: Array.from({ length: 4 }, (__, paragraphIndex) => ({
        id: `section-${sectionIndex + 1}-paragraph-${paragraphIndex + 1}`,
        text: `This distinct source-scoped paragraph ${paragraphIndex + 1} records the planned trial and its evidence limit for section ${sectionIndex + 1}.`,
        claimIds: ["trial-date"],
        sourceIds: ["pib-road-note"]
      }))
    }));

    expect(() => parseGeneratedStoryV2(draft, sourceDossier)).toThrow(/18 body paragraphs/i);
  });

  it("builds a JSON-only prompt from reusable source-pack records and names the language rules", () => {
    const prompt = buildStoryDraftV2Prompt({ language: "en-IN", mode: "news", format: "explainer", editorialBrief: "Explain the documented change and the evidence still needed.", indiaConnection: "This concerns a public transport trial on an Indian municipal road.", sourceRoles: [{ sourceId: "pib-road-note", role: "official account of the planned change" }], missingVoices: ["Independent observation", "People who use and work beside the road"], sourceDossier });
    expect(prompt).toContain("do not use remembered facts");
    expect(prompt).toContain("Do not quote or closely copy source wording");
    expect(prompt).toContain("In a significant development");
    expect(prompt).toContain("syat.story-draft.v2");
    expect(prompt).toContain("modelInputAllowed");
    expect(prompt).not.toContain("publicationAllowed\": true");
  });
});
