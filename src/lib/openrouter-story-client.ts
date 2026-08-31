import { z } from "zod";

import {
  buildStoryDraftV2Prompt,
  buildStoryDraftProviderJsonSchema,
  parseGeneratedStoryV2Json,
  validateApprovedSourceDossier,
  type GeneratedStoryV2,
  type StoryDraftV2PromptInput
} from "./generation-contract";
import { reviewGeneratedDraft, type DraftReview } from "./draft-review";
import { authoriseGenerationBudget, type GenerationBudgetDecision } from "./generation-budget";

export const OPENROUTER_STORY_MODEL = "deepseek/deepseek-v4-flash-0731";
const STORY_DRAFT_MAX_TOKENS = 6000;
export const MAX_STORY_DRAFT_EDITORIAL_BRIEF_UTF8_BYTES = 4_000;
export const MAX_STORY_DRAFT_INDIA_CONNECTION_UTF8_BYTES = 2_000;
export const MAX_STORY_DRAFT_DOSSIER_UTF8_BYTES = 12_000;
export const MAX_STORY_DRAFT_DOSSIER_RECORD_UTF8_BYTES = 6_000;
export const MAX_STORY_DRAFT_PROMPT_UTF8_BYTES = 48_000;
const STORY_DRAFT_TIMEOUT_MS = 75_000;

// Published model rates in USD per token, captured on 2026-08-31. The conversion deliberately rounds up at ₹100/USD.
const INPUT_USD_PER_TOKEN = 0.000000065;
const OUTPUT_USD_PER_TOKEN = 0.00000018;
const CONSERVATIVE_INR_PER_USD = 100;

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
const utf8 = new TextEncoder();

export type StoryDraftInput = StoryDraftV2PromptInput;

