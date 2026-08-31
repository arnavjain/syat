export type ModerationDecision = "needs_source_pack" | "held" | "rejected" | "source_pack_ready";

export type ModerationRecord = {
  decision: ModerationDecision;
  note: string;
  updatedAt: string;
};

export type ModerationSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  sourceClass: "official_public_record" | "newsroom_rss";
  isSensitive?: boolean;
};

export type ModerationItem = ModerationSource & ModerationRecord & {
  publicationAllowed: false;
};

export type ReviewDecisionEvent = {
  targetId: string;
  decision: ModerationDecision;
  note: string;
  checklist: {
    openedOriginalLink: boolean;
    keptLinkOnly: boolean;
    namedNextNeed: boolean;
  };
  occurredAt: string;
  publicationAllowed: false;
};

export type ReviewDecisionInput = Omit<ReviewDecisionEvent, "publicationAllowed" | "decision"> & {
  decision: ModerationDecision | string;
};

const allowedDecisions = new Set<ModerationDecision>(["needs_source_pack", "held", "rejected", "source_pack_ready"]);

function hasCompleteChecklist(checklist: ReviewDecisionEvent["checklist"]) {
  return checklist.openedOriginalLink && checklist.keptLinkOnly && checklist.namedNextNeed;
}

export function applyReviewDecision(input: ReviewDecisionInput): { ok: true; event: ReviewDecisionEvent } | { ok: false; reason: string } {
  if (!allowedDecisions.has(input.decision as ModerationDecision)) return { ok: false, reason: "unsupported editorial decision" };
  if (input.decision === "source_pack_ready" && (!hasCompleteChecklist(input.checklist) || !input.note.trim())) {
    return { ok: false, reason: "source-pack-ready requires a complete checklist and next-step note" };
  }

  return {
    ok: true,
    event: {
      targetId: input.targetId,
      decision: input.decision as ModerationDecision,
      note: input.note,
      checklist: input.checklist,
      occurredAt: input.occurredAt,
      publicationAllowed: false
    }
  };
}

export function projectReviewEvents(targetId: string, events: readonly ReviewDecisionEvent[]): ModerationRecord & { publicationAllowed: false } {
  const latest = events.filter((event) => event.targetId === targetId).sort((first, second) => second.occurredAt.localeCompare(first.occurredAt))[0];
  if (!latest) return { ...defaultRecord, publicationAllowed: false };
  const invalidReady = latest.decision === "source_pack_ready" && (!hasCompleteChecklist(latest.checklist) || !latest.note.trim());

  return {
    decision: invalidReady ? "needs_source_pack" : latest.decision,
    note: latest.note,
    updatedAt: latest.occurredAt,
    publicationAllowed: false
  };
}

export type ReviewFilter = "all" | ModerationDecision | "sensitive";

const defaultRecord: ModerationRecord = {
  decision: "needs_source_pack",
  note: "",
  updatedAt: ""
};

export function mergeReviewRecords(sources: ModerationSource[], records: Record<string, ModerationRecord>): ModerationItem[] {
  return sources.map((source) => ({
    ...source,
    ...(records[source.id] ?? defaultRecord),
    publicationAllowed: false
  }));
}

export function getReviewSummary(items: ModerationItem[]) {
  return items.reduce<Record<ModerationDecision, number>>((summary, item) => {
    summary[item.decision] += 1;
    return summary;
  }, { needs_source_pack: 0, held: 0, rejected: 0, source_pack_ready: 0 });
}

export function filterReviewItems(items: ModerationItem[], filter: ReviewFilter) {
  if (filter === "all") return items;
  if (filter === "sensitive") return items.filter((item) => item.isSensitive);
  return items.filter((item) => item.decision === filter);
}
