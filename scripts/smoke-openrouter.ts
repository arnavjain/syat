import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { type StoryDraftV2PromptInput } from "../src/lib/generation-contract";
import { createStoryDraft, type GenerationReservationRequest, type ReserveStoryAttempt } from "../src/lib/openrouter-story-client";

export function buildSmokeInput(): StoryDraftV2PromptInput {
  return {
    sourcePackId: "fictional-shared-garden",
    language: "en-IN",
    mode: "news",
    format: "news_brief",
    editorialBrief: "Create a non-published teaching draft only. The sole source is fictional, and every statement must stay within its text. Keep mediaPlan empty.",
    indiaConnection: "This fictional teaching fixture is an Indian neighbourhood context, not a report about a real event.",
    sourceRoles: [{ sourceId: "teaching-note", role: "A fictional, explicitly licensed teaching record used only to verify the private generation path." }],
    missingVoices: ["Independent observation", "People who use the shared garden"],
    sourceDossier: [{
      id: "teaching-note",
      publisherId: "syat-teaching-desk",
      publisher: "Syāt teaching desk",
      title: "Fictional note about a shared garden",
      url: "https://example.invalid/syat-teaching-note",
      sourceKind: "reputable_reporting",
      publishedAt: "2026-08-31T06:00:00.000Z",
      accessedAt: "2026-08-31T06:00:00.000Z",
      evidenceText: "A fictional neighbourhood note says that a shared garden is planned to open on 1 September 2026 in an Indian city. The note names volunteers, local residents, and a city maintenance team as participants. It does not measure outcomes, record independent observation, or claim agreement among the people named.",
      linkAllowed: true,
      modelInputAllowed: true,
      mediaReuseAllowed: false,
      rightsBasis: "explicit_licence",
      policyUrl: "https://example.invalid/syat-teaching-fixture-licence",
      reviewedAt: "2026-08-31T06:00:00.000Z",
      creditLine: "Fictional source: Syāt teaching desk"
    }]
  };
}

export function makeNonDurableSmokeReservation(): ReserveStoryAttempt {
  return async (request: GenerationReservationRequest) => {
    if (request.localDecision.status === "refused" || request.localDecision.authorisedTotalPaise === null) {
      throw new Error("The local smoke budget refused this non-durable test reservation.");
    }
    return {
      reservationId: `non-durable-${randomUUID()}`,
      reservationPaise: request.estimatedPaise,
      authoritativeTotalPaise: request.localDecision.authorisedTotalPaise,
      budgetStatus: request.localDecision.status
    };
  };
}

async function main() {
  if (process.env.SYAT_ALLOW_PAID_SMOKE !== "yes") {
    throw new Error("Paid smoke is disabled. Set SYAT_ALLOW_PAID_SMOKE=yes only for an intentional one-off check.");
  }
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set in the private environment.");

  console.log("Paid smoke uses a non-durable in-memory reservation; do not use it for batch generation.");
  const result = await createStoryDraft({
    apiKey,
    input: buildSmokeInput(),
    budget: { spentPaise: 0, reservedPaise: 0 },
    reserveAttempt: makeNonDurableSmokeReservation(),
    maxAttempts: 1
  });

  console.log(JSON.stringify({
    status: result.draft.editorialStatus,
    reviewStatus: result.review.status,
    reviewFindings: result.review.findings.map((finding) => finding.code),
    promptTokens: result.usage.promptTokens,
    completionTokens: result.usage.completionTokens,
    reservedMaximumPaise: result.reservedMaximumPaise,
    actualCostUsd: result.actualCostUsd,
    reservation: "non-durable in-memory"
  }, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Paid smoke failed safely.");
    process.exitCode = 1;
  });
}
