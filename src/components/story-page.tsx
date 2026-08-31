import Link from "next/link";

import type { PreviewStory } from "@/lib/preview-content";

import { AssociatedPeople } from "./associated-people";
import { ContextBridge } from "./context-bridge";
import { PostTimeline } from "./post-timeline";
import { StatementBasisSheet } from "./statement-basis-sheet";

function reframePath(story: PreviewStory): string {
  const parameters = new URLSearchParams();
  if (story.actions.reframe.topic) parameters.set("topic", story.actions.reframe.topic);
  if (story.actions.reframe.claim) parameters.set("claim", story.actions.reframe.claim);
  return `/en/reframe?${parameters.toString()}`;
}

export function StoryPage({ story }: { story: PreviewStory }) {
  return (
    <article className="story-page">
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
        <div className="media-subject"><p className="micro-copy">Fixed subject</p><h2 id="story-media-title">A street rule is a starting point. Daily life is the question.</h2><p>{story.media.label}</p></div>
        <div className="media-reading-map" aria-label="A conceptual teaching map of bus corridor, market edge, school gate, and clinic approach"><span>Bus corridor</span><span>Market edge</span><span>School gate</span><span>Clinic approach</span><b>One street rule</b></div>
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

      <section className="story-return" aria-labelledby="story-return-title"><p className="micro-copy">Keep reading</p><h2 id="story-return-title">Choose one useful next step.</h2><div><a className="story-return-action" href={`#${story.actions.sourceTrailTarget}`}><strong>Follow the source trail</strong><span>See the material this teaching fixture names.</span></a><Link className="story-return-action" href="/en/saved"><strong>Save for later</strong><span>Sign-in is needed before a shelf can remember it.</span></Link><Link className="story-return-action" href={reframePath(story)}><strong>Reframe this reading</strong><span>Make a local reading plan from this story’s question or claim.</span></Link><a className="story-return-action" href="#context-bridge-title"><strong>Follow the larger question</strong><span>Move from one fixture event to a Timeless subject.</span></a></div></section>
    </article>
  );
}
