# Syāt build status

Updated as work lands. Newest at the top.

---

## Now: 5 September 2026, UI pass

**Doing:** landing page that explains the whole product, onboarding fixes, making the
user-generated section discoverable, Google login wiring.

**In background:** collecting CAG source packs (300 requested, one request at a time
with a 700ms gap, roughly 2,800 reports available).

## Decisions taken with you

- **All four source lanes**: court judgments, Parliament Q&A, CAG reframed as Timeless,
  and Census/NSSO/RBI open data.
- **UI before articles.**

## The rights boundary, since it shapes everything

Newspapers are already in: 23 registered, 10 collected, across the spectrum including
Organiser and OpIndia. But every newsroom is **link-only** — headline and link, never
article text. `src/lib/source-pack.ts` structurally refuses to let a link-only source
carry evidence text. Stories therefore get written from records that carry a
reproduction policy: government audits, judgments, Parliament answers, open data.

That is why the first thirteen stories are audit-shaped, and why the fix is new source
lanes rather than more prompt work.

## Budget

Cap raised to **Rs 1,000** on your instruction (was Rs 100). Spent so far: **Rs 92.24**.
`AGENTS.md` warns at Rs 1,000 a month and hard stops before Rs 1,400, so Rs 1,000 sits
exactly on the warning line; the monthly guard still applies above it.

## Live

- https://syat-seven.vercel.app
- https://syat-jdso.vercel.app
- 13 News stories, all `private_preview`, `publicationAllowed: false`, noindex.
- 100 Timeless topics, authored, live.

## Known limits, stated plainly

- **Google sign-in is built but cannot be switched on by me.** It needs OAuth
  credentials from your Google Cloud Console. Steps are at the bottom of this file
  once written.
- **Audit records reach about a third of the hundred Timeless questions.** History,
  art and language questions need archives this project does not hold yet. Forcing a
  match would file a procurement audit under "What makes an original feel original?",
  which is exactly what the curated map in `src/lib/timeless-source-fit.ts` prevents.
