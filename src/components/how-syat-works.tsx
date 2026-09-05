import Link from "next/link";

/**
 * The landing explainer.
 *
 * Someone arriving cold needs three things answered before they will read anything: what this is,
 * where the material comes from, and what is not finished. The last one matters most. Syāt asks
 * readers to trust a source trail, so hiding the state of the project would undercut the only
 * thing it is selling.
 *
 * Counts are passed in rather than hardcoded, so this cannot quietly become a fake metric.
 */
export function HowSyatWorks({ newsCount, topicCount, publisherCount }: { newsCount: number; topicCount: number; publisherCount: number }) {
  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <div className="how-intro">
        <p className="micro-copy">What Syāt is</p>
        <h2 id="how-it-works-title">A reading practice for subjects that do not resolve into one answer.</h2>
        <p>Most reporting hands you a conclusion and hides the working. Syāt does the opposite: it separates what a source documents from what someone concluded from it, names the standpoints that genuinely disagree, and shows you where the evidence stops. You are meant to check it, not believe it.</p>
      </div>

      <ol className="how-steps">
        <li>
          <span className="how-step-mark" aria-hidden="true">01</span>
          <h3>Read the labels, not just the words</h3>
          <p>Every claim carries one of three marks. <strong>Documented</strong> is what a source directly supports. <strong>Interpreted</strong> is what a reasonable person concludes from it. <strong>Unresolved</strong> is what still needs better evidence. Nothing is left unmarked.</p>
        </li>
        <li>
          <span className="how-step-mark" aria-hidden="true">02</span>
          <h3>Open the basis for any statement</h3>
          <p>Each statement names the record behind it, what that record covers, and the specific question it cannot answer. A limit that just restates the scope is treated as a failure, not as diligence.</p>
        </li>
        <li>
          <span className="how-step-mark" aria-hidden="true">03</span>
          <h3>Cross from an event to the question under it</h3>
          <p>A News story is one instance of something older. The Context Bridge carries you from the event to the enduring question it belongs to, where the standpoints are laid out on their own terms.</p>
        </li>
      </ol>

      <div className="how-sources">
        <div>
          <p className="micro-copy">Where the material comes from</p>
          <h3>Two lanes, and they never mix.</h3>
        </div>
        <div className="how-lane">
          <h4>Records Syāt writes from</h4>
          <p>Government audits, court judgments, Parliament answers and open data. These carry a reproduction policy, so their text can be quoted, checked and used as evidence.</p>
        </div>
        <div className="how-lane">
          <h4>Newsrooms Syāt links to</h4>
          <p>{publisherCount} publishers across the spectrum are credited and linked, never reproduced. Their reporting is theirs. Syāt shows you where else a subject was covered; it does not write from their words or treat a headline as proof.</p>
        </div>
      </div>

      <div className="how-state">
        <div>
          <p className="micro-copy">Where the project actually is</p>
          <h3>Said plainly, because the alternative is asking you to trust a source trail while hiding this one.</h3>
        </div>
        <dl>
          <div><dt>Timeless questions</dt><dd>{topicCount}</dd><dd className="how-state-note">Each mapped to the standpoints that genuinely disagree.</dd></div>
          <div><dt>News stories</dt><dd>{newsCount}</dd><dd className="how-state-note">Each written from public records, with the source trail on the page.</dd></div>
          <div><dt>Accounts</dt><dd>Not yet</dd><dd className="how-state-note">Saving works on your device alone. Nothing about you is collected or sent anywhere.</dd></div>
          <div><dt>Recommendations</dt><dd>Off</dd><dd className="how-state-note">Suggesting reading would mean profiling you. That needs a policy before it needs code.</dd></div>
        </dl>
      </div>

      <div className="how-contribute">
        <div>
          <p className="micro-copy">Questions from readers</p>
          <h3>The catalogue is not finished, and it is not only ours.</h3>
          <p>If a question has stayed open for you, write it down. Proposals are read by a person before anything is published, and nothing goes live automatically.</p>
        </div>
        <Link className="primary-action" href="/en/propose">Propose a question <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
