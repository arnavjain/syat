import Link from "next/link";

import { designDirections, type DesignDirection } from "@/lib/design-direction";
import { getHomeContent, getHomeModeHref, type HomeMode } from "@/lib/home-content";
import { publisherRegistry } from "@/lib/publisher-registry";
import { getNewsStoryIndexProjection } from "@/lib/reader-stories";
import { timelessTopics } from "@/lib/timeless-topics";

import { DirectionSignature } from "./direction-signature";
import { EditorialFeed } from "./editorial-feed";
import { HowSyatWorks } from "./how-syat-works";
import { SiteChrome } from "./site-chrome";
import { SyatFrame } from "./syat-frame";

export function HomeView({ mode, direction, isDesignReview = false }: { mode: HomeMode; direction: DesignDirection; isDesignReview?: boolean }) {
  const content = getHomeContent(mode);

  return (
    <SiteChrome active={mode === "news" ? "home" : "explore"} className={direction.className}>
      {isDesignReview && <aside className="design-review-note" aria-label="Private design review">
        <p className="micro-copy">Private design review</p>
        <p><strong>{direction.label}</strong> · {direction.description}</p>
        <div>{designDirections.map((option) => <Link className={option.id === direction.id ? "design-review-link is-selected" : "design-review-link"} href={`/preview/design/${option.id}`} key={option.id}>{option.label}</Link>)}</div>
      </aside>}
      <section className="home-intro" aria-labelledby="home-title">
        <div>
          <p className="micro-copy">News and enduring questions, read with their limits</p>
          <h1 id="home-title">Read what changed. See what evidence cannot settle.</h1>
        </div>
        <div className="home-intro-actions">
          <p className="intro-copy">Syāt separates documented claims, interpretation and open questions, then lets you inspect the source trail yourself.</p>
          <div className="home-first-actions">
            <Link className="primary-action" href={content.feature.cta.href}>Start reading <span aria-hidden="true">↗</span></Link>
            <Link className="first-read-link" href="/en/onboarding">Take the two-minute tour</Link>
          </div>
        </div>
      </section>

      <nav className="mode-switch" aria-label="Choose an editorial mode">
        <Link className={mode === "news" ? "mode-link active" : "mode-link"} href={getHomeModeHref("news")}>
          <span>News</span>
          <small>Developing stories</small>
        </Link>
        <Link className={mode === "timeless" ? "mode-link active" : "mode-link"} href={getHomeModeHref("timeless")}>
          <span>Timeless</span>
          <small>Culture, history &amp; ideas</small>
        </Link>
        <span className="mode-frame" aria-hidden="true" />
      </nav>

      {isDesignReview ? <section className="home-stage" aria-label={`${direction.label} Syāt Frame demonstration`}>
        <DirectionSignature direction={direction} />
        <SyatFrame />
      </section> : null}

      <EditorialFeed content={content} />

      <HowSyatWorks newsCount={getNewsStoryIndexProjection().length} topicCount={timelessTopics.length} publisherCount={publisherRegistry.filter((publisher) => publisher.kind !== "public record").length} />

      <section className="reading-promise" aria-label="How Syāt labels a story">
        <div><span className="legend-mark documented" /><strong>Documented</strong><p>What a source directly supports.</p></div>
        <div><span className="legend-mark interpreted" /><strong>Interpreted</strong><p>What reasonable people conclude from it.</p></div>
        <div><span className="legend-mark unresolved" /><strong>Unresolved</strong><p>What still needs better evidence.</p></div>
      </section>

      <section className="source-note" aria-labelledby="source-note-title">
        <div><p className="micro-copy">A source is more than a link</p><h2 id="source-note-title">Every published story will show who said what, when, and how far the evidence reaches.</h2></div>
        <Link href="/en/about">Why Syāt is built this way <span aria-hidden="true">↗</span></Link>
      </section>
    </SiteChrome>
  );
}
