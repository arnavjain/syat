import { SiteChrome } from "@/components/site-chrome";
import { formatSignalDate, latestNewsSignals, newsSignalMetadata } from "@/lib/news-signals";
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
  const sourceQueue = latestNewsSignals.slice(0, 12);

  return (
    <SiteChrome active="studio">
      <section className="studio-page">
        <p className="micro-copy">Private Review Studio · read-only preview</p>
        <h1>See what is ready, and what is not.</h1>
        <p className="page-lede">This is a review terminal, not a public dashboard. It has no write controls until Google sign-in and editor roles are verified.</p>
        <p className="studio-timestamp">Latest India-first source intake: {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(newsSignalMetadata.generatedAt))} UTC · {newsSignalMetadata.windowDays}-day window</p>
        <div className="studio-summary">
          <div><strong>₹1,400</strong><span>monthly AI ceiling</span></div>
          <div><strong>0</strong><span>publicly generated stories</span></div>
          <div><strong>0</strong><span>rights-cleared external media files</span></div>
        </div>
        <div className="review-table" role="table" aria-label="Content and publication queue">
          <div className="review-row review-heading" role="row"><span role="columnheader">Queue</span><span role="columnheader">Count</span><span role="columnheader">State</span><span role="columnheader">Guardrail</span></div>
          {reviewRows.map(([queue, count, state, guardrail]) => <div className="review-row" role="row" key={queue}><strong role="cell">{queue}</strong><span role="cell">{count}</span><span role="cell">{state}</span><span role="cell">{guardrail}</span></div>)}
        </div>
        <section className="publisher-balance" aria-labelledby="publisher-balance-title">
          <div>
            <p className="micro-copy">Publisher diversity record</p>
            <h2 id="publisher-balance-title">Many sources, no political scorecard.</h2>
            <p>Syāt records the kind of source and how it enters the queue. It does not assign publishers a left, right, or centre label; each story still needs its own evidence check.</p>
          </div>
          <ul>{publisherRegistry.map((publisher) => <li key={publisher.id}><p>{publisher.kind} · {publisher.intake}</p><h3>{publisher.name}</h3><span>{publisher.note}</span></li>)}</ul>
        </section>
        <section className="source-queue" aria-labelledby="source-queue-title">
          <div>
            <p className="micro-copy">Source queue · first 12 of {newsSignalMetadata.itemCount}</p>
            <h2 id="source-queue-title">India-first signals waiting for a source pack.</h2>
            <p>These are external links, not Syāt stories. Each needs primary material, claim review, context, and a rights decision before a draft can move forward.</p>
          </div>
          <ol>
            {sourceQueue.map((signal) => <li key={signal.id}><p>{signal.sourceClass === "official_public_record" ? "Official record" : "Newsroom RSS"} · {signal.publisher} · {formatSignalDate(signal.publishedAt)}</p><h3><a href={signal.url} rel="noreferrer" target="_blank">{signal.title} <span aria-hidden="true">↗</span></a></h3><span>Needs source pack · link-only</span></li>)}
          </ol>
        </section>
        <section className="studio-gates">
          <h2>Before any publishing switch appears</h2>
          <ul><li>Editor approves every factual sentence and source connection.</li><li>Rights reviewer clears each external visual or keeps it link-only.</li><li>English and Hindi editions are reviewed separately.</li><li>Google sign-in and an editor role protect real write actions.</li></ul>
        </section>
      </section>
    </SiteChrome>
  );
}
