# Content review gate

## Purpose

Syāt can use AI to prepare a source-linked draft. It cannot use AI to publish a story. The review record exists so a person can see what the system checked, what it could not check, and why a draft is waiting.

## What runs automatically

- The strict parser accepts only known source IDs, known claim IDs, supported locales, and the draft-only status.
- A direct quote is blocked when it does not appear word-for-word in the small source excerpt supplied for that job.
- A repeated factual claim is blocked so the editor does not have to untangle duplicate wording.
- The review warns if there is only one publisher, a news source has no date, a media idea still needs rights review, or the job lacks a written India connection.
- The result is always `publicationAllowed: false`.

## What a person must decide

- Whether a source really supports a paraphrase or interpretation.
- Whether a source pack is broad enough for a claim.
- Whether an issue is relevant and fairly framed for an Indian reader.
- Whether a viewpoint is responsibly described and does not create false balance.
- Whether a visual has the creator credit, rights basis, proof, accessible text, and approval to appear.
- Whether an English or Hindi version can be published.

## Where it is stored

`draftReviews` records the contract version, automatic checks, findings, any editor note, and the final human decision. It links to the generation job and, once one exists, the story record.

Until Google sign-in, editor roles, and Convex are connected, Review Studio has a private browser-only queue. It saves a reviewer’s hold, reject, source-pack-ready choice, and note in that browser alone. Those choices never approve or publish a story and are intentionally not shared with other reviewers.
