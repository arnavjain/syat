import { describe, expect, it } from "vitest";

import { reviewGeneratedDraft, type GeneratedStory } from "./draft-review";

const dossier = [
  {
    sourceId: "ward-note",
    publisher: "Nadi Nagar Municipal Corporation",
    title: "Bazaar Road walking and bus-priority trial note",
    url: "https://example.invalid/nadi-nagar-bazaar-road",
    excerpt: "The trial opens one bus-priority lane and widens two crossings on Bazaar Road from 1 September.",
    publishedAt: "2026-08-28"
  }
];

const draft: GeneratedStory = {
  contractVersion: "syat.story-draft.v1",
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  status: "needs_editorial_review",
  story: {
    mode: "news",
    title: "Nadi Nagar sets out a Bazaar Road trial",
    dek: "A source-linked draft that remains in the editor’s review queue.",
    whatHappened: "The municipal note describes a short trial with a bus-priority lane and wider crossings.",
    whatChanged: "The note gives a start date and names the two street changes under consideration.",
    whyItMattersNow: "People who walk, take buses, sell on the street, or make deliveries may experience the street differently."
  },
  timeline: [{ happenedAt: "2026-08-28", text: "The municipal corporation published the trial note.", sourceIds: ["ward-note"] }],
  statements: [{ id: "trial-details", type: "documented", text: "The note describes a bus-priority lane and two wider crossings.", sourceIds: ["ward-note"] }],
  contentBlocks: [
    { id: "intro", kind: "paragraph", text: "The municipal note describes a short trial with a bus-priority lane and wider crossings.", claimIds: ["trial-details"], sourceIds: ["ward-note"] },
    { id: "quote-note", kind: "quote", quoteId: "ward-note-quote", text: "The trial opens one bus-priority lane and widens two crossings on Bazaar Road from 1 September.", sourceId: "ward-note" }
  ],
  perspectives: [
    { id: "bus-rider", label: "Bus rider", sees: "A possible change to a regular commute.", values: "Reliable and affordable travel.", uses: "The municipal note and a daily travel routine.", mayMiss: "How trading conditions change on the street.", sourceIds: ["ward-note"] },
    { id: "street-vendor", label: "Street vendor", sees: "A possible change to space beside the road.", values: "A dependable place to work and safe customer access.", uses: "The municipal note and everyday work on the street.", mayMiss: "How bus delays affect people travelling farther.", sourceIds: ["ward-note"] }
  ],
  unresolved: [{ question: "How will the trial affect people with different mobility needs?", whatWouldHelp: "Observed access checks during the trial and feedback from disabled residents.", sourceIds: ["ward-note"] }],
  mediaPlan: [],
  modelNotes: ["Seek independent reporting and an accessibility review before publication."]
};

describe("reviewGeneratedDraft", () => {
  it("keeps a source-linked draft in human review and records evidence limits", () => {
    const result = reviewGeneratedDraft(draft, dossier, {
      indiaConnection: "This fictional teaching fixture is set in an Indian municipal context."
    });

    expect(result.status).toBe("needs_editorial_review");
    expect(result.publicationAllowed).toBe(false);
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "single-publisher-evidence", severity: "warning" }));
    expect(result.findings.find((finding) => finding.code === "quote-not-in-source")).toBeUndefined();
  });

  it("blocks a quote that the supplied source excerpt cannot verify", () => {
    const changed = structuredClone(draft);
    changed.contentBlocks[1] = { ...changed.contentBlocks[1], kind: "quote", quoteId: "made-up", text: "A sentence not present in the source excerpt.", sourceId: "ward-note" };

    const result = reviewGeneratedDraft(changed, dossier, { indiaConnection: "This fictional teaching fixture is set in an Indian municipal context." });

    expect(result.status).toBe("blocked");
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "quote-not-in-source", severity: "blocker" }));
  });

  it("blocks repeated factual claims before a person reviews the draft", () => {
    const changed = structuredClone(draft);
    changed.statements.push({ ...changed.statements[0], id: "trial-details-repeat" });

    const result = reviewGeneratedDraft(changed, dossier, { indiaConnection: "This fictional teaching fixture is set in an Indian municipal context." });

    expect(result.status).toBe("blocked");
    expect(result.findings).toContainEqual(expect.objectContaining({ code: "repeated-claim", severity: "blocker" }));
  });
});
