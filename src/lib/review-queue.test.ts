import { describe, expect, it } from "vitest";

import { applyReviewDecision, filterReviewItems, getReviewSummary, mergeReviewRecords, projectReviewEvents, type ModerationRecord, type ModerationSource } from "./review-queue";

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

  it("accepts only private source-research steps and never creates approval or publication state", () => {
    const held = applyReviewDecision({
      targetId: "signal-a",
      decision: "held",
      note: "Find the original order before research continues.",
      checklist: { openedOriginalLink: false, keptLinkOnly: false, namedNextNeed: false },
      occurredAt: "2026-08-31T10:00:00.000Z"
    });
    const rejected = applyReviewDecision({
      targetId: "signal-a",
      decision: "rejected",
      note: "Not useful for this private research queue.",
      checklist: { openedOriginalLink: false, keptLinkOnly: false, namedNextNeed: false },
      occurredAt: "2026-08-31T10:01:00.000Z"
    });
    const unsupported = applyReviewDecision({
      targetId: "signal-a",
      decision: "published" as never,
      note: "Attempting an unsupported state.",
      checklist: { openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: true },
      occurredAt: "2026-08-31T10:02:00.000Z"
    });

    expect(held.ok).toBe(true);
    expect(rejected.ok).toBe(true);
    expect(unsupported).toEqual({ ok: false, reason: "unsupported editorial decision" });
    expect(held.ok && held.event.publicationAllowed).toBe(false);
    expect(rejected.ok && rejected.event.publicationAllowed).toBe(false);
  });

  it("rejects an incomplete source-pack-ready event and projects an invalid stored ready event back to needs-source-pack", () => {
    const incomplete = applyReviewDecision({
      targetId: "signal-a",
      decision: "source_pack_ready",
      note: "",
      checklist: { openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: false },
      occurredAt: "2026-08-31T10:00:00.000Z"
    });

    expect(incomplete).toEqual({ ok: false, reason: "source-pack-ready requires a complete checklist and next-step note" });

    const projected = projectReviewEvents("signal-a", [{
      targetId: "signal-a",
      decision: "source_pack_ready",
      note: "   ",
      checklist: { openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: true },
      occurredAt: "2026-08-31T10:00:00.000Z",
      publicationAllowed: false
    }]);

    expect(projected).toMatchObject({ decision: "needs_source_pack", publicationAllowed: false });
  });
});
