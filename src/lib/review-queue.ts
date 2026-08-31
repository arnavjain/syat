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
