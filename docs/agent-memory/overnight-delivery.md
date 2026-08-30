# Overnight delivery state

## What is deliberately real

- The app routes, content contracts, data checks, and Convex schema.
- 100 RSS metadata signals from the most recent seven-day window.
- 100 static Timeless questions.
- Source links, review labels, cost ceiling, and media rights records.

## What must not be misrepresented

- RSS signals are not Syāt-published stories.
- Teaching fixtures are fictional and visibly labelled.
- There are no rights-cleared external images or live social embeds yet.
- Google login and passkey registration remain disabled until stable credentials and URL are supplied.
- Studio is a read-only design/queue preview until editor roles are enforced.
- Vercel Authentication protects both the private preview and the unaliased staging deployment. The temporary default production alias was removed and now returns 404; no custom domain has been attached.
- Automated route, type, lint, build, and content checks have run. This environment did not provide a browser for screenshot or device-width inspection, so visual review still needs that final human/browser pass.

## Next safe work

1. Choose a stable hostname before enabling Google callback URLs or passkey registration. A per-deployment Vercel URL is suitable for review, not for a long-lived sign-in configuration.
2. Add an editor-role claim and protect write mutations and Studio.
3. Trial a source dossier through the strict draft parser; have an editor check it.
4. Promote only rights-verified media candidates into public assets.
