import { describe, expect, it } from "vitest";

import { parseGeneratedStoryV2, type GeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";
import { reviewGeneratedDraft } from "./draft-review";

const dossier: SourceDossierRecord[] = [{
  id: "official-note", publisherId: "pib", publisher: "Press Information Bureau", title: "Bazaar Road trial note",
  url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000002", sourceKind: "official_statement",
  publishedAt: "2026-08-28T06:00:00.000Z", accessedAt: "2026-08-31T06:00:00.000Z",
  evidenceText: "The note says a bus-priority trial starts on Bazaar Road on 1 September.", linkAllowed: true,
  modelInputAllowed: true, mediaReuseAllowed: false, rightsBasis: "government_reproduction_policy",
  policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3",
  reviewedAt: "2026-08-31T06:00:00.000Z", creditLine: "Source: Press Information Bureau"
}];

function makeDraft(): GeneratedStoryV2 {
  return parseGeneratedStoryV2({
    contractVersion: "syat.story-draft.v2", language: "en-IN", editorialStatus: "needs_editorial_review", format: "news_brief",
    story: { mode: "news", title: "Bazaar Road bus-priority trial gets a start date", dek: "The official note names 1 September, but the effects on road users have not yet been measured.", theme: "Cities and public life", indiaConnection: "The planned transport change concerns a municipal road in India.", eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, reframe: { kind: "question", value: "What evidence would show how the road change affects different users?" } },
    bodySections: [
      { id: "change", title: "The planned change", paragraphs: [{ id: "opening", text: "A bus-priority trial is due to start on Bazaar Road on 1 September, the official note says.", claimIds: ["start-date"], sourceIds: ["official-note"] }] },
      { id: "record", title: "What the record supports", paragraphs: [{ id: "scope", text: "The note establishes the announced date and location, not whether the trial will begin as planned.", claimIds: ["start-date"], sourceIds: ["official-note"] }] },
      { id: "gap", title: "Evidence still needed", paragraphs: [{ id: "unknown", text: "Travel-time records and observations would be needed to understand the effect on bus riders and traders.", claimIds: ["effects-open"], sourceIds: ["official-note"] }] }
    ],
    timeline: [{ id: "planned-start", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The note gives this as the planned start date.", sourceIds: ["official-note"] }],
    statements: [
      { id: "start-date", type: "documented", basis: "official_claim", text: "The note names 1 September as the planned start date.", sourceIds: ["official-note"], sourceScope: "The statement is limited to the date announced in the official note.", limits: "It does not confirm later implementation or effects." },
      { id: "effects-open", type: "unresolved", basis: "evidence_gap", text: "The effects on different road users remain unknown.", sourceIds: ["official-note"], sourceScope: "The supplied record does not contain outcome measurements.", limits: "No independent observation is present in this source pack." }
    ],
    perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The note concerns a bus-priority lane used on this route.", sees: "A possible change to the timing of a regular trip.", values: "Reliable and affordable travel on the route.", uses: "The route and start date in the official note.", mayMiss: "The working conditions of traders beside the road.", sourceIds: ["official-note"] }],
    people: [{ id: "transport-ministry", kind: "institution", label: "Transport ministry", association: "The institution issued the source note for the planned road trial.", sourceIds: ["official-note"] }],
    unresolved: [{ id: "travel-time", question: "How will travel times change during the trial?", whatWouldHelp: "Comparable route data collected before and during the trial.", sourceIds: ["official-note"] }],
    contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The road trial connects a public decision with experiences that have not yet been measured." },
    authoredVisual: { kind: "timeline", title: "The evidence timeline", description: "The announcement, planned start and later measurement are shown as distinct steps.", limitation: "The visual does not show an outcome because none is established.", claimIds: ["start-date", "effects-open"], sourceIds: ["official-note"] },
    mediaPlan: [], modelNotes: ["Seek direct observation before final reporting."]
  }, dossier);
}

describe("reviewGeneratedDraft", () => {
  it("keeps a source-linked draft in human review and records a single-publisher limit", () => {
    const result = reviewGeneratedDraft(makeDraft(), dossier, { indiaConnection: "The planned transport change concerns a municipal road in India." });
    expect(result.status).toBe("needs_editorial_review");
    expect(result.publicationAllowed).toBe(false);
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "single-publisher-evidence", severity: "warning" }));
  });

  it("blocks a repeated statement before promotion", () => {
    const draft = makeDraft();
    draft.statements.push({ ...draft.statements[0], id: "start-date-repeat" });
    const result = reviewGeneratedDraft(draft, dossier, { indiaConnection: draft.story.indiaConnection });
    expect(result.status).toBe("blocked");
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "repeated-claim", severity: "blocker" }));
  });

  it("requires human rights review when the model proposes external media", () => {
    const draft = makeDraft();
    draft.mediaPlan.push({ kind: "photo", placement: "hero", purpose: "Show the physical road layout described by the record.", alt: "Bazaar Road before the planned bus-priority trial.", rightsRequirement: "explicit_licence", sourceIds: ["official-note"] });
    const result = reviewGeneratedDraft(draft, dossier, { indiaConnection: draft.story.indiaConnection });
    expect(result.checks.mediaRights).toBe("human_review_required");
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "media-rights-review-needed" }));
  });
});
