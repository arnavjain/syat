import { getTimelessTopic } from "./timeless-topics";

export type ReframeInputKind = "text" | "topic" | "claim";

export type ReframePlan = {
  state: "needs_input" | "ready_for_review";
  steps: Array<{
    id: "extract" | "separate" | "trace" | "question";
    title: string;
    description: string;
    sendsOriginalFile: false;
  }>;
};

const maximumInputLength = 320;

export function normalizeReframeInput(value: string | null | undefined): string {
  if (!value) return "";

  let decoded = value;
  try {
    decoded = decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    // Keep malformed input as text instead of rejecting or misrepresenting it.
  }

  return decoded.normalize("NFKC").replace(/\s+/gu, " ").trim().slice(0, maximumInputLength);
}

export function resolveReframeInitialInput(topic: string | null, claim: string | null): { value: string; kind: ReframeInputKind } {
  const normalizedClaim = normalizeReframeInput(claim);
  if (normalizedClaim) return { value: normalizedClaim, kind: "claim" };

  const catalogueTopic = getTimelessTopic(normalizeReframeInput(topic));
  return catalogueTopic ? { value: catalogueTopic.title, kind: "topic" } : { value: "", kind: "text" };
}

export function makeReframePlan(value: string, kind: ReframeInputKind = "text"): ReframePlan {
  const subject = normalizeReframeInput(value);
  if (!subject) {
    return { state: "needs_input", steps: [] };
  }

  const subjectType = kind === "topic" ? "question" : kind === "claim" ? "claim" : "text";

  return {
    state: "ready_for_review",
    steps: [
      { id: "extract", title: "Keep the original close", description: `Read this ${subjectType}: “${subject}”. It is a starting point, not a verdict.`, sendsOriginalFile: false },
      { id: "separate", title: "Separate kinds of statements", description: `For “${subject}”, mark what is documented, interpreted, experienced, valued, and still unresolved.`, sendsOriginalFile: false },
      { id: "trace", title: "Trace the source trail", description: `For “${subject}”, list the exact sources a claim depends on; a missing source stays visible.`, sendsOriginalFile: false },
      { id: "question", title: "Ask what would change the view", description: `Ask what evidence could change how you read “${subject}” before asking for a summary.`, sendsOriginalFile: false }
    ]
  };
}
