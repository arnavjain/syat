import { describe, expect, it } from "vitest";

import { capItemsPerFeed, filterRecentItems, parseRssItems, selectBalancedItems, type RssFeed } from "./news-intake";

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
    const sourceB = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title>Feed B newest</title><link>https://example.test/b-1</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item><item><title>Feed B next</title><link>https://example.test/b-2</link><pubDate>Sun, 30 Aug 2026 07:00:00 GMT</pubDate></item></channel></rss>`, { ...feed, id: "example-b", url: "https://example.test/b.xml" });

    expect(selectBalancedItems([...sourceA, ...sourceB], 2, 3).map((item) => item.title)).toEqual(["Feed A newest", "Feed B newest", "Feed A next"]);
  });
});
