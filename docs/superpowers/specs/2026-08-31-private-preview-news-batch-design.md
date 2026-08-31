# Syāt 100-article private-preview design

## Outcome

Build and deploy exactly 100 India-first News reading pages for the protected friend preview. They are source-linked, AI-assisted editorial previews, not final verified reporting. The batch is only scaled after a small pilot proves that the writing is useful, natural, and supported by the source pack.

The reader should be able to answer five questions after each page:

1. What changed?
2. Why might it matter in India?
3. What does the available evidence establish?
4. What remains uncertain or contested?
5. Where can I inspect the original material?

## Current gap

The present build has one fictional News teaching page, one Timeless fixture, 100 Timeless question prompts, and 59 link-only RSS signals. It does not have a generated article store, an article body renderer, a durable paid-generation ledger, or a path from a parsed draft to a static reader page.

The 59 RSS records also cannot support 100 articles. They contain headlines and links, not approved evidence excerpts. Several publisher terms limit RSS or site use to personal or non-commercial use. Publisher links therefore remain discovery and “read the original coverage” records unless Syāt has explicit reuse permission.

## Editorial and legal boundary

Every generated page uses the visible status `AI-assisted private preview`. Its machine-readable status is `private_preview`, and `publicationAllowed` remains `false`.

The batch may be shown only behind the protected Vercel preview. It must keep `noindex`. It must not appear on an unprotected production domain, in a search feed, or as final Syāt reporting.

Sources have three independent permissions:

- `linkAllowed`: the original page may be credited and linked.
- `modelInputAllowed`: a bounded part of the source may be supplied to OpenRouter.
- `mediaReuseAllowed`: an image, chart, audio item, video, or embed may appear.

One permission never implies another.

The first batch uses model input only from material with a recorded reuse basis. The preferred base is Press Information Bureau material covered by its copyright policy and datasets explicitly published under the Government Open Data License - India. Other public records may be used only when their page carries an equally clear reuse basis. Newsroom reporting from The Indian Express, The Hindu, ThePrint, The Wire, Scroll, Mongabay India, NDTV, and others remains attributed, link-only context unless a source-specific permission record says otherwise.

No publisher is labelled left, right, or centre. Story balance is recorded through source roles: claim maker, affected group, independent reporting, researcher or specialist, court or regulator, and unresolved or absent voice.

## Source acquisition

The pipeline builds at least 100 candidate source packs from records published in the most recent seven complete days at collection time. A pack normally contains:

- one reusable primary or open-licence record;
- one independent newsroom link when relevant;
- one affected-party, specialist, research, court, regulator, or open-data record when available;
- an explicit India connection;
- a short evidence note that says what the source can establish and what it cannot.

The pack is rejected when its only material is a headline, its rights basis is unclear, its event falls outside the seven-day window, it is a duplicate or near-duplicate, or it cannot support a useful reader question.

High-risk automated topics are excluded from the first batch: graphic violence, allegations against private individuals, communal rumours, medical treatment advice, self-harm, sexual harm, stories centred on minors, and live election claims. These may enter a future editor-led workflow, but they are a poor unattended-preview test set.

The target mix is:

| Theme | Target |
| --- | ---: |
| Government and public policy | 20 |
| Economy, work, RBI, and regulation | 15 |
| State and local public services | 15 |
| Climate, environment, agriculture, and science | 15 |
| Courts, rights, and institutions | 10 |
| Health and education systems | 10 |
| Culture, technology, infrastructure, and everyday life | 15 |

The collector may move up to five pieces between neighbouring themes when the seven-day source window is uneven. It may not pad the batch by splitting one event into repetitive articles.

## Article formats and language

The 100 pages use five formats so the product does not feel like a repeated AI template:

- `news_brief`: a narrow update with a short consequence and open question;
- `explainer`: what changed, how the mechanism works, and what to watch;
- `timeline`: an event placed in a short dated sequence;
- `source_map`: where official records, reporting, and affected voices agree or differ;
- `public_impact`: what a rule or system could change for a reader, without giving personal advice.

Each page is 350–800 words. The body has three to six short sections. It begins with the event, not a philosophy statement or generic scene-setting.

Titles are factual and specific. They do not use “shocking,” “game-changing,” “everything you need to know,” “what everyone missed,” or unsupported certainty. A question title is allowed only when the body genuinely answers part of the question.

The tone borrows useful habits from Indian news products without copying them:

