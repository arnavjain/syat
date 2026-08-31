import { describe, expect, it } from "vitest";

import { parseGeneratedStory } from "./generation-contract";

const sourceDossier = [
  {
    sourceId: "ward-note",
    publisher: "Nadi Nagar Municipal Corporation",
    title: "Bazaar Road walking and bus-priority trial note",
    url: "https://example.invalid/nadi-nagar-bazaar-road",
    excerpt: "The trial starts on 1 September and opens one bus-priority lane on Bazaar Road."
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
});
