export type ReframeInputKind = "text" | "link" | "document";

export type ReframePlan = {
  state: "needs_input" | "ready_for_review";
  steps: Array<{
    id: "extract" | "separate" | "trace" | "question";
    title: string;
    description: string;
    sendsOriginalFile: false;
  }>;
};

export function makeReframePlan(value: string, kind: ReframeInputKind = "text"): ReframePlan {
  if (!value.trim()) {
    return { state: "needs_input", steps: [] };
  }

  const subject = kind === "link" ? "the linked page text you approve" : kind === "document" ? "the text you extract and approve" : "the text you paste";

  return {
    state: "ready_for_review",
    steps: [
      { id: "extract", title: "Keep the original close", description: `Read ${subject} without treating it as a verdict.`, sendsOriginalFile: false },
      { id: "separate", title: "Separate kinds of statements", description: "Mark what is documented, interpreted, experienced, valued, and still unresolved.", sendsOriginalFile: false },
      { id: "trace", title: "Trace the source trail", description: "List the exact sources a claim depends on; a missing source stays visible.", sendsOriginalFile: false },
      { id: "question", title: "Ask what would change the view", description: "Name the strongest unanswered question before asking for a summary.", sendsOriginalFile: false }
    ]
  };
}