- Inshorts: get to the concrete event quickly;
- The Indian Express Explained: name the mechanism and the reader’s real question;
- ThePrint and Scroll: use a specific standfirst that adds information instead of repeating the headline;
- The Wire and opinion pages: make interpretation visible as interpretation rather than neutral fact.

Syāt adds its own discipline: evidence type, source scope, limits, missing voice, and a useful Timeless bridge. It does not imitate any publisher’s wording.

## Canonical data contract

Create one `ReaderStory` contract used by generated files, static routes, the home projection, the archive, and later Convex publication projection. It replaces the current mismatch between `PreviewStory`, `GeneratedStory`, and `PublicationStory`.

The contract contains:

```ts
type ReaderStory = {
  contractVersion: "syat.reader-story.v1";
  id: string;
  slug: string;
  mode: "news";
  locale: "en-IN";
  format: "news_brief" | "explainer" | "timeline" | "source_map" | "public_impact";
  status: "private_preview";
  publicationAllowed: false;
  disclosure: "AI-assisted private preview";
  title: string;
  dek: string;
  theme: string;
  indiaConnection: string;
  eventTime: { kind: "exact_date" | "period" | "unknown"; value?: string; label: string };
  collectedAt: string;
  generatedAt: string;
  updatedAt: string;
  readingMinutes: number;
  body: ContentBlock[];
  statements: ReaderStatement[];
  timeline: ReaderTimelineEntry[];
  perspectives: ReaderPerspective[];
  people: ReaderAssociation[];
  unresolved: ReaderQuestion[];
  contextBridge: { topicSlug: string; question: string; connection: string };
  sources: ReaderSource[];
  media: ApprovedReaderMedia[];
  relatedCoverage: LinkOnlySource[];
  reframe: { kind: "claim" | "question"; value: string };
  generation: GenerationProvenance;
  quality: QualitySummary;
};
```

Every body block, documented statement, timeline entry, perspective, and person association cites known source IDs. Every interpretation includes a scope and limitation. Every person or institution has a plain explanation of why it belongs. Unknown people or affected groups remain unnamed rather than invented.

Full articles live in separate files under `data/stories/news/`. A small `index.json` contains card fields only, so Home does not load 100 full bodies. The same records map without loss to the existing Convex story, version, source, statement, timeline, people, perspective, media, job, and review tables when shared editorial storage is enabled later.

## Generation contract and prompt

The generation contract moves to `syat.story-draft.v2`. The model receives only:

- the approved-for-preview source dossier;
- the chosen article format;
- the India connection;
- a precise editorial brief;
- the source-role and missing-voice record;
- the fixed JSON schema.

The prompt tells the model:

- Use only the dossier. Do not rely on remembered facts.
- Do not invent a person, quote, date, cause, reaction, result, or consensus.
- Do not quote source text. Paraphrase cautiously and cite source IDs.
- Start with the concrete change in plain Indian English.
- Separate official claims, independently established facts, interpretation, and open questions.
- Include a perspective only when the dossier explains why it belongs.
- Never manufacture a second side to make the page look balanced.
- Vary sentence length and section shape. Avoid generic openings and repeated “may/could” filler.
- Return JSON only with `needs_editorial_review`; never claim publication approval.

The parser rejects unknown fields, unknown source IDs, unknown claim IDs, invalid dates, unbounded text, duplicate IDs, missing source scope, unsupported media, an invalid Timeless topic, or any attempt to set a publishable status.

## Durable cost control

The local private batch uses one atomic JSON ledger and one lock file. It records input hash, model, prompt version, reservation ID, reserved paise, actual provider cost, token use, attempt state, and output hash. The key is read only from `.env.local` and is never written to the ledger, story files, terminal output, or source control.

One runner process owns the lock. Before each paid call it writes a durable unique reservation. After the call it writes actual usage and releases unused reservation. A completed input hash is reused. Failed jobs can resume without duplicating accepted output.

Cost gates:

- pilot maximum: ₹100;
- monthly warning: ₹1,000;
- monthly hard stop: ₹1,400;
- maximum two attempts for a changed input;
- no translation, public on-demand generation, or image generation in this batch.

Live OpenRouter model metadata is checked before the first call. `deepseek/deepseek-v4-flash-0731` must still exist and support structured outputs. Provider usage cost is stored and reconciled against the reservation.

## Quality gate and pilot

Generate six pilot articles before scaling:

1. one public-policy brief;
2. one economy or regulation explainer;
3. one climate or science timeline;
4. one public-service impact page;
5. one institutions or rights source map;
6. one culture or technology page.

All six are read in full. The prompt, schema, parser, and quality checks are revised until the pilot passes. A failed pilot is not hidden by averaging it with stronger articles.

