import Link from "next/link";

import { RandomTopicPicker } from "@/components/random-topic-picker";
import { SiteChrome } from "@/components/site-chrome";
import { TopicSearch } from "@/components/topic-search";
import { buildSearchIndex } from "@/lib/topic-search";
import { readingLenses, timelessThemes, timelessTopics } from "@/lib/timeless-topics";

export const metadata = {
  title: "Explore every question · Syāt",
  description: "One hundred open questions, grouped by theme and reading lens, each with the standpoints that disagree about it."
};

export default function ExplorePage() {
  const entries = buildSearchIndex();

  return (
    <SiteChrome active="explore">
      <section className="explore-page">
        <p className="micro-copy">Explore</p>
        <h1>Questions that keep opening.</h1>
        <p className="page-lede">One hundred questions that do not resolve. Each one is written out with the standpoints that genuinely disagree about it, what each brings into view, and what it tends to miss.</p>

        <TopicSearch entries={entries} />

        <section className="explore-themes" aria-labelledby="explore-themes-title">
          <h2 id="explore-themes-title">By theme</h2>
          <div className="explore-theme-grid">
            {timelessThemes.map((theme) => (
              <Link className="explore-theme-card" href={`/en/timeless/theme/${theme.slug}`} key={theme.slug}>
                <span>{theme.readingLens} lens</span>
                <strong>{theme.theme}</strong>
                <em>{theme.count} questions</em>
              </Link>
            ))}
          </div>
        </section>

        <section className="explore-lenses" aria-labelledby="explore-lenses-title">
          <h2 id="explore-lenses-title">By reading lens</h2>
          <p>A lens is the angle a question is best approached from. It shapes how each page is drawn and what its standpoints attend to.</p>
          <ul className="lens-row">
            {readingLenses.map((lens) => <li key={lens.lens}><strong>{lens.lens}</strong><span>{lens.count} questions</span></li>)}
          </ul>
        </section>

        <RandomTopicPicker topics={timelessTopics} />

        <section className="explore-submit" aria-labelledby="explore-submit-title">
          <h2 id="explore-submit-title">Propose a question</h2>
          <p>If a question keeps opening for you and is not here, send it. Proposals are read before anything is published, so nothing appears automatically.</p>
          <Link className="primary-action" href="/en/propose">Propose a question <span aria-hidden="true">↗</span></Link>
        </section>
      </section>
    </SiteChrome>
  );
}
