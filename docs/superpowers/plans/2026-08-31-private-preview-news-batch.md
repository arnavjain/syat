# Syāt 100-article Private Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, review, and deploy exactly 100 India-first, source-linked, AI-assisted News pages to Syāt's protected friend preview.

**Architecture:** Reusable public records become bounded source packs, a strict OpenRouter contract produces review-only JSON, deterministic checks and a pilot gate stop weak output, and an adapter writes one validated static `ReaderStory` file per route. Home loads only a small index projection; the archive and story pages remain static and the paid batch uses an atomic local spend ledger.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Zod 4, Vitest 4, OpenRouter structured outputs, DeepSeek V4 Flash, static JSON, Vercel Hobby.

**Spec:** `docs/superpowers/specs/2026-08-31-private-preview-news-batch-design.md`

## Global Constraints

- The output count is exactly 100 News preview records and exactly 100 generated News preview routes.
- Every page visibly says `AI-assisted private preview`, uses status `private_preview`, and keeps `publicationAllowed: false`.
- The deployed review stays protected and `noindex`; this task does not authorize final public publication.
- Public reading pages are static server-rendered pages first; client code exists only for an interaction.
- Every source is credited and linked. Synthesis must use Syāt's own wording and must not copy passages.
- Attribution does not replace a rights check. `linkAllowed`, `modelInputAllowed`, and `mediaReuseAllowed` are separate fields.
- Never imitate Googlebot, bypass access controls, or automate a publisher path that prohibits automated collection.
- Newsroom pages may be attributed link-only context; model input uses only material with a recorded reuse basis.
- Public-record claims remain attributed claims until independently supported; no government release is presented as neutral verification of itself.
- No publisher-level left/right/centre score is stored. Balance is assessed through source roles and missing voices.
- External media never renders without creator, source, credit, rights proof, review status, and accessibility metadata.
- OpenRouter warns at ₹1,000/month, stops before ₹1,400/month, and the six-story pilot stops before ₹100.
- The API key remains in `.env.local`; tests, logs, story files, reports, and commits must never contain it.
- Use the Warm Commons serif/sans design language and keep Home selective so 100 full bodies never enter its module graph.
- Do not scale past six pilot stories until every pilot quality dimension scores at least 4/5 and all blockers are zero.

## File Structure

### Canonical reader records

- `src/lib/reader-story-schema.ts` — the one strict public-preview story contract.
- `src/lib/reader-stories.ts` — server-only loading, index validation, static params, and featured projections.
- `src/lib/promote-generated-story.ts` — converts a parsed review-only draft into a `ReaderStory`; never promotes uncleared media.
- `data/stories/news/index.json` — lightweight card metadata only.
- `data/stories/news/{story-slug}.json` — one full validated record per article; `{story-slug}` is the validated stable slug stored in the index.

### Source acquisition

- `src/lib/source-rights.ts` — separate link/model/media-use decisions and policy evidence.
- `src/lib/source-pack.ts` — source-pack schema, event selection, risk exclusions, and source-role validation.
- `src/lib/pib-source-parser.ts` — pure parsers for PIB release-list and detail HTML.
- `scripts/collect-pib-source-packs.ts` — polite seven-day collection with bounded concurrency and atomic output.
- `data/source-packs/candidates.json` — collected public-record candidates and link-only related coverage.
- `data/source-packs/approved-preview.json` — only packs permitted for private-preview generation.

### Generation and quality

- `src/lib/generation-contract.ts` — `syat.story-draft.v2` schema and prompt.
- `src/lib/draft-review.ts` — structural and evidence-review output.
- `src/lib/editorial-quality.ts` — natural-language, duplication, and usefulness checks.
- `src/lib/local-generation-ledger.ts` — atomic reservations, actual-cost reconciliation, input-hash reuse, and lock ownership.
- `scripts/generate-preview-batch.ts` — pilot/wave/resume runner.
- `.syat-private/generation-ledger.json` — ignored local durable ledger; contains no key.
- `data/generation-reports/pilot.json` and `data/generation-reports/wave-*.json` — safe review summaries.

### Reader surfaces

- `src/components/story-body.tsx` — paragraph and approved-media block renderer.
- `src/components/story-visual.tsx` — Syāt-authored timeline/process/source-role/relationship/number visual.
- `src/components/story-page.tsx` — canonical `ReaderStory` page.
- `src/app/en/news/page.tsx` — static archive of all 100 preview cards.
- `src/app/en/news/[slug]/page.tsx` — static route and page metadata from the canonical loader.
- `src/lib/home-content.ts` and `src/components/home-view.tsx` — small featured/latest/theme projection.
- `src/app/en/studio/page.tsx` and `src/components/preview-quality-dashboard.tsx` — read-only batch quality and cost summary.

---

### Task 1: Canonical reader-story contract and static loader

**Files:**
- Create: `src/lib/reader-story-schema.ts`
- Create: `src/lib/reader-stories.ts`
- Create: `src/lib/reader-story-schema.test.ts`
- Create: `src/lib/reader-stories.test.ts`
- Create: `data/stories/news/index.json`

