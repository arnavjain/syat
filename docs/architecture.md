# Syāt architecture

## Product shape

Syāt is a reading-first web app. News and Timeless are separate editorial modes. Reframe, saved reading, guided onboarding, the about page, and the internal Review Studio reuse the same structured content.

## Delivery shape

```text
trusted source → intake record → structured draft → editorial review
       ↓                                      ↓
  media-rights record                  publish projection
       ↓                                      ↓
static credited derivative      static reading page + Convex record
                                      ↓
                           private Vercel preview / Review Studio
```

## Why this is cost-aware

- Public reading pages are rendered on the server and cached. They do not need a live database round trip for every reader.
- Convex holds canonical content, approvals, jobs, saves, accounts, polls, and future community workflows.
- Small approved media derivatives live in `public/media` and ship with Vercel. There is no object-storage bill during private preview.
- AI runs only after deterministic source extraction and schema checks; the model sees the minimum needed text and must return strict JSON.

## Future-ready, not turned on

The model reserves records for accounts, saved items, public perspectives, comments, moderation reports, polls, recommendations, notifications, translations, and on-demand AI jobs. Public write paths remain off until policy and staffing are approved.
