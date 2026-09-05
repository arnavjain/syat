import Link from "next/link";

import type { PreviewStory } from "@/lib/preview-content";
import type { ReaderStory } from "@/lib/reader-story-schema";
import { timelessTopicPath } from "@/lib/timeless-topics";

import { AssociatedPeople } from "./associated-people";
import { ContextBridge } from "./context-bridge";
import { PostTimeline } from "./post-timeline";
import { StandpointDeck } from "./standpoint-deck";
import { StatementBasisSheet } from "./statement-basis-sheet";
import { StoryBody } from "./story-body";
import { StoryVisual } from "./story-visual";

function fixtureReframePath(story: PreviewStory): string {
  const parameters = new URLSearchParams();
  if (story.actions.reframe.topic) parameters.set("topic", story.actions.reframe.topic);
  if (story.actions.reframe.claim) parameters.set("claim", story.actions.reframe.claim);
  return `/en/reframe?${parameters.toString()}`;
}

function readerReframePath(story: ReaderStory): string {
  const parameters = new URLSearchParams();
  parameters.set(story.reframe.kind, story.reframe.value);
  return `/en/reframe?${parameters.toString()}`;
}

function formatName(format: ReaderStory["format"]) {
  return format.replaceAll("_", " ");
}

function statementBasis(statement: ReaderStory["statements"][number]) {
  return {
    id: statement.id,
    statementType: statement.type,
    basis: statement.basis.replaceAll("_", " "),
    sourceScope: statement.sourceScope,
    limits: statement.limits
  };
}

