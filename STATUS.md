# Syāt build status

Updated as work lands. Newest at the top.

---

## Landed since you last looked

- **26 specific Indian history questions**, live. The freedom struggle argued rather
  than narrated (1857 to the INA trials), Partition and its arithmetic (Cabinet
  Mission, the Radcliffe line, the recovery programmes), and the writing of the
  Constitution. Each has three or four standpoints that genuinely disagree. Catalogue
  is now **126 questions**, up from 100.
- **A search bar**, in the top navigation, covering both libraries at once. Built at
  compile time, searched on your device, nothing typed is sent anywhere.
- **A landing explainer** that says what Syāt is, where material comes from, and what
  is not finished, including that there are no accounts and recommendations are off.
- **Reader-proposed questions** now reachable from the footer and the landing page.
- **PIB collected** as a second source lane, 112 packs.
- **Story marks**: every News story draws its own SVG, since no newsroom image may sit
  beside one.

## Live

- https://syat-seven.vercel.app
- https://syat-jdso.vercel.app
- 126 Timeless questions · 13 News previews · 179 static pages

## Open decisions and blocks

- **Google sign-in is fully built and cannot be switched on by me.** `convex/auth.ts`
  registers the provider, the button exists on `/en/you`. It needs two secrets from
  your Google Cloud Console: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, with
  `https://syat-seven.vercel.app/api/auth/callback/google` as an authorised redirect
  URI. Paste them into `.env.local` and Vercel project settings and it works.
- **Court judgments are not usable.** `sci.gov.in` refuses the request outright (403).
  Getting past that means impersonating a browser on someone else's system, so that
  lane is closed rather than worked around.
- **Parliament Q&A is open but client-rendered** with no exposed API. Reachable, but
  needs a rendering step rather than a plain fetch.
- **Audit records reach about a third of the enduring questions.** History, art and
  language questions cannot be grounded in audit data, which is why they are authored
  rather than generated.

## Budget

Cap raised to **Rs 1,000** on your instruction. Spent: **Rs 92.24**. No model spend
since; everything above was written or built rather than generated.

## The rights boundary, since it shapes everything

Newspapers are in: 23 registered, 10 collected, across the spectrum including Organiser
and OpIndia. Every newsroom is **link-only** — headline and link, never article text.
`src/lib/source-pack.ts` structurally refuses to let a link-only source carry evidence
text. Stories get written from records carrying a reproduction policy.
