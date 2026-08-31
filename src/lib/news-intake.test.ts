import { describe, expect, it } from "vitest";
import * as newsIntake from "./news-intake";
import * as moderationQueue from "../components/moderation-queue";

import { capItemsPerFeed, filterRecentItems, parseRssItems, selectBalancedItems, type NewsIntakeItem, type RssFeed } from "./news-intake";

const feed = {
  id: "example-world",
  publisher: "Example News",
  url: "https://example.test/feed.xml",
  editorialScope: "india_first",
  sourceClass: "newsroom_rss"
} satisfies RssFeed;

describe("RSS intake", () => {
  it("takes metadata only from RSS entries and keeps the originating source link", () => {
    const items = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title><![CDATA[ A careful headline ]]></title><link>https://example.test/story</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item></channel></rss>`, feed, new Date("2026-08-31T12:00:00Z"));

    expect(items).toEqual([expect.objectContaining({ title: "A careful headline", url: "https://example.test/story", publisher: "Example News", editorialScope: "india_first", sourceClass: "newsroom_rss", status: "needs_editorial_review", rights: "link_only" })]);
  });

  it("decodes numeric and named HTML entities in visible RSS metadata without changing its publisher", () => {
    const items = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Editors &#8216;ask&#8217;: tea &amp; coffee</title><link>https://example.test/entities</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item></channel></rss>`, feed, new Date("2026-08-31T12:00:00Z"));

    expect(items).toEqual([expect.objectContaining({ title: "Editors ‘ask’: tea & coffee", publisher: "Example News" })]);
  });

  it("drops old or undated entries before a seven-day review queue is written", () => {
    const items = [
      { title: "New", url: "https://example.test/new", publishedAt: "2026-08-30T08:00:00.000Z" },
      { title: "Old", url: "https://example.test/old", publishedAt: "2026-08-10T08:00:00.000Z" }
    ];

    expect(filterRecentItems(items, new Date("2026-08-31T12:00:00Z"), 7)).toHaveLength(1);
  });

  it("keeps a review queue from being dominated by one feed", () => {
    const sourceA = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Feed A one</title><link>https://example.test/a-1</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item><item><title>Feed A two</title><link>https://example.test/a-2</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item><item><title>Feed A three</title><link>https://example.test/a-3</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item></channel></rss>`, feed);
    const sourceB = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Feed B</title><link>https://example.test/b</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item></channel></rss>`, { ...feed, id: "example-b", url: "https://example.test/b.xml" });

    expect(capItemsPerFeed([...sourceA, ...sourceB], 2)).toHaveLength(3);
  });

  it("takes turns across feeds before it fills a fixed-size review queue", () => {
    const sourceA = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Feed A newest</title><link>https://example.test/a-1</link><pubDate>Sun, 30 Aug 2026 10:00:00 GMT</pubDate></item><item><title>Feed A next</title><link>https://example.test/a-2</link><pubDate>Sun, 30 Aug 2026 09:00:00 GMT</pubDate></item></channel></rss>`, feed);
    const sourceB = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Feed B newest</title><link>https://example.test/b-1</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item><item><title>Feed B next</title><link>https://example.test/b-2</link><pubDate>Sun, 30 Aug 2026 07:00:00 GMT</pubDate></item></channel></rss>`, { ...feed, id: "example-b", publisher: "Another News", url: "https://example.test/b.xml" });

    expect(selectBalancedItems([...sourceA, ...sourceB], 2, 3).map((item) => item.title)).toEqual(["Feed A newest", "Feed B newest", "Feed A next"]);
  });

  it("caps a publisher even when it has several busy feeds", () => {
    const items = [
      signal("express-india-1", "The Indian Express", "https://example.test/express-india", "2026-08-31T10:00:00.000Z"),
      signal("express-cities-1", "The Indian Express", "https://example.test/express-cities", "2026-08-31T09:00:00.000Z"),
      signal("express-business-1", "The Indian Express", "https://example.test/express-business", "2026-08-31T08:00:00.000Z"),
      signal("express-india-2", "The Indian Express", "https://example.test/express-india", "2026-08-31T07:00:00.000Z"),
      signal("hindu-1", "The Hindu", "https://example.test/hindu", "2026-08-31T06:00:00.000Z"),
      signal("mongabay-1", "Mongabay India", "https://example.test/mongabay", "2026-08-31T05:00:00.000Z")
    ];

    const selected = selectBalancedItems(items, 2, 6);

    expect(selected.filter((item) => item.publisher === "The Indian Express")).toHaveLength(2);
    expect(selected).toHaveLength(4);
  });

  it("rotates a publisher's available feeds before taking a second item from one feed", () => {
    const items = [
      signal("express-india-1", "The Indian Express", "https://example.test/express-india", "2026-08-31T10:00:00.000Z"),
      signal("express-india-2", "The Indian Express", "https://example.test/express-india", "2026-08-31T09:00:00.000Z"),
      signal("express-cities-1", "The Indian Express", "https://example.test/express-cities", "2026-08-31T08:00:00.000Z"),
      signal("hindu-1", "The Hindu", "https://example.test/hindu", "2026-08-31T07:00:00.000Z")
    ];

    const selected = selectBalancedItems(items, 3, 4);

    expect(selected.filter((item) => item.publisher === "The Indian Express").map((item) => item.sourceFeed)).toEqual([
      "https://example.test/express-india",
      "https://example.test/express-cities",
      "https://example.test/express-india"
    ]);
  });

  it("rejects malformed, stale, duplicate, over-cap, and incomplete intake candidates", () => {
    const api = newsIntake as unknown as IntakeValidationApi;
    const now = new Date("2026-08-31T12:00:00.000Z");
    const valid = intakeDocument([
      signal("a-1", "Publisher A", "https://example.test/a", "2026-08-31T10:00:00.000Z"),
      signal("a-2", "Publisher A", "https://example.test/a", "2026-08-31T09:00:00.000Z"),
      signal("b-1", "Publisher B", "https://example.test/b", "2026-08-31T08:00:00.000Z")
    ]);

    expect(api.validateIntakeDocument(valid, now)).toEqual([]);
    expect(api.validateIntakeDocument({ ...valid, itemCount: 4 }, now)).toContain("item count does not match items");
    expect(api.validateIntakeDocument({ ...valid, items: [...valid.items, { ...valid.items[0]!, id: "same-url" }] }, now)).toContain("duplicate source URL");
    expect(api.validateIntakeDocument({ ...valid, items: [valid.items[0]!, { ...valid.items[1]!, id: "same-title", title: valid.items[0]!.title, url: "https://example.test/different-url" }] }, now)).toContain("duplicate source title");
    expect(api.validateIntakeDocument({ ...valid, items: [{ ...valid.items[0]!, publishedAt: "not-a-date" }] }, now)).toContain("invalid published date");
    expect(api.validateIntakeDocument({ ...valid, items: [valid.items[0]!, valid.items[1]!, { ...valid.items[0]!, id: "a-3", url: "https://example.test/a-3" }] }, now)).toContain("publisher cap exceeded");
    expect(api.validateIntakeDocument({ ...valid, items: [{ ...valid.items[0]!, status: "published" as never, rights: undefined as never }] }, now)).toContain("item must remain review-only and link-only");
    expect(api.validateIntakeDocument({ ...valid, itemCount: 1, items: [{ ...valid.items[0]!, editorialScope: "not-india-first" as never, sourceClass: "arbitrary" as never, note: "   " }] }, now)).toEqual(expect.arrayContaining([
      "invalid editorial scope",
      "invalid source class",
      "item note is required"
    ]));
    expect(api.isIntakeSnapshotCurrent({ generatedAt: "2026-08-20T12:00:00.000Z", windowDays: 7 }, now)).toBe(false);
  });

  it("refuses to replace a last-good queue after a partial collector result", () => {
    const api = newsIntake as unknown as IntakeValidationApi;
    const candidate = intakeDocument([
      signal("a-1", "Publisher A", "https://example.test/a", "2026-08-31T10:00:00.000Z")
    ]);

    expect(api.canReplaceLastGoodIntake(candidate, ["feed-a", "feed-b"], ["feed-a"], new Date("2026-08-31T12:00:00.000Z"))).toBe(false);
    expect(api.canReplaceLastGoodIntake(candidate, ["feed-a"], ["feed-a"], new Date("2026-08-31T12:00:00.000Z"))).toBe(true);
  });

  it("requires every local source-pack check before marking a pack ready", () => {
    const api = newsIntake as unknown as IntakeValidationApi;

    expect(api.isSourcePackChecklistComplete({ openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: false })).toBe(false);
    expect(api.isSourcePackChecklistComplete({ openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: true })).toBe(true);
  });

  it("demotes a stored pack-ready decision when its required note is cleared or absent", () => {
    const api = moderationQueue as unknown as ModerationQueueApi;
    const completeChecklist = { openedOriginalLink: true, keptLinkOnly: true, namedNextNeed: true };

    expect(api.normalisePrivateReviewRecord({ decision: "source_pack_ready", note: "", updatedAt: "2026-08-31T12:00:00.000Z" }, completeChecklist).decision).toBe("needs_source_pack");
    expect(api.normalisePrivateReviewRecord({ decision: "source_pack_ready", note: "Find the primary record.", updatedAt: "2026-08-31T12:00:00.000Z" }, { ...completeChecklist, namedNextNeed: false }).decision).toBe("needs_source_pack");
  });
});

