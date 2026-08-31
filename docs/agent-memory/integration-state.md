# Integration state

| Service | Intended use | State |
| --- | --- | --- |
| OpenRouter | Strict, source-bound content drafts with `deepseek/deepseek-v4-flash-0731` | Local key present. A fictional India-context smoke draft completed on 2026-08-31 in about 12 seconds; parser and automatic review kept it non-publishable. The key was not copied into the worktree or a deployment. |
| Convex | Database, identity, workflow state, publishing records | Schema is ready, including review findings; deployment is not connected yet. |
| Vercel | Protected private preview on Hobby | Project exists. The review deployment is protected by Vercel Authentication; no public Syāt alias or custom domain is attached. |
| Google | Optional sign-in alongside passkeys | Credentials not created yet |
# Shared review integration state — 2026-08-31

- The code for append-only shared source research review is ready but intentionally not connected to the browser. It needs a deployed Convex API, Google-backed identity, verified `SYAT_EDITOR_SUBJECTS`, and a client integration after those are available.
- Without those services, the public/production access policy is read-only. Browser-local review may appear only in a Vercel preview when the server-only `SYAT_PROTECTED_REVIEW_GATE=allow-browser-only-review` deployment variable is deliberately set; a `NEXT_PUBLIC_*` lookalike cannot unlock it.
- The current protected preview has not been given that gate. Its review content is still non-publishing and link-only. No source, story, quote, media, or release decision is shared or public.

## Final local verification — 2026-08-31

- The clean reviewed commit `5d6d804` was checked with the full test suite, TypeScript, linting, content validation, production build, production dependency audit, route matrix, and desktop/phone browser flows. The detailed evidence is in the ignored Task 8 report.
- This verification did not call OpenRouter, inspect or change a key, connect or deploy Convex, create Google credentials, or change Vercel. The existing protected Vercel preview remains the only review deployment recorded here.
- Local production policy is read-only. A separately started local server confirmed that browser-only review appears only with both `VERCEL_ENV=preview` and the server-only protected-review gate. That local check did not alter the hosted preview.
