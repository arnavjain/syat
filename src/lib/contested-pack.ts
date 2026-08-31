import { publisherRegistry } from "./publisher-registry";
import { deduplicateSourcePacks, validatePreviewSourcePack, type SourcePack, type SourcePackSource } from "./source-pack";

/** A link-only newsroom signal, as collected into the intake. */
export type CoverageSignal = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
  accessedAt: string;
};

const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "is", "it", "its", "of", "on", "or",
  "that", "the", "this", "to", "was", "were", "will", "with", "report", "audit", "government", "india", "indian",
  "year", "state", "sector", "comptroller", "auditor", "general", "no", "accounts", "finance", "finances"
]);

function subjectTokens(text: string): Set<string> {
  return new Set(
    (text.toLocaleLowerCase("en-IN").normalize("NFKD").match(/[a-z]{4,}/g) ?? [])
      .filter((token) => !stopWords.has(token))
  );
}

function overlapScore(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  return shared;
}

function registryEntry(publisher: string) {
  return publisherRegistry.find((entry) => entry.name === publisher);
}

/**
 * Attaches credited newsroom links to a pack's subject. These are never model input: the
 * schema refuses evidence text on a link-only source, so a reader can follow independent
 * reporting while the story itself is written only from reusable records.
 */
export function selectRelatedCoverage(
  pack: Pick<SourcePack, "title" | "sources">,
  signals: readonly CoverageSignal[],
  maximumPerPublisher = 1,
  maximumTotal = 6
): SourcePack["relatedCoverage"] {
  const subject = subjectTokens(`${pack.title} ${pack.sources.map((source) => source.title).join(" ")}`);
  const scored = signals
    .map((signal) => ({ signal, score: overlapScore(subject, subjectTokens(signal.title)) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.signal.publishedAt.localeCompare(right.signal.publishedAt));

  const perPublisher = new Map<string, number>();
  const chosen: SourcePack["relatedCoverage"] = [];

  for (const { signal } of scored) {
    if (chosen.length >= maximumTotal) break;
    const entry = registryEntry(signal.publisher);
    if (!entry) continue;
    const used = perPublisher.get(signal.publisher) ?? 0;
    if (used >= maximumPerPublisher) continue;
    perPublisher.set(signal.publisher, used + 1);
    chosen.push({
      id: `coverage-${signal.id.replace(/^signal-/, "")}`,
      publisherId: entry.id,
      publisher: signal.publisher,
      title: signal.title,
      url: signal.url,
      sourceKind: "reputable_reporting",
      publishedAt: signal.publishedAt,
      accessedAt: signal.accessedAt,
      evidenceText: "",
      linkAllowed: true,
      modelInputAllowed: false,
      mediaReuseAllowed: false,
      rightsBasis: "link_only",
      policyUrl: entry.sourceUse.policyUrl,
      reviewedAt: entry.sourceUse.reviewedAt,
      creditLine: entry.sourceUse.creditLine
    });
  }

  return chosen;
}

export type ConcentrationWarning = { kind: "publisher" | "source_role"; name: string; share: number; message: string };

/**
 * Concentration is reported as a warning, never as a political label. A single publisher or a
 * single evidence role dominating a batch is a weakness in the record, whoever it is.
 */
export function concentrationWarnings(packs: readonly SourcePack[], threshold = 0.6): ConcentrationWarning[] {
  const warnings: ConcentrationWarning[] = [];
  const publishers = new Map<string, number>();
  const roles = new Map<string, number>();
  let sourceCount = 0;
  let coverageCount = 0;

  for (const pack of packs) {
    for (const source of pack.sources) {
      sourceCount += 1;
      roles.set(source.sourceKind, (roles.get(source.sourceKind) ?? 0) + 1);
    }
    for (const coverage of pack.relatedCoverage) {
      coverageCount += 1;
      publishers.set(coverage.publisher, (publishers.get(coverage.publisher) ?? 0) + 1);
    }
  }

  for (const [name, count] of publishers) {
    const share = count / Math.max(1, coverageCount);
    if (share > threshold) warnings.push({ kind: "publisher", name, share, message: `${name} supplies ${Math.round(share * 100)} per cent of the credited coverage, so the batch leans on one newsroom.` });
  }
  for (const [name, count] of roles) {
    const share = count / Math.max(1, sourceCount);
    if (share > threshold) warnings.push({ kind: "source_role", name, share, message: `${Math.round(share * 100)} per cent of model evidence is ${name.replaceAll("_", " ")}, so the batch hears one kind of record.` });
  }

  return warnings;
}

/** Builds a pack whose India connection names its actual subject rather than a boilerplate line. */
export function composeContestedPack(input: {
  id: string;
  title: string;
  indiaConnection: string;
  sources: readonly SourcePackSource[];
  signals: readonly CoverageSignal[];
  collectedAt: string;
}): SourcePack {
  const draft = { title: input.title, sources: [...input.sources] };
  return validatePreviewSourcePack({
    contractVersion: "syat.source-pack.v1",
    id: input.id,
    title: input.title,
    indiaConnection: input.indiaConnection,
    collectedAt: input.collectedAt,
    sources: draft.sources,
    relatedCoverage: selectRelatedCoverage(draft, input.signals)
  });
}

export function deduplicateContestedPacks(packs: readonly SourcePack[]): SourcePack[] {
  return deduplicateSourcePacks(packs);
}
