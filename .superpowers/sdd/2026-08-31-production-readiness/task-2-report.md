# Task 2 report — Honest Timeless topics and input-aware Reframe

## Status

Implemented, verified, self-reviewed, and committed with this task report.

## Implementation

- Added `getTimelessTopic(slug)` and `timelessTopicPath(slug)` to keep catalogue lookup and destinations in one place. Unknown slugs have no destination.
- Added static `/en/timeless/topic/[slug]` pages for all 100 catalogue subjects. They name each question, state that it is not a published story, state that no editor-reviewed source pack is published, and offer a local Reframe path.
- Changed the Explore catalogue and accessible random selector to use only those static subject pages.
- Made Reframe resolve either an approved `topic` slug or an explicit `claim`; an explicit claim takes priority. The browser query reader supplies decoded values, which are Unicode-normalized, whitespace-normalized, and limited to 320 characters. Empty or unknown input stays empty.
- Reframe plans now name the supplied text in every step, so two inputs receive visibly different plans.
- Removed the link and document choices. The workbench says plainly that it does not fetch links or upload files.
- Wrapped the client query-reader in `Suspense`; `/en/reframe` remains statically prerendered and the 100 subject pages are generated at build time.

## Files

- Created `src/app/en/timeless/topic/[slug]/page.tsx`
- Modified `src/app/en/explore/page.tsx`
- Modified `src/components/random-topic-picker.tsx`
- Modified `src/app/en/reframe/page.tsx`
- Modified `src/components/reframe-workbench.tsx`
- Modified `src/lib/reframe-plan.ts`
- Modified `src/lib/reframe-plan.test.ts`
- Modified `src/lib/timeless-topics.ts`
- Modified `src/lib/timeless-topics.test.ts`

## TDD evidence

### RED

`npm test -- src/lib/timeless-topics.test.ts src/lib/reframe-plan.test.ts`

Failed as expected: missing `getTimelessTopic` and subject-path behavior, and existing plans did not name or distinguish supplied input. After adding the initial-query resolver test:

`npm test -- src/lib/reframe-plan.test.ts`

Failed as expected because `resolveReframeInitialInput` did not exist.

### GREEN

`npm test -- src/lib/timeless-topics.test.ts src/lib/reframe-plan.test.ts src/lib/topic-picker.test.ts`

Passed: 3 files, 13 tests.

## Verification

- `npm test` — passed once: 14 files, 40 tests. This was the requested single full-suite run during iteration.
- `npm run typecheck` — passed after the final resolver change.
- `npm run lint` — passed.
- `npm run build` — passed. Next generated `/en/reframe` statically and 100 static `/en/timeless/topic/[slug]` pages.
- `git diff --check` — passed.

## Self-review

- Reviewed all changed files and the new route. Every catalogue link and random selection uses the known-subject path helper; unknown values cannot create a link.
- Confirmed topic pages state the missing-source-pack boundary rather than implying sources or publication.
- Confirmed Reframe has no URL-fetch or file-upload control or claim. Query text is bounded before display and React escapes the resulting text.
- The only follow-up correction during verification stored the random-picker route lookup once so TypeScript could prove it was defined; behavior did not change.

## Concerns

- No browser/device-width visual pass was available in this task; static build and accessibility-oriented markup were checked, but a human browser review is still useful.
- Timeless subject pages intentionally do not contain a real source pack. Editorial source, rights, and publication approval remain human gates.

## Review follow-up — decoded Reframe claims

- Fixed the review finding that `normalizeReframeInput` decoded values a second time after `useSearchParams().get()` had already decoded them. It now only normalizes and bounds the received display value.
- Added regressions for literal `+`, literal `%25`, and malformed-percent text. They are treated as already-decoded display input, so each remains visible unchanged apart from whitespace and Unicode normalization.

### RED

`npm test -- src/lib/reframe-plan.test.ts`

Failed as expected: `C++ is useful` became `C is useful` in both direct normalization and explicit-claim resolution.

### GREEN and checks

- `npm test -- src/lib/reframe-plan.test.ts src/lib/timeless-topics.test.ts src/lib/topic-picker.test.ts` — passed: 3 files, 13 tests.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; `/en/reframe` stayed static and all 100 subject pages were generated.
- `git diff --check` — passed.
- Full suite was not repeated: this small boundary fix is covered by the focused tests, and the original task's requested full-suite run remains recorded above.

Code-fix commit: `5fbe9b48cc202eef19f378eb75707d8159fb78cd` (`fix: preserve decoded reframe claims`).