Every pilot must meet all blockers:

- every factual sentence has a known source path;
- no source text is quoted or closely copied;
- no named person or exact date is invented;
- no media renders without an approved rights record;
- no source outside its permitted use enters model input;
- the title and dek are supported and not sensational;
- the article is understandable without reading product philosophy;
- the page clearly says what remains unknown;
- the source trail and Timeless bridge both work.

Each pilot is scored from 1 to 5 for clarity, usefulness, evidence discipline, India relevance, human voice, perspective quality, and source transparency. Every dimension must score at least 4 before scale begins.

The deterministic language review flags:

- near-duplicate titles, deks, claims, and body paragraphs;
- repeated first four words across articles;
- generic openings such as “In a significant development”;
- excessive “may,” “could,” “context,” “perspective,” and “stakeholder” language;
- uniform section order across too many pages;
- abstract sentences without a concrete subject and verb;
- claim text that is more specific than its source note;
- unsupported superlatives or causal language.

## Scaling and review loop

After the pilot passes, generation proceeds in waves of ten. Each wave runs:

```text
source validation → budget reservation → structured generation → strict parse
→ evidence and language checks → preview promotion → wave report
```

The next wave does not start when the current wave has a blocker, more than one serious language failure, duplicate coverage, or a median quality score below 4. The failed records are repaired by changing the source pack or brief first; blind regeneration is not the default.

All 100 titles, deks, source trails, India connections, disclosure labels, and quality reports are inspected. The six pilot bodies, every sensitive or institutionally contested page, every automatically flagged page, and a stratified sample of at least 20 remaining bodies receive full close reading. The final independent reviewer reads another cross-theme sample and checks the code and browser flow.

## Reader experience

Home remains selective and fast:

- one lead article;
- six to ten recent articles;
- three to five themed clusters;
- a clear link to “All 100 News previews.”

Add a static `/en/news` archive containing lightweight cards for all 100 pages. Each `/en/news/[slug]` route is statically generated from one validated story file. The route provides article-specific page metadata and remains fast without a client-side story fetch.

The story page renders:

- visible private-preview disclosure;
- headline, standfirst, event date, theme, and reading time;
- article body;
- statement basis and limits;
- timeline when useful;
- associated people and institutions;
- source-grounded perspectives;
- authored visual module;
- source trail and link-only related coverage;
- unresolved questions;
- Context Bridge to one of the 100 Timeless topics;
- Save, Reframe, and next-reading actions.

The 100 pages use Syāt’s existing Warm Commons design language. Format differences change editorial hierarchy, not the product identity. The reader sees one coherent serif/sans system, rounded shapes, restrained colour, and clear mobile order.

## Media and social material

Every article gets at least one Syāt-authored visual module derived from approved structured data: a timeline, process, relationship map, source-role map, number stack, or comparison. These are credited “Syāt visual desk” and say what they cannot show.

External media is optional, not a requirement for the 100-page count. It renders only when creator, source URL, licence, credit, rights proof, review date, alt text, caption, and limitation are complete. PIB permission does not automatically cover third-party material inside a release.

Social posts remain attributed link cards by default. A click-to-load embed is allowed only for an official source post with `official_embed` rights, an approved caption, and a privacy warning. No social SDK loads before a reader taps.

## Verification and completion

The batch is complete only when:

- exactly 100 unique News preview records pass the canonical schema;
- exactly 100 unique static News routes build;
- no record has `publicationAllowed: true`;
- every source and media reference passes its rights/use gate;
- every body and evidence item cites known source IDs;
- all quality blockers are zero;
- the protected deployment remains `noindex` and access-controlled;
- Home, archive, and representative story routes pass desktop and 390px browser review;
- tests, typecheck, lint, content checks, and production build pass;
- the final review report names remaining editorial limits honestly.

The private preview may then be shared with selected friends. Moving any page to final public reporting remains a separate human editorial and rights decision.

## References used for this design

- PIB copyright policy: `https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3`
- Government Open Data License - India: `https://ap.data.gov.in/godl`
- Indian Express RSS terms: `https://indianexpress.com/rss/`
- ThePrint terms: `https://theprint.in/terms-of-use/`
- Scroll terms: `https://scroll.in/terms`
- Mongabay India licence: `https://india.mongabay.com/about/`
- OpenRouter structured outputs: `https://openrouter.ai/docs/guides/features/structured-outputs`
- OpenRouter usage accounting: `https://openrouter.ai/docs/cookbook/administration/usage-accounting`
