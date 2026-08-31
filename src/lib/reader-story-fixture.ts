import type { ReaderStory } from "@/lib/reader-story-schema";

// A non-publishable reader-shaped fixture. It exists so component tests and the
// /preview/reader design-review route can exercise the real reader components
// while the generated News index is still empty. It is not reporting, and its
// publication flags stay closed.

export function makeReaderStoryFixture(overrides: Partial<ReaderStory> = {}): ReaderStory {
  const story: ReaderStory = {
    contractVersion: "syat.reader-story.v1",
    id: "news-delhi-water-review",
    slug: "delhi-water-review",
    mode: "news",
    locale: "en-IN",
    status: "private_preview",
    publicationAllowed: false,
    disclosure: "AI-assisted private preview",
    format: "explainer",
    title: "Delhi opens a new public review of neighbourhood water records",
    dek: "The review sets out what the official record can show and which local effects still need independent evidence.",
    theme: "Public services",
    indiaConnection: "The record concerns access to a public service in Delhi and the evidence residents would need to inspect it.",
    eventTime: { kind: "exact_date", value: "2026-08-30", label: "30 August 2026" },
    eventTimeEvidence: { claimIds: ["claim-review"], sourceIds: ["water-note"] },
    collectedAt: "2026-08-31T08:00:00.000Z",
    generatedAt: "2026-08-31T09:00:00.000Z",
    updatedAt: "2026-08-31T10:00:00.000Z",
    readingMinutes: 4,
    body: [
      { id: "opening", kind: "paragraph", section: { id: "what-opened", title: "What opened for review" }, text: "The department's note opens a review of neighbourhood water records and names the records it plans to examine.", claimIds: ["claim-review"], sourceIds: ["water-note"] },
      { id: "scope", kind: "paragraph", section: { id: "what-record-shows", title: "What the record can show" }, text: "The official note can establish the review's stated scope, but it cannot establish how water access changed in each neighbourhood.", claimIds: ["claim-review", "claim-limit"], sourceIds: ["water-note"] },
      { id: "unknown", kind: "paragraph", section: { id: "what-remains", title: "What remains to be checked" }, text: "Independent measurements and accounts from residents would be needed to compare the record with everyday access.", claimIds: ["claim-limit"], sourceIds: ["water-note"] }
    ],
    statements: [
      { id: "claim-review", type: "documented", basis: "official_claim", text: "The department says it opened a review of neighbourhood water records.", sourceIds: ["water-note"], sourceScope: "The source records the department's own description of the review.", limits: "It does not independently establish the review's effects on water access." },
      { id: "claim-limit", type: "unresolved", basis: "evidence_gap", text: "The supplied record does not establish neighbourhood-level access outcomes.", sourceIds: ["water-note"], sourceScope: "The source describes the review but contains no independent outcome measurement.", limits: "Resident accounts and comparable local measurements are not included." },
      { id: "claim-audit", type: "interpreted", basis: "reported_observation", text: "An earlier audit found that meter records and billing records disagreed in several wards.", sourceIds: ["audit-note"], sourceScope: "The audit examined record keeping in a sample of wards, not the whole city.", limits: "It predates this review and cannot describe the wards outside its sample." }
    ],
    timeline: [{ id: "review-opens", time: { kind: "exact_date", value: "2026-08-30", label: "30 August 2026" }, text: "The department published the note opening the records review.", claimIds: ["claim-review"], sourceIds: ["water-note"] }],
    perspectives: [
      { id: "record-holder", label: "The department's record", rationale: "The source is the department's own note about the review.", sees: "A defined administrative review and its stated scope.", values: "A consistent record of the process it has announced.", uses: "The published review note and the records named in it.", mayMiss: "Differences between the official process and daily water access.", sourceIds: ["water-note"] },
      { id: "audit-reading", label: "The auditor's reading", rationale: "The audit examined how the same records were kept before this review began.", sees: "Gaps between meter records and billing records in the wards it sampled.", values: "Records that can be reconciled and checked by someone outside the department.", uses: "Its own ward sample and the department's record keeping at that time.", mayMiss: "What changed after the audit closed, and the wards it never sampled.", sourceIds: ["audit-note"] }
    ],
    people: [
      { id: "water-department", kind: "institution", label: "Delhi water department", association: "It issued the note that defines the review and its stated scope.", sourceIds: ["water-note"] },
      { id: "state-auditor", kind: "institution", label: "State audit office", association: "It examined the department's record keeping in a sample of wards before this review.", sourceIds: ["audit-note"] }
    ],
    unresolved: [{ id: "local-outcome", question: "How closely do the reviewed records match neighbourhood water access?", whatWouldHelp: "Comparable local measurements and reporting from residents across the reviewed areas.", sourceIds: ["water-note"] }],
    contextBridge: { topicSlug: "water-sharing", question: "How does water infrastructure shape who can rely on a place?", connection: "The current review concerns records and access; the Timeless topic follows how Indian water systems carry public choices across time." },
    sources: [
      { id: "water-note", publisher: "Delhi water department", title: "Neighbourhood water records review note", url: "https://example.invalid/delhi-water-review", sourceKind: "official_statement", publishedAt: "2026-08-30T08:00:00.000Z", accessedAt: "2026-08-31T08:00:00.000Z", use: "Supports the stated scope and timing of the official review.", scope: "Records the department's account, not an independent access assessment.", rightsBasis: "government_reproduction_policy", reviewStatus: "approved", linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false },
      { id: "audit-note", publisher: "State audit office", title: "Ward sample audit of water record keeping", url: "https://example.invalid/ward-water-audit", sourceKind: "primary_document", publishedAt: "2026-06-12T08:00:00.000Z", accessedAt: "2026-08-31T08:00:00.000Z", use: "Supports the earlier finding that meter and billing records disagreed in sampled wards.", scope: "Covers only the wards in its sample and only the period it audited.", rightsBasis: "government_open_data", reviewStatus: "approved", linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false }
    ],
    media: [{ id: "water-review-map", kind: "chart", label: "From official record to unanswered local question", alt: "A source map connecting the official water review note to the outcomes it cannot establish.", caption: "A Syāt visual based on the credited official record.", creator: "Syāt visual desk", creditLine: "Visual: Syāt visual desk; based only on the credited source record.", sourceUrl: "https://syat.local/preview/visuals/water-review-map", rightsBasis: "owned", reviewStatus: "approved", reviewedAt: "2026-08-31T10:00:00.000Z", rightsProof: { kind: "documented_record", recordId: "water-review-map", note: "Syāt recorded ownership of this source-led authored visual." }, limitation: "The visual maps evidence roles; it does not measure water access.", claimIds: ["claim-review", "claim-limit"], sourceIds: ["water-note"] }],
    authoredVisual: { mediaId: "water-review-map", kind: "source_role_map", title: "From official record to unanswered local question", description: "The map separates what the department records from what needs independent local evidence.", limitation: "The visual maps evidence roles; it does not measure water access.", claimIds: ["claim-review", "claim-limit"], sourceIds: ["water-note", "audit-note"] },
    relatedCoverage: [],
    reframe: { kind: "question", value: "What evidence would connect an official water record to daily access?" },
    generation: { model: "deepseek/deepseek-v4-flash-0731", promptVersion: "syat.story-draft.v2.4", inputHash: "a".repeat(64), generatedBy: "openrouter", reviewedAt: "2026-08-31T10:00:00.000Z" },
    quality: { status: "passed", blockers: [], warnings: [], scores: { clarity: 4, usefulness: 4, evidenceDiscipline: 5, indiaRelevance: 5, humanVoice: 4, perspectiveQuality: 4, sourceTransparency: 5 } },
    publication: { approvedByHuman: false, finalReporting: false }
  };

  return { ...story, ...overrides };
}

