import { z } from "zod";

import {
  buildStoryDraftPrompt,
  generatedStoryResponseSchema,
  parseGeneratedStoryJson,
  type GeneratedStory,
  type SourceDossierRecord
} from "./generation-contract";

export const OPENROUTER_STORY_MODEL = "deepseek/deepseek-v4-flash-0731";

// Published model rates in USD per token, captured on 2026-08-31. The conversion deliberately rounds up at ₹100/USD.
const INPUT_USD_PER_TOKEN = 0.000000065;
const OUTPUT_USD_PER_TOKEN = 0.00000018;
const CONSERVATIVE_INR_PER_USD = 100;

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type StoryDraftInput = {
  language: "en-IN" | "hi-IN";
  mode: "news" | "timeless";
  editorialBrief: string;
  sourceDossier: SourceDossierRecord[];
};

type OpenRouterPayload = {
  choices?: Array<{ message?: { content?: string | null } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: { message?: string };
};

export type StoryDraftResult = {
  draft: GeneratedStory;
  usage: { promptTokens: number; completionTokens: number };
  estimatedCostInrPaise: number;
};

export function estimateStoryDraftCostInrPaise(promptTokens: number, completionTokens: number) {
  const usdCost = promptTokens * INPUT_USD_PER_TOKEN + completionTokens * OUTPUT_USD_PER_TOKEN;
  return Math.max(1, Math.ceil(usdCost * CONSERVATIVE_INR_PER_USD * 100));
}

export async function createStoryDraft({
  apiKey,
  input,
  fetchImpl = fetch
}: {
  apiKey: string;
  input: StoryDraftInput;
  fetchImpl?: FetchLike;
}): Promise<StoryDraftResult> {
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required to generate a story draft.");
  }

  const prompt = buildStoryDraftPrompt(input);
  const response = await fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENROUTER_STORY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.15,
      max_tokens: 3500,
      stream: false,
      provider: { require_parameters: true },
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "syat_story_draft",
          strict: true,
          schema: z.toJSONSchema(generatedStoryResponseSchema)
        }
      }
    })
  });

  const payload = (await response.json()) as OpenRouterPayload;
  if (!response.ok) {
    throw new Error(`OpenRouter story draft failed: ${payload.error?.message ?? response.statusText}`);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("OpenRouter returned no draft content.");
  }

  const promptTokens = payload.usage?.prompt_tokens ?? 0;
  const completionTokens = payload.usage?.completion_tokens ?? 0;

  return {
    draft: parseGeneratedStoryJson(content, input.sourceDossier),
    usage: { promptTokens, completionTokens },
    estimatedCostInrPaise: estimateStoryDraftCostInrPaise(promptTokens, completionTokens)
  };
}
