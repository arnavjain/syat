import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { canReplaceLastGoodIntake, deduplicateIntake, filterRecentItems, maximumSignalsPerPublisher, parseRssItems, selectBalancedItems, type NewsIntakeDocument, type NewsIntakeItem, type RssFeed } from "../src/lib/news-intake";

// Feeds verified reachable on 1 September 2026. A publisher listed in the registry but
// absent here has no permitted or working feed, so editors add its links by hand.
// `required` marks the load-bearing feeds: if one of those fails the intake is not replaced,
// because losing them would silently narrow the record. Optional feeds may fail.
type CollectorFeed = RssFeed & { required?: boolean };

const feeds: readonly CollectorFeed[] = [
  { id: "pib-releases", publisher: "Press Information Bureau", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", editorialScope: "india_first", sourceClass: "official_public_record", required: true },
  { id: "the-hindu-national", publisher: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss", editorialScope: "india_first", sourceClass: "newsroom_rss", required: true },
  { id: "the-hindu-business", publisher: "The Hindu", url: "https://www.thehindu.com/business/feeder/default.rss", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "the-hindu-scitech", publisher: "The Hindu", url: "https://www.thehindu.com/sci-tech/feeder/default.rss", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-india", publisher: "The Indian Express", url: "https://indianexpress.com/section/india/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss", required: true },
  { id: "indian-express-cities", publisher: "The Indian Express", url: "https://indianexpress.com/section/cities/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-economy", publisher: "The Indian Express", url: "https://indianexpress.com/section/business/economy/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "indian-express-explained", publisher: "The Indian Express", url: "https://indianexpress.com/section/explained/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "times-of-india-top", publisher: "The Times of India", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", editorialScope: "india_first", sourceClass: "newsroom_rss", required: true },
  { id: "times-of-india-india", publisher: "The Times of India", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "hindustan-times-india", publisher: "Hindustan Times", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", editorialScope: "india_first", sourceClass: "newsroom_rss", required: true },
  { id: "economic-times-top", publisher: "The Economic Times", url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "frontline", publisher: "Frontline", url: "https://frontline.thehindu.com/feeder/default.rss", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "opindia", publisher: "OpIndia", url: "https://www.opindia.com/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "organiser", publisher: "Organiser", url: "https://organiser.org/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "newslaundry", publisher: "Newslaundry", url: "https://www.newslaundry.com/feed", editorialScope: "india_first", sourceClass: "newsroom_rss" },
  { id: "mongabay-india", publisher: "Mongabay India", url: "https://india.mongabay.com/feed/", editorialScope: "india_first", sourceClass: "newsroom_rss" }
];

/** Distinct publishers the intake must still carry, so a narrow snapshot never replaces a wide one. */
const MINIMUM_PUBLISHERS = 6;

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

  const requiredFeedIds = feeds.filter((feed) => feed.required).map((feed) => feed.id);
  const completedFeedIds = results.filter((result) => result.complete).map((result) => result.feedId);
  const failedRequired = requiredFeedIds.filter((feedId) => !completedFeedIds.includes(feedId));
  const failedOptional = results.filter((result) => !result.complete && !requiredFeedIds.includes(result.feedId)).map((result) => result.feedId);

  if (failedRequired.length > 0) {
    console.error(`A load-bearing feed failed (${failedRequired.join(", ")}); kept the last good intake unchanged.`);
    process.exitCode = 2;
    return;
  }
  if (failedOptional.length > 0) console.error(`Continued without these optional feeds: ${failedOptional.join(", ")}.`);

  // A feed can answer 200 and still carry nothing recent, which looks like success while
  // quietly removing a lane. Say so rather than letting the summary imply full coverage.
  const emptyRequired = results.filter((result) => result.complete && result.items.length === 0 && requiredFeedIds.includes(result.feedId)).map((result) => result.feedId);
  if (emptyRequired.length > 0) console.error(`These load-bearing feeds returned no recent items: ${emptyRequired.join(", ")}. Check them before trusting this snapshot's breadth.`);

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
  const publishersCollected = new Set(recent.map((item) => item.publisher));
  if (publishersCollected.size < MINIMUM_PUBLISHERS) {
    console.error(`Only ${publishersCollected.size} publishers were collected, below the floor of ${MINIMUM_PUBLISHERS}; kept the last good intake unchanged.`);
    process.exitCode = 2;
    return;
  }
  if (!canReplaceLastGoodIntake(output, requiredFeedIds, completedFeedIds.filter((feedId) => requiredFeedIds.includes(feedId)), now)) {
    console.error("Collected candidate failed its intake contract; kept the last good intake unchanged.");
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
