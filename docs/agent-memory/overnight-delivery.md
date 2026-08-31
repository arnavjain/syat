# Overnight delivery state

## What is deliberately real

- The app routes, content contracts, data checks, and Convex schema.
- 100 RSS metadata signals from the most recent seven-day window, selected from India-first feeds.
- 100 static Timeless questions.
- Source links, review labels, cost ceiling, and media rights records.

## What must not be misrepresented

- RSS signals are not Syāt-published stories.
- “India-first” describes source selection. A source can still cover an international event, which needs an explicit India connection before it is drafted.
- Teaching fixtures are fictional and visibly labelled.
- There are no rights-cleared external images or live social embeds yet.
- Google login and passkey registration remain disabled until stable credentials and URL are supplied.
- Studio is a read-only design/queue preview until editor roles are enforced.
- Vercel Authentication protects both the private preview and the unaliased staging deployment. The temporary default production alias was removed and now returns 404; no custom domain has been attached.
- Automated route, type, lint, build, and content checks have run. This environment did not provide a browser for screenshot or device-width inspection, so visual review still needs that final human/browser pass.
- A live OpenRouter smoke draft has passed the strict parser and automatic review. It was fictional, source-bound, review-only, and not stored as a story. The automatic gate blocks unverified direct quotes and repeated claims; it warns about thin evidence, media rights, missing dates, and missing India context.

## Next safe work

1. Choose a stable hostname before enabling Google callback URLs or passkey registration. A per-deployment Vercel URL is suitable for review, not for a long-lived sign-in configuration.
2. Add an editor-role claim and protect write mutations and Studio.
3. Build fuller source dossiers for selected queue items, then have an editor check the source evidence and the automatic review record.
4. Promote only rights-verified media candidates into public assets.
