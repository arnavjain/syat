# Task 4 — Design directions and accessibility repair

## Status

Implemented and verified locally on 31 August 2026. The offline Syāt reference was available locally and informed the existing marigold, aubergine, hibiscus, cobalt, teal, and paper language; no external reference URL was needed.

## Implementation

- Added static, `noindex` private review routes at `/preview/design/annotated-evidence`, `/preview/design/warm-commons`, and `/preview/design/signal-garden`. The typed direction contract supplies their stable static parameters and rejects unknown values.
- Kept the production home as the static Warm Commons baseline. Review-only context and direction links appear only on preview routes.
- Made the three directions differ in reading emphasis without changing content, routes, labels, tokens, or interaction meaning:
  - Annotated Evidence uses tighter corners, a narrow evidence spine, and copy-first feature proportions.
  - Warm Commons keeps the accepted, rounded and spacious reading surface.
  - Signal Garden makes the authored visual lead and shifts the source/reading rhythm without turning the page into a dashboard.
- Made the News fixture static with `generateStaticParams` and `dynamicParams = false`.
- Replaced hard-coded home labels and the story orbit’s four-item limit with a typed deterministic position-class contract for two through eight viewpoints. The five-viewpoint story now shows City planner rather than dropping it.
- Repaired home section `aria-labelledby` values to use stable ID tokens, strengthened global keyboard focus for links, buttons, inputs, selects, textareas, and summaries, and changed small hibiscus text to `#b4144b`.
- Added reduced-motion handling, solid background fallback for the mobile blurred navigation, and explicit mobile overrides for direction-specific grids.
- Completed the carried-forward findings: active onboarding uses `aria-current="step"`; completed onboarding no longer announces a numbered first step; story Reframe metadata now requires exactly one bounded claim or a catalogue topic.

## Design contract

All directions retain Syāt’s editorial serif for headlines and sans-serif body/navigation pairing, the shared paper/ink/marigold/hibiscus/cobalt/teal palette, current copy, navigation, static-first rendering, and interaction meanings. The documented radius rule is detail `8–12px`, cards `20px`, and feature surfaces `30px` in Warm Commons; Annotated Evidence tightens geometry intentionally, while Signal Garden retains the shared scale with a visual-first arrangement. Motion is limited to explicit 140–200ms property transitions and press feedback; reduced-motion shortens it to effectively instant.

## TDD evidence

### RED

```text
npm test -- src/lib/design-direction.test.ts src/lib/preview-content.test.ts src/components/guided-onboarding.test.ts
```

Observed 5 expected failures: missing static direction parameters, missing viewpoint position classes, missing Reframe-action validation, and missing onboarding state helpers.

```text
npm test -- src/lib/preview-content.test.ts
```

Observed 1 expected failure: missing static News-story parameters.

The browser reproduction at 390×844 also failed before the final CSS repair: Annotated Evidence’s direction-specific desktop grid overrode the mobile grid and clipped the `Street vendor` map label.

### GREEN and final commands

```text
npm test -- src/lib/design-direction.test.ts src/lib/preview-content.test.ts src/components/guided-onboarding.test.ts
# 3 files passed, 11 tests passed

npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

All commands above completed with exit status 0. The build reports the three preview pages and `/en/news/street-plan-daily-realities` as SSG routes.

## Browser visual review

Fresh `next start` server: `http://localhost:3210`.

Desktop review used a real Chrome rendering at **1440×900 CSS pixels**. Phone review used **390×844 CSS pixels**. Chrome saved phone rasters one pixel shorter (390×843) while its live CSS viewport reported 390×844.

| Surface | Desktop artifact | Phone artifact | Observed result |
| --- | --- | --- | --- |
| Annotated Evidence home | `task-4-visuals/annotated-evidence-desktop-1440x900.jpg` | `task-4-visuals/annotated-evidence-mobile-390x844.jpg` | No overflow or nav wrapping; initial mobile label clipping repaired. |
| Warm Commons home | `task-4-visuals/warm-commons-desktop-1440x900.jpg` | `task-4-visuals/warm-commons-mobile-390x844.jpg` | Rounded baseline remains calm and readable. |
| Signal Garden home | `task-4-visuals/signal-garden-desktop-1440x900.jpg` | `task-4-visuals/signal-garden-mobile-390x844.jpg` | Visual-first hierarchy is distinct while source-reading content is unchanged. |
| News story | `task-4-visuals/news-story-desktop-1440x900.jpg` | `task-4-visuals/news-story-mobile-390x844.jpg` | No overflow; readable story orientation and action surface. |
| Five-viewpoint story visual | — | `task-4-visuals/news-story-five-viewpoints-mobile-390x844.jpg` | All five labels visible, unclipped, and non-overlapping. |
| Keyboard focus | — | `task-4-visuals/warm-commons-keyboard-focus.jpg` | Tab reaches Skip to content with a visible cobalt solid outline and 4px offset. |

For every home direction and the News story, browser layout checks returned: horizontal overflow `false`, label overlap `false`, clipped labels `[]`, and comfortable primary/navigation review targets `true`. Desktop navigation did not wrap. The audit also found no unresolved `aria-labelledby` references. Small hibiscus micro-copy measured **5.73:1** against paper, clearing normal-text AA contrast.

