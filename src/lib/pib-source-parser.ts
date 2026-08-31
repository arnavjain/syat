import type { SourcePackSource } from "./source-pack";
import { pibUseDecision } from "./source-rights";

export type PibReleaseLink = { id: string; title: string; url: string };

const PIB_RELEASE_URL = "https://www.pib.gov.in/PressReleasePage.aspx";

export function recentCompletePibDates(todayInIndia: Date, days: number): Date[] {
  return Array.from({ length: days }, (_, offset) => new Date(todayInIndia.getTime() - (offset + 1) * 86_400_000));
}

function decodeHtml(value: string): string {
  const named: Record<string, string> = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"', ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith("#x")) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith("#")) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return named[code.toLocaleLowerCase("en-US")] ?? entity;
  });
}

function textFromHtml(html: string): string {
  return decodeHtml(
    html
      .replace(/<(?:script|style|nav|header|footer|aside|figure|picture|svg)\b[^>]*>[\s\S]*?<\/(?:script|style|nav|header|footer|aside|figure|picture|svg)>/gi, " ")
      .replace(/<(?:img|source)\b[^>]*>/gi, " ")
      .replace(/<br\s*\/?>|<\/(?:p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0 && !/^(?:image\s*:|visitor counter\s*:|follow us\b)/i.test(line))
    .join("\n")
    .trim();
}

function elementInnerHtml(html: string, tag: string, attribute: string, valuePattern: string): string | undefined {
  const match = html.match(new RegExp(`<${tag}\\b[^>]*\\b${attribute}=["'][^"']*${valuePattern}[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1];
}

function getAttribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"))?.[2];
}

export function buildPibDateForm(html: string, date: Date): URLSearchParams {
  const form = new URLSearchParams();
  for (const match of html.matchAll(/<input\b[^>]*>/gi)) {
    const name = getAttribute(match[0], "name");
    if (!name?.startsWith("__")) continue;
    form.set(name, decodeHtml(getAttribute(match[0], "value") ?? ""));
  }
  form.set("__EVENTTARGET", "ctl00$ContentPlaceHolder1$ddlday");
  form.set("__EVENTARGUMENT", "");
  form.set("ctl00$ContentPlaceHolder1$ddlMinistry", "0");
  form.set("ctl00$ContentPlaceHolder1$ddlday", String(date.getUTCDate()));
  form.set("ctl00$ContentPlaceHolder1$ddlMonth", String(date.getUTCMonth() + 1));
  form.set("ctl00$ContentPlaceHolder1$ddlYear", String(date.getUTCFullYear()));
  return form;
}

export function extractPibReleaseLinks(html: string): PibReleaseLink[] {
  const releases: PibReleaseLink[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = decodeHtml(getAttribute(match[1], "href") ?? "");
    const id = href.match(/PressRelease(?:Page|Detail)\.aspx\?[^"']*\bPRID=(\d+)/i)?.[1];
    if (!id || seen.has(id)) continue;
    const title = textFromHtml(getAttribute(match[1], "title") ?? match[2]);
    if (!title) continue;
    seen.add(id);
    releases.push({ id, title, url: `${PIB_RELEASE_URL}?PRID=${id}` });
  }
  return releases;
}

function parsePublishedAt(value: string): string {
  const match = value.match(/\b(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{4})\b/i);
  if (!match) throw new Error("PIB release date is missing.");
  const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].indexOf(match[2].toUpperCase());
  return new Date(Date.UTC(Number(match[3]), month, Number(match[1]))).toISOString();
}

function extractEvidenceHtml(html: string): string | undefined {
  const opening = html.match(/<div\b[^>]*class=["'][^"']*\bBackgroundRelease\b[^"']*["'][^>]*>/i);
  if (opening?.index !== undefined) {
    const start = opening.index + opening[0].length;
    const releaseIdStart = html.slice(start).search(/<(?:span|div)\b[^>]*id=["']ReleaseId["']/i);
    const backgroundEvidence = releaseIdStart >= 0
      ? html.slice(start, start + releaseIdStart)
      : elementInnerHtml(html.slice(opening.index), "div", "class", "\\bBackgroundRelease\\b");
    if (backgroundEvidence && textFromHtml(backgroundEvidence)) return backgroundEvidence;
  }

  const dateOpening = html.match(/<div\b[^>]*id=["']PrDateTime["'][^>]*>/i);
  if (dateOpening?.index === undefined) return undefined;
  const afterDateOpening = dateOpening.index + dateOpening[0].length;
  const dateClosing = html.indexOf("</div>", afterDateOpening);
  if (dateClosing < 0) return undefined;
  const evidenceStart = dateClosing + "</div>".length;
  const boundary = html.slice(evidenceStart).search(/<(?:div\b[^>]*id=["']reel_pic["']|span\b[^>]*id=["']ReleaseId["']|div\b[^>]*class=["'][^"']*\bBackgroundRelease\b)/i);
  return boundary >= 0 ? html.slice(evidenceStart, evidenceStart + boundary) : undefined;
}

export function parsePibRelease(html: string, url: string, accessedAt: Date): SourcePackSource {
  const id = url.match(/[?&]PRID=(\d+)/i)?.[1];
  if (!id) throw new Error("PIB release URL is missing a PRID.");
  const title = textFromHtml(elementInnerHtml(html, "h2", "id", "Titleh2") ?? "");
  if (!title) throw new Error("PIB release title is missing.");
  const dateText = textFromHtml(elementInnerHtml(html, "div", "id", "PrDateTime") ?? "");
  const evidenceText = textFromHtml(extractEvidenceHtml(html) ?? "");
  if (!evidenceText) throw new Error("PIB release evidence is missing.");

  return {
    id: `pib-${id}`,
    publisherId: "pib",
    publisher: "Press Information Bureau",
    title,
    url: `${PIB_RELEASE_URL}?PRID=${id}`,
    sourceKind: "official_statement",
    publishedAt: parsePublishedAt(dateText),
    accessedAt: accessedAt.toISOString(),
    evidenceText,
    ...pibUseDecision
  };
}
