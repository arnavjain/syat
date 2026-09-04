import { cagUseDecision } from "./source-rights";
import type { SourcePackSource } from "./source-pack";

export type CagReportLink = { id: string; url: string };

/** The published report file, which carries the findings the listing page does not. */
export function extractCagReportPdfUrl(html: string): string | undefined {
  return /href="(https:\/\/cag\.gov\.in\/uploads\/download_audit_report\/[^"]+\.pdf)"/i.exec(html)?.[1];
}

/** Enough audit prose to support a 350-word article without padding. */
export const MINIMUM_EVIDENCE_CHARACTERS = 1_500;

const CAG_REPORT_URL = "https://cag.gov.in/en/audit-report/details";

const namedEntities: Record<string, string> = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  lsquo: "\u2018", rsquo: "\u2019", ldquo: "\u201c", rdquo: "\u201d",
  ndash: "\u2013", mdash: "\u2014", hellip: "\u2026", middot: "\u00b7",
  rupee: "\u20b9", deg: "\u00b0", eacute: "\u00e9", sbquo: "\u201a"
};

function decodeHtml(value: string): string {
  return value
    .replace(/&([a-z]+);/gi, (match, name: string) => namedEntities[name.toLowerCase()] ?? match)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function textFromHtml(html: string): string {
  return decodeHtml(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

export function extractCagReportLinks(html: string): CagReportLink[] {
  const unique = new Map<string, CagReportLink>();
  for (const [, id] of html.matchAll(/\/en\/audit-report\/details\/(\d+)/g)) {
    unique.set(id, { id, url: `${CAG_REPORT_URL}/${id}` });
  }
  return [...unique.values()];
}

/** Reads a `labelTitleBold` / `labelItemBold` pair, which is how the page states each field. */
function labelledValue(html: string, label: string): string | undefined {
  const pattern = new RegExp(`labelTitleBold"[^>]*>\\s*${label}[^<]*</div>\\s*<div class="labelItemBold"[^>]*>([\\s\\S]*?)</div>`, "i");
  const value = textFromHtml(pattern.exec(html)?.[1] ?? "");
  return value || undefined;
}

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** CAG prints dates as "Tue 11 Aug, 2026". */
export function parseCagDate(value: string): string {
  const match = /(\d{1,2})\s+([A-Za-z]{3,})[,\s]+(\d{4})/.exec(value);
  if (!match) throw new Error(`CAG report date "${value}" is not in the expected format.`);
  const month = monthNames.indexOf(match[2].slice(0, 3).toLowerCase());
  if (month < 0) throw new Error(`CAG report date "${value}" names an unknown month.`);
  return new Date(Date.UTC(Number(match[3]), month, Number(match[1]))).toISOString();
}

function overviewText(html: string): string {
  const section = /<h4[^>]*>\s*Overview\s*<\/h4>([\s\S]*?)(?=<h4|<\/section|<footer|$)/i.exec(html)?.[1];
  if (!section) return "";
  return [...section.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => textFromHtml(match[1]))
    .filter((paragraph) => paragraph.length > 0)
    .join("\n\n");
}

const indianStatesAndTerritories = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Lakshadweep", "Dadra and Nagar Haveli"
] as const;

/** The place the audit is about, so a pack never describes itself only as "an Indian authority". */
export function findCagJurisdiction(text: string): string | undefined {
  return indianStatesAndTerritories.find((place) => new RegExp(`\\b${place}\\b`, "i").test(text));
}

export function parseCagReport(html: string, url: string, accessedAt: Date): SourcePackSource {
  const id = /\/details\/(\d+)/.exec(url)?.[1];
  if (!id) throw new Error("CAG report URL is missing a report id.");

  const title = textFromHtml(/<h3[^>]*class="[^"]*singTitle[^"]*"[^>]*>([\s\S]*?)<\/h3>/i.exec(html)?.[1] ?? "");
  if (!title) throw new Error("CAG report title is missing.");

  const tabled = labelledValue(html, "Date on which Report Tabled");
  if (!tabled) throw new Error("CAG report tabling date is missing.");

  const evidenceText = overviewText(html);
  if (evidenceText.length < MINIMUM_EVIDENCE_CHARACTERS) throw new Error(`CAG report overview is ${evidenceText.length} characters, too thin to write a grounded article from.`);

  const sector = textFromHtml(/sectorSingleAudit[^>]*>\s*<span[^>]*>\s*<b>\s*Sector\s*<\/b>\s*<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/i.exec(html)?.[1] ?? "");
  const governmentType = labelledValue(html, "Government Type");

  return {
    id: `cag-${id}`,
    publisherId: "cag",
    publisher: "Comptroller and Auditor General of India",
    title: [title, sector ? `Sector: ${sector}` : "", governmentType ? `Government: ${governmentType}` : ""].filter(Boolean).join(" · ").slice(0, 320),
    url: `${CAG_REPORT_URL}/${id}`,
    sourceKind: "audit_report",
    publishedAt: parseCagDate(tabled),
    accessedAt: accessedAt.toISOString(),
    evidenceText,
    ...cagUseDecision
  };
}