## Copy, contrast, and focus check

- Copy: no product copy, route slug, nav label, or story hierarchy was changed. The preview-only label is plain about its private review status.
- Contrast: small hibiscus text now uses `#b4144b` on paper at 5.73:1; primary buttons retain dark text on marigold.
- Focus: global `:focus-visible` covers interactive controls and was checked with a real Tab keypress.
- Touch: preview-direction links were raised to 44px; primary actions, mode links, language link, and mobile navigation meet the reviewed target size.

## Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| No review routes; directions existed only as CSS classes. | Three SSG, noindex `/preview/design/[direction]` routes backed by one typed contract. | Lets a human compare concrete private review surfaces without changing production home. |
| Story orbit rendered only four standpoints and had no fifth-label placement. | Two through eight labels receive deterministic unique position classes; the five-viewpoint fixture renders all five. | Prevents the overlap-prone fifth-item behaviour and preserves the story’s actual viewpoints. |
| Home sections used readable title text as `aria-labelledby` IDs. | Stable `editorial-section-N` IDs. | ARIA ID references now resolve reliably. |
| Completed onboarding retained `step 1 of 4`; active steps had no current-step state. | Completion says `Guide completed`; only active step has `aria-current="step"`. | Screen-reader progress matches the state the reader is in. |
| Reframe action type allowed topic and claim together. | Runtime validation and tests require exactly one valid catalogue topic or non-empty claim of 320 characters or fewer. | Keeps each story action honest and compatible with the input contract. |
| Direction-specific desktop grid won on phone and pushed `Street vendor` beyond 390px. | Explicit mobile override resets all direction feature grids to one column. | The mobile frame fits and all map labels remain visible. |

## Self-review

Reviewed the resulting source for static rendering, client-boundary additions, focus coverage, motion duration/property specificity, typography roles, rounded-scale consistency, no fake metrics/gradients/screenshots, preview isolation, and source/rights copy. No client component was added for previews; the existing onboarding client component remains necessary for its browser-local guided state. `git diff --check` is clean.

## Concerns

- The Chrome screenshot backend emits JPEG files; artifacts therefore use `.jpg` and are ignored under `.superpowers/`.
- Browser review is local only. A human still chooses the public direction and approves any publication, media-rights, or source decision.

## Independent review repair (2026-08-31)

**Code commit:** `59de956 fix: repair review accessibility findings`

### RED → GREEN evidence

RED first:

```text
npm test -- src/app/globals.test.ts
# 1 file failed, 3 tests failed
```

The failures covered the three reported gaps: the interpreted-evidence, perspective-term, and topic-card small labels did not all resolve to `--hibiscus-text`; transform lifts were still in coarse-pointer hover rules; and story-orientation links lacked a 44px independent control contract.

GREEN and final verification:

```text
npm test -- src/app/globals.test.ts
# 1 file passed, 3 tests passed

npm run typecheck
npm run lint
npm test
# 17 files passed, 54 tests passed

npm run build
git diff --check
```

All final commands completed with exit status 0. The build continued to emit the three preview directions as SSG routes.

### Repair summary

| Before | After | Why |
| --- | --- | --- |
| Three small normal-text roles used the brighter decorative hibiscus in their defining rules. | Interpreted-evidence labels, perspective terms, and topic-card labels resolve to `--hibiscus-text` (`rgb(180, 20, 75)` in the browser). | Preserves hibiscus for accents while making the small editorial text readable. |
| Four card/action hover rules applied a transform lift to any pointer. | The lift transforms live only inside `@media (hover: hover) and (pointer: fine)`; existing active press and reduced-motion handling remain. | Touch devices keep immediate visual feedback without hover-like movement. |
| Story orientation was a wrapping row of inline links, making Sources prone to becoming a tiny orphan. | It is a four-column navigation grid with bordered, underlined, 44px link controls and the shared global focus ring. | Makes the choices easy to tap and scan without changing their meanings. |
| Reduced-motion handling was duplicated and private review controls consumed more mobile height than needed. | One reduced-motion rule remains; private review controls use a compact three-column, 44px mobile layout. | Planned polish that keeps the comparison visible above the fold. |

### Fresh mobile browser review

Fresh production `next start` rendering at **390×844 CSS pixels** (saved rasters are 390×843 due to the Chrome capture backend):

| Surface | Artifact | Observed result |
| --- | --- | --- |
| News story | `task-4-visuals/task-4-review-fix-news-mobile-390x844.jpg` | No horizontal overflow; Evidence, Timeline, Viewpoints, and Sources each measured 85×44px on one row; keyboard Tab reached an orientation link with a solid 2.4px cobalt outline and 4px offset. |
| Warm Commons preview | `task-4-visuals/task-4-review-fix-warm-commons-mobile-390x844.jpg` | No horizontal overflow; all three private comparison controls measured 107×44px and remained visible above the hero. |

The visual pass also confirmed no clipped or wrapped orientation labels. No new concern was found.
