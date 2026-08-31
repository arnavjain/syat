import { describe, expect, it } from "vitest";

import { filterReviewItems, getReviewSummary, mergeReviewRecords, type ModerationRecord, type ModerationSource } from "./review-queue";

const sources: ModerationSource[] = [
  { id: "signal-a", title: "A source signal", publisher: "Newsroom A", url: "https://example.invalid/a", publishedAt: "2026-08-31T08:00:00.000Z", sourceClass: "newsroom_rss" },
  { id: "signal-b", title: "A sensitive source signal", publisher: "Newsroom B", url: "https://example.invalid/b", publishedAt: "2026-08-30T08:00:00.000Z", sourceClass: "official_public_record", isSensitive: true }
];

describe("review queue state", () => {
  it("starts every source signal in the source-pack queue", () => {
    const items = mergeReviewRecords(sources, {});

    expect(items.map((item) => item.decision)).toEqual(["needs_source_pack", "needs_source_pack"]);
    expect(getReviewSummary(items)).toMatchObject({ needs_source_pack: 2, held: 0, rejected: 0, source_pack_ready: 0 });
  });

  it("keeps a local decision and note attached to the matching source", () => {
    const records: Record<string, ModerationRecord> = {
      "signal-b": { decision: "held", note: "Need primary document before drafting.", updatedAt: "2026-08-31T09:00:00.000Z" }
    };

    const items = mergeReviewRecords(sources, records);

    expect(items[1]).toMatchObject({ decision: "held", note: "Need primary document before drafting." });
    expect(filterReviewItems(items, "held")).toHaveLength(1);
    expect(filterReviewItems(items, "sensitive")).toHaveLength(1);
  });

  it("does not treat source-pack readiness as approval or publication", () => {
    const items = mergeReviewRecords(sources, {
      "signal-a": { decision: "source_pack_ready", note: "", updatedAt: "2026-08-31T09:00:00.000Z" }
    });

    expect(items[0].publicationAllowed).toBe(false);
  });
});
