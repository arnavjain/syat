import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { extractCagReportLinks, extractCagReportPdfUrl, findCagJurisdiction, hasUsableEvidence, parseCagReport, type CagReportLink } from "../src/lib/cag-source-parser";
import { extractAuditSummary } from "../src/lib/cag-report-text";
import { composeContestedPack, concentrationWarnings, deduplicateContestedPacks, type CoverageSignal } from "../src/lib/contested-pack";
import { latestNewsSignals } from "../src/lib/news-signals";
import type { SourcePack, SourcePackSource } from "../src/lib/source-pack";

const CAG_LIST_URL = "https://cag.gov.in/en/audit-report";
const REQUEST_TIMEOUT_MS = 20_000;
const PDF_TIMEOUT_MS = 90_000;
const MINIMUM_START_GAP_MS = 700;
const DEFAULT_OUTPUT = "data/source-packs/cag-candidates.json";
// The listing runs to roughly 282 pages. This bounds one collection run without
// pretending the archive is smaller than it is.
const MAXIMUM_LISTING_PAGES = 300;

// One request at a time with a gap between starts. This is a small research queue, not a crawl.
class PoliteHtmlClient {
  private lastStartedAt = 0;

  async fetchBytes(url: string): Promise<Uint8Array> {
    const waitMs = Math.max(0, this.lastStartedAt + MINIMUM_START_GAP_MS - Date.now());
    if (waitMs > 0) await new Promise((resolveWait) => setTimeout(resolveWait, waitMs));
    this.lastStartedAt = Date.now();

    const response = await fetch(url, { headers: { Accept: "application/pdf" }, signal: AbortSignal.timeout(PDF_TIMEOUT_MS) });
    if (!response.ok) throw new Error(`CAG report download failed with status ${response.status}.`);
    return new Uint8Array(await response.arrayBuffer());
  }

  async fetchHtml(url: string): Promise<string> {
    const waitMs = Math.max(0, this.lastStartedAt + MINIMUM_START_GAP_MS - Date.now());
    if (waitMs > 0) await new Promise((resolveWait) => setTimeout(resolveWait, waitMs));
    this.lastStartedAt = Date.now();

    const response = await fetch(url, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) throw new Error(`CAG request failed with status ${response.status}.`);
    return response.text();
  }
}

function parseCount(argv: readonly string[], flag: string, fallback: number): number {
  const index = argv.indexOf(flag);
  if (index < 0) return fallback;
  const value = Number(argv[index + 1]);
  if (!Number.isSafeInteger(value) || value < 1 || value > 400) throw new Error(`${flag} needs a whole number between 1 and 400.`);
  return value;
}

/** Names the actual subject, so no pack carries a boilerplate India connection. */
function indiaConnectionFor(source: SourcePackSource): string {
  const place = findCagJurisdiction(`${source.title} ${source.evidenceText.slice(0, 1200)}`);
  const where = place ? `in ${place}` : "in India";
  // A finances or revenue audit is not a programme audit, and saying so would be inaccurate.
  const subject = /state finances|state revenue|revenue receipts|appropriation|accounts of/i.test(source.title)
    ? `how public money ${where} was accounted for and reported`
    : `how a public programme ${where} was carried out and recorded`;
  return `This audit examines ${subject}, and it states what the audited record can and cannot establish for the people in India who depend on it.`;
}

function packFor(source: SourcePackSource, signals: readonly CoverageSignal[], collectedAt: string): SourcePack {
  return composeContestedPack({
    id: source.id,
    title: source.title.slice(0, 320),
    indiaConnection: indiaConnectionFor(source),
    sources: [source],
    signals,
    collectedAt
  });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const wanted = parseCount(argv, "--count", 12);
  const outputPath = resolve(process.cwd(), argv.includes("--output") ? argv[argv.indexOf("--output") + 1] : DEFAULT_OUTPUT);

  const client = new PoliteHtmlClient();
  const signals: CoverageSignal[] = latestNewsSignals.map((signal) => ({
    id: signal.id,
    title: signal.title,
    url: signal.url,
    publisher: signal.publisher,
    publishedAt: signal.publishedAt,
    accessedAt: signal.accessedAt
  }));

  // Only some audit reports publish a narrative overview, so page through the listing until
  // enough reports actually qualify rather than stopping at a link count.
  const packs: SourcePack[] = [];
  const skipped: string[] = [];
  const summaryFallbacks: string[] = [];
  const seen = new Set<string>();
  let emptyPages = 0;

  for (let page = 0; packs.length < wanted && page < MAXIMUM_LISTING_PAGES; page += 1) {
    const listing = await client.fetchHtml(page === 0 ? CAG_LIST_URL : `${CAG_LIST_URL}?page=${page}`);
    const links: CagReportLink[] = extractCagReportLinks(listing).filter((link) => !seen.has(link.id));
    console.error(`  listing page ${page}: ${links.length} new report(s), ${packs.length} pack(s) so far`);
    if (links.length === 0) {
      emptyPages += 1;
      if (emptyPages >= 3) break;
      continue;
    }
    emptyPages = 0;

    for (const link of links) {
      if (packs.length >= wanted) break;
      seen.add(link.id);
      try {
        const accessedAt = new Date();
        const detail = await client.fetchHtml(link.url);
        const source = parseCagReport(detail, link.url, accessedAt);

        // The report's own findings, which the listing page does not carry.
        const pdfUrl = extractCagReportPdfUrl(detail);
        if (pdfUrl) {
          try {
            const extracted = await extractAuditSummary(await client.fetchBytes(pdfUrl));
            source.evidenceText = extracted.summary;
          } catch (pdfError) {
            summaryFallbacks.push(`${link.id}: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
          }
        }
        if (!hasUsableEvidence(source.evidenceText)) {
          throw new Error(`no readable findings: the report PDF could not be read and the listing overview is ${source.evidenceText.trim().length} characters.`);
        }

        packs.push(packFor(source, signals, accessedAt.toISOString()));
      } catch (error) {
        skipped.push(`${link.id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  const unique = deduplicateContestedPacks(packs);
  if (unique.length === 0) {
    console.error(`Collected no usable CAG packs. ${skipped.join(" | ") || "No reports were listed."}`);
    process.exitCode = 2;
    return;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  const temporary = `${outputPath}.next`;
  await writeFile(temporary, `${JSON.stringify({ contractVersion: "syat.source-pack-candidates.v1", collectedAt: new Date().toISOString(), packCount: unique.length, packs: unique }, null, 2)}\n`);
  await rename(temporary, outputPath);

  if (skipped.length > 0) {
    const thin = skipped.filter((line) => /too thin|no readable findings/.test(line)).length;
    console.error(`Skipped ${skipped.length} report(s): ${thin} had no publishable overview on the page, ${skipped.length - thin} were missing a required field.`);
  }
  if (summaryFallbacks.length > 0) console.error(`${summaryFallbacks.length} report(s) kept the listing preface because their PDF could not be read.`);
  for (const warning of concentrationWarnings(unique)) console.error(`Concentration warning: ${warning.message}`);
  const withCoverage = unique.filter((pack) => pack.relatedCoverage.length > 0).length;
  console.log(`Collected ${unique.length} CAG audit packs; ${withCoverage} carry credited independent coverage. Every newsroom link stays link-only and never enters model input.`);
}

void main();
