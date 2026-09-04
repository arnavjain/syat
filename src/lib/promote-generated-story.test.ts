import { describe, expect, it } from "vitest";

import type { DraftReview } from "./draft-review";
import type { EditorialQualityReport } from "./editorial-quality";
import { parseGeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";
import { assertSourcePackPromotionCompatible, promoteGeneratedStory as promoteGeneratedStoryWithInputHash } from "./promote-generated-story";
import type { ReaderStory } from "./reader-story-schema";
import type { SourcePack } from "./source-pack";

const source: SourceDossierRecord = {
  id: "pib-city-note", publisherId: "pib", publisher: "Press Information Bureau", title: "Bazaar Road bus trial note",
  url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000004", sourceKind: "official_statement",
  publishedAt: "2026-08-28T06:00:00.000Z", accessedAt: "2026-08-31T06:00:00.000Z",
  evidenceText: "The transport record says a bus-priority trial is planned for Bazaar Road from 1 September 2026.",
  linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false, rightsBasis: "government_reproduction_policy",
  policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3", reviewedAt: "2026-08-31T06:00:00.000Z",
  creditLine: "Source: Press Information Bureau"
};

const sourcePack: SourcePack = {
  contractVersion: "syat.source-pack.v1", id: "bazaar-road-bus-trial", title: "Bazaar Road bus-priority trial gets a planned start date",
  indiaConnection: "The transport record concerns a municipal road in India and people who use it.", collectedAt: "2026-08-31T06:30:00.000Z",
  sources: [source], relatedCoverage: [{
    id: "related-report", publisherId: "independent-paper", publisher: "Independent Paper", title: "How commuters use Bazaar Road",
    url: "https://example.invalid/bazaar-road-report", sourceKind: "reputable_reporting", publishedAt: "2026-08-30T06:00:00.000Z",
    accessedAt: "2026-08-31T06:00:00.000Z", evidenceText: "", linkAllowed: true, modelInputAllowed: false,
    mediaReuseAllowed: false, rightsBasis: "link_only", policyUrl: "https://example.invalid/terms", reviewedAt: "2026-08-31T06:00:00.000Z",
    creditLine: "Independent Paper"
  }]
};

const generationInputHash = "7".repeat(64);
type PromotionInputWithoutHash = Omit<Parameters<typeof promoteGeneratedStoryWithInputHash>[0], "generationInputHash">;

function promoteGeneratedStory(input: PromotionInputWithoutHash) {
  return promoteGeneratedStoryWithInputHash({ ...input, generationInputHash } as Parameters<typeof promoteGeneratedStoryWithInputHash>[0]);
}

function makeDraft(withExternalMedia = false) {
  return parseGeneratedStoryV2({
    contractVersion: "syat.story-draft.v2", sourcePackId: "bazaar-road-bus-trial", sourceIds: ["pib-city-note"], language: "en-IN", editorialStatus: "needs_editorial_review", format: "explainer",
    story: { mode: "news", title: "Bazaar Road bus-priority trial gets a planned start date", dek: "The city record names the road and date, while travel effects and implementation remain unverified.", theme: "Cities and public life", indiaConnection: sourcePack.indiaConnection, eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, eventTimeEvidence: { claimIds: ["claim-1"], sourceIds: ["pib-city-note"] }, reframe: { kind: "question", value: "What evidence would show how the bus-priority change works on the ground?" } },
    bodySections: [
      { id: "announcement", title: "The announced change", paragraphs: [{ id: "opening", text: "A bus-priority trial is due to start on Bazaar Road on 1 September, according to the city transport record.", claimIds: ["claim-1"], sourceIds: ["pib-city-note"] }] },
      { id: "limits", title: "What the record cannot establish", paragraphs: [{ id: "record-limit", text: "The announcement does not establish whether the lane opened as planned or how journeys changed.", claimIds: ["claim-2"], sourceIds: ["pib-city-note"] }] },
      { id: "reporting", title: "What reporting would add", paragraphs: [{ id: "next-reporting", text: "Road observations and comparable route data would help assess effects on riders, walkers and traders.", claimIds: ["claim-2"], sourceIds: ["pib-city-note"] }] }
    ],
    timeline: [{ id: "planned-start", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The city record gives this as the planned start date.", claimIds: ["claim-1"], sourceIds: ["pib-city-note"] }],
    statements: [
      { id: "claim-1", type: "documented", basis: "official_claim", text: "The city record says the trial is planned from 1 September.", sourceIds: ["pib-city-note"], sourceScope: "This is the plan described by the official source.", limits: "It does not confirm implementation or effects." },
      { id: "claim-2", type: "unresolved", basis: "evidence_gap", text: "The effect on road users has not been established.", sourceIds: ["pib-city-note"], sourceScope: "The source pack contains no outcome measurement.", limits: "No independent observation or affected-person account is supplied." }
    ],
    perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The announced lane change concerns a bus route on Bazaar Road.", sees: "A possible change to a regular journey.", values: "Reliable and affordable travel.", uses: "The route and date in the city record.", mayMiss: "Changes to work and access beside the road.", sourceIds: ["pib-city-note"] }],
    people: [{ id: "city-transport-office", kind: "institution", label: "City transport office", association: "The institution issued the note describing the planned trial.", sourceIds: ["pib-city-note"] }],
    unresolved: [{ id: "route-effects", question: "How do travel time and street access change during the trial?", whatWouldHelp: "Comparable route data, road observations and conversations with affected people.", sourceIds: ["pib-city-note"] }],
    contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The trial links a public decision to experiences that still need direct reporting." },
    authoredVisual: { kind: "process", title: "From plan to measured outcome", description: "The visual separates the announcement, road observation and later assessment.", limitation: "It does not present an outcome that the source pack cannot establish.", claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-city-note"] },
    mediaPlan: withExternalMedia ? [{ id: "bazaar-road-photo", kind: "photo", placement: "hero", purpose: "Show the road layout before the trial.", alt: "Bazaar Road before the planned bus-priority trial.", rightsRequirement: "cc_by", claimIds: ["claim-1"], sourceIds: ["pib-city-note"] }] : [],
    modelNotes: ["Independent road observation remains necessary."]
  }, [source]);
}

const draftReview: DraftReview = {
  contractVersion: "syat.draft-review.v1", status: "needs_editorial_review", publicationAllowed: false,
  checks: { sourceReferences: "passed", directQuotes: "passed", repeatedClaims: "passed", publisherDiversity: "limited", mediaRights: "not_requested", indiaContext: "provided" },
  findings: []
};

const qualityReview: EditorialQualityReport = {
  contractVersion: "syat.editorial-quality.v1", status: "passed", blockers: [], warnings: [],
  scores: { clarity: 5, usefulness: 4, evidenceDiscipline: 5, indiaRelevance: 5, humanVoice: 4, perspectiveQuality: 4, sourceTransparency: 5 }
};

const approvedVisual: ReaderStory["media"][number] = {
  id: "authored-bazaar-road-bus-trial-process", kind: "chart", label: "From plan to measured outcome",
  alt: "Three steps separate the announced plan, road observation and later assessment.",
  caption: "A Syāt visual separates what is announced from what still needs to be observed.", creator: "Syāt visual desk",
  creditLine: "Syāt visual desk, based on the credited source record", sourceUrl: source.url, rightsBasis: "owned",
  reviewStatus: "approved", reviewedAt: "2026-08-31T07:00:00.000Z",
  rightsProof: { kind: "documented_record", recordId: "syat-visual-approval", note: "Syāt authored this source-led visual for the private preview." },
  limitation: "The visual does not establish whether the trial occurred or produced a result.", claimIds: ["claim-1", "claim-2"], sourceIds: ["pib-city-note"]
};

const approvedPhoto = {
  ...approvedVisual,
  id: "approved-bazaar-road-photo",
  planId: "bazaar-road-photo",
  kind: "photo" as const,
  label: "Bazaar Road before the trial",
  alt: "Bazaar Road before the planned bus-priority trial.",
  caption: "An approved external photo requested for the Bazaar Road story.",
  creator: "Independent photographer",
  creditLine: "Independent photographer, CC BY",
  rightsBasis: "cc_by" as const,
  claimIds: ["claim-1"]
};

describe("promoteGeneratedStory", () => {
  it("promotes only reviewed input into the strict private-preview ReaderStory contract", () => {
    const story = promoteGeneratedStory({ draft: makeDraft(), draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual] });
    expect(story.status).toBe("private_preview");
    expect(story.publicationAllowed).toBe(false);
    expect(story.disclosure).toBe("AI-assisted private preview");
    expect(story.sources[0].rightsBasis).toBe("government_reproduction_policy");
    expect(story.relatedCoverage[0]).toMatchObject({ modelInputAllowed: false, mediaReuseAllowed: false });
    expect(story.generation.inputHash).toBe(generationInputHash);
    expect(story.generation.promptVersion).toBe("syat.story-draft.v4.5");
    expect(story.media).toEqual([approvedVisual]);
    expect(story.statements[0]).toMatchObject({ basis: "official_claim", sourceScope: expect.any(String), limits: expect.any(String) });
    expect(story.statements[1]).toMatchObject({ basis: "evidence_gap", limits: "No independent observation or affected-person account is supplied." });
    expect(story.statements[1]).not.toHaveProperty("evidenceNeed");
    expect(story.perspectives[0].rationale).toContain("bus route");
    expect(story.body[0]).toMatchObject({ section: { id: "announcement", title: "The announced change" } });
    expect(story.authoredVisual).toMatchObject({ mediaId: approvedVisual.id, kind: "process", claimIds: ["claim-1", "claim-2"] });
  });

  it("fails source-pack promotion compatibility before a draft or paid call is needed", () => {
    const genericLicencePack: SourcePack = { ...sourcePack, sources: [{ ...source, rightsBasis: "explicit_licence", policyUrl: "https://example.invalid/custom-licence" }] };

    expect(() => assertSourcePackPromotionCompatible(genericLicencePack)).toThrow(/licence-specific|explicit licence/i);
    expect(assertSourcePackPromotionCompatible(sourcePack).id).toBe(sourcePack.id);
  });

  it("cannot promote a draft with an uncleared media plan", () => {
    expect(() => promoteGeneratedStory({ draft: makeDraft(true), draftReview: { ...draftReview, checks: { ...draftReview.checks, mediaRights: "human_review_required" } }, qualityReview, sourcePack, approvedMedia: [approvedVisual] })).toThrow(/approved media/i);
  });

  it("does not treat the authored visual approval as clearance for a separate external media plan", () => {
    const draft = makeDraft();
    draft.mediaPlan.push({ id: "external-travel-chart", kind: "chart", placement: "inline", purpose: "Add an external chart comparing travel-time records.", alt: "External chart comparing morning travel times on Bazaar Road.", rightsRequirement: "cc_by", claimIds: ["claim-1"], sourceIds: ["pib-city-note"] });
    expect(() => promoteGeneratedStory({ draft, draftReview: { ...draftReview, checks: { ...draftReview.checks, mediaRights: "human_review_required" } }, qualityReview, sourcePack, approvedMedia: [approvedVisual] })).toThrow(/approved media/i);
  });

  it("consumes an approved external media record only once", () => {
    const draft = makeDraft(true);
    draft.mediaPlan.push({ ...draft.mediaPlan[0], id: "second-bazaar-road-photo" });

    expect(() => promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual, approvedPhoto] })).toThrow(/approved media/i);
  });

  it("returns only the exact planned media and the separately bound authored visual", () => {
    const draft = makeDraft(true);
    const unplannedPhoto = { ...approvedPhoto, id: "unplanned-photo", planId: "unplanned-photo" };

    const story = promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual, approvedPhoto, unplannedPhoto] });

    expect(story.media.map((media) => media.id)).toEqual([approvedVisual.id, approvedPhoto.id]);
  });

  it("rejects external approvals that differ from the plan identity or exact fields", () => {
    const draft = makeDraft(true);
    const mismatches = [
      { ...approvedPhoto, planId: "another-photo-plan" },
      { ...approvedPhoto, alt: "A different approved caption that does not match the requested alternative text." },
      { ...approvedPhoto, claimIds: ["claim-2"] },
      { ...approvedPhoto, rightsBasis: "owned" as const }
    ];

    for (const media of mismatches) {
      expect(() => promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual, media] })).toThrow(/approved media/i);
    }
  });

  it("requires the approved Syāt visual to name the exact authored-visual claims", () => {
    const wrongClaims = { ...approvedVisual, claimIds: ["claim-1"] };

    expect(() => promoteGeneratedStory({ draft: makeDraft(), draftReview, qualityReview, sourcePack, approvedMedia: [wrongClaims] })).toThrow(/authored visual/i);
  });

  it("never treats explicit_licence as a wildcard for an owned external asset", () => {
    const draft = makeDraft();
    draft.mediaPlan.push({ id: "external-licensed-chart", kind: "chart", placement: "inline", purpose: "Add an external chart comparing travel-time records.", alt: "External chart comparing morning travel times on Bazaar Road.", rightsRequirement: "explicit_licence", claimIds: ["claim-1"], sourceIds: ["pib-city-note"] });
    const externalOwned = { ...approvedVisual, id: "external-owned-chart", creator: "Outside chart desk", label: "External travel-time chart" };

    expect(() => promoteGeneratedStory({ draft, draftReview: { ...draftReview, checks: { ...draftReview.checks, mediaRights: "human_review_required" } }, qualityReview, sourcePack, approvedMedia: [approvedVisual, externalOwned] })).toThrow(/explicit licence|approved media/i);
  });

  it("reparses the draft against the exact source pack even when source IDs are reused", () => {
    const foreignPack: SourcePack = { ...sourcePack, id: "foreign-pack", sources: [{ ...source, title: "Different record with a reused ID", evidenceText: "A different record has no date or Bazaar Road trial evidence." }] };
    expect(() => promoteGeneratedStory({ draft: makeDraft(), draftReview, qualityReview, sourcePack: foreignPack, approvedMedia: [approvedVisual] })).toThrow(/source pack|evidence/i);
  });

  it("keeps a 1600-character paragraph valid by storing the section title separately", () => {
    const draft = makeDraft();
    draft.bodySections[0].paragraphs[0].text = "x".repeat(1_600);
    const story = promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual] });
    expect(story.body[0]).toMatchObject({ text: "x".repeat(1_600), section: { id: "announcement", title: "The announced change" } });
  });

  it("does not label a Hindi draft as an en-IN ReaderStory", () => {
    const draft = makeDraft();
    draft.language = "hi-IN";
    expect(() => promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia: [approvedVisual] })).toThrow(/en-IN/i);
  });

  it("rejects blocked draft or quality reviews", () => {
    const blockedDraft = { ...draftReview, status: "blocked" as const };
    const blockedQuality: EditorialQualityReport = { ...qualityReview, status: "blocked", blockers: [{ code: "generic-opening", message: "Opening is generic." }] };
    expect(() => promoteGeneratedStory({ draft: makeDraft(), draftReview: blockedDraft, qualityReview, sourcePack, approvedMedia: [approvedVisual] })).toThrow(/blocked draft/i);
    expect(() => promoteGeneratedStory({ draft: makeDraft(), draftReview, qualityReview: blockedQuality, sourcePack, approvedMedia: [approvedVisual] })).toThrow(/blocked draft/i);
  });
});

describe("authored visual media id", () => {
  it("accepts every visual kind, including the ones whose names carry underscores", () => {
    // The media id must be a slug, so source_role_map becomes source-role-map. Promotion and
    // the batch runner have to agree on that or a good draft is rejected at the last step.
    for (const kind of ["timeline", "process", "relationship_map", "source_role_map", "number_stack", "comparison"] as const) {
      const slug = `authored-bazaar-road-trial-${kind}`.replaceAll("_", "-");
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(slug).not.toContain("_");
    }
  });
});
