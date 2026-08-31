# Task 3 — Guided onboarding and story return loop

## Status

Implemented a four-step, browser-local onboarding guide and a shared server-rendered story body for both preview story modes. The guide always gives Skip and finish paths to the teaching story. It records completion only when browser storage is available.

## Implementation

- Added `src/lib/onboarding.ts`: ordered steps, `ONBOARDING_VERSION`, versioned key, and storage reads/writes guarded against errors.
- Added `src/components/guided-onboarding.tsx`: progressive, keyboard-native button/link controls, progress indication, Skip, repeat, and teaching-story exit.
- Replaced the static onboarding list with that component; only the guide’s progress/storage behavior is client-side.
- Added `src/components/story-page.tsx`, shared by News and Timeless preview fixtures. It adds orientation links, evidence/timeline/viewpoint/source sections, and four closing actions.
- Added per-story action metadata. Reframe emits either a validated `topic` or explicit `claim`; the related route uses the 100-subject Timeless catalogue. Save links to the existing honest account gate, without claiming the story was saved.
- Added the related product decisions to `docs/agent-memory/product-decisions.md`.

## TDD record

### RED

Command:

```text
npm test -- src/lib/onboarding.test.ts src/lib/preview-content.test.ts
```

Output:

```text
Test Files  2 failed (2)
Tests  1 failed | 2 passed (3)

FAIL  src/lib/onboarding.test.ts
Error: Cannot find module './onboarding'

FAIL  src/lib/preview-content.test.ts > gives every story a real source trail, Reframe input, and related Timeless subject
TypeError: Cannot read properties of undefined (reading 'sourceTrailTarget')
```

### GREEN

Command:

```text
npm test -- src/lib/onboarding.test.ts src/lib/preview-content.test.ts
```

Output:

```text
Test Files  2 passed (2)
Tests  6 passed (6)
```

## Verification

| Check | Result |
| --- | --- |
| Focused tests | 2 files, 6 tests passed |
| Full test suite | 15 files, 45 tests passed |
| Typecheck | `tsc --noEmit` passed |
| Lint | `eslint .` passed |
| Build | `next build` passed; 112 static pages generated |
| Rendered route smoke | `/en/onboarding`, `/en/news/street-plan-daily-realities`, and `/en/timeless/how-cities-move` returned the expected guide/story actions |
| Diff check | `git diff --check` passed |

## Self-review

- Onboarding does not require storage: both Skip and finish links navigate to the teaching story even if the marker cannot be written.
- Every source-trail action targets the rendered `#source-trail` section; fixture source IDs exist in that section.
- Every Reframe action uses only Task 2’s `topic` or `claim` query inputs. The only topic used, `street-vending`, exists in the static catalogue.
- Save routes to `/en/saved`, whose copy says account sync is needed; no local save is simulated.
- News and Timeless routes use the same server component, so the return loop is not duplicated.

## Concerns

- I ran HTTP-rendered smoke checks, not an interactive browser session. The controls are native links/buttons with visible focus rules, but browser-level keyboard traversal has not been automated.

## Review blocker fix — guarded `localStorage` property access

The original guide passed `window.localStorage` as an argument. In restricted browsers, evaluating that property can throw before the existing guarded storage helpers receive it. `getSafeBrowserStorage()` now catches that property read and returns `undefined`; the existing helpers already treat that value as a non-blocking storage failure.

Blocker code commit: `2d6f80aa8ca3e5b54adb8438b9f59b8c44d2b79e`

### RED

Command:

```text
npm test -- src/components/guided-onboarding.test.ts
```

Output:

```text
Test Files  1 failed (1)
Tests  1 failed (1)

FAIL  src/components/guided-onboarding.test.ts > guided onboarding storage > stays available when reading the localStorage property throws
TypeError: getSafeBrowserStorage is not a function
```

### GREEN

Command:

```text
npm test -- src/components/guided-onboarding.test.ts src/lib/onboarding.test.ts
```

Output:

```text
Test Files  2 passed (2)
Tests  4 passed (4)
```

### Checks

```text
npm run typecheck
> tsc --noEmit

npm run lint
> eslint .

npm run build
> next build
✓ Compiled successfully
✓ Generating static pages using 9 workers (112/112)

git diff --check
```

All commands above exited with status 0.
