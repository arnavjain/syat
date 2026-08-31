import { describe, expect, it, vi } from "vitest";

import { createStoryDraft, estimateMaximumStoryDraftCostInrPaise, OPENROUTER_STORY_MODEL } from "./openrouter-story-client";

function acceptedReservation({ attempt, estimatedPaise }: { attempt: number; estimatedPaise: number }) {
  return Promise.resolve({
    reservationId: `reservation-${attempt}`,
    reservationPaise: estimatedPaise,
    authoritativeTotalPaise: estimatedPaise,
    budgetStatus: "allowed" as const
  });
}

const input = {
  language: "en-IN" as const,
  mode: "news" as const,
  editorialBrief: "Prepare a cautious story draft from the fictional Nadi Nagar municipal order.",
  indiaConnection: "This teaching fixture is a fictional Indian municipal context, not a report about a real event.",
  sourceDossier: [
    {
      sourceId: "ward-note",
      publisher: "Nadi Nagar Municipal Corporation",
      title: "Bazaar Road walking and bus-priority trial note",
      url: "https://example.invalid/nadi-nagar-order",
      excerpt: "The trial starts on 1 September and opens one bus-priority lane on Bazaar Road.",
      sourceKind: "official_statement" as const,
      rightsBasis: "link_only" as const,
      reviewStatus: "approved" as const
    }
  ]
};

