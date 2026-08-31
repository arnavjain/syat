import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { buildPibDateForm, extractPibReleaseLinks, parsePibRelease, recentCompletePibDates, type PibReleaseLink } from "../src/lib/pib-source-parser";
import {
  blockedPreviewRiskPatterns,
  deduplicateSourcePacks,
  validatePreviewSourcePack,
  type SourcePack
} from "../src/lib/source-pack";

const PIB_LIST_URL = "https://www.pib.gov.in/AllRel.aspx?lang=1&reg=1";
const REQUEST_TIMEOUT_MS = 12_000;
const MINIMUM_START_GAP_MS = 250;
const MAXIMUM_DETAIL_CONCURRENCY = 2;

type CollectorOptions = { days: number; limit: number; output: string };

function parsePositiveInteger(value: string | undefined, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${flag} must be a positive integer.`);
  return parsed;
}

function parseOptions(argv: string[]): CollectorOptions {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag?.startsWith("--") || !value) throw new Error("Use --days, --limit, and --output with values.");
    values.set(flag, value);
  }
  const output = values.get("--output");
  if (!output) throw new Error("--output is required.");
  return {
    days: parsePositiveInteger(values.get("--days"), "--days"),
    limit: parsePositiveInteger(values.get("--limit"), "--limit"),
    output: resolve(output)
  };
}

function indiaTodayUtc(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)));
}

class PoliteHtmlClient {
  private lastStartedAt = 0;
  private startQueue: Promise<void> = Promise.resolve();

  async fetchHtml(url: string, init: RequestInit = {}): Promise<string> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await this.waitForStartSlot();
      const response = await fetch(url, {
        ...init,
        headers: { Accept: "text/html", ...init.headers },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      if (response.ok) return response.text();
      if (response.status >= 500 && response.status <= 599 && attempt === 0) {
        await response.body?.cancel();
        continue;
      }
      throw new Error(`PIB request failed with status ${response.status}.`);
    }
    throw new Error("PIB request failed after one transient-server retry.");
  }

  private async waitForStartSlot(): Promise<void> {
    let release = () => {};
    const previous = this.startQueue;
    this.startQueue = new Promise<void>((resolveQueue) => {
      release = resolveQueue;
    });
    await previous;
    const waitMs = Math.max(0, this.lastStartedAt + MINIMUM_START_GAP_MS - Date.now());
    if (waitMs > 0) await new Promise((resolveWait) => setTimeout(resolveWait, waitMs));
    this.lastStartedAt = Date.now();
    release();
  }
}

async function collectReleaseLinks(client: PoliteHtmlClient, dates: readonly Date[]): Promise<PibReleaseLink[]> {
  const baseHtml = await client.fetchHtml(PIB_LIST_URL);
  const unique = new Map<string, PibReleaseLink>();
  for (const date of dates) {
    const form = buildPibDateForm(baseHtml, date);
    const listHtml = await client.fetchHtml(PIB_LIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form
    });
    for (const release of extractPibReleaseLinks(listHtml)) unique.set(release.id, release);
  }
  return [...unique.values()];
}

function makeSourcePack(source: ReturnType<typeof parsePibRelease>, collectedAt: string): SourcePack {
  return validatePreviewSourcePack({
    contractVersion: "syat.source-pack.v1",
    id: source.id,
    title: source.title,
    indiaConnection: "This release is an official Government of India public record.",
    collectedAt,
    sources: [source],
    relatedCoverage: []
  });
}

async function collectSourcePacks(client: PoliteHtmlClient, links: readonly PibReleaseLink[]): Promise<SourcePack[]> {
  const results = new Array<SourcePack>(links.length);
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < links.length) {
      const index = nextIndex;
      nextIndex += 1;
      const link = links[index];
      const detailHtml = await client.fetchHtml(link.url);
      const accessedAt = new Date();
      results[index] = makeSourcePack(parsePibRelease(detailHtml, link.url, accessedAt), accessedAt.toISOString());
    }
  };
  await Promise.all(Array.from({ length: Math.min(MAXIMUM_DETAIL_CONCURRENCY, links.length) }, worker));
  return deduplicateSourcePacks(results);
}

async function writeAtomically(output: string, packs: readonly SourcePack[]): Promise<void> {
  const nextOutput = `${output}.next`;
  const serialised = `${JSON.stringify(packs, null, 2)}\n`;
  const reparsed = JSON.parse(serialised) as unknown;
  if (!Array.isArray(reparsed)) throw new Error("The candidate source-pack document must be an array.");
  reparsed.forEach(validatePreviewSourcePack);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(nextOutput, serialised, "utf8");
  await rename(nextOutput, output);
}

function printSafeSummary(packs: readonly SourcePack[]): void {
  const dates = [...new Set(packs.flatMap((pack) => pack.sources.map((source) => source.publishedAt.slice(0, 10))))].sort();
  const publishers = new Map<string, number>();
  for (const source of packs.flatMap((pack) => pack.sources)) publishers.set(source.publisher, (publishers.get(source.publisher) ?? 0) + 1);
  const publisherDistribution = [...publishers.entries()].map(([publisher, count]) => `${publisher}=${count}`).join(", ");
  console.log(`Candidates: ${packs.length}`);
  console.log(`Dates: ${dates.join(", ") || "none"}`);
  console.log(`Publishers: ${publisherDistribution || "none"}`);
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const dates = recentCompletePibDates(indiaTodayUtc(), options.days);
  const client = new PoliteHtmlClient();
  const links = (await collectReleaseLinks(client, dates))
    .filter((release) => !blockedPreviewRiskPatterns.some((pattern) => pattern.test(release.title)))
    .slice(0, options.limit);
  const packs = await collectSourcePacks(client, links);
  await writeAtomically(options.output, packs);
  printSafeSummary(packs);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "PIB collection failed.");
  process.exitCode = 1;
});
