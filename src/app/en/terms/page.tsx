import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

export const metadata = {
  title: "Terms of use · Syāt",
  description: "What Syāt offers, what it does not claim, and the terms for using it."
};

const UPDATED = "5 September 2026";

export default function TermsPage() {
  return (
    <SiteChrome active="about">
      <article className="policy-page">
        <header>
          <p className="micro-copy">Terms of use</p>
          <h1>What this is, and what it does not claim to be.</h1>
          <p className="page-lede">Plain terms, in plain words. If something here reads as though it were written to protect us rather than to inform you, that is a fault and worth telling us about.</p>
          <p className="policy-updated">Last updated {UPDATED}.</p>
        </header>

        <section aria-labelledby="what-title">
          <h2 id="what-title">What Syāt is</h2>
          <p>A reading practice for subjects that do not resolve into one answer. It separates what a source documents from what someone concluded from it, sets out the standpoints that genuinely disagree, and shows where the evidence stops. It is published for reading and for checking.</p>
        </section>

        <section aria-labelledby="preview-title">
          <h2 id="preview-title">How the writing is made</h2>
          <p>News stories are written by Syāt from public records that carry a reproduction policy, with machine assistance in the drafting and a source trail on every page so the working is visible. The Timeless questions are written by hand. Either way the records are named, and checking them is the point.</p>
        </section>

        <section aria-labelledby="accuracy-title">
          <h2 id="accuracy-title">Accuracy, and its limits</h2>
          <p>Every factual claim is tied to a public record, and each page names what that record covers and the question it cannot answer. That is a real discipline and it is not a guarantee. Records contain errors, drafts contain mistakes, and machine-assisted drafting introduces its own. Nothing here is legal, financial, medical or professional advice, and it should not be relied on as the sole basis for a decision that matters.</p>
          <p>If you find something wrong, say so and it will be corrected or removed. That is the intended way to use this.</p>
        </section>

        <section aria-labelledby="sources-title">
          <h2 id="sources-title">Sources and other people&rsquo;s work</h2>
          <p>Syāt writes from public records that carry a reproduction policy: government audits, judgments, parliamentary answers and open data. Links to newsrooms are credited and belong to those publishers. Their reporting is theirs, is never reproduced here, and a headline is never treated as proof of anything.</p>
          <p>Syāt&rsquo;s own writing and artwork are its own. Quote it with attribution and a link. Do not republish it wholesale as though it were yours, and do not present a preview draft as finished reporting from Syāt.</p>
        </section>

        <section aria-labelledby="you-title">
          <h2 id="you-title">Using the site</h2>
          <ul className="policy-list">
            <li>Read it, check it, quote it, disagree with it.</li>
            <li>If you <Link href="/en/propose">propose a question</Link>, send something you are content to have read by a person and possibly written about. Do not send anything confidential or anything about someone else that is not yours to send.</li>
            <li>Do not use the site to break the law, to attack the service, or to scrape it in a way that degrades it for others.</li>
            <li>Proposals are read before anything is published. Nothing you send goes live automatically, and there is no obligation to use it.</li>
          </ul>
        </section>

        <section aria-labelledby="accounts-title">
          <h2 id="accounts-title">Accounts</h2>
          <p>Signing in is optional and currently unlocks nothing: saving works on your device without it. If you create an account you can ask for it to be deleted at any time. What sign-in stores is set out in the <Link href="/en/privacy">privacy page</Link>.</p>
        </section>

        <section aria-labelledby="asis-title">
          <h2 id="asis-title">Availability</h2>
          <p>This is a preview run by one person. It may change, break, or go away. It is provided as it is, with no warranty and no guarantee of availability, and to the extent the law allows, without liability for loss arising from relying on it. Nothing here limits rights you have that cannot be waived.</p>
        </section>

        <section aria-labelledby="changes-title">
          <h2 id="changes-title">Changes and contact</h2>
          <p>These terms change as the site does, and the date at the top moves when they do. Questions, corrections and complaints go to <a href="mailto:arnavjain166@gmail.com">arnavjain166@gmail.com</a>.</p>
        </section>
      </article>
    </SiteChrome>
  );
}