**Interfaces:**
- Produces: `readerStorySchema`, `readerStoryIndexItemSchema`, `ReaderStory`, `ReaderStoryIndexItem`.
- Produces: `getNewsStory(slug): ReaderStory | undefined`, `getNewsStoryIndex(): readonly ReaderStoryIndexItem[]`, `getNewsStoryStaticParams(): Array<{ slug: string }>`, and `getFeaturedNewsStories(limit: number): readonly ReaderStoryIndexItem[]`.
- Consumes later: generated files in `data/stories/news/{story-slug}.json`; no client component imports the full corpus.

- [ ] **Step 1: Write the failing canonical-schema tests**

```ts
it("accepts only a non-publishable private-preview story", () => {
  const parsed = readerStorySchema.parse(makeValidReaderStory());
  expect(parsed.status).toBe("private_preview");
  expect(parsed.publicationAllowed).toBe(false);
  expect(parsed.disclosure).toBe("AI-assisted private preview");
});

it("rejects an unknown claim or source reference", () => {
  const story = makeValidReaderStory();
  story.body[0].sourceIds = ["missing-source"];
  expect(() => readerStorySchema.parse(story)).toThrow(/missing-source/);
});
```

- [ ] **Step 2: Run the focused tests and confirm they fail because the module is missing**

Run: `npm test -- src/lib/reader-story-schema.test.ts src/lib/reader-stories.test.ts`

Expected: FAIL with module-resolution errors for `reader-story-schema` and `reader-stories`.

- [ ] **Step 3: Implement the strict Zod contract**

```ts
export const readerStorySchema = z.object({
  contractVersion: z.literal("syat.reader-story.v1"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  mode: z.literal("news"),
  locale: z.literal("en-IN"),
  status: z.literal("private_preview"),
  publicationAllowed: z.literal(false),
  disclosure: z.literal("AI-assisted private preview"),
  format: z.enum(["news_brief", "explainer", "timeline", "source_map", "public_impact"]),
  title: z.string().min(12).max(160),
  dek: z.string().min(20).max(320),
  body: z.array(readerContentBlockSchema).min(3).max(18),
  sources: z.array(readerSourceSchema).min(1).max(12),
  relatedCoverage: z.array(linkOnlySourceSchema).max(12),
  publication: z.object({ approvedByHuman: z.literal(false), finalReporting: z.literal(false) })
}).strict().superRefine(assertReaderReferences);
```

Define the complete evidence, time, source, perspective, association, media, context-bridge, Reframe, generation, and quality records from the approved spec. `assertReaderReferences` must verify every claim/source/topic/media reference and reject duplicate IDs.

- [ ] **Step 4: Implement server-only file loading and index consistency**

```ts
import "server-only";

export function getNewsStory(slug: string): ReaderStory | undefined {
  const path = join(process.cwd(), "data/stories/news", `${slug}.json`);
  if (!existsSync(path)) return undefined;
  return readerStorySchema.parse(JSON.parse(readFileSync(path, "utf8")));
}
```

The loader must reject an index slug without a file, a file without an index row, duplicate slugs, and an index card whose title/dek/date differs from the full record.

- [ ] **Step 5: Keep the initial index valid and explicitly empty**

```json
{
  "contractVersion": "syat.reader-story-index.v1",
  "generatedAt": "2026-08-31T00:00:00.000Z",
  "items": []
}
```

- [ ] **Step 6: Run tests, typecheck, and diff checks**

Run: `npm test -- src/lib/reader-story-schema.test.ts src/lib/reader-stories.test.ts && npm run typecheck && git diff --check`

Expected: PASS.

- [ ] **Step 7: Commit the canonical reader foundation**

```bash
git add src/lib/reader-story-schema.ts src/lib/reader-stories.ts src/lib/reader-story-schema.test.ts src/lib/reader-stories.test.ts data/stories/news/index.json
git commit -m "feat: add canonical preview story records"
```

### Task 2: Reuse-aware public-record collection and source packs

**Files:**
- Create: `src/lib/source-rights.ts`
- Create: `src/lib/source-rights.test.ts`
- Create: `src/lib/source-pack.ts`
- Create: `src/lib/source-pack.test.ts`
- Create: `src/lib/pib-source-parser.ts`
- Create: `src/lib/pib-source-parser.test.ts`
- Create: `scripts/collect-pib-source-packs.ts`
- Modify: `src/lib/publisher-registry.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `SourceUseDecision`, `SourcePack`, `sourcePackSchema`, `canEnterModelInput(source)`, `validatePreviewSourcePack(pack)`.
- Produces: `extractPibReleaseLinks(html)`, `parsePibRelease(html, url, accessedAt)`.
- Produces command: `npx tsx scripts/collect-pib-source-packs.ts --days 7 --limit 180 --output data/source-packs/candidates.json`.

- [ ] **Step 1: Write failing rights and source-pack tests**

```ts
it("does not infer model permission from attribution or link permission", () => {
  expect(canEnterModelInput({ linkAllowed: true, modelInputAllowed: false, creditLine: "ThePrint" })).toBe(false);
});

