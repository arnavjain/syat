# Syāt Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one coherent, cost-controlled reader and editor foundation from source discovery through a static, human-approved story.

**Architecture:** Public reading stays server-rendered and static. Small client islands handle only onboarding, random selection, and local Reframe interactions. Convex owns authenticated editorial state, audit history, saves, and paid-job records; production editorial access fails closed until Google and editor roles are connected.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Convex, Better Auth, Zod, OpenRouter/DeepSeek, Vercel Hobby.

**Spec:** `docs/superpowers/specs/2026-08-31-production-readiness-design.md`

## Global Constraints

- Public product name is **Syāt**; Reframe stays a quiet feature label.
- Use plain words in product copy and contributor notes.
- Public reading pages are static server-rendered pages first; client code exists only for an interaction.
- Every media item needs a source, rights basis, creator credit, and review status before publication.
- Never imitate Googlebot or bypass publisher access rules.
- Vercel Hobby and Convex free plan are the deployment baseline; no R2 or custom domain in private preview.
- Paid AI warns at ₹1,000/month, stops at ₹1,400/month, and the wider private preview stays below ₹2,000/month.
- Human approval remains mandatory for publication, source and rights decisions, public community features, notifications, and launch.
- Use serif and sans-serif typography together in a calm, rounded, welcoming, vibrant design without generic AI-looking gradients or fake metrics.

---

