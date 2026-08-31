import type { ReactNode } from "react";

import type { ReaderStory } from "@/lib/reader-story-schema";

function sourceLinks(sourceIds: readonly string[]) {
  return sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>{sourceId}</a>);
}

function TimelineVisual({ story }: { story: ReaderStory }) {
  const events = story.timeline.length > 0 ? story.timeline.slice(0, 6) : [{ id: "current-record", time: story.eventTime, text: story.authoredVisual.description }];
  return <ol className="visual-sequence">{events.map((event) => <li key={event.id}><time>{event.time.label}</time><p>{event.text}</p></li>)}</ol>;
}

function ProcessVisual({ story }: { story: ReaderStory }) {
  return <ol className="visual-process">{story.statements.slice(0, 5).map((statement, index) => <li key={statement.id}><span>{index + 1}</span><div><strong>{statement.type}</strong><p>{statement.text}</p></div></li>)}</ol>;
}

function RelationshipVisual({ story }: { story: ReaderStory }) {
  const relationships = story.people.length > 0 ? story.people : story.sources.map((source) => ({ id: source.id, kind: "institution" as const, label: source.publisher, association: source.scope, sourceIds: [source.id] }));
  return <ul className="visual-relationships">{relationships.slice(0, 6).map((item) => <li key={item.id}><strong>{item.label}</strong><span>{item.kind.replaceAll("_", " ")}</span><p>{item.association}</p></li>)}</ul>;
}

function SourceRoleVisual({ story }: { story: ReaderStory }) {
  return <div className="visual-source-roles">{story.sources.map((source) => <article key={source.id}><span>{source.sourceKind.replaceAll("_", " ")}</span><h3>{source.publisher}</h3><p>{source.scope}</p></article>)}</div>;
}

function NumberStackVisual({ story }: { story: ReaderStory }) {
  const values = [
    [story.statements.filter((item) => item.type === "documented").length, "documented statements"],
    [story.sources.length, "credited source records"],
    [story.unresolved.length, "open questions"]
  ] as const;
  return <dl className="visual-number-stack">{values.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function ComparisonVisual({ story }: { story: ReaderStory }) {
  const views = story.perspectives.length > 0 ? story.perspectives.slice(0, 4) : [{ id: "record-view", label: "What the record sees", sees: story.statements[0]?.text ?? story.authoredVisual.description, mayMiss: story.unresolved[0]?.question ?? story.authoredVisual.limitation }];
  return <div className="visual-comparison">{views.map((view) => <article key={view.id}><h3>{view.label}</h3><p><strong>Brings into view</strong>{view.sees}</p><p><strong>May leave out</strong>{view.mayMiss}</p></article>)}</div>;
}

function VisualContent({ story }: { story: ReaderStory }): ReactNode {
  switch (story.authoredVisual.kind) {
    case "timeline": return <TimelineVisual story={story} />;
    case "process": return <ProcessVisual story={story} />;
    case "relationship_map": return <RelationshipVisual story={story} />;
    case "source_role_map": return <SourceRoleVisual story={story} />;
    case "number_stack": return <NumberStackVisual story={story} />;
    case "comparison": return <ComparisonVisual story={story} />;
  }
}

export function StoryVisual({ story }: { story: ReaderStory }) {
  const media = story.media.find((item) => item.id === story.authoredVisual.mediaId);
  if (!media || media.creator !== "Syāt visual desk" || media.reviewStatus !== "approved") return null;

  return (
    <figure className={`reader-authored-visual visual-${story.authoredVisual.kind}`} data-visual-kind={story.authoredVisual.kind} aria-labelledby="authored-visual-title">
      <figcaption>
        <span>Syāt visual desk</span>
        <h2 id="authored-visual-title">{story.authoredVisual.title}</h2>
        <p>{story.authoredVisual.description}</p>
      </figcaption>
      <div className="reader-visual-field"><VisualContent story={story} /></div>
      <footer>
        <p><strong>What this cannot show</strong>{story.authoredVisual.limitation}</p>
        <p className="visual-source-links"><strong>Built from</strong>{sourceLinks(story.authoredVisual.sourceIds)}</p>
        <small>{media.creditLine}</small>
      </footer>
    </figure>
  );
}