type IntakeDocumentFixture = {
  contractVersion: "syat.news-intake.v1";
  generatedAt: string;
  windowDays: number;
  maximumPerPublisher: number;
  itemCount: number;
  items: NewsIntakeItem[];
};

type IntakeValidationApi = {
  validateIntakeDocument: (document: IntakeDocumentFixture, now: Date) => string[];
  isIntakeSnapshotCurrent: (snapshot: { generatedAt: string; windowDays: number }, now: Date) => boolean;
  canReplaceLastGoodIntake: (candidate: IntakeDocumentFixture, expectedFeedIds: readonly string[], completedFeedIds: readonly string[], now: Date) => boolean;
  isSourcePackChecklistComplete: (checklist: { openedOriginalLink: boolean; keptLinkOnly: boolean; namedNextNeed: boolean }) => boolean;
};

type ModerationQueueApi = {
  normalisePrivateReviewRecord: (
    record: { decision: "needs_source_pack" | "held" | "rejected" | "source_pack_ready"; note: string; updatedAt: string },
    checklist: { openedOriginalLink: boolean; keptLinkOnly: boolean; namedNextNeed: boolean }
  ) => { decision: "needs_source_pack" | "held" | "rejected" | "source_pack_ready" };
};

function intakeDocument(items: NewsIntakeItem[]): IntakeDocumentFixture {
  return {
    contractVersion: "syat.news-intake.v1",
    generatedAt: "2026-08-31T12:00:00.000Z",
    windowDays: 7,
    maximumPerPublisher: 2,
    itemCount: items.length,
    items
  };
}

function signal(id: string, publisher: string, sourceFeed: string, publishedAt: string): NewsIntakeItem {
  return {
    id,
    title: id,
    url: `https://example.test/articles/${id}`,
    publisher,
    sourceFeed,
    editorialScope: "india_first",
    sourceClass: "newsroom_rss",
    publishedAt,
    accessedAt: "2026-08-31T10:00:00.000Z",
    sourceType: "rss_metadata",
    status: "needs_editorial_review",
    rights: "link_only",
    note: "Review-only metadata."
  };
}
