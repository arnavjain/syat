import { describe, expect, it } from "vitest";

import { parseGeneratedStory } from "./generation-contract";

const sourceDossier = [
  {
    sourceId: "city-order",
    publisher: "City of Rivergate",
    title: "Congestion pricing implementation order",
    url: "https://example.org/rivergate-order",
    excerpt: "The charge will begin on 1 September and apply to the defined central zone."
  }
];

const response = {
  contractVersion: "syat.story-draft.v1",
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  story: {
    mode: "news",
    title: "Rivergate prepares to begin its central-zone charge",
    dek: "A source-linked draft for an editor to verify before publication.",
    whatHappened: "The city order says the charge begins on 1 September in the defined central zone.",
    whatChanged: "The start date and zone are now specified in the implementation order.",
    whyItMattersNow: "People who travel through the zone need time to understand how the change affects them."
  },
  timeline: [
    {
      happenedAt: "2026-08-28",
      text: "The city published the implementation order.",
      sourceIds: ["city-order"]
    }
  ],
  statements: [
    {
      id: "claim-start-date",
      type: "documented",
      text: "The order names 1 September as the start date.",
      sourceIds: ["city-order"],
      scope: "This describes the order, not whether the policy will meet its goals."
    }
  ],
  contentBlocks: [
    {
      id: "opening-paragraph",
      kind: "paragraph",
      text: "The city order says the charge begins on 1 September in the defined central zone.",
      claimIds: ["claim-start-date"],
      sourceIds: ["city-order"]
    }
  ],
  perspectives: [
    {
      id: "commuter",
      label: "Daily commuter",
      sees: "A new regular cost on a familiar route.",
      values: "Predictable, affordable travel.",
      uses: "The published fee schedule and their travel routine.",
      mayMiss: "Effects on people who cannot use a car.",
      sourceIds: ["city-order"]
    },
    {
      id: "planner",
      label: "Urban planner",
      sees: "A change intended to alter traffic patterns.",
      values: "Safer streets and reliable alternatives.",
      uses: "The policy order and stated objectives.",
      mayMiss: "The immediate cost pressure on individual travellers.",
      sourceIds: ["city-order"]
    }
  ],
  unresolved: [
    {
      question: "How will the charge affect different household budgets?",
      whatWouldHelp: "Published independent monitoring after the first months.",
      sourceIds: ["city-order"]
    }
  ],
  mediaPlan: [
    {
      kind: "illustration",
      placement: "hero",
      alt: "Diagram of the announced central-zone boundary.",
      rightsRequirement: "owned"
    }
  ],
  modelNotes: ["This draft needs local transport reporting before publication."]
};

describe("parseGeneratedStory", () => {
  it("accepts a source-linked model response and keeps it in editorial review", () => {
    const result = parseGeneratedStory(response, sourceDossier);

    expect(result.status).toBe("needs_editorial_review");
    expect(result.story.title).toContain("Rivergate");
    expect(result.timeline[0].sourceIds).toEqual(["city-order"]);
  });

  it("rejects a model response that cites a source outside the supplied dossier", () => {
    const result = structuredClone(response);
    result.statements[0].sourceIds = ["invented-source"];

    expect(() => parseGeneratedStory(result, sourceDossier)).toThrow(/not in the supplied dossier/);
  });
});
