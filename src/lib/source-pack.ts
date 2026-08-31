import { z } from "zod";

import { canEnterModelInput } from "./source-rights";

const sourceIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
const sourceUseDecisionShape = {
  linkAllowed: z.boolean(),
  modelInputAllowed: z.boolean(),
  mediaReuseAllowed: z.boolean(),
  rightsBasis: z.enum(["link_only", "government_reproduction_policy", "government_open_data", "explicit_licence"]),
  policyUrl: z.url(),
  reviewedAt: z.iso.datetime(),
  creditLine: z.string().min(2).max(240)
} as const;

export const sourcePackSourceSchema = z.object({
  id: sourceIdSchema,
  publisherId: sourceIdSchema,
  publisher: z.string().min(2).max(160),
  title: z.string().min(1).max(320),
  url: z.url(),
  sourceKind: z.enum(["official_statement", "government_open_data", "audit_report", "reputable_reporting"]),
  publishedAt: z.iso.datetime(),
  accessedAt: z.iso.datetime(),
  evidenceText: z.string().max(50_000),
  ...sourceUseDecisionShape
}).strict().superRefine((source, ctx) => {
  if (source.rightsBasis === "link_only" && (source.modelInputAllowed || source.mediaReuseAllowed)) {
    ctx.addIssue({ code: "custom", message: "Link-only rights cannot permit model input or media reuse.", path: ["rightsBasis"] });
  }
  if (source.modelInputAllowed && source.evidenceText.trim().length < 24) {
    ctx.addIssue({ code: "custom", message: "Model-input sources require reusable evidence text.", path: ["evidenceText"] });
  }
  if (!source.modelInputAllowed && source.evidenceText.trim().length > 0) {
    ctx.addIssue({ code: "custom", message: "Link-only sources cannot store evidence text.", path: ["evidenceText"] });
  }
});

const relatedCoverageSchema = z.object({
  id: sourceIdSchema,
  publisherId: sourceIdSchema,
  publisher: z.string().min(2).max(160),
  title: z.string().min(1).max(320),
  url: z.url(),
  sourceKind: z.literal("reputable_reporting"),
  publishedAt: z.iso.datetime(),
  accessedAt: z.iso.datetime(),
  evidenceText: z.literal(""),
  linkAllowed: z.literal(true),
  modelInputAllowed: z.literal(false),
  mediaReuseAllowed: z.literal(false),
  rightsBasis: z.literal("link_only"),
  policyUrl: z.url(),
  reviewedAt: z.iso.datetime(),
  creditLine: z.string().min(2).max(240)
}).strict();

export const sourcePackSchema = z.object({
  contractVersion: z.literal("syat.source-pack.v1"),
  id: sourceIdSchema,
  title: z.string().min(12).max(320),
  indiaConnection: z.string().min(12).max(500),
  collectedAt: z.iso.datetime(),
  sources: z.array(sourcePackSourceSchema).max(12),
  relatedCoverage: z.array(relatedCoverageSchema).max(12)
}).strict();

export type SourcePackSource = z.infer<typeof sourcePackSourceSchema>;
export type SourcePack = z.infer<typeof sourcePackSchema>;

export const blockedPreviewRiskPatterns: readonly RegExp[] = [
  /\b(?:child sexual abuse|rape|sexual assault|suicide|self-harm)\b/i,
  /\b(?:graphic violence|murder|lynching|communal violence|riot|terrorism|terrorist|hostage|kidnapp?ing)\b/i,
  /\b(?:communal rumou?r|religious rumou?r)\b/i,
  /\b(?:medical treatment advice|treatment advice|dosage advice|miracle cure)\b/i,
  /\b(?:minor|minor-aged|child|schoolgirl|schoolboy|teenager)s?\b/i,
  /\b(?:live election|election|polling|ballot|vote[ -]?count|exit poll)\b/i,
  /\b(?:allegation|alleged|accused)\b[^.]{0,80}\b(?:private individual|private citizen|person|man|woman)\b/i,
  /\b(?:military strike|declares war)\b/i
];

export function validatePreviewSourcePack(pack: unknown): SourcePack {
  const parsed = sourcePackSchema.parse(pack);
  if (!parsed.sources.some(canEnterModelInput)) throw new Error("The source pack has no evidence permitted for model input.");
  if (blockedPreviewRiskPatterns.some((pattern) => pattern.test(parsed.title))) throw new Error("The source pack is outside the unattended preview risk boundary.");
  return parsed;
}

const titleStopWords = new Set(["a", "an", "and", "at", "by", "for", "from", "in", "into", "of", "on", "the", "to", "with"]);

function normalisedTitleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLocaleLowerCase("en-IN")
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 1 && !titleStopWords.has(token))
  );
}

function canonicalSourceUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = "";
  if (/\/PressRelease(?:Page|Detail)\.aspx$/i.test(parsed.pathname) && parsed.searchParams.has("PRID")) {
    return `https://www.pib.gov.in/PressReleasePage.aspx?PRID=${parsed.searchParams.get("PRID")}`;
  }
  parsed.hostname = parsed.hostname.toLocaleLowerCase("en-US");
  parsed.pathname = parsed.pathname.replace(/\/$/, "");
  parsed.searchParams.sort();
  return parsed.toString();
}

function titlesDescribeSameEvent(left: string, right: string): boolean {
  const leftTokens = normalisedTitleTokens(left);
  const rightTokens = normalisedTitleTokens(right);
  if (leftTokens.size === 0 || rightTokens.size === 0) return false;
  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return overlap >= 4 && overlap / Math.min(leftTokens.size, rightTokens.size) >= 0.75;
}

function sourcePacksDescribeSameEvent(left: SourcePack, right: SourcePack): boolean {
  const leftUrls = new Set(left.sources.map((source) => canonicalSourceUrl(source.url)));
  return right.sources.some((source) => leftUrls.has(canonicalSourceUrl(source.url))) || titlesDescribeSameEvent(left.title, right.title);
}

export function deduplicateSourcePacks(packs: readonly SourcePack[]): SourcePack[] {
  const unique: SourcePack[] = [];
  for (const pack of packs) {
    if (!unique.some((existing) => sourcePacksDescribeSameEvent(existing, pack))) unique.push(pack);
  }
  return unique;
}
