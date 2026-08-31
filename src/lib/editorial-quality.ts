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
  | "schema-traceability"
  | "officialese"
  | "nominalisation-density"
  | "passive-voice-density"
  | "paragraph-length-monotony"
  | "decorative-dash"
  | "corpus-repeated-opening"
  | "perspective-sameness"
  | "boilerplate-limits"
  | "hedge-stacking";

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
// A PIB-derived draft does not usually fail by being wrong. It fails by reading like a
// circular: borrowed officialese, abstraction where a verb belongs, and every sentence
// built the same way. These checks measure that directly instead of inferring it.
const officialese = /\b(?:inter alia|vide|hereby|the said|aforesaid|aforementioned|in this regard|with a view to|it may be recalled|pursuant to|in pursuance of|w\.e\.f\.|thereof|therein|wherein|hitherto|the undersigned)\b/i;
const nominalisation = /\b\w{4,}(?:tion|ment|ance|ence|ency|ency|ity|isation|ization)s?\b/gi;
const concreteSuffixNouns = new Set([
  "priority", "authority", "majority", "minority", "community", "city", "security", "quality",
  "university", "facility", "utility", "capacity", "electricity", "identity",
  "junction", "station", "nation", "ration", "portion", "section", "auction", "position",
  "document", "instrument", "department", "government", "parliament", "moment", "element",
  "environment", "equipment", "payment", "settlement", "movement", "monument", "apartment",
  "distance", "instance", "substance", "ambulance", "pavement", "sentence", "residence",
  "evidence", "science", "conference", "reference", "difference", "experience", "audience"
]);
const passiveVerb = /\b(?:was|were|is|are|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i;
const hedgeStack = /\b(?:may|might|could|would)\s+(?:possibly|potentially|perhaps|conceivably)\b|\b(?:possibly|potentially|perhaps)\s+(?:may|might|could)\b/i;
const decorativeDash = /[\u2013\u2014]/;
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

/** Every string a reader actually sees, for checks that must cover the whole page. */
function visibleCopy(story: GeneratedStoryV2): string {
  return [
    story.story.title,
    story.story.dek,
    story.story.indiaConnection,
    ...story.bodySections.flatMap((section) => [section.title, ...section.paragraphs.map((paragraph) => paragraph.text)]),
    ...story.statements.flatMap((statement) => [statement.text, statement.sourceScope, statement.limits]),
    ...story.timeline.map((entry) => entry.text),
    ...story.perspectives.flatMap((view) => [view.label, view.rationale, view.sees, view.values, view.uses, view.mayMiss]),
    ...story.people.map((person) => person.association),
    ...story.unresolved.flatMap((item) => [item.question, item.whatWouldHelp]),
    story.contextBridge.question,
    story.contextBridge.connection,
    story.authoredVisual.title,
    story.authoredVisual.description,
    story.authoredVisual.limitation
  ].join("\n");
}

function nominalisationRate(text: string) {
  const total = words(text).length;
  if (total === 0) return 0;
  const matches = (text.match(nominalisation) ?? []).filter((match) => !concreteSuffixNouns.has(match.toLocaleLowerCase("en-IN")));
  return matches.length / total;
}

function passiveRate(text: string) {
  const all = sentences(text);
  if (all.length === 0) return 0;
  return all.filter((sentence) => passiveVerb.test(sentence)).length / all.length;
}

function openingSignature(text: string) {
  return words(text).slice(0, 6).join(" ");
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

  // Voice checks. Only precise signals block; density measures stay advisory because the
  // suffix match cannot perfectly separate a nominalised verb from a concrete noun.
  const visible = visibleCopy(story);

  const officialPhrase = officialese.exec(visible);
  if (officialPhrase) addUnique(blockers, { code: "officialese", message: `Visible copy borrows the source's official register ("${officialPhrase[0]}") instead of plain words.` });

  if (decorativeDash.test(visible)) addUnique(blockers, { code: "decorative-dash", message: "Visible copy uses an em or en dash. News copy uses normal punctuation." });

  for (const existing of corpus) {
    if (openingSignature(paragraphs(existing)[0]?.text ?? "") && openingSignature(bodyParagraphs[0]?.text ?? "") === openingSignature(paragraphs(existing)[0]?.text ?? "")) {
      addUnique(blockers, { code: "corpus-repeated-opening", message: `The article opens with the same six words as "${existing.story.title}".` });
      break;
    }
  }

  for (let left = 0; left < story.perspectives.length; left += 1) {
    for (let right = left + 1; right < story.perspectives.length; right += 1) {
      const first = story.perspectives[left];
      const second = story.perspectives[right];
      const sameSees = jaccard(meaningfulTokens(first.sees), meaningfulTokens(second.sees)) >= 0.7;
      const sameMisses = jaccard(meaningfulTokens(first.mayMiss), meaningfulTokens(second.mayMiss)) >= 0.7;
      if (sameSees || sameMisses) addUnique(blockers, { code: "perspective-sameness", message: "Two perspectives restate the same standpoint instead of genuinely differing.", relatedId: second.id });
    }
  }

  const limitTexts = new Map<string, number>();
  for (const statement of story.statements) {
    const normalisedLimit = words(statement.limits).join(" ");
    limitTexts.set(normalisedLimit, (limitTexts.get(normalisedLimit) ?? 0) + 1);
    if (jaccard(meaningfulTokens(statement.limits), meaningfulTokens(statement.sourceScope)) >= 0.72) {
      addUnique(blockers, { code: "boilerplate-limits", message: "A statement's limit only restates its own source scope, so it adds no evidence discipline.", relatedId: statement.id });
    }
  }
  if (story.statements.length > 1 && [...limitTexts.values()].some((count) => count > 1)) {
    addUnique(blockers, { code: "boilerplate-limits", message: "The same limit is repeated word for word across statements." });
  }

  const nominalRate = nominalisationRate(bodyText);
  if (nominalRate > 0.055) addUnique(warnings, { code: "nominalisation-density", message: `Abstract nouns make up ${(nominalRate * 100).toFixed(1)} per cent of the body, so the prose reads like a form rather than a sentence.` });

  const passiveShare = passiveRate(bodyText);
  if (passiveShare > 0.3) addUnique(warnings, { code: "passive-voice-density", message: `${Math.round(passiveShare * 100)} per cent of sentences are passive, which hides who acted.` });

  const paragraphLengths = bodyParagraphs.map((paragraph) => words(paragraph.text).length);
  if (paragraphLengths.length >= 3 && Math.max(...paragraphLengths) - Math.min(...paragraphLengths) <= 8) {
    addUnique(warnings, { code: "paragraph-length-monotony", message: "Every paragraph is almost exactly the same length, which reads as a template." });
  }

  if (sentences(visible).some((sentence) => hedgeStack.test(sentence))) {
    addUnique(warnings, { code: "hedge-stacking", message: "A sentence stacks two hedges, which weakens a claim without making it more accurate." });
  }

  const languageDeductions = Number(blockers.some((item) => ["generic-opening", "hype-language", "title-dek-overlap"].includes(item.code))) + Number(warnings.some((item) => ["repeated-opening", "sentence-length-monotony", "excessive-modal-language"].includes(item.code)));
  const voiceDeductions =
    Number(blockers.some((item) => ["officialese", "decorative-dash", "corpus-repeated-opening"].includes(item.code))) * 2
    + Number(warnings.some((item) => ["nominalisation-density", "passive-voice-density"].includes(item.code)))
    + Number(warnings.some((item) => ["paragraph-length-monotony", "hedge-stacking"].includes(item.code)));
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
      humanVoice: score(5, languageDeductions + duplicateDeductions + voiceDeductions),
      perspectiveQuality: score(5, (story.perspectives.length === 0 ? 2 : 0) + Number(blockers.some((item) => item.code === "perspective-sameness"))),
      sourceTransparency: score(5, evidenceDeductions + Number(blockers.some((item) => item.code === "boilerplate-limits")))
    }
  };
}
