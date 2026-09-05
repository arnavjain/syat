# Pilot status, 5 September 2026

## Where it stands

Thirteen reviewed News previews are staged and live on the private preview surfaces.
Every one keeps `status: private_preview`, `publicationAllowed: false` and `noindex`.
Nothing is published, and a human still has to approve any of it.

Live at https://syat-seven.vercel.app and https://syat-jdso.vercel.app.
`syat.vercel.app` is an unrelated project and is not ours.

Coverage spans five states and the centre: Haryana e-procurement, Jharkhand and
Rajasthan rural employment, Nagaland's fiscal position, Green India Mission, West
Bengal veterinary services, railway freight and asset renewal, central public sector
planning, SC/ST apprenticeship funds in Mumbai, the FAME-I portal, and IT controls at
Tata Memorial Centre. All five story formats are in use.

## The budget is spent

Rs 92.24 of the Rs 100 pilot cap. **Generation stops here.** Raising the cap is the
owner's decision, not the agent's. Roughly 19 paise per attempt, so Rs 100 more would
buy about 500 attempts.

## What the money bought, and what it taught

Three constraints were found and fixed this session, in the order they were binding:

1. **Deduplication was discarding two thirds of the source pool.** Every CAG title
   carries the same institutional boilerplate, so title similarity read distinct
   reports on different states as one event. Excluding those tokens took the pool from
   12 usable packs to 29. The archive itself runs to roughly 282 listing pages, about
   2,800 reports, so sources were never the real ceiling.

2. **The prompt never stated the article length the gate enforces.** The gate rejects
   a body outside 350 to 800 words and the model was never told. Forty-five per cent
   of cached drafts came in under 350. Draft length did not track evidence length at
   all, so this was variance against an unstated target, not packs too thin to write
   from. Word-count rejections stopped within one round of stating it.

3. **The repair figure guard was stricter than its own rule.** It refused every new
   digit; the rule only forbids inventing one. Restating a date the cited evidence
   carries is grounded, and good repairs were being thrown away for it. Fixing that
   exposed a worse bug: every two-digit number was expanded to a year, so "24
   districts" and "2024" were the same figure and a rewrite could swap a count for a
   date unnoticed. Expansion is now contextual.

## The remaining constraint

Close copy, and it is now the only large one: 19 of 34 failures, almost all in
paragraph fields, and they survive the one permitted repair call. The repair prompt
has been sharpened (length may change, split or merge sentences, change the
grammatical subject) but the effect was not measurable before the cap was reached.

Anyone resuming should treat this as the next diagnosis, not more prompt wording.
Five rounds of wording changes have already been paid for. The tokeniser fix, which
was a measurement bug rather than an instruction, was worth more than all of them.

## Rate, honestly

About one accepted article per nine attempts. One hundred articles is not reachable
under the current cap, and was not reachable at any point this session. Thirteen is
what Rs 92 bought.
