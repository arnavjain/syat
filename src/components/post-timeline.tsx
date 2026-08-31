import type { PreviewTimelineEvent } from "@/lib/preview-content";

export function PostTimeline({ events }: { events: readonly PreviewTimelineEvent[] }) {
  return (
    <section className="post-timeline" id="timeline" aria-labelledby="timeline-title">
      <div className="section-heading"><div><p className="micro-copy">How this fixture unfolds</p><h2 id="timeline-title">A sequence, with its uncertainty left in.</h2></div><p>The timing is only as precise as this teaching record allows.</p></div>
      <ol>
        {events.map((event) => <li key={`${event.order}-${event.eventType}`}>
          <div className={`timeline-marker ${event.time.kind}`} aria-hidden="true"><span>{String(event.order).padStart(2, "0")}</span></div>
          <div className="timeline-time"><p>{event.eventType}</p><strong>{event.time.label}</strong></div>
          <div className="timeline-reading"><p>{event.text}</p><small>{event.uncertainty}</small><div>{event.sourceIds.map((sourceId) => <a href={`#${sourceId}`} key={sourceId}>Source {sourceId}</a>)}</div></div>
        </li>)}
      </ol>
    </section>
  );
}
