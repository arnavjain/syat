# Task 1 report — Static public foundation and route integrity

## TDD evidence

### RED

Command:

```text
npm test -- src/lib/home-content.test.ts
```

Result: 2 of 4 tests failed, as intended.

```text
FAIL keeps every internal home link on a page contract that exists today
Expected the four unfinished Timeless cards to use /en/explore.
Received:
/en/timeless/what-makes-a-place-public
/en/timeless/maps-and-power
/en/timeless/river-letter
/en/timeless/measurement-and-values

FAIL uses stable route paths for the editorial modes
TypeError: getHomeModeHref is not a function
```

### GREEN

Command:

```text
npm test -- src/lib/home-content.test.ts
```

Result:

```text
Test Files  1 passed (1)
Tests       4 passed (4)
```

## Changes

- Added `HomeView({ mode, direction })`, shared by static `/` and `/en/timeless` routes.
- Removed the root `searchParams` mode and direction handling. Mode links now use `/` and `/en/timeless`.
- Moved the shared public header, skip link, footer, and mobile navigation into `SiteChrome` for the home view as well.
- Removed the global Convex provider and added it only below `/en/you`.
- Redirected the four unfinished Timeless cards to `/en/explore`, per the preflight ruling.
- Disabled the `X-Powered-By` response header and added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` headers.

## Files changed

- `next.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/en/timeless/page.tsx`
- `src/app/en/you/layout.tsx`
- `src/components/home-view.tsx`
- `src/components/site-chrome.tsx`
- `src/lib/home-content.ts`
- `src/lib/home-content.test.ts`

## Verification

```text
npm test -- src/lib/home-content.test.ts  -> 1 file passed, 4 tests passed
npm run typecheck                          -> exit 0
npm run lint                               -> exit 0
npm test                                   -> 14 files passed, 34 tests passed
npm run build                              -> exit 0
```

The build route table marked both routes static:

```text
○ /
○ /en/timeless
```

Production-server checks returned HTTP 200 for both routes. They included the four configured security headers, did not include `X-Powered-By`, and returned `x-nextjs-prerender: 1`.

## Self-review

- Confirmed `/` has no `searchParams` and no imports of Convex or account code.
- Confirmed `/en/you/layout.tsx` is the only route layout that imports `ConvexClientProvider`.
- Confirmed `HomeView` uses `SiteChrome`, so the home pages now have the skip link and footer.
- Confirmed all six internal home destinations are current route contracts: the News fixture, the existing Timeless fixture, and four Explore links.
- Confirmed the new route-content test fails if a Timeless card returns to a missing subject route or a mode path becomes query-driven.
- Checked the final diff for whitespace errors with `git diff --check`.

## Concerns

The four Timeless cards deliberately open the broad Explore page until Task 2 creates truthful, individual subject pages. This is the recorded preflight decision, not a replacement for that follow-up work.
