export const PROPOSAL_STORAGE_KEY = "syat:proposals:v1";
export const MAXIMUM_QUESTION_LENGTH = 160;
export const MAXIMUM_REASON_LENGTH = 600;

export type TopicProposal = {
  question: string;
  reason: string;
  theme: string;
  proposedAt: string;
};

export type ProposalResult = { ok: true; proposal: TopicProposal } | { ok: false; reason: string };

/**
 * Validates a reader's proposed question.
 *
 * Proposals are held on the reader's own device and never published automatically. Nothing
 * here triggers a model call, so no visitor can run up a bill or place unreviewed text about
 * a real person onto a public page.
 */
export function validateProposal(input: { question: string; reason: string; theme: string }, now = new Date()): ProposalResult {
  const question = input.question.trim().replace(/\s+/g, " ");
  const reason = input.reason.trim().replace(/\s+/g, " ");
  const theme = input.theme.trim();

  if (question.length < 12) return { ok: false, reason: "A question needs a little more than that. Say what keeps opening." };
  if (question.length > MAXIMUM_QUESTION_LENGTH) return { ok: false, reason: `Keep the question under ${MAXIMUM_QUESTION_LENGTH} characters. The detail belongs below.` };
  if (!question.includes("?")) return { ok: false, reason: "Write it as a question, ending with a question mark." };
  if (reason.length > MAXIMUM_REASON_LENGTH) return { ok: false, reason: `Keep the note under ${MAXIMUM_REASON_LENGTH} characters.` };
  if (!theme) return { ok: false, reason: "Choose the theme it belongs closest to." };

  return { ok: true, proposal: { question, reason, theme, proposedAt: now.toISOString() } };
}

type BrowserStorage = Pick<Storage, "getItem" | "setItem">;

export function readProposals(storage: BrowserStorage | null | undefined): TopicProposal[] {
  try {
    const raw = storage?.getItem(PROPOSAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TopicProposal[]).filter((item) => typeof item?.question === "string") : [];
  } catch {
    return [];
  }
}

export function saveProposal(storage: BrowserStorage | null | undefined, proposal: TopicProposal): boolean {
  try {
    const existing = readProposals(storage);
    // Keep the list short: this is a personal note, not a database.
    storage?.setItem(PROPOSAL_STORAGE_KEY, JSON.stringify([proposal, ...existing].slice(0, 20)));
    return Boolean(storage);
  } catch {
    return false;
  }
}
