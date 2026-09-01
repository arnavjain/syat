import { ProposalCount } from "@/components/proposal-count";
import { SiteChrome } from "@/components/site-chrome";
import { TopicProposalForm } from "@/components/topic-proposal-form";
import { timelessThemes } from "@/lib/timeless-topics";

export const metadata = {
  title: "Propose a question · Syāt",
  description: "Suggest an open question for the Syāt catalogue. Proposals are read before anything is published."
};

export default function ProposePage() {
  return (
    <SiteChrome active="explore">
      <div className="propose-page">
        <header>
          <p className="micro-copy">Propose</p>
          <h1>A question that keeps opening.</h1>
          <p className="page-lede">Syāt is built from questions that do not resolve. If one has stayed open for you, write it here.</p>
        </header>
        <section className="propose-how" aria-labelledby="propose-how-title">
          <h2 id="propose-how-title">How this works</h2>
          <ul>
            <li>Your question goes to a review queue and is kept on this device too, so you do not lose it.</li>
            <li>Nothing publishes automatically. A person reads every proposal before it becomes a page.</li>
            <li>No text is generated for you here. Syāt writes each question&rsquo;s standpoints by hand, which is why they take a while.</li>
          </ul>
        </section>
        <ProposalCount />
        <TopicProposalForm themes={timelessThemes.map((theme) => theme.theme)} themeSlugs={Object.fromEntries(timelessThemes.map((theme) => [theme.theme, theme.slug]))} />
      </div>
    </SiteChrome>
  );
}