it("requires reusable evidence and an explicit India connection", () => {
  const result = sourcePackSchema.safeParse(makePack({ indiaConnection: "", sources: [headlineOnlySource] }));
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Write failing PIB parser tests with small authored HTML fixtures**

```ts
it("extracts unique release IDs and titles from the official list", () => {
  expect(extractPibReleaseLinks(listHtml)).toEqual([
    { id: "2305021", title: "Century-old limit on turning heat into electricity surpassed", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305021" }
  ]);
});

it("removes navigation, image labels, and footer text from the release evidence", () => {
  const release = parsePibRelease(detailHtml, officialUrl, new Date("2026-08-31T12:00:00Z"));
  expect(release.evidenceText).not.toMatch(/Visitor Counter|Follow us|Image:/i);
  expect(release.publishedAt).toBe("2026-08-31T00:00:00.000Z");
});
```

- [ ] **Step 3: Implement separate reuse decisions and exact policy records**

```ts
export type SourceUseDecision = {
  linkAllowed: boolean;
  modelInputAllowed: boolean;
  mediaReuseAllowed: boolean;
  rightsBasis: "link_only" | "government_reproduction_policy" | "government_open_data" | "explicit_licence";
  policyUrl: string;
  reviewedAt: string;
  creditLine: string;
};
```

Add PIB's official copyright-policy URL and the Government Open Data Licence URL. Mark Indian Express, The Hindu, ThePrint, The Wire, Scroll, Mongabay India, and NDTV link-only unless an exact source override is later recorded.

- [ ] **Step 4: Implement pack validation, risk exclusions, and duplicate-event checks**

```ts
export function validatePreviewSourcePack(pack: unknown) {
  const parsed = sourcePackSchema.parse(pack);
  if (!parsed.sources.some(canEnterModelInput)) throw new Error("The source pack has no evidence permitted for model input.");
  if (blockedPreviewRiskPatterns.some((pattern) => pattern.test(parsed.title))) throw new Error("The source pack is outside the unattended preview risk boundary.");
  return parsed;
}
```

Use URL identity plus normalised-title token similarity to prevent one event from becoming multiple packs. Related newsroom links may support discovery but cannot fill the reusable-evidence requirement.

- [ ] **Step 5: Implement polite PIB list/detail collection**

Fetch `https://www.pib.gov.in/AllRel.aspx?lang=1&reg=1` and its date form for each requested day. Use `Accept: text/html`, no impersonated user agent, at most two concurrent detail requests, a 12-second timeout, one retry for a transient 5xx, and a 250ms minimum start gap. Fetch the clean `PressReleasePage.aspx?PRID=...` detail page, not images or third-party assets.

Write the candidate document beside the requested output with a `.next` suffix, validate it, then rename atomically. A partial collection must leave the last good file unchanged.

- [ ] **Step 6: Add the collector and private-ledger paths to `.gitignore` correctly**

```gitignore
.syat-private/
data/source-packs/*.next
```

The approved source-pack JSON and safe generation reports remain tracked; the local spend ledger and lock do not.

- [ ] **Step 7: Run focused tests and a read-only ten-record collection probe**

Run: `npm test -- src/lib/source-rights.test.ts src/lib/source-pack.test.ts src/lib/pib-source-parser.test.ts`

Then run: `npx tsx scripts/collect-pib-source-packs.ts --days 1 --limit 10 --output /tmp/syat-pib-probe.json`

Expected: tests PASS; probe contains ten or fewer valid candidates and prints only counts, dates, and publisher distribution—never source bodies.

- [ ] **Step 8: Commit source collection**

```bash
git add .gitignore src/lib/source-rights.ts src/lib/source-rights.test.ts src/lib/source-pack.ts src/lib/source-pack.test.ts src/lib/pib-source-parser.ts src/lib/pib-source-parser.test.ts scripts/collect-pib-source-packs.ts src/lib/publisher-registry.ts
git commit -m "feat: collect reuse-aware public source packs"
```

### Task 3: Story-draft v2 contract, promotion adapter, and quality checks

**Files:**
- Modify: `src/lib/generation-contract.ts`
- Modify: `src/lib/generation-contract.test.ts`
- Modify: `src/lib/draft-review.ts`
- Modify: `src/lib/draft-review.test.ts`
- Create: `src/lib/editorial-quality.ts`
- Create: `src/lib/editorial-quality.test.ts`
- Create: `src/lib/promote-generated-story.ts`
- Create: `src/lib/promote-generated-story.test.ts`
- Modify: `src/lib/openrouter-story-client.ts`
- Modify: `src/lib/openrouter-story-client.test.ts`

**Interfaces:**
- Produces: `generatedStoryV2ResponseSchema`, `buildStoryDraftV2Prompt`, `parseGeneratedStoryV2Json`.
- Produces: `reviewEditorialQuality(story, corpus): EditorialQualityReport`.
- Produces: `promoteGeneratedStory({ draft, draftReview, qualityReview, sourcePack, approvedMedia }): ReaderStory`.

- [ ] **Step 1: Write failing v2 contract tests**

```ts
it("supports exact, period, and unknown timeline time without invented dates", () => {
  const json = JSON.stringify(makeDraft({ timeline: [{ time: { kind: "unknown", label: "Outcome date not yet known" } }] }));
  expect(parseGeneratedStoryV2Json(json, dossier).timeline[0].time.kind).toBe("unknown");
});

it("requires a basis, source scope, and limit for every statement", () => {
  const json = JSON.stringify(makeDraft({ statements: [{ ...statement, limits: "" }] }));
  expect(() => parseGeneratedStoryV2Json(json, dossier)).toThrow();
});
```

- [ ] **Step 2: Write failing natural-language and promotion tests**

```ts
it("blocks generic AI openings and near-duplicate paragraphs", () => {
  const report = reviewEditorialQuality(makeStory({ opening: "In a significant development..." }), [nearDuplicateStory]);
  expect(report.blockers.map((item) => item.code)).toContain("generic-opening");
  expect(report.blockers.map((item) => item.code)).toContain("near-duplicate-body");
});

it("cannot promote a draft with an uncleared media plan", () => {
  expect(() => promoteGeneratedStory({ ...validInputs, approvedMedia: [], draft: draftWithMediaBlock })).toThrow(/approved media/i);
});
```

- [ ] **Step 3: Implement `syat.story-draft.v2`**

Add format, three-to-six titled body sections, source-scoped statements, flexible timeline time, source-bound perspective rationale, people/institution associations, unresolved evidence needs, Context Bridge topic slug, and one authored visual specification. Keep `editorialStatus: "needs_editorial_review"` and reject any publication field.

- [ ] **Step 4: Replace the prompt with the approved language rules**

```ts
const editorialRules = [
  "Use only the supplied dossier; do not use remembered facts.",
  "Do not quote or closely copy source wording.",
  "Begin with the concrete change, not a generic announcement phrase.",
  "Name official claims as claims and keep interpretation visibly separate.",
  "Include a standpoint only when a source explains why it belongs.",
  "Do not manufacture a second side or a personal reaction."
];
```

Include examples of rejected generic phrasing, but do not include copied publisher paragraphs. Keep the existing prompt byte ceilings and add `provider.require_parameters: true`.

- [ ] **Step 5: Implement deterministic editorial-quality checks**

Check generic openings, hype terms, repeated first four words, excessive modal/abstract words, title/dek overlap, sentence-length monotony, paragraph and story similarity, unsupported causal terms, absent concrete nouns, required India connection, article word count, and schema traceability. Use token-set Jaccard and n-gram overlap; do not add an embedding service.

- [ ] **Step 6: Implement promotion without unsafe casts**

```ts
if (draftReview.status === "blocked" || qualityReview.blockers.length > 0) {
  throw new Error("A blocked draft cannot become a reader preview.");
}
return readerStorySchema.parse({
  contractVersion: "syat.reader-story.v1",
  status: "private_preview",
  publicationAllowed: false,
  disclosure: "AI-assisted private preview",
  ...mapDraftFields(draft, sourcePack, approvedMedia)
});
```

The adapter derives source cards, Reframe input, reading time, generation provenance, and the approved Timeless topic link. It must never convert `mediaPlan` directly into media.

- [ ] **Step 7: Capture OpenRouter's actual usage cost while retaining the conservative reservation**

Extend the response type to accept `usage.cost`. Validate that it is finite and non-negative. Return both `reservedMaximumPaise` and `actualCostUsd`; do not trust model text for cost.

- [ ] **Step 8: Run focused and full contract tests**

Run: `npm test -- src/lib/generation-contract.test.ts src/lib/draft-review.test.ts src/lib/editorial-quality.test.ts src/lib/promote-generated-story.test.ts src/lib/openrouter-story-client.test.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 9: Commit the v2 generation boundary**

```bash
git add src/lib/generation-contract.ts src/lib/generation-contract.test.ts src/lib/draft-review.ts src/lib/draft-review.test.ts src/lib/editorial-quality.ts src/lib/editorial-quality.test.ts src/lib/promote-generated-story.ts src/lib/promote-generated-story.test.ts src/lib/openrouter-story-client.ts src/lib/openrouter-story-client.test.ts
git commit -m "feat: add reviewed story draft v2"
```

### Task 4: Atomic local spend ledger and resumable batch runner

**Files:**
- Create: `src/lib/local-generation-ledger.ts`
- Create: `src/lib/local-generation-ledger.test.ts`
- Create: `scripts/generate-preview-batch.ts`
- Modify: `scripts/smoke-openrouter.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `LocalGenerationLedger.reserve(request)`, `.complete(receipt, usage)`, `.fail(receipt, errorCode)`, `.getByInputHash(hash)`, `.summary(month)`.
- Produces commands: `npm run content:generate-pilot` and `npm run content:generate-wave -- --start 6 --count 10`.

- [ ] **Step 1: Write failing ledger tests**

```ts
it("writes a unique reservation before a paid call and reuses a completed input hash", async () => {
  const first = await ledger.reserve(request);
  await ledger.complete(first, { actualCostUsd: 0.001, promptTokens: 100, completionTokens: 200, outputHash: "out-1" });
  expect(await ledger.getByInputHash(request.inputHash)).toMatchObject({ state: "completed", outputHash: "out-1" });
});

it("refuses a reservation that reaches the ₹1,400 hard stop", async () => {
  await seedLedgerAtPaise(139_990);
  await expect(ledger.reserve({ ...request, estimatedPaise: 10 })).rejects.toThrow(/hard stop/i);
});
```

- [ ] **Step 2: Implement a single-owner lock and atomic ledger writes**

Use `open(lockPath, "wx")` for lock ownership. Every mutation reads and validates the complete ledger, writes the same ledger path with a `.next` suffix, `fsync`s the file, renames it, and releases only its own lock. A stale lock is never deleted automatically; the command prints the exact path and stops safely.

- [ ] **Step 3: Implement reservation, reconciliation, retry, and input-hash reuse**

```ts
const decision = authoriseGenerationBudget({ spentPaise, reservedPaise, estimatedPaise });
if (!decision.allowed) throw new Error(`Generation hard stop: ${decision.reason}`);
const receipt = { reservationId: randomUUID(), inputHash, estimatedPaise, state: "reserved", createdAt: now };
```

The completion record stores provider tokens, provider cost, INR conversion used, output hash, and released amount. A failed attempt remains auditable. Two attempts maximum are permitted only for a changed input or a transient provider failure.

- [ ] **Step 4: Implement the pilot/wave runner**

The runner validates source packs, checks live model metadata from OpenRouter's public models endpoint, acquires the ledger lock, resolves completed hashes, reserves before `createStoryDraft`, parses/reviews/promotes, writes one story and one wave report atomically, and updates the index only after every record in the requested wave passes.

It prints progress as `3/6 passed · reserved ₹x.xx · actual ₹x.xx` without prompts, source bodies, API responses, or the key.

- [ ] **Step 5: Repair the stale smoke script through the real reservation interface**

Give its fictional dossier full source kind, rights basis, and preview-generation approval. Use an in-memory test reservation only for the smoke command, label it non-durable, and prevent it from running unless `SYAT_ALLOW_PAID_SMOKE=yes` is set.

- [ ] **Step 6: Add scripts**

```json
{
  "content:generate-pilot": "node --env-file=.env.local --import tsx scripts/generate-preview-batch.ts --pilot --count 6",
  "content:generate-wave": "node --env-file=.env.local --import tsx scripts/generate-preview-batch.ts"
}
```

- [ ] **Step 7: Run tests with a fake provider and a temporary ledger**

Run: `npm test -- src/lib/local-generation-ledger.test.ts src/lib/openrouter-story-client.test.ts && npm run typecheck`

Expected: PASS; zero network calls and zero cost.

- [ ] **Step 8: Commit cost control and the batch runner**

```bash
git add src/lib/local-generation-ledger.ts src/lib/local-generation-ledger.test.ts scripts/generate-preview-batch.ts scripts/smoke-openrouter.ts package.json package-lock.json
git commit -m "feat: add resumable cost-capped generation"
```

### Task 5: Six-story quality pilot

**Files:**
- Create: `data/source-packs/candidates.json`
- Create: `data/source-packs/approved-preview.json`
- Create: `data/generation-reports/pilot.json`
- Create: `docs/content/pilot-quality-review-2026-08-31.md`
- Create: `data/stories/news/india-q1-gdp-growth-2026-27.json`
- Create: `data/stories/news/heat-electricity-sensing-breakthrough.json`
- Create: `data/stories/news/neet-pg-jaipur-reexam.json`
- Create: `data/stories/news/depalpur-legacy-waste-clearance.json`
- Create: `data/stories/news/cpgrams-july-2026-grievances.json`
- Create: `data/stories/news/upi-uzbekistan-uzqr-partnership.json`
- Modify: `data/stories/news/index.json`

**Interfaces:**
- Produces: six validated `ReaderStory` records in six distinct themes/formats.
- Produces: a scored pilot report with clarity, usefulness, evidence discipline, India relevance, human voice, perspective quality, and source transparency.

- [ ] **Step 1: Collect and validate the most recent seven-day candidate pool**

Run: `npx tsx scripts/collect-pib-source-packs.ts --days 7 --limit 180 --output data/source-packs/candidates.json`

Expected: a complete atomic snapshot with collection dates, exact policy URLs, no third-party media, and enough non-duplicate candidates to select six useful topics.

- [ ] **Step 2: Select six diverse, low-risk packs**

Choose one policy, economy/regulation, climate/science, public-service, institution/rights, and culture/technology record. Reject ceremonial-only items when they do not create a useful reader question. Add related newsroom links only from the existing link-only queue or manually opened original pages; never copy their body text into the pack.

- [ ] **Step 3: Run the pilot under the ₹100 pilot limit**

Run: `npm run content:generate-pilot`

Expected: exactly six parsed preview records, a durable ledger receipt for every paid attempt, no key or source body printed, and `publicationAllowed: false` throughout.

- [ ] **Step 4: Run all deterministic checks and read all six articles in full**

Run: `npm run content:check && npm test -- src/lib/reader-story-schema.test.ts src/lib/editorial-quality.test.ts`

For each article, record a 1–5 score for the seven dimensions and quote only Syāt-authored problem phrases in the review document. Compare the opening/standfirst function—not wording—with the reviewed Inshorts, Indian Express Explained, ThePrint, Scroll, and The Wire examples.

- [ ] **Step 5: Turn every pilot failure into a regression test before regeneration**

If any dimension is below 4 or any blocker exists, return to Task 3 and first add a failing test containing only the smallest Syāt-authored sentence or metadata shape that exposed the problem. Repair `generation-contract.ts`, `editorial-quality.ts`, or the individual source pack according to that test, then regenerate only changed input hashes. Do not continue to Task 6 until all six score at least 4 in every dimension.

- [ ] **Step 6: Re-run the pilot gate and verify the stored count is six**

Run: `npm run content:check && node -e "const i=require('./data/stories/news/index.json'); if(i.items.length!==6) process.exit(1)"`

Expected: PASS and count `6`.

- [ ] **Step 7: Commit the accepted pilot and its review**

```bash
git add data/source-packs/candidates.json data/source-packs/approved-preview.json data/generation-reports/pilot.json data/stories/news docs/content/pilot-quality-review-2026-08-31.md src/lib/generation-contract.ts src/lib/editorial-quality.ts
git commit -m "content: add reviewed six-story pilot"
```

### Task 6: Static News archive, article body, visuals, and Home projection

**Files:**
- Create: `src/components/story-body.tsx`
- Create: `src/components/story-body.test.tsx`
- Create: `src/components/story-visual.tsx`
- Create: `src/components/story-visual.test.tsx`
- Create: `src/app/en/news/page.tsx`
- Modify: `src/app/en/news/[slug]/page.tsx`
- Modify: `src/components/story-page.tsx`
- Modify: `src/components/post-timeline.tsx`
- Modify: `src/components/associated-people.tsx`
- Modify: `src/components/context-bridge.tsx`
- Modify: `src/components/statement-basis-sheet.tsx`
- Modify: `src/lib/home-content.ts`
- Modify: `src/components/home-view.tsx`
- Modify: `src/components/editorial-feed.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/lib/preview-content.test.ts`
- Modify: `src/lib/home-content.test.ts`

**Interfaces:**
- Consumes: `ReaderStory`, index loader, and six pilot records.
- Produces: static `/en/news`, pilot `/en/news/[slug]` routes, article-specific metadata, body blocks, authored visuals, and a small Home projection.

- [ ] **Step 1: Write failing route, body, and status tests**

```ts
it("renders the article body and preview disclosure", () => {
  const html = renderToStaticMarkup(<StoryPage story={readerStory} />);
  expect(html).toContain("AI-assisted private preview");
  expect(html).toContain(readerStory.body[0].text);
  expect(html).not.toContain("fictional teaching fixture");
});

it("returns one static param per indexed story", () => {
  expect(getNewsStoryStaticParams()).toHaveLength(6);
});
```

- [ ] **Step 2: Run focused tests and confirm fixture-specific assumptions fail**

Run: `npm test -- src/components/story-body.test.tsx src/components/story-visual.test.tsx src/lib/preview-content.test.ts src/lib/home-content.test.ts`

Expected: FAIL because the canonical body, archive, and status-driven reader do not exist.

- [ ] **Step 3: Implement the static body and authored visual renderers**

Render paragraphs as server HTML. Quotes remain unsupported in this batch. Render `timeline`, `process`, `source_roles`, `relationship`, `number_stack`, and `comparison` visuals from structured data with credit, limitation, and accessible text. External media requires an approved record and uses explicit dimensions plus lazy loading.

- [ ] **Step 4: Generalise StoryPage from fixture copy to status-driven copy**

Use `ReaderStory` for generated routes and preserve the old fixture through a deliberate fixture adapter. Replace “fixture” labels only for generated stories. Keep the source rail, statement basis, timeline, people, Context Bridge, source trail, and Reframe return loop.

- [ ] **Step 5: Implement the static archive and story metadata**

```ts
export function generateStaticParams() {
  return getNewsStoryStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const story = getNewsStory(params.slug);
  return { title: story?.title, description: story?.dek, robots: { index: false, follow: false } };
}
```

The archive imports the index only and groups cards by theme. Every card shows date, format, source count, and preview status.

- [ ] **Step 6: Replace hardcoded Home News content with a small index projection**

Home shows one lead, six to ten latest cards, three themed entry points, and an “All 100 News previews” archive link. While the pilot count is six, the archive label says “Browse the pilot” and changes automatically at 100. Do not import full story JSON into Home.

- [ ] **Step 7: Add responsive, consistent Warm Commons styles**

Test long Indian names and headlines, compact source metadata, body measure near 68 characters, touch targets at least 44px, a non-overlapping mobile story rail, authored visuals that fit 390px, and restrained use of rounded frames and colour.

- [ ] **Step 8: Run focused tests, typecheck, lint, and build**

Run: `npm test -- src/components/story-body.test.tsx src/components/story-visual.test.tsx src/lib/home-content.test.ts && npm run typecheck && npm run lint && npm run build`

Expected: PASS; six new static News routes appear and Home remains static.

- [ ] **Step 9: Commit the reader integration**

```bash
git add src/components src/app/en/news src/lib/home-content.ts src/app/globals.css src/lib/preview-content.test.ts src/lib/home-content.test.ts
git commit -m "feat: render static preview news library"
```

### Task 6A: Finish the landing page and first-time onboarding

**Files:**
- Modify: `src/components/home-view.tsx`
- Modify: `src/components/home-view.test.tsx`
- Modify: `src/components/guided-onboarding.tsx`
- Modify: `src/components/guided-onboarding.test.tsx`
- Modify: `src/lib/onboarding.ts`
- Modify: `src/lib/onboarding.test.ts`
- Modify: `src/components/site-chrome.tsx`
- Modify: `src/app/en/onboarding/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: the accepted six-story pilot, lightweight News index, existing News/Timeless switch, local onboarding state, and the Warm Commons design contract.
- Produces: a static, mobile-first landing page that explains Syāt within one screen and a guided first-use path through reading, evidence, saving, Context Bridge, and Reframe.

- [ ] **Step 1: Write failing landing and onboarding journey tests**

Test the full first-use path, not just isolated copy:

- Home states what Syāt does in plain words and offers one primary action, `Start reading`.
- `Take the two-minute tour` is the only secondary first-use action.
- The first visible story is a real accepted Indian pilot story, not a fictional fixture or generic hero illustration.
- Reframe does not appear as the home-page headline, hero form, or primary action; it remains in navigation and the later guided step.
- The tour explains documented, interpreted, and unresolved material; opens a teaching story; points to source basis; explains the honest save/sign-in limit; connects News to Timeless; and ends with optional Reframe.
- Returning readers skip the tour automatically but can reopen it.
- Storage failure never traps the reader.

- [ ] **Step 2: Make the landing page useful in five seconds**

Use one compact above-the-fold composition:

- Syāt wordmark and one-line product promise;
- headline of no more than twelve words;
- explanation of roughly twenty words;
- one `Start reading` button and one `Take the two-minute tour` link;
- a real pilot lead story and its authored visual entering the next viewport;
- News/Timeless choice visible without competing with the main action.

Do not add fake user counts, logo walls, testimonials, pricing, newsletter pressure, a Reframe input, or AI-generated decorative hero art. The product and its source discipline are the proof.

- [ ] **Step 3: Build a guided first-read sequence**

Keep the current four-step local guide, but make every step perform a real action:

1. **Read the layers** — distinguish documented, interpreted, experienced, valued, and unresolved material.
2. **Check the basis** — open one statement's source scope and limit.
3. **Keep the thread** — show Save honestly as device-only until Google sign-in is added, then cross the Context Bridge into a Timeless topic.
4. **Ask a better question** — introduce Reframe as an optional tool after reading, not the product's main task.

Each screen has Back, Next, Skip tour, visible progress, keyboard focus, a 44px tap target, and a safe return to the story. Completion remains versioned browser-local state.

- [ ] **Step 4: Apply the Warm Commons design contract**

Follow `.superpowers/sdd/2026-08-31-private-preview-news-batch/task-6-design-addendum.md`. Use Spectral plus IBM Plex Sans, the recorded semantic colour roles, the 12/20/30px radius system, restrained motion, and a deliberate 390px layout. Remove repeated uppercase mini-labels, generic equal-card rows, oversized headings, and decorative copy.

- [ ] **Step 5: Verify first-time and returning flows in a browser**

Render at 390px, 768px, and 1440px. Test a fresh local-storage state, completed state, and blocked-storage state. Check focus order, skip behavior, back navigation, bottom navigation overlap, long Indian headlines, reduced motion, and direct story entry.

- [ ] **Step 6: Run tests, typecheck, lint, build, and commit**

Run: `npm test -- src/components/home-view.test.tsx src/components/guided-onboarding.test.tsx src/lib/onboarding.test.ts && npm run typecheck && npm run lint && npm run build`

Expected: PASS; Home and onboarding remain statically server-rendered except for the small browser-local guide controller.

Commit:

```bash
git add src/components/home-view.tsx src/components/home-view.test.tsx src/components/guided-onboarding.tsx src/components/guided-onboarding.test.tsx src/lib/onboarding.ts src/lib/onboarding.test.ts src/components/site-chrome.tsx src/app/en/onboarding/page.tsx src/app/globals.css
git commit -m "feat: finish first-read landing and onboarding"
```

### Task 7: Scale in reviewed waves to exactly 100 stories

**Files:**
- Modify: `data/source-packs/approved-preview.json`
- Modify: `data/stories/news/index.json`
- Create: 94 additional `data/stories/news/*.json` files whose stable paths are derived from validated source-pack slugs and recorded in `index.json`
- Create: `data/generation-reports/wave-01.json` through `wave-10.json`
- Create: `docs/content/news-batch-quality-review-2026-08-31.md`

**Interfaces:**
- Consumes: accepted pilot, candidate source pool, resumable runner.
- Produces: exactly 100 valid records and a complete title/dek/source/quality review ledger.

- [ ] **Step 1: Rank and approve enough source packs for 100 unique useful stories**

Rank reusable evidence strength, reader utility, India connection, theme coverage, geographic spread, source-role completeness, and duplication risk. Keep 15 spare packs so a weak output can be rejected without padding.

- [ ] **Step 2: Generate the first ten-story scale wave**

Run: `npm run content:generate-wave -- --start 6 --count 10 --wave wave-01`

Expected: wave report has zero blockers, no more than one serious language warning, and median dimension score at least 4.

- [ ] **Step 3: Inspect and repair the wave before continuing**

Read every title, dek, source trail, India connection, disclosure, and quality result. Read every flagged body and at least two clean bodies from different themes. Change source packs or briefs before retrying; do not hide rejected outputs.

- [ ] **Step 4: Repeat waves of ten with a gate after every wave**

Run the same command with successive start/count values until 96 accepted records exist. Generate the final four with `--count 4`. Stop immediately on a rights, evidence, duplication, cost, or language blocker.

- [ ] **Step 5: Run corpus-wide checks at counts 50 and 100**

```bash
npm run content:check
node -e "const i=require('./data/stories/news/index.json'); const s=new Set(i.items.map(x=>x.slug)); if(i.items.length!==100||s.size!==100) process.exit(1)"
```

The content check must validate all claim/source references, date window, topic links, media rights, near-duplicates, title/dek repetition, theme distribution, and `publicationAllowed: false`.

- [ ] **Step 6: Complete the close-reading sample and quality report**

Read all six pilot bodies, all contested/institutional or automatically flagged bodies, and at least 20 additional stratified bodies across formats and themes. Record remaining limits without calling the batch final reporting.

- [ ] **Step 7: Commit each accepted wave separately, then the final report**

```bash
git add data/source-packs/approved-preview.json data/stories/news data/generation-reports docs/content/news-batch-quality-review-2026-08-31.md src/lib/generation-contract.ts src/lib/editorial-quality.ts
git commit -m "content: complete 100-story preview batch"
```

### Task 8: Studio visibility, full review, mobile verification, and protected deployment

**Files:**
- Create: `src/components/preview-quality-dashboard.tsx`
- Create: `src/components/preview-quality-dashboard.test.tsx`
- Modify: `src/app/en/studio/page.tsx`
- Modify: `scripts/check-content.ts`
- Modify: `docs/agent-memory/product-decisions.md`
- Modify: `docs/agent-memory/launch-gates.md`
- Modify: `docs/agent-memory/build-ledger.md`
- Create: `.superpowers/sdd/2026-08-31-news-batch/final-review.md`

**Interfaces:**
- Produces: read-only Studio batch summary, cost summary, source-role/theme coverage, quality findings, and route links.
- Produces: final protected Vercel preview with 100 static News pages.

- [ ] **Step 1: Write the failing dashboard and content-check tests**

```ts
it("shows the accepted count, cost, blockers, and preview boundary", () => {
  const html = renderToStaticMarkup(<PreviewQualityDashboard report={report} />);
  expect(html).toContain("100 accepted");
  expect(html).toContain("0 blockers");
  expect(html).toContain("Not final reporting");
});
```

- [ ] **Step 2: Implement read-only Studio reporting**

Show accepted/rejected/failed counts, reserved and actual spend, themes, formats, source roles, rights bases, language flags, generation waves, and direct links to every story. Do not add a publish button or imply browser state is shared approval.

- [ ] **Step 3: Extend `content:check` across the final corpus**

Fail on any count other than 100, unknown reference, stale/out-of-window pack, prohibited model input, missing credit/policy URL, unapproved media, duplicate event, quality blocker, or publishable status.

- [ ] **Step 4: Run the full automated verification**

Run: `npm test && npm run typecheck && npm run lint && npm run content:check && npm run build && npm audit --omit=dev`

Expected: all checks PASS and production audit reports zero high-severity vulnerabilities.

- [ ] **Step 5: Review the real production build in a browser**

At 1440×900 and 390×844, review onboarding, Home, archive, six pilot stories, at least one story per remaining format/theme, long headline, timeline, people, authored visual, source trail, Context Bridge, Reframe, and Studio. Verify keyboard focus, reduced motion, no horizontal overflow, no mobile-nav collision, and no external media or social SDK before a tap.

- [ ] **Step 6: Run an independent final review and repair every material finding**

The reviewer checks spec compliance, code quality, source rights, content honesty, article usefulness, performance, and mobile flow. Record accepted minor limits and repair blockers/serious findings before deployment.

- [ ] **Step 7: Update agent memory and commit the reviewed build**

Record the exact article count, source boundary, actual AI spend, last collection date, quality sample, remaining public-launch gates, and deployment status in `docs/agent-memory/`.

```bash
git add src/components/preview-quality-dashboard.tsx src/components/preview-quality-dashboard.test.tsx src/app/en/studio/page.tsx scripts/check-content.ts docs/agent-memory .superpowers/sdd/2026-08-31-news-batch/final-review.md
git commit -m "docs: record reviewed 100-story preview"
```

- [ ] **Step 8: Deploy only the clean reviewed commit to Vercel Preview**

Run: `vercel --yes`

Verify the returned deployment is Preview, protected, ready, `noindex`, and serves Home, `/en/news`, three representative story routes, About, Reframe, and Studio. Do not use `vercel --prod`.

- [ ] **Step 9: Record the final preview URL and handoff limits**

Update `docs/agent-memory/launch-gates.md` with the protected URL, verification time, access behavior, article count, actual spend, and explicit statement that the pages are AI-assisted private previews rather than final reporting.

---

## Final Acceptance Commands

```bash
npm test
npm run typecheck
npm run lint
npm run content:check
npm run build
npm audit --omit=dev
node -e "const i=require('./data/stories/news/index.json'); if(i.items.length!==100||new Set(i.items.map(x=>x.slug)).size!==100) process.exit(1)"
git status --short
```

Expected final state: all commands pass, the count command exits zero, the worktree is clean, and the protected Preview deployment exposes exactly 100 source-linked News preview pages without claiming final publication.
