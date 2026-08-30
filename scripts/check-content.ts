import { readFile } from "node:fs/promises";

async function main() {
  const json = JSON.parse(await readFile("data/news-intake.json", "utf8")) as { contractVersion?: string; itemCount?: number; items?: Array<{ status?: string; rights?: string; url?: string; publishedAt?: string }> };
  if (json.contractVersion !== "syat.news-intake.v1") throw new Error("Unexpected news intake contract version.");
  if (!Array.isArray(json.items) || json.items.length !== json.itemCount) throw new Error("News intake count does not match its items.");
  for (const item of json.items) {
    if (item.status !== "needs_editorial_review" || item.rights !== "link_only" || !item.url?.startsWith("https://") || Number.isNaN(Date.parse(item.publishedAt ?? ""))) {
      throw new Error("News intake contains a publishable, unlinked, or undated item.");
    }
  }
  console.log(`Checked ${json.items.length} source signals; all remain review-only and link-only.`);
}

void main();
