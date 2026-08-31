# Syāt production-readiness design

## Outcome

Turn the current private editorial prototype into a trustworthy production MVP foundation. A reader must be able to discover a subject, understand it, inspect its evidence, take one useful next action, and return later. An editor must be able to move a source signal through a shared, reviewable workflow without an AI or browser-only state silently becoming publication.

## Product boundary

The first production slice is one complete path:

```text
source signal → human triage → source pack → optional AI draft
              → automatic checks → human decision → static story
              → save / Reframe / related question
```

One hundred RSS records remain source signals. They are not called stories. Real stories remain unpublished until a person has checked the sources, claims, viewpoint framing, media rights, and language edition.

## Reader experience

- The public home and reading pages render statically and do not load Convex or account code.
- News remains the default home. Timeless has its own stable route instead of making the home dynamic through query parameters.
- Every visible internal link resolves to a useful page.
- Every Timeless catalogue item opens an honest subject page. A subject without a source pack says that plainly and can seed Reframe with its question.
- Reframe describes only actions it can perform. It creates a local, input-aware reading plan; it does not pretend to fetch a link, extract a file, or run AI when those actions are off.
- First-time onboarding uses four short guided steps and ends inside a teaching story. It can remember completion in the browser without requiring an account.
- A story begins with a compact orientation, retains the full evidence and viewpoint depth, and ends with Save, Reframe, source, and related-question paths.

## Editorial workflow

- Source intake records, moderation decisions, source-pack membership, review events, editor roles, and ingestion health have explicit database records.
- Production Studio access requires an authenticated editor. A private Vercel preview may show the prototype queue while application authentication is being configured, but production fails closed.
- Review events are append-only. A current state may be projected for speed, but the decision history is retained.
- “Source pack ready” requires evidence, not only a button press: an India connection, at least two independent publishers unless an editor records a narrow-source exception, and at least one source opened and checked.
- Browser storage is a recoverable preview aid only. Writes are guarded against storage failures and never represent publication approval.

## Content intake

- RSS collection uses honest requests and stores metadata only.
- Selection limits a publisher, not merely each feed, so one newsroom cannot dominate by exposing many section feeds.
- A failed collection never replaces the last known good 100-item file with a partial result.
- Content checks fail when the declared seven-day queue has gone stale, contains duplicates, has invalid records, or violates the publisher cap.
- Publisher diversity is reported from the actual queue. The registry remains an acquisition plan, not evidence that a publisher is present.

## AI and cost

- OpenRouter remains editor-only. Public on-demand generation stays off.
- A generation request must reserve budget before making a paid call.
- Private preview uses a ₹1,000 warning threshold and a ₹1,400 hard monthly stop. The wider preview remains below ₹2,000 per month.
- Input hashes support reuse. Retries are bounded. Recorded provider usage reconciles with the reservation.
- Rejected or pending sources cannot enter a draft dossier.
- The model can link claims to known sources, but automatic review never claims that a paraphrase is true. Human review remains explicit.

## Data shape

The existing future-feature tables stay, with these additions or corrections:

- `sourceSignals`, `ingestionRuns`, `sourcePacks`, `sourcePackSources`
- `editorRoles`, `reviewEvents`
- `timelineEntries`, `topics`, `storyTopics`
- a usable input-hash index and monthly spend query path
- strict review-check values instead of arbitrary strings

Generated story structure must map without loss: dated timeline entries retain their dates, unresolved questions retain what evidence would help, and public versions are immutable after publication. Corrections create another version and correction event.

## Design system

Warm Commons is the default. Annotated Evidence and Signal Garden remain recognisably Syāt but change information emphasis, not only colour:

- Warm Commons: welcoming rounded reading sequence.
- Annotated Evidence: tighter geometry and stronger claim/source spine.
- Signal Garden: media and source trail appear earlier.

All directions share the same content, typography roles, accessibility labels, attribution rules, and mobile navigation. Small hibiscus text must meet normal-text contrast. Diagrams must support their actual number of viewpoints without overlap.

## Launch boundary

The following still require a person or external configuration: Google credentials, editor allow-list, Convex deployment, review of real claims, media rights decisions, Jain scholar review, Hindi editorial review, and any public launch. The implementation must make these gates visible and fail safely; it must not work around them.
