/**
 * Reads an audit report's own findings out of its published PDF.
 *
 * The listing page's overview is the report's preface: it says which chapters exist, not what
 * they found. A story written from that can describe scope accurately and still invent a
 * result, which is exactly what happened once. The executive summary carries the findings in
 * concise, quantified form, so that is what becomes evidence.
 *
 * `unpdf` is loaded lazily because it is ESM and the collector runs as CommonJS.
 */

export const MINIMUM_SUMMARY_CHARACTERS = 900;
/**
 * Deliberately well under the contract limit. At 4,800 bytes the summaries were dense enough
 * with figures that the model both reached for the record's phrasing and lost track of its own
 * JSON. A tighter excerpt keeps the findings while leaving the draft writable.
 */
export const MAXIMUM_SUMMARY_UTF8_BYTES = 2_600;
const MAXIMUM_PDF_BYTES = 40 * 1024 * 1024;

/** Markers that distinguish findings prose from a table of contents or a preface. */
const findingMarkers = /\bper cent\b|₹|\bcrore\b|\blakh\b|audit (?:found|noticed|observed)|were not|was not|did not|remained unutilised|excess expenditure|without authority/i;
const contentsMarkers = /Table of Contents|Reference Paragraph|Page No\./i;

function tidy(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Picks the passage carrying the most findings.
 *
 * An executive summary opens with scope and method before it reports anything, so the first
 * few thousand characters are often the least useful part. Sliding a window over the whole
 * summary and keeping the densest one gives a short excerpt that still states results.
 */
function densestFindingsWindow(text: string, limitBytes: number): string {
  if (Buffer.byteLength(text, "utf8") <= limitBytes) return text;

  const marker = /\bper cent\b|₹|\bcrore\b|\blakh\b|\bwere not\b|\bwas not\b|\bdid not\b|\bunutilised\b|\bexcess\b/gi;
  const sentences = text.split(/(?<=\.)\s+/).filter((sentence) => sentence.trim().length > 0);

  let best = { score: -1, start: 0, end: 0 };
  for (let start = 0; start < sentences.length; start += 1) {
    let end = start;
    let bytes = 0;
    while (end < sentences.length) {
      const next = bytes + Buffer.byteLength(`${sentences[end]} `, "utf8");
      if (next > limitBytes) break;
      bytes = next;
      end += 1;
    }
    if (end === start) continue;
    const score = (sentences.slice(start, end).join(" ").match(marker) ?? []).length;
    if (score > best.score) best = { score, start, end };
    if (end >= sentences.length) break;
  }

  const window = best.score >= 0 ? sentences.slice(best.start, best.end).join(" ") : text;
  return truncateToBytes(tidy(window), limitBytes);
}

/** Cuts at a word boundary without splitting a multi-byte character. */
function truncateToBytes(text: string, limit: number): string {
  if (Buffer.byteLength(text, "utf8") <= limit) return text;
  let cut = text;
  while (Buffer.byteLength(cut, "utf8") > limit) cut = cut.slice(0, Math.floor(cut.length * 0.95));
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > limit / 2 ? cut.slice(0, lastSpace) : cut).trim();
}

export type ExtractedReportText = {
  /** The executive-summary prose used as evidence. */
  summary: string;
  pageIndex: number;
  totalPages: number;
};

export async function extractAuditSummary(pdf: Uint8Array): Promise<ExtractedReportText> {
  if (pdf.byteLength === 0) throw new Error("The audit report PDF was empty.");
  if (pdf.byteLength > MAXIMUM_PDF_BYTES) throw new Error("The audit report PDF is larger than this collector will read.");

  const { extractText, getDocumentProxy } = await import("unpdf");
  const document = await getDocumentProxy(pdf);
  const { totalPages, text } = await extractText(document, { mergePages: false });
  const pages = (Array.isArray(text) ? text : [text]).map((page) => tidy(String(page)));

  // Prefer the executive summary. Fall back to the first page that reads like findings.
  const summaryIndex = pages.findIndex((page) => /Executive Summary/i.test(page) && findingMarkers.test(page) && !contentsMarkers.test(page));
  const findingsIndex = summaryIndex >= 0 ? summaryIndex : pages.findIndex((page) => page.length > MINIMUM_SUMMARY_CHARACTERS && findingMarkers.test(page) && !contentsMarkers.test(page));
  if (findingsIndex < 0) throw new Error("No executive summary or findings page could be read from the audit report.");

  // Executive summaries usually run over a few pages; take them while they keep reading like findings.
  const collected: string[] = [];
  for (let index = findingsIndex; index < Math.min(findingsIndex + 5, pages.length); index += 1) {
    const page = pages[index];
    if (contentsMarkers.test(page)) break;
    if (index > findingsIndex && !findingMarkers.test(page)) break;
    collected.push(page);
    if (Buffer.byteLength(collected.join(" "), "utf8") >= MAXIMUM_SUMMARY_UTF8_BYTES) break;
  }

  const summary = densestFindingsWindow(tidy(collected.join(" ")), MAXIMUM_SUMMARY_UTF8_BYTES);
  if (summary.length < MINIMUM_SUMMARY_CHARACTERS) {
    throw new Error(`The audit report's summary is ${summary.length} characters, too thin to write a grounded article from.`);
  }

  return { summary, pageIndex: findingsIndex, totalPages };
}
