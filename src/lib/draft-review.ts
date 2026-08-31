import type { ContentBlock } from "./content-blocks";
import type { GeneratedStory as StoryDraft, SourceDossierRecord } from "./generation-contract";

export type { GeneratedStory } from "./generation-contract";

export type DraftReviewFinding = {
  code:
    | "single-publisher-evidence"
    | "quote-not-in-source"
    | "quote-too-short-to-check"
    | "repeated-claim"
    | "media-rights-review-needed"
    | "source-date-missing"
    | "india-context-missing";
  severity: "blocker" | "warning" | "note";
  message: string;
  relatedId?: string;
};

export type DraftReview = {
  contractVersion: "syat.draft-review.v1";
  status: "blocked" | "needs_editorial_review";
  publicationAllowed: false;
  checks: {
    sourceReferences: "passed";
    directQuotes: "passed" | "blocked";
    repeatedClaims: "passed" | "blocked";
    publisherDiversity: "limited" | "multiple_publishers";
    mediaRights: "not_requested" | "human_review_required";
    indiaContext: "provided" | "missing";
  };
  findings: DraftReviewFinding[];
};

type ReviewContext = {
  indiaConnection: string;
};

function normalise(text: string) {
  return text
    .toLocaleLowerCase("en-IN")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .trim();
}

function findQuoteFindings(blocks: ContentBlock[], sourceDossier: SourceDossierRecord[]) {
  const sourceById = new Map(sourceDossier.map((source) => [source.sourceId, source]));
  const findings: DraftReviewFinding[] = [];

  for (const block of blocks) {
    if (block.kind !== "quote") continue;

    if (normalise(block.text).length < 12) {
      findings.push({
        code: "quote-too-short-to-check",
        severity: "blocker",
        relatedId: block.id,
        message: `Quote ${block.id} is too short to verify against the supplied source excerpt.`
      });
      continue;
    }

    const source = sourceById.get(block.sourceId);
    if (!source || !normalise(source.excerpt).includes(normalise(block.text))) {
      findings.push({
        code: "quote-not-in-source",
        severity: "blocker",
        relatedId: block.id,
        message: `Quote ${block.id} does not appear verbatim in the supplied excerpt for ${block.sourceId}.`
      });
    }
  }

  return findings;
}

export function reviewGeneratedDraft(
  draft: StoryDraft,
  sourceDossier: SourceDossierRecord[],
  context: ReviewContext
): DraftReview {
  const findings: DraftReviewFinding[] = [];
  const quotes = findQuoteFindings(draft.contentBlocks, sourceDossier);
  findings.push(...quotes);

  const claimTexts = new Set<string>();
  for (const statement of draft.statements) {
    const key = normalise(statement.text);
    if (claimTexts.has(key)) {
      findings.push({
        code: "repeated-claim",
        severity: "blocker",
        relatedId: statement.id,
        message: `Claim ${statement.id} repeats an earlier claim and needs consolidation before editorial review.`
      });
    }
    claimTexts.add(key);
  }

  const publisherCount = new Set(sourceDossier.map((source) => normalise(source.publisher))).size;
  if (publisherCount < 2) {
    findings.push({
      code: "single-publisher-evidence",
      severity: "warning",
      message: "This draft has one publisher in its evidence pack. An editor should seek independent reporting or clearly narrow the claim."
    });
  }

  if (draft.mediaPlan.length > 0) {
    findings.push({
      code: "media-rights-review-needed",
      severity: "warning",
      message: "The draft proposes media. It cannot appear until a person records the creator, credit, rights basis, and approval."
    });
  }

  if (draft.story.mode === "news" && sourceDossier.some((source) => !source.publishedAt)) {
    findings.push({
      code: "source-date-missing",
      severity: "warning",
      message: "At least one news source has no publication date. An editor must add or verify that date before publication."
    });
  }

  const indiaContextProvided = context.indiaConnection.trim().length >= 12;
  if (!indiaContextProvided) {
    findings.push({
      code: "india-context-missing",
      severity: "warning",
      message: "The job does not explain its India connection. Add it before asking an editor to assess local relevance."
    });
  }

  const blocked = findings.some((finding) => finding.severity === "blocker");
  return {
    contractVersion: "syat.draft-review.v1",
    status: blocked ? "blocked" : "needs_editorial_review",
    publicationAllowed: false,
    checks: {
      sourceReferences: "passed",
      directQuotes: quotes.length === 0 ? "passed" : "blocked",
      repeatedClaims: findings.some((finding) => finding.code === "repeated-claim") ? "blocked" : "passed",
      publisherDiversity: publisherCount < 2 ? "limited" : "multiple_publishers",
      mediaRights: draft.mediaPlan.length === 0 ? "not_requested" : "human_review_required",
      indiaContext: indiaContextProvided ? "provided" : "missing"
    },
    findings
  };
}
