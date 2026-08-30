# Syāt private-preview plan

This plan separates what can be built and checked overnight from what needs a real person before any public launch. The aim is a polished private preview, not a public newsroom without editors, rights review, and launch approval.

## Product promise

Syāt is a reading-first product for current events and enduring questions. It keeps five things separate: what a source directly supports; what an editor infers; what someone experiences from a particular position; what people value or disagree about; and what remains unresolved. The first screen leads to reading. Reframe is a separate task, never the dominant home-page action.

## Three matching design directions

| Direction | Use | Character |
| --- | --- | --- |
| Warm Commons | private-preview default | rounded paper surfaces, marigold orientation, aubergine reading field, vivid but comfortable |
| Annotated Evidence | review variant A | open corners, tighter radius, stronger source and change marks |
| Signal Garden | review variant C | larger visual tray, teal/cobalt emphasis, media-first source trail |

All three use the same stories, source cards, labels, typography, credit line, and mobile navigation. Content is never made to look more convincing in one direction than another.

## Overnight MVP scope

- Home with News and Timeless modes, but no Reframe feature block on Home.
- A 100-item, seven-day RSS metadata queue. It links only to the original publisher and stays marked `needs_editorial_review` and `link_only`.
- A 100-topic static Timeless catalogue across cities, history, science, work, food, technology, art, language, health, and democracy.
- Two explicitly fictional teaching fixtures that make the evidence, standpoint, source, visual, and uncertainty pattern testable without pretending to report news.
- English first-use guide, Hindi entry screen, About page, reading pages, Explore, Saved empty state, Reframe workbench, You/account gate, and read-only Review Studio.
- Convex schema for source, story, edition, content blocks, media rights, saves, community features, recommendations, notification records, and durable job/outbox records.
- A strict DeepSeek/OpenRouter draft contract. It can make only a source-bound review draft; it cannot publish.

## Guided first-use flow

```text
Welcome → documented evidence → standpoint → unresolved question → open a story
                                              ↓
                                       save / Reframe / source trail
```

The guide works before sign-in. Account benefits are explained only when available; it does not pretend that saves, recommendations, or notifications are live before the owner approves their policies.

## Content and media pipeline

```text
RSS or approved source → intake record → source dossier → strict draft → parse references
                                                            ↓
                           rights candidate → media review → editor approval → immutable public version
```

Every paragraph, quote, and media position has a stable block ID and references claim/source IDs. The database has separate media candidates, approved assets, renditions, and placements. A visual cannot become public without a rights basis, proof, credit, alt text, caption, and a reviewer.

Source discovery uses normal, honest requests to named RSS feeds. It does not impersonate Googlebot, scrape publisher pages, copy thumbnails, or reuse article images. Until rights are verified, external media stays as a link or click-to-load official embed card. The preview’s diagrams are owned, fictional teaching illustrations with visible limits.

## Future features designed but gated

The schema reserves space for user accounts, synced saves, reading progress, polls, public perspectives, comments and reports, recommendations, notifications, English/Hindi editions, and public on-demand AI. They remain disabled until each has its own policy, moderation, consent, cost, and role check.

## Cost and speed guardrails

- Vercel Hobby only; no R2 and no domain in this stage.
- ₹1,400 monthly AI target; all paid AI stays below the ₹2,000 private-preview ceiling.
- OpenRouter uses `deepseek/deepseek-v4-flash-0731`, low temperature, strict JSON, a source dossier, and job-input reuse.
- Public reading routes are static where possible. Heavy account, auth, social embed, and AI code loads only where needed.
- No third-party media player loads before a reader asks.
- Every media box reserves its space to avoid layout jumps.

## Morning handoff: Google

1. Create Google OAuth web credentials for the stable Vercel preview address.
2. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to the private environment; never paste them into chat or commit them.
3. Set `SITE_URL` to the stable preview URL, then add the exact callback URL shown by the auth route configuration to Google.
4. Test Google sign-in, sign-out, and adding a passkey on two devices before enabling synced writes.

Passkeys need a stable hostname. A changing preview hostname will break the relying-party boundary, so passkey registration stays visibly gated until a stable preview address exists.

## Human gates before public launch

- English and Hindi editorial review.
- Jain scholar/practitioner review of About language and any religious imagery.
- Media-rights reviewer and Indian copyright/legal review for uncertain material.
- Auth proof on a stable URL; role checks for Studio.
- Moderator coverage before comments, submissions, or polls open.
- Accessibility, mobile, performance, and reader testing with real people.
- Explicit owner approval for public launch.
