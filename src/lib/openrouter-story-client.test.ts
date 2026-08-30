import { describe, expect, it, vi } from "vitest";

import { createStoryDraft, OPENROUTER_STORY_MODEL } from "./openrouter-story-client";

const input = {
  language: "en-IN" as const,
  mode: "news" as const,
  editorialBrief: "Prepare a cautious story draft from the city order.",
  sourceDossier: [
    {
      sourceId: "city-order",
      publisher: "City of Rivergate",
      title: "Congestion pricing implementation order",
      url: "https://example.org/rivergate-order",
      excerpt: "The charge will begin on 1 September."
    }
  ]
};

const modelContent = JSON.stringify({
  contractVersion: "syat.story-draft.v1",
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  story: {
    mode: "news",
    title: "Rivergate names the start date for a central-zone charge",
    dek: "A source-linked fixture awaiting editorial review.",
    whatHappened: "The published order says that a central-zone charge will begin on 1 September.",
    whatChanged: "The order supplies a start date that was not present in the briefing.",
    whyItMattersNow: "Regular travellers and nearby businesses can now check how the change may affect their routines."
  },
  timeline: [{ happenedAt: "2026-08-28", text: "The order was published.", sourceIds: ["city-order"] }],
  statements: [{ id: "claim-start-date", type: "documented", text: "The order names 1 September as the start date.", sourceIds: ["city-order"] }],
  contentBlocks: [{ id: "opening-paragraph", kind: "paragraph", text: "The published order names 1 September as the start date for the charge.", claimIds: ["claim-start-date"], sourceIds: ["city-order"] }],
  perspectives: [
    { id: "commuter", label: "Daily commuter", sees: "A recurring charge on a familiar route.", values: "Affordable reliable travel.", uses: "The published order and daily routine.", mayMiss: "Effects on people who do not drive.", sourceIds: ["city-order"] },
    { id: "planner", label: "Urban planner", sees: "A tool intended to shape traffic patterns.", values: "Safe streets and public transport.", uses: "The policy order and stated goals.", mayMiss: "Short-term pressure on individuals.", sourceIds: ["city-order"] }
  ],
  unresolved: [{ question: "How will household costs change across the city?", whatWouldHelp: "Independent monitoring after the first months.", sourceIds: ["city-order"] }],
  mediaPlan: [],
  modelNotes: ["Verify local impact reporting before publication."]
});

describe("createStoryDraft", () => {
  it("uses the fixed model, strict schema, and source parser before returning a review draft", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ message: { content: modelContent } }],
        usage: { prompt_tokens: 100, completion_tokens: 200 }
      }), { status: 200 })
    );

    const result = await createStoryDraft({ apiKey: "test-key", input, fetchImpl });

    const request = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(request.model).toBe(OPENROUTER_STORY_MODEL);
    expect(request.response_format.json_schema.strict).toBe(true);
    expect(request.provider.require_parameters).toBe(true);
    expect(result.draft.status).toBe("needs_editorial_review");
    expect(result.usage.completionTokens).toBe(200);
    expect(result.estimatedCostInrPaise).toBeGreaterThan(0);
  });

  it("refuses to make a paid request without an API key", async () => {
    await expect(createStoryDraft({ apiKey: "", input, fetchImpl: vi.fn() })).rejects.toThrow(/OPENROUTER_API_KEY/);
  });
});