const modelContent = JSON.stringify({
  contractVersion: "syat.story-draft.v1",
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  story: {
    mode: "news",
    title: "Nadi Nagar names the start date for a Bazaar Road trial",
    dek: "A source-linked fixture awaiting editorial review.",
    whatHappened: "The published note says that a Bazaar Road trial begins on 1 September with a bus-priority lane.",
    whatChanged: "The note supplies a start date and a specific street change that were not in the briefing.",
    whyItMattersNow: "Regular bus riders, walkers, traders, and nearby businesses can now check how the trial may affect their routines."
  },
  timeline: [{ happenedAt: "2026-08-28", text: "The municipal note was published.", sourceIds: ["ward-note"] }],
  statements: [{ id: "claim-start-date", type: "documented", text: "The note names 1 September as the start date for the trial.", sourceIds: ["ward-note"] }],
  contentBlocks: [{ id: "opening-paragraph", kind: "paragraph", text: "The published note names 1 September as the start date for the Bazaar Road trial.", claimIds: ["claim-start-date"], sourceIds: ["ward-note"] }],
  perspectives: [
    { id: "bus-rider", label: "Bus rider", sees: "A possible change to a familiar route.", values: "Affordable reliable travel.", uses: "The published note and daily routine.", mayMiss: "Effects on people who work beside the road.", sourceIds: ["ward-note"] },
    { id: "street-vendor", label: "Street vendor", sees: "A possible change to roadside space and access.", values: "A dependable place to work and safe customer access.", uses: "The municipal note and daily work on the street.", mayMiss: "How bus delays affect people travelling farther.", sourceIds: ["ward-note"] }
  ],
  unresolved: [{ question: "How will the trial affect people with different mobility needs?", whatWouldHelp: "Independent access checks during the first weeks.", sourceIds: ["ward-note"] }],
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

    const result = await createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt: vi.fn(acceptedReservation)
    });

    const request = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(request.model).toBe(OPENROUTER_STORY_MODEL);
    expect(request.response_format.json_schema.strict).toBe(true);
    expect(request.provider).toEqual({ require_parameters: true, sort: "throughput", data_collection: "deny", max_price: { prompt: 0.1, completion: 0.2 } });
    expect(request.max_tokens).toBe(3200);
    expect(request.reasoning).toEqual({ effort: "none", exclude: true });
    expect(result.draft.status).toBe("needs_editorial_review");
    expect(result.review.status).toBe("needs_editorial_review");
    expect(result.review.publicationAllowed).toBe(false);
    expect(result.usage.completionTokens).toBe(200);
    expect(result.estimatedCostInrPaise).toBeGreaterThan(0);
  });

  it("refuses to make a paid request without an API key", async () => {
    await expect(createStoryDraft({ apiKey: "", input, fetchImpl: vi.fn(), budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("names a provider-truncated draft instead of trying to parse it", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ finish_reason: "length", message: { content: "{\"contractVersion\":\"syat.story-draft.v1\"" } }],
        usage: { prompt_tokens: 100, completion_tokens: 8000 }
      }), { status: 200 })
    );

    await expect(createStoryDraft({ apiKey: "test-key", input, fetchImpl, budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(/cut .*short/i);
  });

  it("does not build a prompt or call a paid fetch when the monthly budget refuses the job", async () => {
    const fetchImpl = vi.fn();
    const promptBuilder = vi.fn();

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 140_000, reservedPaise: 0 },
      reserveAttempt: vi.fn(acceptedReservation),
      promptBuilder
    })).rejects.toThrow(/budget/i);

    expect(promptBuilder).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects an unapproved dossier before reserving, building, or fetching", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn();
    const promptBuilder = vi.fn(() => "unused prompt");

    await expect(createStoryDraft({
      apiKey: "test-key",
      input: { ...input, sourceDossier: [...input.sourceDossier, input.sourceDossier[0]] },
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt,
      promptBuilder
    })).rejects.toThrow(/source dossier/i);

    expect(reserveAttempt).not.toHaveBeenCalled();
    expect(promptBuilder).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects an oversized Unicode input before constructing a prompt, reserving, or fetching", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn(acceptedReservation);
    const promptBuilder = vi.fn(() => "unused prompt");

    await expect(createStoryDraft({
      apiKey: "test-key",
      input: { ...input, editorialBrief: "🪷".repeat(2_000) },
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt,
      promptBuilder
    })).rejects.toThrow(/input size/i);

    expect(promptBuilder).not.toHaveBeenCalled();
    expect(reserveAttempt).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects an oversized escaped-byte dossier before constructing a prompt, reserving, or fetching", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn(acceptedReservation);
    const promptBuilder = vi.fn(() => "unused prompt");

    await expect(createStoryDraft({
      apiKey: "test-key",
      input: {
        ...input,
        sourceDossier: [{ ...input.sourceDossier[0], excerpt: "\u0000".repeat(7_000) }]
      },
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt,
      promptBuilder
    })).rejects.toThrow(/input size/i);

    expect(promptBuilder).not.toHaveBeenCalled();
    expect(reserveAttempt).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not fetch when the shared reservation returns no durable acknowledgement", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn().mockResolvedValue(undefined);

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt
    })).rejects.toThrow(/reservation acknowledgement/i);

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not fetch when the shared reservation rejects", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn().mockRejectedValue(new Error("ledger unavailable"));

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt
    })).rejects.toThrow(/reservation acknowledgement/i);

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not fetch when the durable acknowledgement has an impossible authoritative total", async () => {
    const fetchImpl = vi.fn();
    const reserveAttempt = vi.fn(async ({ estimatedPaise }: { estimatedPaise: number }) => ({
      reservationId: "wrong-amount",
      reservationPaise: estimatedPaise,
      authoritativeTotalPaise: estimatedPaise - 1,
      budgetStatus: "allowed" as const
    }));

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt
    })).rejects.toThrow(/did not match/i);

    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("waits for a matching durable reservation acknowledgement before fetching", async () => {
    const events: string[] = [];
    const fetchImpl = vi.fn(async () => {
      events.push("fetch");
      return new Response(JSON.stringify({ choices: [{ message: { content: modelContent } }] }), { status: 200 });
    });
    const reserveAttempt = vi.fn(async (request: { attempt: number; estimatedPaise: number }) => {
      events.push("reserve");
      await Promise.resolve();
      events.push("acknowledged");
      return {
        reservationId: "durable-reservation",
        reservationPaise: request.estimatedPaise,
        authoritativeTotalPaise: request.estimatedPaise,
        budgetStatus: "allowed" as const
      };
    });

    const result = await createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt
    });

    expect(events).toEqual(["reserve", "acknowledged", "fetch"]);
    expect(result.reservations[0]).toMatchObject({ reservationId: "durable-reservation" });
  });

  it("includes the first reservation before refusing a retry that would cross the cap", async () => {
    const maximum = estimateMaximumStoryDraftCostInrPaise();
    const fetchImpl = vi.fn().mockRejectedValueOnce(new Error("temporary network failure"));
    const reserveAttempt = vi.fn(acceptedReservation);

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 140_000 - maximum - 1, reservedPaise: 0 },
      reserveAttempt,
      maxAttempts: 2
    })).rejects.toThrow(/budget/i);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(reserveAttempt).toHaveBeenCalledTimes(1);
    expect(reserveAttempt.mock.calls[0][0]).toMatchObject({ attempt: 1, estimatedPaise: maximum });
  });
});
