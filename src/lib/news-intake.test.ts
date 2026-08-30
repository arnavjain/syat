import { describe, expect, it } from "vitest";

import { filterRecentItems, parseRssItems } from "./news-intake";

const feed = {
  id: "example-world",
  publisher: "Example News",
  url: "https://example.test/feed.xml"
};

describe("RSS intake", () => {
  it("takes metadata only from RSS entries and keeps the originating source link", () => {
    const items = parseRssItems(`<?xml version="1.0"?><rss><channel><item><title><![CDATA[ A careful headline ]]></title><link>https://example.test/story</link><pubDate>Sun, 30 Aug 2026 08:00:00 GMT</pubDate></item></channel></rss>`, feed, new Date("2026-08-31T12:00:00Z"));

    expect(items).toEqual([expect.objectContaining({ title: "A careful headline", url: "https://example.test/story", publisher: "Example News", status: "needs_editorial_review", rights: "link_only" })]);
  });

  it("drops old or undated entries before a seven-day review queue is written", () => {
    const items = [
      { title: "New", url: "https://example.test/new", publishedAt: "2026-08-30T08:00:00.000Z" },
      { title: "Old", url: "https://example.test/old", publishedAt: "2026-08-10T08:00:00.000Z" }
    ];

    expect(filterRecentItems(items, new Date("2026-08-31T12:00:00Z"), 7)).toHaveLength(1);
  });
});