### Task 1: Static public foundation and route integrity

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/en/you/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/en/timeless/page.tsx`
- Create: `src/components/home-view.tsx`
- Modify: `src/components/site-chrome.tsx`
- Modify: `src/lib/home-content.ts`
- Modify: `next.config.ts`
- Test: `src/lib/home-content.test.ts`

**Interfaces:**
- Produces: `HomeView({ mode, direction })`, a static News route at `/`, and a static Timeless route at `/en/timeless`.
- Public layouts no longer consume `ConvexClientProvider`; `/en/you` does.

- [ ] Add failing route/content tests proving every home subject points to an existing page contract and mode links use stable paths.
- [ ] Run the focused tests and confirm the new expectations fail.
- [ ] Extract the shared home view, use shared chrome with a skip link and footer, and remove `searchParams` from `/`.
- [ ] Move Convex/auth provider loading to the account route.
- [ ] Add conservative security headers and disable the framework signature header.
- [ ] Run focused tests, typecheck, lint, and build. Confirm `/` is static in build output.
- [ ] Commit the slice.

### Task 2: Honest Timeless topics and input-aware Reframe

**Files:**
- Create: `src/app/en/timeless/topic/[slug]/page.tsx`
- Modify: `src/app/en/explore/page.tsx`
- Modify: `src/components/random-topic-picker.tsx`
- Modify: `src/app/en/reframe/page.tsx`
- Modify: `src/components/reframe-workbench.tsx`
- Modify: `src/lib/reframe-plan.ts`
- Test: `src/lib/reframe-plan.test.ts`
- Test: `src/lib/timeless-topics.test.ts`

**Interfaces:**
- Produces: `getTimelessTopic(slug)`, static subject pages, and `makeReframePlan(value, kind)` whose visible output names the supplied subject.
- Reframe accepts an initial value from `topic` or `claim` search parameters without claiming to fetch or upload anything.

- [ ] Add failing tests for topic lookup, route targets, invalid links, and two different inputs producing distinguishable plans.
- [ ] Run focused tests and confirm failures are caused by missing behavior.
- [ ] Add static topic pages and route all catalogue/random links to them.
- [ ] Seed Reframe from an approved catalogue question or explicit claim query.
- [ ] Remove or relabel link/file actions that are not implemented.
- [ ] Run focused tests, typecheck, lint, and build.
- [ ] Commit the slice.

### Task 3: Guided onboarding and a complete story return loop

**Files:**
- Create: `src/components/guided-onboarding.tsx`
- Create: `src/lib/onboarding.ts`
- Modify: `src/app/en/onboarding/page.tsx`
- Modify: `src/app/en/news/[slug]/page.tsx`
- Modify: `src/app/en/timeless/[slug]/page.tsx`
- Modify: `src/app/globals.css`
- Test: `src/lib/onboarding.test.ts`
- Test: `src/lib/preview-content.test.ts`

**Interfaces:**
- Produces: a four-step local onboarding state with versioned completion storage and story actions for source trail, Save, Reframe, and a related Timeless subject.

- [ ] Add failing tests for ordered onboarding steps, completion version, and valid related-story/action metadata.
- [ ] Run the focused tests and observe the expected failures.
- [ ] Implement progressive first-time screens that end at the teaching story.
- [ ] Add a compact story orientation, section navigation, and end-of-story next actions.
- [ ] Ensure unavailable Save leads to an honest account/saved gate rather than pretending to persist.
- [ ] Run focused tests, typecheck, lint, and build.
- [ ] Commit the slice.

### Task 4: Design directions and accessibility repair

**Files:**
- Modify: `src/components/home-view.tsx`
- Create: `src/app/preview/design/[direction]/page.tsx`
- Modify: `src/lib/design-direction.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/en/news/[slug]/page.tsx`
- Test: `src/lib/design-direction.test.ts`

**Interfaces:**
- Produces: three statically generated review routes and viewpoint diagrams that position two through eight labels without overlap-prone hard-coded fifth-item behavior.

- [ ] Add failing tests for the three stable preview routes and deterministic viewpoint placement classes.
- [ ] Run the focused tests and confirm failure.
- [ ] Make the three directions change hierarchy and emphasis while preserving the Syāt design tokens and content.
- [ ] Repair home ARIA references, button/input focus styles, hibiscus small-text contrast, and the five-viewpoint diagram.
- [ ] Review desktop and 390×844 mobile screenshots for each direction and the story.
- [ ] Run focused tests, typecheck, lint, and build.
- [ ] Commit the slice.

### Task 5: Safe, measurable India-first intake

**Files:**
- Modify: `src/lib/news-intake.ts`
- Modify: `scripts/collect-rss-intake.ts`
- Modify: `scripts/check-content.ts`
- Modify: `src/app/en/studio/page.tsx`
- Modify: `src/components/moderation-queue.tsx`
- Test: `src/lib/news-intake.test.ts`
- Test: `src/lib/news-signals.test.ts`

**Interfaces:**
- Produces: `selectBalancedItems(items, maximumPerPublisher, maximumTotal)`, queue freshness validation, and an actual publisher-distribution summary.

- [ ] Add failing tests proving a newsroom with many feeds cannot dominate, stale queues fail, and a partial collection cannot replace a valid file.
- [ ] Run focused tests and confirm the intended failures.
- [ ] Balance by publisher, retain feed rotation inside each publisher, and validate the complete candidate before replacing the last known good file.
- [ ] Make content checks cover age, duplicates, count, publisher cap, and declared window.
- [ ] Harden browser-storage writes and make “pack ready” visibly require a completion checklist in preview mode.
- [ ] Put the moderation workbench before secondary registry material and correct read/write copy.
- [ ] Run collector once, then run focused tests, content check, typecheck, lint, and build.
- [ ] Commit the slice.

### Task 6: Enforceable source and AI budget gates

**Files:**
- Create: `src/lib/generation-budget.ts`
- Modify: `src/lib/generation-contract.ts`
- Modify: `src/lib/openrouter-story-client.ts`
- Modify: `src/lib/draft-review.ts`
- Modify: `convex/schema.ts`
- Test: `src/lib/generation-budget.test.ts`
- Test: `src/lib/generation-contract.test.ts`
- Test: `src/lib/openrouter-story-client.test.ts`

**Interfaces:**
- Produces: `authoriseGenerationBudget({ spentPaise, reservedPaise, estimatedPaise })`, approved-source dossier validation, `timelineEntries`, and input-hash/month indexes.

- [ ] Add failing tests for the ₹1,000 warning, ₹1,400 hard stop, rejected/pending sources, bounded retry accounting, and no paid fetch after budget refusal.
- [ ] Run focused tests and confirm the failures.
- [ ] Add pure budget authorization and require it before the OpenRouter fetch boundary.
- [ ] Reject unapproved dossier records before prompt construction.
- [ ] Add lossless timeline, source-intake, review-event, role, topic, and spend query shapes to Convex schema.
- [ ] Make review check values strict unions and add input-hash and monthly spend indexes.
- [ ] Run focused tests, typecheck, lint, and build.
- [ ] Commit the slice.

### Task 7: Shared editor workflow and production access gate

**Files:**
- Create: `convex/editorial.ts`
- Create: `src/lib/editor-access.ts`
- Create: `src/app/en/studio/layout.tsx`
- Modify: `src/components/moderation-queue.tsx`
- Modify: `src/app/en/studio/page.tsx`
- Test: `src/lib/editor-access.test.ts`
- Test: `src/lib/review-queue.test.ts`

**Interfaces:**
- Produces: authenticated editor access, append-only `recordReviewDecision`, projected queue state, and safe private-preview fallback that is never accepted in production.

- [ ] Add failing tests for production fail-closed behavior, allowed editor identity, review transitions, and source-pack completion rules.
- [ ] Run focused tests and confirm failure.
- [ ] Implement editor access rules and Convex editorial queries/mutations deriving identity server-side.
- [ ] Use the shared workflow when Convex/auth are configured; label browser-only preview otherwise.
- [ ] Ensure no client input can set publication approval.
- [ ] Run Convex code generation if the configured deployment is available; otherwise keep the integration gate explicit.
- [ ] Run focused tests, typecheck, lint, content check, and build.
- [ ] Commit the slice.

### Task 8: End-to-end verification and memory handoff

**Files:**
- Modify: `docs/agent-memory/build-ledger.md`
- Modify: `docs/agent-memory/integration-state.md`
- Modify: `docs/agent-memory/launch-gates.md`
- Modify: `docs/architecture.md`

**Interfaces:**
- Produces: an accurate handoff stating what is executable, what is protected, what remains externally blocked, and exact morning setup gates.

- [ ] Run the complete test suite, typecheck, lint, content check, production build, and production dependency audit.
- [ ] Start a fresh production server and verify all visible internal routes return useful responses.
- [ ] Browser-test onboarding, topic selection, Reframe, story next actions, Studio fallback, and account gate on desktop and 390×844 mobile.
- [ ] Measure public JavaScript and confirm Convex/auth chunks are absent from `/`.
- [ ] Recheck source distribution, freshness, rights labels, noindex, security headers, and untracked secrets.
- [ ] Update agent memory in plain language with remaining Google, Convex, editorial, rights, Hindi, Jain review, and public-launch gates.
- [ ] Commit the verification and documentation slice.
