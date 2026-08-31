import { describe, expect, it } from "vitest";

import {
  buildStoryDraftProviderJsonSchema,
  buildStoryDraftV2Prompt,
  findCloseCopyMatches,
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
    evidenceText: "The transport ministry record says a bus-priority trial starts on 1 September 2026 on Bazaar Road in Nadi Nagar.",
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
    sourcePackId: "bazaar-road-bus-trial",
    sourceIds: ["pib-road-note"],
    language: "en-IN",
    editorialStatus: "needs_editorial_review",
    format: "explainer",
    story: {
      mode: "news",
      title: "A bus-priority trial is due to begin on Bazaar Road",
      dek: "The official note sets out the route and date, while effects on commuters and traders remain untested.",
      theme: "Cities and public life",
      indiaConnection: "The transport trial concerns an Indian municipal road and the people who use it.",
      eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" },
      eventTimeEvidence: { claimIds: ["claim-1"], sourceIds: ["pib-road-note"] },
      reframe: { kind: "question", value: "What would show whether the bus-priority trial works for different road users?" }
    },
    bodySections: [
      { id: "what-changes", title: "What changes on the road", paragraphs: [{ id: "opening", text: "A bus-priority trial is due to begin on Bazaar Road on 1 September, according to the transport ministry note.", claimIds: ["claim-1"], sourceIds: ["pib-road-note"] }] },
      { id: "what-is-known", title: "What the note establishes", paragraphs: [{ id: "record-scope", text: "The record identifies the road and planned start date but does not report measured effects from the trial.", claimIds: ["claim-1"], sourceIds: ["pib-road-note"] }] },
      { id: "what-remains", title: "What remains unanswered", paragraphs: [{ id: "evidence-gap", text: "Travel-time data and access checks would be needed to assess how the change works for bus riders, traders and walkers.", claimIds: ["claim-2"], sourceIds: ["pib-road-note"] }] }
    ],
    timeline: [{ id: "trial-begins", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The official note says the bus-priority trial is due to begin.", claimIds: ["claim-1"], sourceIds: ["pib-road-note"] }],
    statements: [
      { id: "claim-1", type: "documented", basis: "official_claim", text: "The ministry note says the trial is due to begin on 1 September.", sourceIds: ["pib-road-note"], sourceScope: "This records what the ministry note says about the planned start date.", limits: "It does not establish that the trial began as planned or produced any result." },
      { id: "claim-2", type: "unresolved", basis: "evidence_gap", text: "The effect of the trial on different road users is not yet established.", sourceIds: ["pib-road-note"], sourceScope: "The supplied official note describes the plan but contains no measured outcome data.", limits: "No independent observation or affected-person account is included in the source pack." }
    ],
    perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The note proposes a bus-priority change that would directly affect this journey.", sees: "A possible change to a regular trip through Bazaar Road.", values: "Reliable, affordable and predictable travel.", uses: "The route and timing described in the official note.", mayMiss: "How the change affects work and access beside the road.", sourceIds: ["pib-road-note"] }],
    people: [{ id: "transport-ministry", kind: "institution", label: "Transport ministry", association: "The institution issued the note that describes the planned trial.", sourceIds: ["pib-road-note"] }],
    unresolved: [{ id: "access-results", question: "How will the trial affect people with different mobility needs?", whatWouldHelp: "Published access checks and independent observations during the trial.", sourceIds: ["pib-road-note"] }],
    contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The trial turns a public decision into a change that different road users may experience differently." },
    authoredVisual: { kind: "process", title: "From announcement to evidence", description: "A three-step view of the announced start, observation period and later assessment.", limitation: "This visual shows the evidence path, not whether the trial succeeds.", claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-road-note"] },
    mediaPlan: [],
    modelNotes: ["Independent observation remains necessary before final reporting."],
    ...overrides
  };
}

function providerTimeChoices(evidenceText: string, selectedExactTime?: { value: string; label: string }) {
  const sourceDossierForRequest: SourceDossierRecord[] = [{ ...sourceDossier[0], evidenceText }];
  const input = {
    sourcePackId: "bazaar-road-bus-trial",
    language: "en-IN" as const,
    mode: "news" as const,
    format: "explainer" as const,
    editorialBrief: "Explain the documented change and the evidence still needed.",
    indiaConnection: "This concerns a public transport trial on an Indian municipal road.",
    sourceRoles: [{ sourceId: "pib-road-note", role: "official account of the planned change" }],
    missingVoices: ["Independent observation", "People who use and work beside the road"],
    sourceDossier: sourceDossierForRequest,
    selectedExactTime
  };
  const schema = JSON.parse(JSON.stringify(buildStoryDraftProviderJsonSchema(input)));
  const eventTime = schema.properties.story.properties.eventTime;
  const timelineTime = schema.properties.timeline.items.properties.time;
  const options = (timeSchema: typeof eventTime) => timeSchema.oneOf ?? [timeSchema];
  return { input, eventTime: options(eventTime), timelineTime: options(timelineTime) };
}

describe("syat.story-draft.v2", () => {
  it("allows only unknown event and timeline times when evidence has no exact date", () => {
    const choices = providerTimeChoices("The transport record describes a bus-priority trial on Bazaar Road without naming a date.");

    expect(choices.eventTime.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["unknown"]);
    expect(choices.timelineTime.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["unknown"]);
    expect(choices.eventTime[0].properties.label.const).toBe("Date not established in the supplied evidence");
    expect(choices.timelineTime[0].properties.label.const).toBe("Date not established in the supplied evidence");
    expect(buildStoryDraftV2Prompt(choices.input)).toContain('Allowed exact dates and labels: none. Use unknown for eventTime and every timeline time with label exactly "Date not established in the supplied evidence".');
  });

  it("defaults every generated time to unknown even when evidence contains an exact date", () => {
    const choices = providerTimeChoices("The transport record says the trial starts on 1 September 2026 on Bazaar Road.");

    expect(choices.eventTime.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["unknown"]);
    expect(choices.timelineTime.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["unknown"]);
  });

  it.each([
    "The transport record says the trial starts on 1 September 2026 on Bazaar Road.",
    "The transport record says the trial starts on 2026-09-01 on Bazaar Road."
  ])("closes provider event and timeline times to the exact date found in evidence: %s", (evidenceText) => {
    const choices = providerTimeChoices(evidenceText, { value: "2026-09-01", label: "1 September 2026" });

    for (const timeOptions of [choices.eventTime, choices.timelineTime]) {
      expect(timeOptions.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["exact_date", "unknown"]);
      expect(timeOptions[0].properties.value.const).toBe("2026-09-01");
      expect(timeOptions[0].properties.label.const).toBe("1 September 2026");
      expect(timeOptions[1].properties.label.const).toBe("Date not established in the supplied evidence");
    }
  });

  it("rejects a preselected exact-time pair that is absent from evidence or has an invented label", () => {
    expect(() => providerTimeChoices("The transport record does not name a date.", { value: "2026-09-01", label: "1 September 2026" })).toThrow(/selected|evidence/i);
    expect(() => providerTimeChoices("The transport record names 1 September 2026.", { value: "2026-09-01", label: "Launch day" })).toThrow(/selected|label/i);
  });

  it("rejects an exact event or timeline label that does not match its ISO date", () => {
    const wrongEventLabel = makeDraft();
    wrongEventLabel.story.eventTime = { kind: "exact_date", value: "2026-09-01", label: "2 September 2026" };
    const wrongTimelineLabel = makeDraft();
    wrongTimelineLabel.timeline[0].time = { kind: "exact_date", value: "2026-09-01", label: "Launch day" };

    expect(() => parseGeneratedStoryV2(wrongEventLabel, sourceDossier)).toThrow(/canonical|label/i);
    expect(() => parseGeneratedStoryV2(wrongTimelineLabel, sourceDossier)).toThrow(/canonical|label/i);
  });

  it("rejects free-text unknown labels that can hide an invented date", () => {
    const valid = makeDraft();
    const wrongEventLabel = { ...valid, story: { ...valid.story, eventTime: { kind: "unknown" as const, label: "Likely 2 September 2026" } } };
    const wrongTimelineLabel = { ...valid, timeline: [{ ...valid.timeline[0], time: { kind: "unknown" as const, label: "Expected next Tuesday" } }] };

    expect(() => parseGeneratedStoryV2(wrongEventLabel, sourceDossier)).toThrow(/Date not established|label/i);
    expect(() => parseGeneratedStoryV2(wrongTimelineLabel, sourceDossier)).toThrow(/Date not established|label/i);
  });

  it("supports exact and unknown generated timeline time but rejects a free-form period", () => {
    const draft = makeDraft({ timeline: [
      { id: "exact", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The trial is due to begin on the date named in the note.", claimIds: ["claim-1"], sourceIds: ["pib-road-note"] },
      { id: "unknown", time: { kind: "unknown", label: "Date not established in the supplied evidence" }, text: "The date for publishing measured outcomes is not stated.", claimIds: ["claim-2"], sourceIds: ["pib-road-note"] }
    ] });
    const withPeriod = { ...draft, timeline: [...draft.timeline, { id: "period", time: { kind: "period" as const, value: "September 2026", label: "During September 2026" }, text: "Observation can take place during the trial period.", claimIds: ["claim-1"], sourceIds: ["pib-road-note"] }] };

    expect(parseGeneratedStoryV2Json(JSON.stringify(draft), sourceDossier).timeline.map((entry) => entry.time.kind)).toEqual(["exact_date", "unknown"]);
    expect(() => parseGeneratedStoryV2(withPeriod, sourceDossier)).toThrow(/period|invalid/i);
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

  it("requires sequential claim-1 through claim-N statement IDs even when references are internally consistent", () => {
    const draft = makeDraft();
    draft.statements[0].id = "planned-change";
    draft.statements[1].id = "open-outcome";
    draft.story.eventTimeEvidence.claimIds = ["planned-change"];
    draft.bodySections[0].paragraphs[0].claimIds = ["planned-change"];
    draft.bodySections[1].paragraphs[0].claimIds = ["planned-change"];
    draft.bodySections[2].paragraphs[0].claimIds = ["open-outcome"];
    draft.timeline[0].claimIds = ["planned-change"];
    draft.authoredVisual.claimIds = ["planned-change", "open-outcome"];

    expect(() => parseGeneratedStoryV2(draft, sourceDossier)).toThrow(/sequential|claim-1/i);
  });

  it("rejects a block or timeline source that does not support its cited claim", () => {
    const unrelated: SourceDossierRecord = { ...sourceDossier[0], id: "unrelated-note", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000009", title: "Unrelated official note" };
    const block = makeDraft({ sourceIds: ["pib-road-note", "unrelated-note"] });
    block.bodySections[0].paragraphs[0].sourceIds = ["unrelated-note"];
    const timeline = makeDraft({ sourceIds: ["pib-road-note", "unrelated-note"] });
    timeline.timeline[0].sourceIds = ["unrelated-note"];

    expect(() => parseGeneratedStoryV2(block, [...sourceDossier, unrelated])).toThrow(/support/i);
    expect(() => parseGeneratedStoryV2(timeline, [...sourceDossier, unrelated])).toThrow(/support/i);
  });

  it("rejects an exact date that is absent from its cited evidence", () => {
    const draft = makeDraft();
    draft.story.eventTime = { kind: "exact_date", value: "2027-01-12", label: "12 January 2027" };

    expect(() => parseGeneratedStoryV2(draft, sourceDossier)).toThrow(/date|time.*evidence/i);
  });

  it("binds the response to the requested job and exact source pack", () => {
    const draft = makeDraft();
    const expected = { sourcePackId: "bazaar-road-bus-trial", language: "en-IN" as const, mode: "news" as const, format: "news_brief" as const, indiaConnection: draft.story.indiaConnection };

    expect(() => parseGeneratedStoryV2(draft, sourceDossier, expected)).toThrow(/format/i);
    expect(() => parseGeneratedStoryV2({ ...draft, sourcePackId: "another-pack" }, sourceDossier, { ...expected, format: "explainer" })).toThrow(/source pack/i);
    expect(() => parseGeneratedStoryV2({ ...draft, sourceIds: ["different-source"] }, sourceDossier, { ...expected, format: "explainer" })).toThrow(/exact source/i);
  });

  it("rejects publishable fields and any source that lacks model-input permission", () => {
    const publishable = { ...makeDraft(), publicationAllowed: true };
    const linkOnlySource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "", modelInputAllowed: false, rightsBasis: "link_only" };
    expect(() => parseGeneratedStoryV2(publishable, sourceDossier)).toThrow();
    expect(() => parseGeneratedStoryV2(makeDraft(), [linkOnlySource])).toThrow(/model input/i);
  });

  it("rejects a paragraph that closely copies reusable source wording", () => {
    const copiedText = "The transport ministry record says the bus-priority trial starts on 1 September on Bazaar Road and assigns one lane to scheduled city buses during the morning period.";
    const copiedSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: `The record names 1 September 2026. ${copiedText}` };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = copiedText;

    expect(() => parseGeneratedStoryV2(draft, [copiedSource])).toThrow(/closely cop(?:y|ies)/i);
  });

  it("reports a privacy-safe seven-token fingerprint when a dek copies source structure", () => {
    const copiedSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "The ministry says the revised lane plan will reduce waiting times for scheduled buses while independent results remain unavailable. The planned start is 1 September 2026." };
    const draft = makeDraft();
    draft.story.dek = "The revised lane plan will reduce waiting times for scheduled buses, but independent results remain unavailable.";

    const match = findCloseCopyMatches(draft, [copiedSource]).find((candidate) => candidate.fieldId === "story:dek");

    expect(match).toMatchObject({ fieldId: "story:dek", sourceId: "pib-road-note", tokenCount: 7 });
    expect(match?.matchHash).toMatch(/^[a-f0-9]{64}$/);
    expect(match).not.toHaveProperty("matchedText");
    expect(() => parseGeneratedStoryV2(draft, [copiedSource])).toThrow(/7-token.*[a-f0-9]{12}/i);
  });

  it("rejects a copied 20-word sentence hidden inside a longer source and short verbatim visible copy", () => {
    const copiedSentence = "The authority will close the eastern lane each morning while scheduled buses pass the market and return after ten o'clock.";
    const longEvidence = `The record names 1 September 2026. ${"Background details about the municipal transport record and its stated administrative process. ".repeat(14)} ${copiedSentence} ${"Further record material describes later monitoring and internal reporting steps. ".repeat(8)}`;
    const longSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: longEvidence };
    const longCopy = makeDraft();
    longCopy.bodySections[0].paragraphs[0].text = `Bazaar Road has a planned trial. ${copiedSentence} This sentence is followed by separate Syāt explanation about evidence limits and unanswered questions for commuters.`;
    const shortCopy = makeDraft();
    shortCopy.story.title = "Authority closes eastern lane while scheduled buses pass market";
    const shortSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "On 1 September 2026, Authority closes eastern lane while scheduled buses pass market during the morning period." };

    expect(() => parseGeneratedStoryV2(longCopy, [longSource])).toThrow(/closely cop(?:y|ies)/i);
    expect(() => parseGeneratedStoryV2(shortCopy, [shortSource])).toThrow(/closely cop(?:y|ies)/i);
  });

  it("allows ordinary official terminology that does not reproduce a distinctive sentence", () => {
    const genericSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "The Ministry of Transport announced a new public transport policy after its scheduled meeting in New Delhi on 1 September 2026." };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = "The Ministry of Transport announced a public transport policy. The supplied record does not establish its effect on Bazaar Road users.";

    expect(parseGeneratedStoryV2(draft, [genericSource]).contractVersion).toBe("syat.story-draft.v2");
  });

  it("allows a routine official entity and event phrase in a story title", () => {
    const routinePhrase = "Union Minister of State for Railways reviews station redevelopment";
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: `${routinePhrase} at a scheduled meeting on 1 September 2026.` };
    const draft = makeDraft();
    draft.story.title = routinePhrase;

    expect(parseGeneratedStoryV2(draft, [officialSource]).story.title).toBe(routinePhrase);
  });

  it("blocks a distinctive copied event phrase after a named minister", () => {
    const copiedTitle = "Minister Kavita Rao Opens India’s First Floating Grain Laboratory";
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "Minister Kavita Rao Opens Indias First Floating Grain Laboratory on 1 September 2026." };
    const draft = makeDraft();
    draft.story.title = copiedTitle;

    expect(() => parseGeneratedStoryV2(draft, [officialSource])).toThrow(/closely cop(?:y|ies)/i);
  });

  it("blocks a copied event title after a short institutional actor", () => {
    const copiedTitle = "RBI Launches New Digital Rupee Pilot Today";
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: `${copiedTitle} on 1 September 2026.` };
    const draft = makeDraft();
    draft.story.title = copiedTitle;

    expect(() => parseGeneratedStoryV2(draft, [officialSource])).toThrow(/closely cop(?:y|ies)/i);
  });

  it("rejects repeated stable media-plan IDs", () => {
    const draft = makeDraft();
    const plan = { id: "bazaar-road-photo", kind: "photo" as const, placement: "hero" as const, purpose: "Show the physical road layout described by the source record.", alt: "Bazaar Road before the planned bus-priority trial.", rightsRequirement: "cc_by" as const, claimIds: ["claim-1"], sourceIds: ["pib-road-note"] };
    draft.mediaPlan = [plan, { ...plan }];

    expect(() => parseGeneratedStoryV2(draft, sourceDossier)).toThrow(/repeated/i);
  });

  it("rejects more body paragraphs than the ReaderStory contract can hold", () => {
    const draft = makeDraft();
    draft.bodySections = Array.from({ length: 5 }, (_, sectionIndex) => ({
      id: `section-${sectionIndex + 1}`,
      title: `Evidence section ${sectionIndex + 1}`,
      paragraphs: Array.from({ length: 4 }, (__, paragraphIndex) => ({
        id: `section-${sectionIndex + 1}-paragraph-${paragraphIndex + 1}`,
        text: `This distinct source-scoped paragraph ${paragraphIndex + 1} records the planned trial and its evidence limit for section ${sectionIndex + 1}.`,
        claimIds: ["claim-1"],
        sourceIds: ["pib-road-note"]
      }))
    }));

    expect(() => parseGeneratedStoryV2(draft, sourceDossier)).toThrow(/18 body paragraphs/i);
  });

  it("builds a JSON-only prompt from reusable source-pack records and names the language rules", () => {
    const prompt = buildStoryDraftV2Prompt({ sourcePackId: "bazaar-road-bus-trial", language: "en-IN", mode: "news", format: "explainer", editorialBrief: "Explain the documented change and the evidence still needed.", indiaConnection: "This concerns a public transport trial on an Indian municipal road.", sourceRoles: [{ sourceId: "pib-road-note", role: "official account of the planned change" }], missingVoices: ["Independent observation", "People who use and work beside the road"], sourceDossier, selectedExactTime: { value: "2026-09-01", label: "1 September 2026" } });
    expect(prompt).toContain("do not use remembered facts");
    expect(prompt).toContain("Do not quote or closely copy source wording");
    expect(prompt).toContain("In a significant development");
    expect(prompt).toContain("syat.story-draft.v2");
    expect(prompt).toContain("modelInputAllowed");
    expect(prompt).toContain("Prompt version: syat.story-draft.v3.0");
    expect(prompt).toContain("Write the title and dek with fresh sentence structure");
    expect(prompt).toContain("do not reuse any six-token source span in the title or any seven-token source span in the dek");
    expect(prompt).toContain("Exact proper names and necessary technical labels may repeat");
    expect(prompt).toContain('Allowed exact dates and labels: 2026-09-01 -> 1 September 2026. Use unknown for every other eventTime and timeline time with label exactly "Date not established in the supplied evidence".');
    expect(prompt).toContain("statement IDs exactly claim-1 through claim-N");
    expect(prompt).toContain("Final internal reference-set check");
    expect(prompt).toContain("local-decision");
    expect(prompt).not.toContain("customs-time-release-study");
    expect(prompt).not.toContain("publicationAllowed\": true");
  });
});

