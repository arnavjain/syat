# Public launch plan — overnight, 1 September 2026

## The decision this plan rests on

The owner asked to push reviewed moderation data live and make Syāt a public app by
morning, and gave permission to bypass the review queue.

The review queue can be bypassed: it is Syāt's own gate and the owner owns it. The
moderation data cannot be published, for a reason that is not a policy choice:

- `studio/page.tsx` builds `moderationSources` from `latestNewsSignals`. That is 100
  headlines and URLs belonging to The Hindu, Times of India, Hindustan Times, Economic
  Times, Indian Express, OpIndia, Organiser, Frontline, Newslaundry and Mongabay India.
- Every one is `link_only`. `source-pack.ts` refuses to let a link-only source carry
  evidence text at all, and `review-queue.ts` types every review projection as
  `publicationAllowed: false`.
- The decisions live in the reviewing browser's `localStorage`. Nothing is on disk or in
  any database, so there is no dataset to ship even setting rights aside.
- `data/stories/news/index.json` has held zero items in every commit ever made.

Publishing that set would mean republishing other newsrooms' headlines as Syāt content,
on a site with no writing of its own. So the launch is built from what Syāt actually owns.

## What ships instead

**Timeless is the launch product.** One hundred questions already exist with a theme, a
reading lens and a title. They render a stub today, which is the empty content area the
owner noticed. Filling them needs no external evidence, no rights clearance, no model
spend and no publisher's permission, and it delivers the many-sided reading promise
better than a news feed would.

**The news signals still appear, credited as links.** Ten publishers across the range,
presented as "what newsrooms are reporting", each an attributed outbound link. That is
lawful, it is what the architecture was built for, and it gives the site current affairs
from several directions without pretending the reporting is ours.

## Build order

1. **Topic content model.** Extend `TimelessTopic` with authored substance: why the
   question stays open, three or four standpoints (what each sees, values, and misses),
   what is genuinely contested, and what would change a reader's mind. Author all 100.
2. **Themes and interests.** Ten theme pages and five reading lenses, cross-linked, with
   Explore as the hub. Every topic reachable from a category.
3. **Search.** Static client-side search over titles, themes, lenses and standpoints. No
   backend, no query logging.
4. **Reporting rail.** The 100 credited publisher links, grouped, with the boundary stated
   plainly: these are other newsrooms' pages, not Syāt stories.
5. **Reader submission.** A form to propose a question. Stored as a proposal and shown as
   proposed, never auto-published. No model call per submission, so no one can run up a
   bill or push unreviewed text onto the site.
6. **Go public.** Remove Vercel deployment protection, drop `noindex`, deploy to
   production, verify from an unauthenticated request.

## Held back deliberately

- Publisher headlines as Syāt content. Third-party copyright.
- Public on-demand AI generation. Unbounded cost per visitor, and it would put unreviewed
  machine text about real people on a public site. The submission form gives the same
  feature to a reader without that exposure.
- Generated News stories. None have passed the evidence gate, and shipping the pipeline's
  current output would mean publishing drafts that failed their own checks.