function ReaderStoryPage({ story }: { story: ReaderStory }) {
  const pibOnlyPilot = story.sources.length === 1 && /press information bureau/i.test(story.sources[0].publisher) && story.relatedCoverage.length === 0;
  // ContextBridge renders nothing when the story's topic slug is not an approved Timeless
  // topic, so the rail must not advertise an anchor that does not exist.
  const contextBridgeAvailable = Boolean(timelessTopicPath(story.contextBridge.topicSlug));
  return (
    <article className="story-page reader-story-page">
      <header className="story-header reader-story-header">
        <p className="reader-preview-status">{story.disclosure}</p>
        <dl className="reader-story-meta">
          <div><dt>Theme</dt><dd>{story.theme}</dd></div>
          <div><dt>Format</dt><dd>{formatName(story.format)}</dd></div>
          <div><dt>Date</dt><dd>{story.eventTime.label}</dd></div>
          <div><dt>Read</dt><dd>{story.readingMinutes} min</dd></div>
        </dl>
        <h1>{story.title}</h1>
        <p className="page-lede">{story.dek}</p>
        <p className="reader-india-connection">{story.indiaConnection}</p>
        {pibOnlyPilot ? <p className="reader-pilot-scope"><strong>Source scope:</strong> This private UX pilot uses one PIB evidence release. It is not a balanced edition, and no independent reporting or affected voices were supplied.</p> : null}
      </header>

      <nav className="story-rail reader-story-rail" aria-label="Story sections">
        <a href="#story-body">Story</a>
        <a href="#evidence">Evidence</a>
        {story.timeline.length > 0 ? <a href="#timeline">Timeline</a> : null}
        {story.people.length > 0 ? <a href="#people">People</a> : null}
        <a href="#source-trail">Sources</a>
        {contextBridgeAvailable ? <a href="#context-bridge-title">Context</a> : null}
      </nav>

      <StoryVisual story={story} />
      <StoryBody blocks={story.body} />

      <section className="reader-evidence" id="evidence" aria-labelledby="reader-evidence-title">
        <div className="reader-section-heading">
          <h2 id="reader-evidence-title">What the record supports</h2>
          <p>Each statement keeps its basis, source scope and limit together. An official record is clearly marked as an official record.</p>
        </div>
        <div className="reader-evidence-list">
          {story.statements.map((statement) => (
            <article className={`reader-evidence-row evidence-${statement.type}`} key={statement.id}>
              <p className="reader-evidence-type">{statement.type}</p>
              <h3>{statement.text}</h3>
              <p>{statement.sourceScope}</p>
              <StatementBasisSheet statement={statement.text} basis={statementBasis(statement)} sourceIds={statement.sourceIds} />
            </article>
          ))}
        </div>
      </section>

      <PostTimeline events={story.timeline} generated />

      {story.perspectives.length > 0 ? (
        <section className="reader-perspectives" id="perspectives" aria-labelledby="reader-perspectives-title">
          <div className="reader-section-heading">
            <h2 id="reader-perspectives-title">Different starting points, kept within their evidence</h2>
          </div>
          <StandpointDeck
            idPrefix={`perspective-${story.slug}`}
            standpoints={story.perspectives.map((perspective) => ({
              label: perspective.label,
              rationale: perspective.rationale,
              sees: perspective.sees,
              values: perspective.values,
              uses: perspective.uses,
              mayMiss: perspective.mayMiss,
              sources: <p className="reader-inline-sources">{perspective.sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</p>
            }))}
          />
        </section>
      ) : null}

      <AssociatedPeople associations={story.people} generated />

      <section className="reader-source-trail" id="source-trail" aria-labelledby="reader-source-title">
        <div className="reader-section-heading">
          <h2 id="reader-source-title">Inspect the original records</h2>
          <p>Credit and a link do not claim that every source independently confirms the story.</p>
        </div>
        <div className="reader-source-list">
          {story.sources.map((source) => (
            <article id={source.id} key={source.id}>
              <div><span>{source.sourceKind.replaceAll("_", " ")}</span><time dateTime={source.publishedAt}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(source.publishedAt))}</time></div>
              <h3><a href={source.url} rel="noreferrer" target="_blank">{source.title} <span aria-hidden="true">↗</span></a></h3>
              <p>{source.publisher}. {source.use}</p>
              <small>{source.scope}</small>
            </article>
          ))}
        </div>
        {story.relatedCoverage.length > 0 ? (
          <div className="reader-related-coverage">
            <h3>Related reporting to read separately</h3>
            <p>These credited links were not used as model input.</p>
            <ul>{story.relatedCoverage.map((source) => <li key={source.id}><a href={source.url} rel="noreferrer" target="_blank">{source.publisher}: {source.title} <span aria-hidden="true">↗</span></a></li>)}</ul>
          </div>
        ) : null}
        <p className="reader-related-boundary">Related newsroom links, when present, are credited separately and are never used as model input without a recorded permission.</p>
      </section>

      <section className="reader-unknowns" aria-labelledby="reader-unknowns-title">
        <div className="reader-section-heading">
          <h2 id="reader-unknowns-title">What remains uncertain</h2>
        </div>
        <ol>{story.unresolved.map((item) => <li key={item.id}><h3>{item.question}</h3><p><strong>What would help</strong>{item.whatWouldHelp}</p><p className="reader-inline-sources">{item.sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</p></li>)}</ol>
      </section>

      <ContextBridge bridge={story.contextBridge} />

      <section className="story-return reader-story-return" aria-labelledby="story-return-title">
        <h2 id="story-return-title">Keep the thread</h2>
        <div>
          <a className="story-return-action" href="#source-trail"><strong>Follow the source trail</strong><span>Open the original records and their limits.</span></a>
          <Link className="story-return-action" href="/en/saved"><strong>Save for later</strong><span>Saving stays on this device until sign-in is added.</span></Link>
          <Link className="story-return-action secondary" href={readerReframePath(story)}><strong>Reframe this reading</strong><span>Ask what changes from another grounded standpoint.</span></Link>
          <Link className="story-return-action" href="/en/news"><strong>Read another preview</strong><span>Return to the News archive.</span></Link>
        </div>
      </section>
    </article>
  );
}

