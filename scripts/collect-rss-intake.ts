import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { deduplicateIntake, filterRecentItems, parseRssItems, selectBalancedItems, type NewsIntakeItem, type RssFeed } from "../src/lib/news-intake";

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

async function fetchFeed(feed: RssFeed, now: Date) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(feed.url, { headers: { Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8" }, signal: controller.signal });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return parseRssItems(await response.text(), feed, now);
  } catch (error) {
    console.error(`Skipped ${feed.id}: ${error instanceof Error ? error.message : String(error)}`);
    return [] as NewsIntakeItem[];
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const now = new Date();
  const results: NewsIntakeItem[] = [];

  // Two feeds at once is enough for a small private research queue and avoids aggressive polling.
  for (let index = 0; index < feeds.length; index += 2) {
    results.push(...(await Promise.all(feeds.slice(index, index + 2).map((feed) => fetchFeed(feed, now)))).flat());
  }

  const recent = selectBalancedItems(
    deduplicateIntake(filterRecentItems(results, now, 7)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    16,
    100
  );
  const output = {
    contractVersion: "syat.news-intake.v1",
    generatedAt: now.toISOString(),
    windowDays: 7,
    itemCount: recent.length,
    items: recent
  };
  const destination = resolve(process.cwd(), "data/news-intake.json");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${output.itemCount} RSS metadata signals to data/news-intake.json.`);
  if (output.itemCount < 100) process.exitCode = 2;
}

void main();
