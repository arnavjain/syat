import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { deduplicateIntake, filterRecentItems, parseRssItems, type NewsIntakeItem, type RssFeed } from "../src/lib/news-intake";

const feeds: readonly RssFeed[] = [
  { id: "bbc-world", publisher: "BBC News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { id: "bbc-business", publisher: "BBC News", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { id: "bbc-tech", publisher: "BBC News", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
  { id: "bbc-science", publisher: "BBC News", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml" },
  { id: "bbc-health", publisher: "BBC News", url: "https://feeds.bbci.co.uk/news/health/rss.xml" },
  { id: "guardian-world", publisher: "The Guardian", url: "https://www.theguardian.com/world/rss" },
  { id: "guardian-business", publisher: "The Guardian", url: "https://www.theguardian.com/business/rss" },
  { id: "guardian-tech", publisher: "The Guardian", url: "https://www.theguardian.com/technology/rss" },
  { id: "guardian-environment", publisher: "The Guardian", url: "https://www.theguardian.com/environment/rss" },
  { id: "un-news", publisher: "UN News", url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml" },
  { id: "nasa-breaking", publisher: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
  { id: "al-jazeera", publisher: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" }
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

  const recent = deduplicateIntake(filterRecentItems(results, now, 7)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const output = {
    contractVersion: "syat.news-intake.v1",
    generatedAt: now.toISOString(),
    windowDays: 7,
    itemCount: Math.min(recent.length, 100),
    items: recent.slice(0, 100)
  };
  const destination = resolve(process.cwd(), "data/news-intake.json");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${output.itemCount} RSS metadata signals to data/news-intake.json.`);
  if (output.itemCount < 100) process.exitCode = 2;
}

void main();
