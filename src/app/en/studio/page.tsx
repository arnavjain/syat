import { SiteChrome } from "@/components/site-chrome";
import { ModerationQueue } from "@/components/moderation-queue";
import { maximumSignalsPerPublisher } from "@/lib/news-intake";
import { isSensitiveNewsSignal, isSignalSnapshotCurrent, latestNewsSignals, newsSignalMetadata } from "@/lib/news-signals";
import { publisherRegistry } from "@/lib/publisher-registry";

const reviewRows = [
  ["India-first source intake", String(newsSignalMetadata.itemCount), "Waiting for source and claim review", "source metadata only"],
  ["Timeless questions", "100", "Ready to commission source packs", "non-AI catalogue"],
  ["Teaching fixtures", "2", "Checked as clearly fictional", "safe for private preview"],
  ["Media assets", "0", "No external asset published", "rights-first"],
  ["AI story drafts", "0", "Pipeline configured; human approval required", "cost-capped"],
  ["Automatic review gate", "1 smoke test", "Parser and review passed; output discarded", "never publishes"],
] as const;

export default function StudioPage() {
  const publisherCounts = [...latestNewsSignals.reduce((counts, signal) => counts.set(signal.publisher, (counts.get(signal.publisher) ?? 0) + 1), new Map<string, number>()).entries()].sort(([first], [second]) => first.localeCompare(second));
  const currentPublishers = new Set(publisherCounts.map(([publisher]) => publisher));
  const acquisitionGaps = publisherRegistry.filter((publisher) => !currentPublishers.has(publisher.name));
  const snapshotIsCurrent = isSignalSnapshotCurrent(newsSignalMetadata);
  const moderationSources = latestNewsSignals.map((signal) => ({
    id: signal.id,
    title: signal.title,
    publisher: signal.publisher,
    url: signal.url,
    publishedAt: signal.publishedAt,
    sourceClass: signal.sourceClass,
    isSensitive: isSensitiveNewsSignal(signal)
  }));

  return (
    <SiteChrome active="studio">
      <section className="studio-page">
        <p className="micro-copy">Private Review Studio · read-only preview</p>
        <h1>See what is ready, and what is not.</h1>
        <p className="page-lede">This is a review terminal, not a public dashboard. It has no write controls until Google sign-in and editor roles are verified.</p>
        <p className="studio-timestamp">Last good India-first source intake: {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(newsSignalMetadata.generatedAt))} UTC · {newsSignalMetadata.windowDays}-day window · {snapshotIsCurrent ? "within its declared freshness window" : "stale — kept only for private review, not current public use"}</p>
        <div className="studio-summary">
          <div><strong>₹1,400</strong><span>monthly AI ceiling</span></div>
          <div><strong>0</strong><span>publicly generated stories</span></div>
          <div><strong>0</strong><span>rights-cleared external media files</span></div>
        </div>
        <ModerationQueue sources={moderationSources} />
        <div className="review-table" role="table" aria-label="Content and publication queue">
          <div className="review-row review-heading" role="row"><span role="columnheader">Queue</span><span role="columnheader">Count</span><span role="columnheader">State</span><span role="columnheader">Guardrail</span></div>
          {reviewRows.map(([queue, count, state, guardrail]) => <div className="review-row" role="row" key={queue}><strong role="cell">{queue}</strong><span role="cell">{count}</span><span role="cell">{state}</span><span role="cell">{guardrail}</span></div>)}
        </div>
        <section className="publisher-balance" aria-labelledby="publisher-balance-title">
          <div>
            <p className="micro-copy">Actual source distribution</p>
            <h2 id="publisher-balance-title">Current queue: {latestNewsSignals.length} signals from {publisherCounts.length} publishers.</h2>
            <p>This queue is concentrated. A new collection stops at {maximumSignalsPerPublisher} signals per publisher and rotates that publisher’s feeds; it may honestly contain fewer than 100 records. These are the records actually collected, not a claim of balance or a political scorecard. Each story still needs its own evidence check.</p>
          </div>
          <div>
            <h3>Current queue by publisher</h3>
            <ul>{publisherCounts.map(([publisher, count]) => <li key={publisher}><p>Collected source signals</p><h3>{publisher}</h3><span>{count} of {latestNewsSignals.length} records</span></li>)}</ul>
            <h3>Publishers we still need in a future intake</h3>
            <ul>{acquisitionGaps.map((publisher) => <li key={publisher.id}><p>{publisher.kind} · {publisher.intake}</p><h3>{publisher.name}</h3><span>{publisher.note}</span></li>)}</ul>
          </div>
        </section>
        <section className="studio-gates">
          <h2>Before any publishing switch appears</h2>
          <ul><li>Editor approves every factual sentence and source connection.</li><li>Rights reviewer clears each external visual or keeps it link-only.</li><li>English and Hindi editions are reviewed separately.</li><li>Google sign-in and an editor role protect real write actions.</li></ul>
        </section>
      </section>
    </SiteChrome>
  );
}
