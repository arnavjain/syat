import { readFile } from "node:fs/promises";

const maxFutureClockSkewMs = 5 * 60 * 1000;

async function main() {
  const json = JSON.parse(await readFile("data/news-intake.json", "utf8")) as { contractVersion?: string; generatedAt?: string; windowDays?: number; itemCount?: number; items?: Array<{ status?: string; rights?: string; url?: string; publishedAt?: string }> };
  if (json.contractVersion !== "syat.news-intake.v1") throw new Error("Unexpected news intake contract version.");
  if (!Array.isArray(json.items) || json.items.length !== json.itemCount) throw new Error("News intake count does not match its items.");
  const generatedAt = Date.parse(json.generatedAt ?? "");
  if (!Number.isFinite(generatedAt) || !Number.isInteger(json.windowDays) || (json.windowDays ?? 0) < 1) throw new Error("News intake must declare a valid source-snapshot time and freshness window.");
  for (const item of json.items) {
    if (item.status !== "needs_editorial_review" || item.rights !== "link_only" || !item.url?.startsWith("https://") || Number.isNaN(Date.parse(item.publishedAt ?? ""))) {
      throw new Error("News intake contains a publishable, unlinked, or undated item.");
    }
  }
  const age = Date.now() - generatedAt;
  const isCurrent = age >= -maxFutureClockSkewMs && age <= (json.windowDays ?? 0) * 24 * 60 * 60 * 1000;
  console.log(`Checked ${json.items.length} source signals; all remain review-only and link-only. Snapshot is ${isCurrent ? "within" : "outside"} its declared freshness window and remains Studio-only.`);
}

void main();
