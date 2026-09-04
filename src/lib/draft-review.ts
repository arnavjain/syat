import { findCloseCopyMatches, type GeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";

export type { GeneratedStoryV2 as GeneratedStory } from "./generation-contract";

export type DraftReviewFinding = {
  code:
    | "single-publisher-evidence"
    | "close-copying"
    | "repeated-claim"
    | "media-rights-review-needed"
    | "source-date-missing"
    | "india-context-missing"
    | "unsupported-finding";
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

type ReviewContext = { indiaConnection: string };

/**
 * Comparative findings a story may only make if its evidence makes them.
 *
 * A CAG overview describes what a report's chapters cover, not what they found. A draft
 * written from one can therefore describe scope honestly and still invent a result. The first
 * article to pass every gate at full marks was headlined "a state budget that spent more than
 * it planned" from evidence containing no comparison at all: not "exceeded", not "higher", not
 * "more than". Inventing a finding about a real state's accounts is worse than writing dully,
 * so a comparison absent from the evidence blocks the draft.
 *
 * Bare fiscal nouns like "deficit" are deliberately excluded: they occur as neutral terms.
 */
type ComparativeClaim = {
  /** How the draft might phrase the direction. */
  claim: RegExp;
  /** Any of these in the evidence supports that direction, however the record words it. */
  support: RegExp;
};

/**
 * A story may only assert a direction its evidence supports, in whatever words the record
 * uses. "Excess" in an audit backs a story saying spending "exceeded" a limit; "unutilised"
 * or "savings" backs one saying spending came in "lower than" budget. What is not allowed is
 * a direction the record never reports at all.
 *
 * "more than once" is a count, not a comparison, so it is excluded rather than treated as a
 * finding about a quantity.
 */
const comparativeClaims: readonly ComparativeClaim[] = [
  {
    claim: /\bexceeded\b|\boverspen[dt]\w*\b|\bover the limit\b|\b(?:more|higher) than (?!once\b|twice\b|one\b|two\b)[^.]{0,40}\b(?:limit|target|budget|provision|approved|estimate|projection)\w*\b/i,
    support: /\bexcess\b|\bexceed\w*\b|\boverspen\w*\b|\bin excess of\b|\bbeyond the\b|\bwithout authority\b/i
  },
  {
    claim: /\bshortfall\b|\bfell short\b|\bunderspen[dt]\w*\b|\b(?:less|lower) than (?!once\b|twice\b)[^.]{0,40}\b(?:limit|target|budget|provision|approved|estimate|projection)\w*\b/i,
    support: /\bshortfall\b|\bshort of\b|\bsaving\w*\b|\bunutilised\b|\bun-?utilized\b|\bsurrender\w*\b|\bnot utilised\b|\bless than\b|\blower than\b/i
  },
  {
    claim: /\bincreased\b|\brose to\b|\bgrew to\b/i,
    support: /\bincreas\w*\b|\brose\b|\bgrew\b|\bgrowth\b|\bhigher\b|\bup from\b/i
  },
  {
    claim: /\bdecreased\b|\bfell to\b|\bdeclined to\b/i,
    support: /\bdecreas\w*\b|\bdeclin\w*\b|\bfell\b|\breduc\w*\b|\blower\b|\bdown from\b/i
  }
];


function normalise(text: string) {
  return text.toLocaleLowerCase("en-IN").normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function visibleClaimText(draft: GeneratedStoryV2): string {
  return [
    draft.story.title,
    draft.story.dek,
    ...draft.bodySections.flatMap((section) => section.paragraphs.map((paragraph) => paragraph.text)),
    ...draft.statements.map((statement) => statement.text),
    ...draft.timeline.map((entry) => entry.text)
  ].join(" ").toLocaleLowerCase("en-IN");
}

export function reviewGeneratedDraft(draft: GeneratedStoryV2, sourceDossier: SourceDossierRecord[], context: ReviewContext): DraftReview {
  const findings: DraftReviewFinding[] = [];

  const evidence = sourceDossier.map((source) => source.evidenceText).join(" ").toLocaleLowerCase("en-IN");
  const visibleClaims = visibleClaimText(draft);
  for (const comparative of comparativeClaims) {
    const claimed = comparative.claim.exec(visibleClaims);
    if (claimed && !comparative.support.test(evidence)) {
      findings.push({
        code: "unsupported-finding",
        severity: "blocker",
        message: `The draft states "${claimed[0].trim()}" as a finding, but no supplied record reports that direction in any wording. Describe what the record covers instead of a result it does not report.`
      });
    }
  }
  const copyMatches = findCloseCopyMatches(draft, sourceDossier);
  for (const match of copyMatches) {
    findings.push({ code: "close-copying", severity: "blocker", relatedId: match.fieldId, message: `Visible field ${match.fieldId} closely copies source wording from ${match.sourceId}.` });
  }
  const claimTexts = new Set<string>();
  for (const statement of draft.statements) {
    const key = normalise(statement.text);
    if (claimTexts.has(key)) {
      findings.push({ code: "repeated-claim", severity: "blocker", relatedId: statement.id, message: `Statement ${statement.id} repeats an earlier statement and must be consolidated.` });
    }
    claimTexts.add(key);
  }

  const publisherCount = new Set(sourceDossier.map((source) => normalise(source.publisher))).size;
  if (publisherCount < 2) {
    findings.push({ code: "single-publisher-evidence", severity: "warning", message: "This draft has one publisher in its evidence pack. Keep claims narrow and seek independent reporting where the event is contested." });
  }

  if (draft.mediaPlan.length > 0) {
    findings.push({ code: "media-rights-review-needed", severity: "warning", message: "The draft proposes external media. It cannot appear until a person records the creator, credit, rights basis, rights proof and approval." });
  }

  if (draft.story.mode === "news" && sourceDossier.some((source) => !source.publishedAt)) {
    findings.push({ code: "source-date-missing", severity: "warning", message: "At least one news source has no publication date. An editor must verify it before final reporting." });
  }

  const indiaContextProvided = context.indiaConnection.trim().length >= 12 && draft.story.indiaConnection.trim().length >= 12;
  if (!indiaContextProvided) {
    findings.push({ code: "india-context-missing", severity: "warning", message: "The job and draft must explain their India connection before editorial assessment." });
  }

  const blocked = findings.some((finding) => finding.severity === "blocker");
  return {
    contractVersion: "syat.draft-review.v1",
    status: blocked ? "blocked" : "needs_editorial_review",
    publicationAllowed: false,
    checks: {
      sourceReferences: "passed",
      directQuotes: copyMatches.length === 0 ? "passed" : "blocked",
      repeatedClaims: findings.some((finding) => finding.code === "repeated-claim") ? "blocked" : "passed",
      publisherDiversity: publisherCount < 2 ? "limited" : "multiple_publishers",
      mediaRights: draft.mediaPlan.length === 0 ? "not_requested" : "human_review_required",
      indiaContext: indiaContextProvided ? "provided" : "missing"
    },
    findings
  };
}