describe("close-copy guard precision", () => {
  it("lets a story name the statute it is about", () => {
    // "Mahatma Gandhi National Rural Employment Guarantee Act" is seven tokens. A story about
    // that Act must name it, and paraphrasing a statutory name would make the story wrong.
    const statute = "The audit examined the Mahatma Gandhi National Rural Employment Guarantee Act in the district and found gaps.";
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: statute };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = "Auditors looked at how the Mahatma Gandhi National Rural Employment Guarantee Act was run locally, and they recorded shortfalls in the paperwork that the district office keeps.";

    expect(findCloseCopyMatches(draft, [officialSource])).toEqual([]);
  });

  it("still catches copied prose that merely contains a name", () => {
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "The audit examined the Mahatma Gandhi National Rural Employment Guarantee Act and found that muster rolls were not maintained in the prescribed manner." };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = "The audit found that muster rolls were not maintained in the prescribed manner, which the district has not explained.";

    expect(findCloseCopyMatches(draft, [officialSource]).length).toBeGreaterThan(0);
  });

  it("does not treat lowercase institutional prose as a name", () => {
    const officialSource: SourceDossierRecord = { ...sourceDossier[0], evidenceText: "The report contains compliance audit paragraphs and three general paragraphs on the department." };
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = "It sets out compliance audit paragraphs and three general paragraphs, and it names the department each one concerns.";

    expect(findCloseCopyMatches(draft, [officialSource]).length).toBeGreaterThan(0);
  });
});
