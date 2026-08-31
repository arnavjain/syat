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

export type StoredReviewEvent = {
  targetId: string;
  action: "commented";
  afterState: string;
  beforeState: string;
  note: string;
  createdAt: string;
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

function readExactChecklist(value: string) {
  try {
    const parsed = JSON.parse(value) as { contract?: unknown; checklist?: Partial<ReviewDecisionEvent["checklist"]> };
    if (parsed.contract !== "syat.review-event.v1" || !parsed.checklist) return null;
    const { openedOriginalLink, keptLinkOnly, namedNextNeed } = parsed.checklist;
    if (typeof openedOriginalLink !== "boolean" || typeof keptLinkOnly !== "boolean" || typeof namedNextNeed !== "boolean") return null;
    return { openedOriginalLink, keptLinkOnly, namedNextNeed };
  } catch {
    return null;
  }
}

export function encodeReviewEventForStorage(event: ReviewDecisionEvent): StoredReviewEvent {
  return {
    targetId: event.targetId,
    action: "commented",
    afterState: event.decision,
    beforeState: JSON.stringify({ contract: "syat.review-event.v1", checklist: event.checklist }),
    note: event.note,
    createdAt: event.occurredAt
  };
}

function decodeStoredReviewEvent(event: StoredReviewEvent): ReviewDecisionEvent | null {
  if (!allowedDecisions.has(event.afterState as ModerationDecision)) return null;
  const checklist = readExactChecklist(event.beforeState);
  if (!checklist && event.afterState !== "source_pack_ready") return null;

  return {
    targetId: event.targetId,
    decision: event.afterState as ModerationDecision,
    note: event.note,
    checklist: checklist ?? { openedOriginalLink: false, keptLinkOnly: false, namedNextNeed: false },
    occurredAt: event.createdAt,
    publicationAllowed: false
  };
}

export function projectStoredReviewEvents(targetId: string, events: readonly StoredReviewEvent[]): ModerationRecord & { publicationAllowed: false } {
  return projectReviewEvents(targetId, events.flatMap((event) => {
    const decoded = decodeStoredReviewEvent(event);
    return decoded ? [decoded] : [];
  }));
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
