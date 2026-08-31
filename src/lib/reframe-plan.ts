import { getTimelessTopic } from "./timeless-topics";

export type ReframeInputKind = "text" | "topic" | "claim" | "question" | "passage";

export type ReframeSlot = {
  id: "documented" | "interpretation" | "unresolved";
  title: string;
  prompt: string;
  editable: true;
};

export type ReframePlan = {
  state: "needs_input" | "ready_for_review";
  original?: string;
  inputKind?: "claim" | "question" | "passage";
  statements?: string[];
  slots?: ReframeSlot[];
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

  return value.normalize("NFKC").replace(/\s+/gu, " ").trim().slice(0, maximumInputLength);
}

export function resolveReframeInitialInput(topic: string | null, claim: string | null): { value: string; kind: ReframeInputKind } {
  const normalizedClaim = normalizeReframeInput(claim);
  if (normalizedClaim) return { value: normalizedClaim, kind: "claim" };

  const catalogueTopic = getTimelessTopic(normalizeReframeInput(topic));
  return catalogueTopic ? { value: catalogueTopic.title, kind: "topic" } : { value: "", kind: "text" };
}

export function classifyReframeInput(value: string): "claim" | "question" | "passage" {
  const subject = normalizeReframeInput(value);
  if (/\?$/.test(subject) || /^(who|what|when|where|why|how|which|does|do|did|is|are|can|could|should|will)\b/i.test(subject)) return "question";
  if (splitReframeStatements(subject).length > 1) return "passage";
  return "claim";
}

export function splitReframeStatements(value: string): string[] {
  const subject = normalizeReframeInput(value);
  if (!subject) return [];
  const statements = subject.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? [subject];
  return statements.map((statement) => statement.trim()).filter(Boolean);
}

function planSlots(kind: "claim" | "question" | "passage", statements: string[]): ReframeSlot[] {
  const focus = kind === "question" ? "the question" : kind === "passage" ? "each statement" : "the claim";
  const statementHint = statements.length > 1 ? ` Keep the ${statements.length} statements separate if they need different evidence.` : "";
  return [
    { id: "documented", title: "Documented", prompt: `Write the exact source, record, or observation that supports ${focus}.${statementHint}`, editable: true },
    { id: "interpretation", title: "Interpretation", prompt: `Write what you infer from ${focus}, and what another careful reader could reasonably read differently.`, editable: true },
    { id: "unresolved", title: "Unresolved", prompt: `Write the missing evidence or lived knowledge that could change how you understand ${focus}.`, editable: true }
  ];
}

export function makeReframePlan(value: string): ReframePlan {
  const subject = normalizeReframeInput(value);
  if (!subject) {
    return { state: "needs_input", steps: [] };
  }

  // A seeded topic or claim is only a starting point. Each submit classifies the
  // current text again, so an edit cannot leave the old label attached.
  const inputKind = classifyReframeInput(subject);
  const statements = splitReframeStatements(subject);
  const subjectType = inputKind === "passage" ? "passage" : inputKind;

  return {
    state: "ready_for_review",
    original: subject,
    inputKind,
    statements,
    slots: planSlots(inputKind, statements),
    steps: [
      { id: "extract", title: "Keep the original close", description: `Read this ${subjectType}: “${subject}”. It is your input, not a verdict.`, sendsOriginalFile: false },
      { id: "separate", title: inputKind === "passage" ? "Keep statements separate" : "Separate what is known from what is read into it", description: inputKind === "passage" ? `This passage has ${statements.length} statement${statements.length === 1 ? "" : "s"}. Give each one its own evidence trail if needed.` : "Do not turn an interpretation or an experience into a documented fact.", sendsOriginalFile: false },
      { id: "trace", title: "Fill only the evidence you can name", description: "Add a source note beside a statement, or leave the gap visible. This workbench does not verify it for you.", sendsOriginalFile: false },
      { id: "question", title: "Ask what could change your view", description: "Name the evidence, context, or lived knowledge that is still missing before asking for a summary.", sendsOriginalFile: false }
    ]
  };
}
