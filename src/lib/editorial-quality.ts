import type { GeneratedStoryV2 } from "./generation-contract";

export type EditorialQualityCode =
  | "generic-opening"
  | "hype-language"
  | "repeated-opening"
  | "excessive-modal-language"
  | "title-dek-overlap"
  | "sentence-length-monotony"
  | "near-duplicate-paragraph"
  | "near-duplicate-body"
  | "unsupported-causal-language"
  | "missing-concrete-language"
  | "missing-india-connection"
  | "article-word-count"
  | "schema-traceability";

export type EditorialQualityFinding = { code: EditorialQualityCode; message: string; relatedId?: string };

export type EditorialQualityReport = {
  contractVersion: "syat.editorial-quality.v1";
  status: "passed" | "blocked";
  blockers: EditorialQualityFinding[];
  warnings: EditorialQualityFinding[];
  scores: {
    clarity: number;
    usefulness: number;
    evidenceDiscipline: number;
    indiaRelevance: number;
    humanVoice: number;
    perspectiveQuality: number;
    sourceTransparency: number;
  };
};

const stopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "was", "were", "will", "with"]);
const genericOpening = /^(?:in a (?:significant|major|landmark|notable) (?:development|move|step)|in today(?:'s|’s) rapidly evolving landscape|in an era of|it is important to note)/i;
const hypeTerms = /\b(?:groundbreaking|game[ -]?changer|historic milestone|revolutionary|transformative leap|unprecedented success|sweeping victory|massive boost)\b/i;
const modalOrAbstract = new Set(["may", "might", "could", "would", "possibly", "potentially", "impact", "development", "initiative", "stakeholder", "landscape", "significant", "various"]);
const causalTerms = /\b(?:because|therefore|thus|hence|caused?|causing|led to|resulted in|driven by)\b/i;
const reportingVerb = /\b(?:says?|said|states?|stated|attributes?|attributed)\b/i;
const clauseBoundary = /(?:[,;:—–]|\s+\b(?:although|but|however|nevertheless|nonetheless|though|whereas|while|yet)\b\s*)/i;
const concreteTerms = new Set(["road", "lane", "bus", "train", "school", "hospital", "court", "river", "village", "city", "district", "ministry", "office", "record", "report", "route", "street", "market", "worker", "farmer", "student", "household", "rupee", "kilometre", "hectare", "station"]);

function words(text: string): string[] {
  return text.toLocaleLowerCase("en-IN").normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [];
}

function meaningfulTokens(text: string) {
  return new Set(words(text).filter((token) => token.length > 2 && !stopWords.has(token)));
}

function jaccard(left: Set<string>, right: Set<string>) {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function ngrams(text: string, size: number) {
  const tokens = words(text);
  const result = new Set<string>();
  for (let index = 0; index <= tokens.length - size; index += 1) result.add(tokens.slice(index, index + size).join(" "));
  return result;
}

function ngramOverlap(left: string, right: string, size = 5) {
  const leftNgrams = ngrams(left, size);
  const rightNgrams = ngrams(right, size);
  if (leftNgrams.size === 0 || rightNgrams.size === 0) return 0;
  let overlap = 0;
  for (const gram of leftNgrams) if (rightNgrams.has(gram)) overlap += 1;
  return overlap / Math.min(leftNgrams.size, rightNgrams.size);
}

function paragraphs(story: GeneratedStoryV2) {
  return story.bodySections.flatMap((section) => section.paragraphs);
}

function sentences(text: string) {
  return text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
}

function allCausalClausesAreAttributed(text: string) {
  const causalClauses = sentences(text).flatMap((sentence) => sentence.split(clauseBoundary)).filter((clause) => causalTerms.test(clause));
  return causalClauses.length > 0 && causalClauses.every((clause) => {
    const reporting = reportingVerb.exec(clause);
    if (!reporting) return false;
    const causal = causalTerms.exec(clause);
    return Boolean(causal && reporting.index < causal.index);
  });
}

function addUnique(list: EditorialQualityFinding[], finding: EditorialQualityFinding) {
  if (!list.some((item) => item.code === finding.code && item.relatedId === finding.relatedId)) list.push(finding);
}

function hasTraceability(story: GeneratedStoryV2) {
  const claimIds = new Set(story.statements.map((statement) => statement.id));
  const content = paragraphs(story);
  return content.every((paragraph) => paragraph.sourceIds.length > 0 && paragraph.claimIds.length > 0 && paragraph.claimIds.every((claimId) => claimIds.has(claimId)))
    && story.statements.every((statement) => statement.sourceIds.length > 0 && statement.sourceScope.trim().length >= 12 && statement.limits.trim().length >= 12)
    && story.authoredVisual.sourceIds.length > 0
    && story.authoredVisual.claimIds.every((claimId) => claimIds.has(claimId));
}

function score(base: number, deductions: number) {
  return Math.max(1, Math.min(5, base - deductions));
}

export function reviewEditorialQuality(story: GeneratedStoryV2, corpus: readonly GeneratedStoryV2[]): EditorialQualityReport {
  const blockers: EditorialQualityFinding[] = [];
  const warnings: EditorialQualityFinding[] = [];
  const bodyParagraphs = paragraphs(story);
  const opening = bodyParagraphs[0]?.text.trim() ?? "";
  const bodyText = bodyParagraphs.map((paragraph) => paragraph.text).join("\n");
  const bodyWords = words(bodyText);

  if (genericOpening.test(opening)) addUnique(blockers, { code: "generic-opening", message: "The opening begins with a generic announcement phrase instead of the concrete change.", relatedId: bodyParagraphs[0]?.id });
  if (hypeTerms.test(`${story.story.title} ${story.story.dek} ${bodyText}`)) addUnique(blockers, { code: "hype-language", message: "The draft uses promotional or inflated language that the evidence does not establish." });

  const firstFourCounts = new Map<string, number>();
  for (const sentence of sentences(bodyText)) {
    const firstFour = words(sentence).slice(0, 4).join(" ");
    if (firstFour.split(" ").length === 4) firstFourCounts.set(firstFour, (firstFourCounts.get(firstFour) ?? 0) + 1);
  }
  if ([...firstFourCounts.values()].some((count) => count >= 3)) addUnique(warnings, { code: "repeated-opening", message: "Three or more sentences begin with the same four words." });

  const modalCount = bodyWords.filter((word) => modalOrAbstract.has(word)).length;
  if (bodyWords.length > 0 && modalCount / bodyWords.length > 0.055) addUnique(warnings, { code: "excessive-modal-language", message: "Modal or abstract filler makes the article less concrete than it should be." });

  if (jaccard(meaningfulTokens(story.story.title), meaningfulTokens(story.story.dek)) >= 0.72) addUnique(blockers, { code: "title-dek-overlap", message: "The standfirst repeats the headline instead of adding useful information." });

  const sentenceLengths = sentences(bodyText).map((sentence) => words(sentence).length).filter((length) => length > 0);
  if (sentenceLengths.length >= 4 && Math.max(...sentenceLengths) - Math.min(...sentenceLengths) <= 4) addUnique(warnings, { code: "sentence-length-monotony", message: "Sentence lengths are so similar that the article reads mechanically." });

  for (let left = 0; left < bodyParagraphs.length; left += 1) {
    for (let right = left + 1; right < bodyParagraphs.length; right += 1) {
      if (jaccard(meaningfulTokens(bodyParagraphs[left].text), meaningfulTokens(bodyParagraphs[right].text)) >= 0.78 || ngramOverlap(bodyParagraphs[left].text, bodyParagraphs[right].text) >= 0.62) {
        addUnique(blockers, { code: "near-duplicate-paragraph", message: "Two paragraphs repeat substantially the same language.", relatedId: bodyParagraphs[right].id });
      }
    }
  }

  for (const existing of corpus) {
    const existingText = paragraphs(existing).map((paragraph) => paragraph.text).join("\n");
    if (jaccard(meaningfulTokens(bodyText), meaningfulTokens(existingText)) >= 0.8 || ngramOverlap(bodyText, existingText) >= 0.7) {
      addUnique(blockers, { code: "near-duplicate-body", message: `The body is too similar to the existing draft “${existing.story.title}”.` });
      break;
    }
  }

  for (const paragraph of bodyParagraphs) {
    const factualCausalText = paragraph.text
      .replace(/\b(?:matters?|important)\s+because\b/gi, "")
      .replace(/\b(?:no|not)\b[^.!?]{0,100}\bcauses?\b/gi, "")
      .replace(/\brather than\b[^.!?]{0,100}\bcauses?\b/gi, "");
    if (!causalTerms.test(factualCausalText)) continue;
    const linkedStatements = story.statements.filter((statement) => paragraph.claimIds.includes(statement.id));
    const causalBasisPresent = linkedStatements.some((statement) => statement.basis === "direct_record" || statement.basis === "reported_observation");
    const attributedOfficialReason = linkedStatements.some((statement) => statement.basis === "official_claim")
      && allCausalClausesAreAttributed(factualCausalText);
    if (!causalBasisPresent && !attributedOfficialReason) addUnique(blockers, { code: "unsupported-causal-language", message: "Causal wording appears without a direct-record basis or clear attribution as an official claim.", relatedId: paragraph.id });
  }

  const hasNumber = /\b\d[\d,.]*\b/.test(bodyText);
  const hasConcreteTerm = bodyWords.some((word) => concreteTerms.has(word));
  const namedTitleTokens = [...meaningfulTokens(story.story.title)].filter((token) => token.length > 4);
  const hasNamedDetail = namedTitleTokens.some((token) => bodyWords.includes(token));
  if (!hasNumber && !hasConcreteTerm && !hasNamedDetail) addUnique(blockers, { code: "missing-concrete-language", message: "The body lacks a specific place, institution, object, number or other concrete detail." });

  if (!/\b(?:india|indian|bharat)\b/i.test(story.story.indiaConnection)) addUnique(blockers, { code: "missing-india-connection", message: "The India connection is not explicit enough for this preview batch." });
  if (bodyWords.length < 350 || bodyWords.length > 800) addUnique(blockers, { code: "article-word-count", message: `The article body has ${bodyWords.length} words; the approved preview range is 350 to 800.` });
  if (!hasTraceability(story)) addUnique(blockers, { code: "schema-traceability", message: "At least one paragraph, statement or visual cannot be traced to known claims and sources." });

  const languageDeductions = Number(blockers.some((item) => ["generic-opening", "hype-language", "title-dek-overlap"].includes(item.code))) + Number(warnings.some((item) => ["repeated-opening", "sentence-length-monotony", "excessive-modal-language"].includes(item.code)));
  const evidenceDeductions = Number(blockers.some((item) => ["unsupported-causal-language", "schema-traceability"].includes(item.code)));
  const usefulnessDeductions = Number(blockers.some((item) => ["missing-concrete-language", "article-word-count"].includes(item.code)));
  const duplicateDeductions = Number(blockers.some((item) => ["near-duplicate-paragraph", "near-duplicate-body"].includes(item.code)));

  return {
    contractVersion: "syat.editorial-quality.v1",
    status: blockers.length === 0 ? "passed" : "blocked",
    blockers,
    warnings,
    scores: {
      clarity: score(5, languageDeductions),
      usefulness: score(5, usefulnessDeductions),
      evidenceDiscipline: score(5, evidenceDeductions),
      indiaRelevance: score(5, Number(blockers.some((item) => item.code === "missing-india-connection"))),
      humanVoice: score(5, languageDeductions + duplicateDeductions),
      perspectiveQuality: score(5, story.perspectives.length === 0 ? 2 : 0),
      sourceTransparency: score(5, evidenceDeductions)
    }
  };
}
