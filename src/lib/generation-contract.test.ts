import { describe, expect, it } from "vitest";

import { buildStoryDraftPrompt, parseGeneratedStory, type SourceDossierRecord } from "./generation-contract";

const sourceDossier = [
  {
    sourceId: "ward-note",
    publisher: "Nadi Nagar Municipal Corporation",
    title: "Bazaar Road walking and bus-priority trial note",
    url: "https://example.invalid/nadi-nagar-bazaar-road",
    excerpt: "The trial starts on 1 September and opens one bus-priority lane on Bazaar Road.",
    sourceKind: "official_statement" as const,
    rightsBasis: "link_only" as const,
    reviewStatus: "approved" as const
  }
];

const response = {
  contractVersion: "syat.story-draft.v1",
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  story: {
    mode: "news",
    title: "Nadi Nagar prepares a Bazaar Road street trial",
    dek: "A source-linked draft for an editor to verify before publication.",
    whatHappened: "The municipal note says the trial starts on 1 September and opens one bus-priority lane.",
    whatChanged: "The start date and the street changes are now specified in the municipal note.",
    whyItMattersNow: "People who walk, take buses, trade, or make deliveries on the street may experience the trial differently."
  },
  timeline: [
    {
      happenedAt: "2026-08-28",
      text: "The municipal corporation published the trial note.",
      sourceIds: ["ward-note"]
    }
  ],
  statements: [
    {
      id: "claim-trial-date",
      type: "documented",
      text: "The note names 1 September as the start date for the street trial.",
      sourceIds: ["ward-note"],
      scope: "This describes the municipal note, not whether the trial will meet its goals."
    }
  ],
  contentBlocks: [
    {
      id: "opening-paragraph",
      kind: "paragraph",
      text: "The municipal note says the trial starts on 1 September and opens one bus-priority lane.",
      claimIds: ["claim-trial-date"],
      sourceIds: ["ward-note"]
    }
  ],
  perspectives: [
    {
      id: "commuter",
      label: "Daily commuter",
      sees: "A possible change to a regular bus journey.",
      values: "Predictable, affordable travel.",
      uses: "The published note and their travel routine.",
      mayMiss: "Effects on people who work at the roadside.",
      sourceIds: ["ward-note"]
    },
    {
      id: "planner",
      label: "Urban planner",
      sees: "A short trial intended to change how the street moves.",
      values: "Safer crossings and reliable buses.",
      uses: "The municipal note and stated objectives.",
      mayMiss: "The immediate pressure on people who work beside the road.",
      sourceIds: ["ward-note"]
    }
  ],
  unresolved: [
    {
      question: "How will the trial affect people with different mobility needs?",
      whatWouldHelp: "Published access checks and independent monitoring during the trial.",
      sourceIds: ["ward-note"]
    }
  ],
  mediaPlan: [
    {
      kind: "illustration",
      placement: "hero",
      alt: "Diagram of the proposed Bazaar Road changes.",
      rightsRequirement: "owned"
    }
  ],
  modelNotes: ["This draft needs local transport reporting before publication."]
};

describe("parseGeneratedStory", () => {
  it("accepts a source-linked model response and keeps it in editorial review", () => {
    const result = parseGeneratedStory(response, sourceDossier);

    expect(result.status).toBe("needs_editorial_review");
    expect(result.story.title).toContain("Nadi Nagar");
    expect(result.timeline[0].sourceIds).toEqual(["ward-note"]);
  });

  it("rejects a model response that cites a source outside the supplied dossier", () => {
    const result = structuredClone(response);
    result.statements[0].sourceIds = ["invented-source"];

    expect(() => parseGeneratedStory(result, sourceDossier)).toThrow(/not in the supplied dossier/);
  });

  const invalidDossiers: SourceDossierRecord[][] = [
    [{ ...sourceDossier[0], reviewStatus: "pending" }],
    [{ ...sourceDossier[0], reviewStatus: "rejected" }],
    [{ ...sourceDossier[0], rightsBasis: undefined }],
    [{ ...sourceDossier[0], sourceId: "" }],
    [sourceDossier[0], sourceDossier[0]]
  ];

  it.each(invalidDossiers.map((dossier) => ({ dossier })))("rejects an incomplete or non-approved source dossier before prompt construction", ({ dossier }) => {
    expect(() => buildStoryDraftPrompt({
      language: "en-IN",
      mode: "news",
      editorialBrief: "Use the supplied note carefully.",
      indiaConnection: "A fictional teaching fixture in an Indian municipal context.",
      sourceDossier: dossier
    })).toThrow(/source dossier/i);
  });

  it("rejects unknown source and review values while preserving review-only output", () => {
    const malformedDossier = [{ ...sourceDossier[0], reviewStatus: "approved_by_model" }] as unknown as SourceDossierRecord[];
    const malformedSourceKind = [{ ...sourceDossier[0], sourceKind: "machine_guess" }] as unknown as SourceDossierRecord[];
    const malformedResponse = { ...response, editorialStatus: "approved" };

    expect(() => parseGeneratedStory(response, malformedDossier)).toThrow(/source dossier/i);
    expect(() => parseGeneratedStory(response, malformedSourceKind)).toThrow(/source dossier/i);
    expect(() => parseGeneratedStory(malformedResponse, sourceDossier)).toThrow();
    expect(parseGeneratedStory(response, sourceDossier).status).toBe("needs_editorial_review");
  });

  it("allows an approved link-only source in a private draft but rejects link-only media", () => {
    const invalidMedia = structuredClone(response);
    invalidMedia.mediaPlan[0].rightsRequirement = "link_only";

    expect(parseGeneratedStory(response, sourceDossier).status).toBe("needs_editorial_review");
    expect(() => parseGeneratedStory(invalidMedia, sourceDossier)).toThrow();
  });
});
