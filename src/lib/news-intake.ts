export type RssFeed = {
  id: string;
  publisher: string;
  url: string;
  editorialScope: "india_first";
  sourceClass: "official_public_record" | "newsroom_rss";
};

export type NewsIntakeItem = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceFeed: string;
  editorialScope: "india_first";
  sourceClass: "official_public_record" | "newsroom_rss";
  publishedAt: string;
  accessedAt: string;
  sourceType: "rss_metadata";
  status: "needs_editorial_review";
  rights: "link_only";
  note: string;
};

export type NewsIntakeDocument = {
  contractVersion: "syat.news-intake.v1";
  generatedAt: string;
  windowDays: number;
  maximumPerPublisher: number;
  itemCount: number;
  items: NewsIntakeItem[];
};

export type SourcePackChecklist = {
  openedOriginalLink: boolean;
  keptLinkOnly: boolean;
  namedNextNeed: boolean;
};

export const maximumSignalsPerPublisher = 24;

export function decodeHtmlEntities(value: string) {
  const numericEntity = /&#(x[0-9a-f]+|\d+);/gi;
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(numericEntity, (_entity, value: string) => {
      const codePoint = value.toLowerCase().startsWith("x") ? Number.parseInt(value.slice(1), 16) : Number.parseInt(value, 10);
      if (!Number.isSafeInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return _entity;
      return String.fromCodePoint(codePoint);
    })
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
  return match ? decodeHtmlEntities(match[1]) : "";
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
      editorialScope: feed.editorialScope,
      sourceClass: feed.sourceClass,
      publishedAt: publishedAt.toISOString(),
      accessedAt: accessedAt.toISOString(),
      sourceType: "rss_metadata" as const,
      status: "needs_editorial_review" as const,
      rights: "link_only" as const,
      note: "India-first source selection, metadata only. This may include an international event that needs an India connection before drafting. Do not treat it as a published Syāt story; open the original source before editorial work."
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

export function isIntakeSnapshotCurrent(snapshot: Pick<NewsIntakeDocument, "generatedAt" | "windowDays">, now = new Date()) {
  const generatedAt = Date.parse(snapshot.generatedAt);
  const windowMs = snapshot.windowDays * 24 * 60 * 60 * 1000;
  const age = now.valueOf() - generatedAt;
  return Number.isFinite(generatedAt) && Number.isInteger(snapshot.windowDays) && snapshot.windowDays > 0 && age >= 0 && age <= windowMs;
}

export function validateIntakeDocument(document: unknown, now = new Date()) {
  const errors: string[] = [];
  if (!document || typeof document !== "object") return ["document is not an object"];
  const candidate = document as Partial<NewsIntakeDocument>;

  if (candidate.contractVersion !== "syat.news-intake.v1") errors.push("unexpected contract version");
  if (!Number.isInteger(candidate.windowDays) || (candidate.windowDays ?? 0) < 1) errors.push("invalid declared window");
  if (!Number.isInteger(candidate.maximumPerPublisher) || (candidate.maximumPerPublisher ?? 0) < 1) errors.push("invalid publisher cap");
  if (!Array.isArray(candidate.items)) return [...errors, "items must be an array"];
  if (candidate.itemCount !== candidate.items.length) errors.push("item count does not match items");
  if (!isIntakeSnapshotCurrent({ generatedAt: candidate.generatedAt ?? "", windowDays: candidate.windowDays ?? 0 }, now)) errors.push("snapshot is stale, future, or invalid");

  const urls = new Set<string>();
  const titles = new Set<string>();
  const publisherCounts = new Map<string, number>();
  const generatedAt = Date.parse(candidate.generatedAt ?? "");
  const windowStart = generatedAt - (candidate.windowDays ?? 0) * 24 * 60 * 60 * 1000;
  const windowEnd = generatedAt + 5 * 60 * 1000;

  for (const item of candidate.items) {
    if (!item || typeof item !== "object") {
      errors.push("item is not an object");
      continue;
    }
    const source = item as Partial<NewsIntakeItem>;
    if (source.status !== "needs_editorial_review" || source.rights !== "link_only" || source.sourceType !== "rss_metadata") errors.push("item must remain review-only and link-only");
    if (!source.id || !source.title || !source.publisher || !source.sourceFeed || !source.url?.startsWith("https://")) errors.push("item is missing required link-only metadata");
    if (source.editorialScope !== "india_first") errors.push("invalid editorial scope");
    if (source.sourceClass !== "official_public_record" && source.sourceClass !== "newsroom_rss") errors.push("invalid source class");
    if (!source.note?.trim()) errors.push("item note is required");

    const publishedAt = Date.parse(source.publishedAt ?? "");
    const accessedAt = Date.parse(source.accessedAt ?? "");
    if (!Number.isFinite(publishedAt)) errors.push("invalid published date");
    if (!Number.isFinite(accessedAt)) errors.push("invalid accessed date");
    if (Number.isFinite(publishedAt) && (publishedAt < windowStart || publishedAt > windowEnd)) errors.push("published date is outside declared window");
    if (Number.isFinite(accessedAt) && accessedAt > windowEnd) errors.push("accessed date is after declared snapshot");

    const normalizedUrl = source.url?.replace(/[?#].*$/, "").toLowerCase();
    if (normalizedUrl) {
      if (urls.has(normalizedUrl)) errors.push("duplicate source URL");
      urls.add(normalizedUrl);
    }
    const normalizedTitle = source.title?.replace(/\s+/g, " ").trim().toLocaleLowerCase("en-IN");
    if (normalizedTitle) {
      if (titles.has(normalizedTitle)) errors.push("duplicate source title");
      titles.add(normalizedTitle);
    }
    if (source.publisher) publisherCounts.set(source.publisher, (publisherCounts.get(source.publisher) ?? 0) + 1);
  }

  if ((candidate.maximumPerPublisher ?? 0) > 0 && [...publisherCounts.values()].some((count) => count > (candidate.maximumPerPublisher ?? 0))) errors.push("publisher cap exceeded");
  return [...new Set(errors)];
}

export function canReplaceLastGoodIntake(
  candidate: unknown,
  expectedFeedIds: readonly string[],
  completedFeedIds: readonly string[],
  now = new Date()
) {
  const expected = new Set(expectedFeedIds);
  const completed = new Set(completedFeedIds);
  const collectedEveryFeed = expected.size > 0 && expected.size === completed.size && [...expected].every((feedId) => completed.has(feedId));
  return collectedEveryFeed && validateIntakeDocument(candidate, now).length === 0;
}

export function isSourcePackChecklistComplete(checklist: SourcePackChecklist) {
  return checklist.openedOriginalLink && checklist.keptLinkOnly && checklist.namedNextNeed;
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

export function capItemsPerFeed(items: NewsIntakeItem[], maximumPerFeed: number) {
  const countByFeed = new Map<string, number>();
  return items.filter((item) => {
    const count = countByFeed.get(item.sourceFeed) ?? 0;
    if (count >= maximumPerFeed) return false;
    countByFeed.set(item.sourceFeed, count + 1);
    return true;
  });
}

// A private review queue should not be filled by the publisher with the most
// section feeds. First, rotate the available feeds inside each publisher.
// Then rotate publishers and stop at the stated per-publisher cap.
export function selectBalancedItems(items: NewsIntakeItem[], maximumPerPublisher: number, maximumTotal: number) {
  const feedsByPublisher = new Map<string, Map<string, NewsIntakeItem[]>>();

  for (const item of items) {
    const publisherFeeds = feedsByPublisher.get(item.publisher) ?? new Map<string, NewsIntakeItem[]>();
    const feedItems = publisherFeeds.get(item.sourceFeed) ?? [];
    feedItems.push(item);
    publisherFeeds.set(item.sourceFeed, feedItems);
    feedsByPublisher.set(item.publisher, publisherFeeds);
  }

  const publisherQueues = [...feedsByPublisher.values()].map((publisherFeeds) => {
    const feedQueues = [...publisherFeeds.values()];
    const rotated: NewsIntakeItem[] = [];
    let position = 0;

    while (rotated.length < maximumPerPublisher) {
      let added = false;
      for (const feedQueue of feedQueues) {
        const item = feedQueue[position];
        if (!item) continue;
        rotated.push(item);
        added = true;
        if (rotated.length === maximumPerPublisher) return rotated;
      }
      if (!added) return rotated;
      position += 1;
    }

    return rotated;
  });

  const selected: NewsIntakeItem[] = [];
  let position = 0;

  while (selected.length < maximumTotal) {
    let added = false;
    for (const publisherQueue of publisherQueues) {
      const item = publisherQueue[position];
      if (!item) continue;
      selected.push(item);
      added = true;
      if (selected.length === maximumTotal) return selected;
    }
    if (!added) return selected;
    position += 1;
  }

  return selected;
}
