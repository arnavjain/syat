import type { PreviewTimelineEvent } from "@/lib/preview-content";
import type { ReaderStory } from "@/lib/reader-story-schema";

type TimelineEvent = PreviewTimelineEvent | ReaderStory["timeline"][number];

function isFixtureEvent(event: TimelineEvent): event is PreviewTimelineEvent {
  return "eventType" in event;
}

export function PostTimeline({ events, generated = false }: { events: readonly TimelineEvent[]; generated?: boolean }) {
  if (events.length === 0) return null;
  return (
    <section className="post-timeline" id="timeline" aria-labelledby="timeline-title">
      <div className="section-heading"><div>{generated ? <p className="reader-section-label">Timeline</p> : <p className="micro-copy">How this fixture unfolds</p>}<h2 id="timeline-title">A sequence, with its uncertainty left in.</h2></div><p>The timing is only as precise as the cited record allows.</p></div>
      <ol>
        {events.map((event, index) => <li key={isFixtureEvent(event) ? `${event.order}-${event.eventType}` : event.id}>
          <div className={`timeline-marker ${event.time.kind}`} aria-hidden="true"><span>{String(isFixtureEvent(event) ? event.order : index + 1).padStart(2, "0")}</span></div>
          <div className="timeline-time"><p>{isFixtureEvent(event) ? event.eventType : "Recorded point"}</p><strong>{event.time.label}</strong></div>
          <div className="timeline-reading"><p>{event.text}</p><small>{isFixtureEvent(event) ? event.uncertainty : "Read this point with the statement scope and limits shown above."}</small><div>{event.sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</div></div>
        </li>)}
      </ol>
    </section>
  );
}
