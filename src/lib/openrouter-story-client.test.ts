import { describe, expect, it, vi } from "vitest";

import type { GeneratedStoryV2 } from "./generation-contract";
import { createStoryDraft, estimateMaximumStoryDraftCostInrPaise, OPENROUTER_STORY_MODEL, type GenerationReservationRequest } from "./openrouter-story-client";

function acceptedReservation({ attempt, estimatedPaise }: GenerationReservationRequest) {
  return Promise.resolve({
    reservationId: `reservation-${attempt}`,
    reservationPaise: estimatedPaise,
    authoritativeTotalPaise: estimatedPaise,
    budgetStatus: "allowed" as const
  });
}

const input = {
  sourcePackId: "nadi-nagar-road-trial",
  language: "en-IN" as const,
  mode: "news" as const,
  format: "news_brief" as const,
  editorialBrief: "Prepare a cautious story draft from the fictional Nadi Nagar municipal order.",
  indiaConnection: "This teaching fixture is a fictional Indian municipal context, not a report about a real event.",
  sourceRoles: [{ sourceId: "ward-note", role: "official account of the planned trial" }],
  missingVoices: ["Independent observation", "People who use Bazaar Road"],
  sourceDossier: [
    {
      id: "ward-note",
      publisherId: "nadi-municipal-corporation",
      publisher: "Nadi Nagar Municipal Corporation",
      title: "Bazaar Road walking and bus-priority trial note",
      url: "https://example.invalid/nadi-nagar-order",
      evidenceText: "The trial starts on 1 September 2026 and opens one bus-priority lane on Bazaar Road.",
      publishedAt: "2026-08-28T06:00:00.000Z",
      accessedAt: "2026-08-31T06:00:00.000Z",
      sourceKind: "official_statement" as const,
      linkAllowed: true,
      modelInputAllowed: true,
      mediaReuseAllowed: false,
      rightsBasis: "government_reproduction_policy" as const,
      policyUrl: "https://example.invalid/reproduction-policy",
      reviewedAt: "2026-08-31T06:00:00.000Z",
      creditLine: "Source: Nadi Nagar Municipal Corporation"
    }
  ]
};