function FixtureStoryPage({ story }: { story: PreviewStory }) {
  return (
    <article className="story-page fixture-story-page">
      <header className="story-header">
        <p className="micro-copy">{story.kicker}</p>
        <h1>{story.title}</h1>
        <p className="page-lede">{story.dek}</p>
        <p className="story-updated">{story.updatedLabel} · <Link href="/en/about#editorial-fixtures">Why this label?</Link></p>
      </header>

      <nav className="story-rail" aria-label="Story sections">
        <p>Read this fixture</p><a href="#evidence">Basis</a><a href="#timeline">Timeline</a><a href="#people">People &amp; roles</a><a href="#context-bridge-title">Context</a><a href={`#${story.actions.sourceTrailTarget}`}>Sources</a>
      </nav>

      <section className="story-media" aria-labelledby="story-media-title">
        <div className="media-subject"><p className="micro-copy">Fixed subject</p><h2 id="story-media-title">{story.media.subjectTitle}</h2><p>{story.media.label}</p></div>
        <div className="media-reading-map" aria-label={story.media.mapAriaLabel}>{story.media.mapLabels.map((label) => <span key={label}>{label}</span>)}<b>{story.media.mapCenter}</b></div>
        <dl className="media-metadata"><div><dt>Creator</dt><dd>{story.media.creator}</dd></div><div><dt>Source</dt><dd>{story.media.source}</dd></div><div><dt>Rights basis</dt><dd>{story.media.rightsBasis}</dd></div><div><dt>Review</dt><dd>{story.media.reviewStatus}</dd></div><div><dt>Publication</dt><dd>{story.media.publicationStatus}</dd></div></dl>
        <p className="visual-limitation">Limit: {story.media.limitation}</p>
      </section>

      <section className="story-summary"><div><p className="micro-copy">{story.mode === "news" ? "What changed" : "The question"}</p><p>{story.whatChanged}</p></div><div><p className="micro-copy">{story.mode === "news" ? "Why it matters here" : "Why keep it open"}</p><p>{story.whyItMatters}</p></div></section>

      <section className="evidence-section" id="evidence"><div className="section-heading"><div><h2>What the fixture can say, and what it cannot.</h2></div><p>Open a statement’s basis to see its type, scope, and limits. A source ID names material to inspect; it is not an automatic proof badge.</p></div><div className="evidence-list">{story.evidence.map((item) => <article className={`evidence-card ${item.type}`} key={item.basis.id}><p>{item.type}</p><h3>{item.text}</h3><small>{item.scope}</small><StatementBasisSheet statement={item.text} basis={item.basis} sourceIds={item.sourceIds} /></article>)}</div></section>

      <PostTimeline events={story.timeline} />

      <section className="perspective-section" id="perspectives"><p className="micro-copy">The same question, different starting points</p><h2>Read the friction, not a formula.</h2><p className="perspective-boundary">Each role below is a starting standpoint for this fictional fixture. It is not a full community, demographic, or representation claim.</p><div>{story.perspectives.map((item) => <article key={item.label}><p className="micro-copy">Starting standpoint</p><h3>{item.label}</h3><p className="perspective-start">{item.startingPoint}</p><p>{item.reading}</p><small>{item.boundary}</small><div>{item.sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</div></article>)}</div></section>

      <AssociatedPeople associations={story.associatedPeople} />
      <ContextBridge bridge={story.contextBridge} />

      <section className="source-trail" id={story.actions.sourceTrailTarget}><p className="micro-copy">Source trail</p><h2>What this page is built from.</h2>{story.sources.map((source) => <article id={source.id} key={source.id}><p>{source.publishedLabel}</p><h3><a href={source.url}>{source.title} <span aria-hidden="true">↗</span></a></h3><p>{source.publisher} · {source.use}</p></article>)}<p className="embed-gate">Social posts and media embeds are click-to-load and require an approved source, rights record, and caption. This teaching fixture has none to load.</p></section>

      <section className="story-return" aria-labelledby="story-return-title"><p className="micro-copy">Keep reading</p><h2 id="story-return-title">Choose one useful next step.</h2><div><a className="story-return-action" href={`#${story.actions.sourceTrailTarget}`}><strong>Follow the source trail</strong><span>See the material this teaching fixture names.</span></a><Link className="story-return-action" href="/en/saved"><strong>Save for later</strong><span>Sign-in is needed before a shelf can remember it.</span></Link><Link className="story-return-action" href={fixtureReframePath(story)}><strong>Reframe this reading</strong><span>Make a local reading plan from this story’s question or claim.</span></Link><a className="story-return-action" href="#context-bridge-title"><strong>Follow the larger question</strong><span>Move from one fixture event to a Timeless subject.</span></a></div></section>
    </article>
  );
}

export function StoryPage({ story }: { story: PreviewStory | ReaderStory }) {
  return "contractVersion" in story ? <ReaderStoryPage story={story} /> : <FixtureStoryPage story={story} />;
}