type OpenRouterPayload = {
  choices?: Array<{ finish_reason?: string | null; message?: { content?: string | null } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
  error?: { message?: string };
};

export type StoryDraftResult = {
  draft: GeneratedStoryV2;
  review: DraftReview;
  usage: { promptTokens: number; completionTokens: number };
  reservedMaximumPaise: number;
  actualCostUsd: number;
  reservations: GenerationAttemptReservation[];
};

export type GenerationAttemptReservation = {
  attempt: number;
  estimatedPaise: number;
  localDecision: GenerationBudgetDecision;
  reservationId: string;
  reservationPaise: number;
  authoritativeTotalPaise: number;
  budgetStatus: "allowed" | "warning";
};

export type GenerationReservationRequest = {
  attempt: number;
  estimatedPaise: number;
  localDecision: GenerationBudgetDecision;
  previousReservationIds: string[];
  promptUtf8Bytes: number;
};

const generationReservationAcknowledgementSchema = z
  .object({
    reservationId: z.string().trim().min(1),
    reservationPaise: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    authoritativeTotalPaise: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
    budgetStatus: z.enum(["allowed", "warning"])
  })
  .strict();

export type ReserveStoryAttempt = (request: GenerationReservationRequest) => Promise<unknown>;

export function estimateStoryDraftCostInrPaise(promptTokens: number, completionTokens: number) {
  const usdCost = promptTokens * INPUT_USD_PER_TOKEN + completionTokens * OUTPUT_USD_PER_TOKEN;
  return Math.max(1, Math.ceil(usdCost * CONSERVATIVE_INR_PER_USD * 100));
}

export function estimateMaximumStoryDraftCostInrPaise() {
  // This is a conservative byte-fallback reservation bound, not a provider token count claim.
  return estimateStoryDraftCostInrPaise(MAX_STORY_DRAFT_PROMPT_UTF8_BYTES, STORY_DRAFT_MAX_TOKENS);
}

function inputByteLength(value: unknown, label: string) {
  if (typeof value !== "string") {
    throw new Error(`Story draft input size check requires ${label} to be text.`);
  }
  return utf8.encode(value).byteLength;
}

function assertAtMostBytes(value: unknown, maximum: number, label: string) {
  if (inputByteLength(value, label) > maximum) {
    throw new Error(`Story draft input size exceeds the ${label} limit.`);
  }
}

function assertStoryDraftInputSize(input: StoryDraftInput) {
  assertAtMostBytes(input.editorialBrief, MAX_STORY_DRAFT_EDITORIAL_BRIEF_UTF8_BYTES, "editorial brief");
  assertAtMostBytes(input.indiaConnection, MAX_STORY_DRAFT_INDIA_CONNECTION_UTF8_BYTES, "India connection");

  for (const source of input.sourceDossier) {
    assertAtMostBytes(JSON.stringify(source), MAX_STORY_DRAFT_DOSSIER_RECORD_UTF8_BYTES, "source dossier record");
  }
  assertAtMostBytes(JSON.stringify(input.sourceDossier), MAX_STORY_DRAFT_DOSSIER_UTF8_BYTES, "source dossier");
}

function assertStoryDraftPromptSize(prompt: string) {
  assertAtMostBytes(prompt, MAX_STORY_DRAFT_PROMPT_UTF8_BYTES, "prompt");
}

function getMaxAttempts(maxAttempts: number | undefined) {
  if (maxAttempts === undefined) return 1;
  if (maxAttempts === 1 || maxAttempts === 2) return maxAttempts;
  throw new Error("Story draft generation allows one request and at most one bounded retry.");
}

function budgetRefusalMessage(decision: GenerationBudgetDecision) {
  return `Story draft generation budget refused: ${decision.reason}.`;
}

export async function createStoryDraft({
  apiKey,
  input,
  fetchImpl = fetch,
  budget,
  reserveAttempt,
  maxAttempts,
  promptBuilder = buildStoryDraftV2Prompt
}: {
  apiKey: string;
  input: StoryDraftInput;
  fetchImpl?: FetchLike;
  budget: { spentPaise: number; reservedPaise: number };
  reserveAttempt: ReserveStoryAttempt;
  maxAttempts?: number;
  promptBuilder?: typeof buildStoryDraftV2Prompt;
}): Promise<StoryDraftResult> {
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required to generate a story draft.");
  }

  // Validate independently of the prompt builder so a test or future adapter cannot skip this gate.
  validateApprovedSourceDossier(input.sourceDossier);
  assertStoryDraftInputSize(input);

  if (typeof reserveAttempt !== "function") {
    throw new Error("A shared durable reservation is required before a story draft can be generated.");
  }

  const maximumEstimatePaise = estimateMaximumStoryDraftCostInrPaise();
  const firstDecision = authoriseGenerationBudget({
    spentPaise: budget.spentPaise,
    reservedPaise: budget.reservedPaise,
    estimatedPaise: maximumEstimatePaise
  });
  if (firstDecision.status === "refused") {
    throw new Error(budgetRefusalMessage(firstDecision));
  }

  const prompt = promptBuilder(input);
  assertStoryDraftPromptSize(prompt);
  const attempts = getMaxAttempts(maxAttempts);
  const reservations: GenerationAttemptReservation[] = [];
  let reservedByThisJobPaise = 0;
  let response: Response | undefined;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const decision = authoriseGenerationBudget({
      spentPaise: budget.spentPaise,
      reservedPaise: budget.reservedPaise + reservedByThisJobPaise,
      estimatedPaise: maximumEstimatePaise
    });
    if (decision.status === "refused") {
      throw new Error(budgetRefusalMessage(decision));
    }

    const reservationRequest: GenerationReservationRequest = {
      attempt,
      estimatedPaise: maximumEstimatePaise,
      localDecision: decision,
      previousReservationIds: reservations.map((reservation) => reservation.reservationId),
      promptUtf8Bytes: inputByteLength(prompt, "prompt")
    };

    let acknowledgement: z.infer<typeof generationReservationAcknowledgementSchema>;
    try {
      acknowledgement = generationReservationAcknowledgementSchema.parse(await reserveAttempt(reservationRequest));
    } catch {
      throw new Error("Shared reservation acknowledgement was unavailable or malformed; no paid request was made.");
    }

    if (reservationRequest.previousReservationIds.includes(acknowledgement.reservationId)) {
      throw new Error("Shared reservation acknowledgement used a replayed reservation receipt; no paid request was made.");
    }

    if (
      acknowledgement.reservationPaise !== maximumEstimatePaise ||
      acknowledgement.authoritativeTotalPaise < acknowledgement.reservationPaise ||
      acknowledgement.authoritativeTotalPaise >= 140_000 ||
      (acknowledgement.budgetStatus === "allowed" && acknowledgement.authoritativeTotalPaise >= 100_000) ||
      (acknowledgement.budgetStatus === "warning" && acknowledgement.authoritativeTotalPaise < 100_000)
    ) {
      throw new Error("Shared reservation acknowledgement did not match the permitted budget; no paid request was made.");
    }

    const reservation: GenerationAttemptReservation = {
      ...reservationRequest,
      ...acknowledgement
    };
    reservations.push(reservation);
    reservedByThisJobPaise += maximumEstimatePaise;

    const signal = AbortSignal.timeout(STORY_DRAFT_TIMEOUT_MS);
    try {
      response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal,
        body: JSON.stringify({
          model: OPENROUTER_STORY_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.15,
          max_tokens: STORY_DRAFT_MAX_TOKENS,
          stream: false,
          reasoning: { effort: "none", exclude: true },
          provider: {
            require_parameters: true,
            sort: "throughput",
            data_collection: "deny",
            max_price: { prompt: 0.1, completion: 0.2 }
          },
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "syat_story_draft",
              strict: true,
              schema: buildStoryDraftProviderJsonSchema(input)
            }
          }
        })
      });
      break;
    } catch (error) {
      if (signal.aborted) {
        throw new Error(`OpenRouter did not return a draft within ${STORY_DRAFT_TIMEOUT_MS / 1000} seconds. The job can be retried from the private review queue.`);
      }
      if (attempt === attempts) throw error;
    }
  }

  if (!response) {
    throw new Error("OpenRouter did not return a story draft response.");
  }

  const payload = (await response.json()) as OpenRouterPayload;
  if (!response.ok) {
    throw new Error(`OpenRouter story draft failed: ${payload.error?.message ?? response.statusText}`);
  }

  const choice = payload.choices?.[0];
  if (choice?.finish_reason === "length") {
    throw new Error("OpenRouter cut the story draft short before it reached the strict review parser.");
  }

  const content = choice?.message?.content;
  if (typeof content !== "string") {
    throw new Error("OpenRouter returned no draft content.");
  }

  const promptTokens = Number.isSafeInteger(payload.usage?.prompt_tokens) && (payload.usage?.prompt_tokens ?? 0) >= 0 ? payload.usage?.prompt_tokens ?? 0 : 0;
  const completionTokens = Number.isSafeInteger(payload.usage?.completion_tokens) && (payload.usage?.completion_tokens ?? 0) >= 0 ? payload.usage?.completion_tokens ?? 0 : 0;
  const actualCostUsd = payload.usage?.cost;
  if (typeof actualCostUsd !== "number" || !Number.isFinite(actualCostUsd) || actualCostUsd < 0) {
    throw new Error("OpenRouter returned an invalid or missing usage cost; the reservation cannot be reconciled safely.");
  }

  const draft = parseGeneratedStoryV2Json(content, input.sourceDossier, {
    sourcePackId: input.sourcePackId,
    language: input.language,
    mode: input.mode,
    format: input.format,
    indiaConnection: input.indiaConnection
  });
  return {
    draft,
    review: reviewGeneratedDraft(draft, input.sourceDossier, { indiaConnection: input.indiaConnection }),
    usage: { promptTokens, completionTokens },
    // This is the reserved maximum, not a bill or trusted provider-reported actual cost.
    reservedMaximumPaise: maximumEstimatePaise,
    actualCostUsd,
    reservations
  };
}