const modelDraft: GeneratedStoryV2 = {
  contractVersion: "syat.story-draft.v2",
  sourcePackId: "nadi-nagar-road-trial",
  sourceIds: ["ward-note"],
  language: "en-IN",
  editorialStatus: "needs_editorial_review",
  format: "news_brief",
  story: {
    mode: "news",
    title: "Nadi Nagar names the start date for a Bazaar Road trial",
    dek: "The city note names the planned date and lane change, while effects on people using the street remain unmeasured.",
    theme: "Cities and public life",
    indiaConnection: input.indiaConnection,
    eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" },
    eventTimeEvidence: { claimIds: ["claim-1"], sourceIds: ["ward-note"] },
    reframe: { kind: "question", value: "What evidence would show how the street trial works for different road users?" }
  },
  bodySections: [
    { id: "announcement", title: "The announced change", paragraphs: [{ id: "opening", text: "A bus-priority trial is due to start on Bazaar Road on 1 September, according to the municipal note.", claimIds: ["claim-1"], sourceIds: ["ward-note"] }] },
    { id: "scope", title: "What the note supports", paragraphs: [{ id: "source-scope", text: "The note identifies a planned date and lane change but supplies no measured result from the road.", claimIds: ["claim-1"], sourceIds: ["ward-note"] }] },
    { id: "unknowns", title: "Evidence still needed", paragraphs: [{ id: "evidence-needed", text: "Travel-time records and direct observations would help assess how the trial affects riders, walkers and traders.", claimIds: ["claim-2"], sourceIds: ["ward-note"] }] }
  ],
  timeline: [{ id: "planned-start", time: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" }, text: "The municipal note gives this as the planned start date.", claimIds: ["claim-1"], sourceIds: ["ward-note"] }],
  statements: [
    { id: "claim-1", type: "documented", basis: "official_claim", text: "The note names 1 September as the planned start date.", sourceIds: ["ward-note"], sourceScope: "This reports the date and change described in the municipal note.", limits: "It does not confirm implementation or a measured outcome." },
    { id: "claim-2", type: "unresolved", basis: "evidence_gap", text: "The effects on different road users are not established.", sourceIds: ["ward-note"], sourceScope: "The note contains no travel-time record or direct observation.", limits: "The source pack contains no affected-person account." }
  ],
  perspectives: [{ id: "bus-rider", label: "Bus rider", rationale: "The note concerns a bus-priority lane on a regular route.", sees: "A possible change to a familiar journey.", values: "Affordable and reliable travel.", uses: "The route and date described in the note.", mayMiss: "Effects on people who work beside the road.", sourceIds: ["ward-note"] }],
  people: [{ id: "municipal-corporation", kind: "institution", label: "Nadi Nagar Municipal Corporation", association: "The institution issued the note describing the planned trial.", sourceIds: ["ward-note"] }],
  unresolved: [{ id: "access-effects", question: "How will the trial affect people with different mobility needs?", whatWouldHelp: "Independent access checks and observations during the first weeks.", sourceIds: ["ward-note"] }],
  contextBridge: { topicSlug: "local-decision", question: "How should a local decision be made?", connection: "The street trial links a municipal decision to public experiences that still need reporting." },
  authoredVisual: { kind: "process", title: "From announcement to assessment", description: "The visual separates the announced plan, road observation and later outcome assessment.", limitation: "It does not claim an outcome that the note cannot establish.", claimIds: ["claim-1", "claim-2"], sourceIds: ["ward-note"] },
  mediaPlan: [],
  modelNotes: ["Verify local impact reporting before publication."]
};
const modelContent = JSON.stringify(modelDraft);

describe("createStoryDraft", () => {
  it("uses the fixed model, strict schema, and source parser before returning a review draft", async () => {
    const reserveAttempt = vi.fn(acceptedReservation);
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ message: { content: modelContent } }],
        usage: { prompt_tokens: 100, completion_tokens: 200, cost: 0.000042 }
      }), { status: 200 })
    );

    const result = await createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt
    });

    const request = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(request.model).toBe(OPENROUTER_STORY_MODEL);
    expect(request.response_format.json_schema.strict).toBe(true);
    const providerSchema = request.response_format.json_schema.schema;
    expect(providerSchema.properties.statements.items.properties.id.pattern).toBe("^claim-[1-9][0-9]*$");
    expect(providerSchema.properties.contextBridge.properties.topicSlug.enum).toContain("local-decision");
    expect(providerSchema.properties.contextBridge.properties.topicSlug.enum).not.toContain("customs-time-release-study");
    expect(providerSchema.properties.sourceIds.items.enum).toEqual(["ward-note"]);
    expect(providerSchema.properties.story.properties.eventTimeEvidence.properties.sourceIds.items.enum).toEqual(["ward-note"]);
    const eventTimeOptions = providerSchema.properties.story.properties.eventTime.oneOf;
    const timelineTimeOptions = providerSchema.properties.timeline.items.properties.time.oneOf;
    expect(eventTimeOptions.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["exact_date", "unknown"]);
    expect(timelineTimeOptions.map((option: { properties: { kind: { const: string } } }) => option.properties.kind.const)).toEqual(["exact_date", "unknown"]);
    expect(eventTimeOptions[0].properties.value.const).toBe("2026-09-01");
    expect(eventTimeOptions[0].properties.label.const).toBe("1 September 2026");
    expect(eventTimeOptions[1].properties.label.const).toBe("Date not established in the supplied evidence");
    expect(timelineTimeOptions[0].properties.value.const).toBe("2026-09-01");
    expect(timelineTimeOptions[0].properties.label.const).toBe("1 September 2026");
    expect(timelineTimeOptions[1].properties.label.const).toBe("Date not established in the supplied evidence");
    expect(providerSchema.properties.sourcePackId.const).toBe(input.sourcePackId);
    expect(providerSchema.properties.language.const).toBe(input.language);
    expect(providerSchema.properties.format.const).toBe(input.format);
    expect(providerSchema.properties.story.properties.mode.const).toBe(input.mode);
    expect(providerSchema.properties.story.properties.indiaConnection.const).toBe(input.indiaConnection);
    expect(request.provider).toEqual({ require_parameters: true, sort: "throughput", data_collection: "deny", max_price: { prompt: 0.1, completion: 0.2 } });
    expect(request.max_tokens).toBe(6000);
    expect(request.reasoning).toEqual({ effort: "none", exclude: true });
    expect(result.draft.editorialStatus).toBe("needs_editorial_review");
    expect(result.review.status).toBe("needs_editorial_review");
    expect(result.review.publicationAllowed).toBe(false);
    expect(result.usage.completionTokens).toBe(200);
    expect(result.reservedMaximumPaise).toBe(42);
    expect(reserveAttempt.mock.calls[0][0].estimatedPaise).toBe(42);
    expect(result.actualCostUsd).toBe(0.000042);
  });

  it("keeps the conservative 6,000-token reservation inside the ₹100 per-job ceiling", () => {
    const maximumPaise = estimateMaximumStoryDraftCostInrPaise();

    expect(maximumPaise).toBe(42);
    expect(maximumPaise).toBeLessThan(10_000);
  });

  it("rejects provider output that changes the requested language, mode, format, India connection, or source pack", async () => {
    const cases = [
      { label: "language", change: (draft: GeneratedStoryV2): GeneratedStoryV2 => ({ ...draft, language: "hi-IN" }) },
      { label: "mode", change: (draft: GeneratedStoryV2): GeneratedStoryV2 => ({ ...draft, story: { ...draft.story, mode: "timeless" } }) },
      { label: "format", change: (draft: GeneratedStoryV2): GeneratedStoryV2 => ({ ...draft, format: "timeline" }) },
      { label: "India connection", change: (draft: GeneratedStoryV2): GeneratedStoryV2 => ({ ...draft, story: { ...draft.story, indiaConnection: "A different context supplied by the model." } }) },
      { label: "source pack", change: (draft: GeneratedStoryV2): GeneratedStoryV2 => ({ ...draft, sourcePackId: "another-pack" }) }
    ];

    for (const testCase of cases) {
      const changed = testCase.change(structuredClone(modelDraft));
      const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(changed) } }], usage: { cost: 0.00004 } }), { status: 200 }));
      await expect(createStoryDraft({ apiKey: "test-key", input, fetchImpl, budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(new RegExp(testCase.label, "i"));
    }
  });

  it("refuses to make a paid request without an API key", async () => {
    await expect(createStoryDraft({ apiKey: "", input, fetchImpl: vi.fn(), budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(/OPENROUTER_API_KEY/);
  });

  it("names a provider-truncated draft instead of trying to parse it", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        choices: [{ finish_reason: "length", message: { content: "{\"contractVersion\":\"syat.story-draft.v2\"" } }],
        usage: { prompt_tokens: 100, completion_tokens: 8000 }
      }), { status: 200 })
    );

    await expect(createStoryDraft({ apiKey: "test-key", input, fetchImpl, budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(/cut .*short/i);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -0.01])("rejects invalid provider usage cost %s", async (cost) => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: modelContent } }],
      usage: { prompt_tokens: 100, completion_tokens: 200, cost }
    }), { status: 200 }));

    await expect(createStoryDraft({ apiKey: "test-key", input, fetchImpl, budget: { spentPaise: 0, reservedPaise: 0 }, reserveAttempt: vi.fn(acceptedReservation) })).rejects.toThrow(/usage cost/i);
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
        sourceDossier: [{ ...input.sourceDossier[0], evidenceText: "\u0000".repeat(7_000) }]
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
      return new Response(JSON.stringify({ choices: [{ message: { content: modelContent } }], usage: { cost: 0.00004 } }), { status: 200 });
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

  it("rejects a replayed retry receipt before a second paid fetch", async () => {
    const maximum = estimateMaximumStoryDraftCostInrPaise();
    const fetchImpl = vi.fn().mockRejectedValueOnce(new Error("temporary network failure"));
    const reserveAttempt = vi.fn().mockResolvedValue({
      reservationId: "first-receipt",
      reservationPaise: maximum,
      authoritativeTotalPaise: maximum,
      budgetStatus: "allowed" as const
    });

    await expect(createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt,
      maxAttempts: 2
    })).rejects.toThrow(/replayed reservation/i);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(reserveAttempt).toHaveBeenCalledTimes(2);
    expect(reserveAttempt.mock.calls[1][0].previousReservationIds).toEqual(["first-receipt"]);
  });

  it("allows one retry when it receives a distinct second receipt", async () => {
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new Error("temporary network failure"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: modelContent } }], usage: { cost: 0.00004 } }), { status: 200 }));
    const reserveAttempt = vi.fn(acceptedReservation);

    const result = await createStoryDraft({
      apiKey: "test-key",
      input,
      fetchImpl,
      budget: { spentPaise: 0, reservedPaise: 0 },
      reserveAttempt,
      maxAttempts: 2
    });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(result.reservations.map((reservation) => reservation.reservationId)).toEqual(["reservation-1", "reservation-2"]);
    expect(reserveAttempt.mock.calls[1][0].previousReservationIds).toEqual(["reservation-1"]);
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
