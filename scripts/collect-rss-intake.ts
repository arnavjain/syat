import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { canReplaceLastGoodIntake, deduplicateIntake, filterRecentItems, maximumSignalsPerPublisher, parseRssItems, selectBalancedItems, type NewsIntakeDocument, type NewsIntakeItem, type RssFeed } from "../src/lib/news-intake";

const feeds: readonly RssFeed[] = [
  { id: "pib-releases", publisher: "Press Information Bureau", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", editorialScope: "india_first", sourceClass: "official_public_record" },
  { id: "the-hindu-national", publisher: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "mongabay-india", publisher: "Mongabay India", url: "https://india.mongabay.com/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-india", publisher: "The Indian Express", url: "https://indianexpress.com/section/india/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-cities", publisher: "The Indian Express", url: "https://indianexpress.com/section/cities/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-business", publisher: "The Indian Express", url: "https://indianexpress.com/section/business/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-economy", publisher: "The Indian Express", url: "https://indianexpress.com/section/business/economy/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-technology", publisher: "The Indian Express", url: "https://indianexpress.com/section/technology/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-science", publisher: "The Indian Express", url: "https://indianexpress.com/section/technology/science/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-explained", publisher: "The Indian Express", url: "https://indianexpress.com/section/explained/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-health", publisher: "The Indian Express", url: "https://indianexpress.com/section/health-wellness/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-education", publisher: "The Indian Express", url: "https://indianexpress.com/section/education/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-north-east", publisher: "The Indian Express", url: "https://indianexpress.com/section/north-east-india/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" }
];

type FeedResult = { feedId: string; items: NewsIntakeItem[]; complete: true } | { feedId: string; items: []; complete: false };

async function fetchFeed(feed: RssFeed, now: Date): Promise<FeedResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(feed.url, { headers: { Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8" }, signal: controller.signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return { feedId: feed.id, items: parseRssItems(await response.text(), feed, now), complete: true };
  } catch (error) {
    console.error(`Skipped ${feed.id}: ${error instanceof Error ? error.message : String(error)}`);
    return { feedId: feed.id, items: [], complete: false };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const now = new Date();
  const results: FeedResult[] = [];

  // Two feeds at once is enough for a small private research queue and avoids aggressive polling.
  for (let index = 0; index < feeds.length; index += 2) {
    results.push(...(await Promise.all(feeds.slice(index, index + 2).map((feed) => fetchFeed(feed, now)))));
  }

  const incompleteFeeds = results.filter((result) => !result.complete).map((result) => result.feedId);
  if (incompleteFeeds.length > 0) {
    console.error(`Collection was incomplete (${incompleteFeeds.join(", ")}); kept the last good intake unchanged.`);
    process.exitCode = 2;
    return;
  }

  const recent = selectBalancedItems(
    deduplicateIntake(filterRecentItems(results.flatMap((result) => result.items), now, 7)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    maximumSignalsPerPublisher,
    100
  );
  const output: NewsIntakeDocument = {
    contractVersion: "syat.news-intake.v1",
    generatedAt: now.toISOString(),
    windowDays: 7,
    maximumPerPublisher: maximumSignalsPerPublisher,
    itemCount: recent.length,
    items: recent
  };
  const destination = resolve(process.cwd(), "data/news-intake.json");
  await mkdir(dirname(destination), { recursive: true });
  if (!canReplaceLastGoodIntake(output, feeds.map((feed) => feed.id), results.map((result) => result.feedId), now)) {
    console.error("Collected candidate failed its full intake contract; kept the last good intake unchanged.");
    process.exitCode = 2;
    return;
  }

  const temporaryDestination = `${destination}.next`;
  await writeFile(temporaryDestination, `${JSON.stringify(output, null, 2)}\n`);
  await rename(temporaryDestination, destination);
  const distribution = [...recent.reduce((counts, item) => counts.set(item.publisher, (counts.get(item.publisher) ?? 0) + 1), new Map<string, number>()).entries()].map(([publisher, count]) => `${publisher}: ${count}`).join("; ");
  console.log(`Replaced the intake with ${output.itemCount} review-only, link-only source signals (cap ${maximumSignalsPerPublisher} per publisher). ${distribution || "No current records."}`);
}

void main();
