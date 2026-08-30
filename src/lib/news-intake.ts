export type RssFeed = { id: string; publisher: string; url: string };

export type NewsIntakeItem = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceFeed: string;
  publishedAt: string;
  accessedAt: string;
  sourceType: "rss_metadata";
  status: "needs_editorial_review";
  rights: "link_only";
  note: string;
};

function decodeHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function field(item: string, name: string) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decodeHtml(match[1]) : "";
}

function makeId(url: string) {
  let value = 2166136261;
  for (const character of url) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return `signal-${(value >>> 0).toString(36)}`;
}

export function parseRssItems(xml: string, feed: RssFeed, accessedAt = new Date()): NewsIntakeItem[] {
  const itemBlocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];

  return itemBlocks.flatMap((block) => {
    const title = field(block, "title");
    const url = field(block, "link");
    const rawDate = field(block, "pubDate") || field(block, "published") || field(block, "updated");
    const publishedAt = new Date(rawDate);

    if (!title || !url || Number.isNaN(publishedAt.valueOf()) || !/^https:\/\//.test(url)) return [];

    return [{
      id: makeId(url),
      title,
      url,
      publisher: feed.publisher,
      sourceFeed: feed.url,
      publishedAt: publishedAt.toISOString(),
      accessedAt: accessedAt.toISOString(),
      sourceType: "rss_metadata" as const,
      status: "needs_editorial_review" as const,
      rights: "link_only" as const,
      note: "RSS metadata only. Do not treat this as a published Syāt story; open the original source before editorial drafting."
    }];
  });
}

export function filterRecentItems<T extends { publishedAt: string }>(items: T[], now = new Date(), days = 7) {
  const cutoff = now.valueOf() - days * 24 * 60 * 60 * 1000;
  return items.filter((item) => {
    const publishedAt = new Date(item.publishedAt).valueOf();
    return Number.isFinite(publishedAt) && publishedAt >= cutoff && publishedAt <= now.valueOf() + 5 * 60 * 1000;
  });
}

export function deduplicateIntake(items: NewsIntakeItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.url.replace(/[?#].*$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
