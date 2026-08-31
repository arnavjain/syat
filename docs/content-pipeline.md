# Syāt content generation pipeline

## Purpose

The AI may prepare a draft, but it cannot publish. Every draft is tied to an intake record and stays `needs_editorial_review` until a person approves factual wording, perspective framing, media rights, and editions.

```text
source intake → source dossier → strict model draft → parser → automatic review → Review Studio → approved version → public projection
                         ↑              ↓                   ↓                    ↓
                 licence record     cost record     blocked on a mismatch     human decision
```

## Model and cost control

- Provider: OpenRouter; model: `deepseek/deepseek-v4-flash-0731`.
- One source dossier per job. Sources are clipped to the smallest useful quoted context.
- The job hashes its input. A matching completed job is reused rather than generated again.
- An estimated cost in paise is written to `generationJobs`; the private-preview monthly cap is ₹1,400.
- A job cannot request a public generation while the queue is over its daily allowance. It moves to `queued` instead.
- Each request provides an India connection in plain words. This makes the local relevance reviewable instead of inferred from a headline.

## Input format

The caller supplies:

```ts
{
  language: "en-IN" | "hi-IN",
  mode: "news" | "timeless",
  editorialBrief: string,
  indiaConnection: string,
  sourceDossier: Array<{
    sourceId: string,
    publisher: string,
    title: string,
    url: string,
    excerpt: string,
    publishedAt?: string,
    accessedAt?: string,
    sourceKind?: "primary_document" | "official_statement" | "reputable_reporting" | "research" | "archive" | "social_embed",
    rightsBasis?: "link_only" | "owned" | "public_domain" | "cc0" | "cc_by" | "cc_by_sa" | "government_open_data" | "official_embed" | "commercial_license",
    reviewStatus?: "pending" | "approved" | "rejected" | "needs_changes"
  }>
}
```

`sourceId` is created before the model runs. The model cannot create a source or cite arbitrary URLs.

## Output format and parser

The executable contract is `src/lib/generation-contract.ts`. It accepts only `syat.story-draft.v1` JSON and checks:

- supported English/Hindi edition code;
- exact draft-only editorial status;
- limits on titles, statements, viewpoints, and media requests;
- at least two perspectives and one unresolved question;
- every cited source exists in the input dossier;
- every reading block names the claim IDs and source IDs it relies on;
- every media idea describes a needed licence, never a cleared asset.

The parser returns `needs_editorial_review`, even if a model tries to suggest anything else. A deterministic writer then turns approved source and claim IDs into `contentBlocks` rows.

## Automatic review output

After parsing, `src/lib/draft-review.ts` writes this compact review record. It can never set `publicationAllowed` to `true`.

```ts
{
  contractVersion: "syat.draft-review.v1",
  status: "blocked" | "needs_editorial_review",
  publicationAllowed: false,
  checks: {
    sourceReferences: "passed",
    directQuotes: "passed" | "blocked",
    repeatedClaims: "passed" | "blocked",
    publisherDiversity: "limited" | "multiple_publishers",
    mediaRights: "not_requested" | "human_review_required",
    indiaContext: "provided" | "missing"
  },
  findings: Array<{
    code: string,
    severity: "blocker" | "warning" | "note",
    message: string,
    relatedId?: string
  }>
}
```

The automatic review blocks a quote that is not word-for-word in the supplied excerpt and blocks repeated factual claims. It warns about a one-publisher dossier, proposed media without a recorded rights decision, missing news dates, or an absent India connection. It does **not** prove a source supports a paraphrase, assess a claim’s real-world truth, decide a source’s political position, or clear publication. Those are human editorial decisions.

## Database mapping

| Contract area | Stored in |
| --- | --- |
| story metadata and writing | `stories`, `storyVersions`, `editions` |
| source citations | `sources`, `storySources`, `statements` |
| perspectives | `perspectives` |
| traceable paragraphs, quotes, and media slots | `contentBlocks` |
| timeline and unresolved questions | `statements` with documented/unresolved type |
| media request and rights review | `mediaAssets`, `storyMedia` |
| cost, retries, and idempotency | `generationJobs`, `publicationOutbox` |
| automatic checks and editor’s disposition | `draftReviews` |

## Human gates

An editor must approve the source trail, distinguish fact from interpretation, select or clear assets, review Hindi wording, and choose whether a story can be published. Comments, community submissions, polls, notifications, personal recommendations, and public on-demand generation remain disabled until their separate policy gates are approved.
