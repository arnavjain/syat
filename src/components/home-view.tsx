import Link from "next/link";

import { designDirections, type DesignDirection } from "@/lib/design-direction";
import { getHomeContent, getHomeModeHref, type HomeMode } from "@/lib/home-content";

import { DirectionSignature } from "./direction-signature";
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
          <p className="micro-copy">News first · more than one honest view</p>
          <h1 id="home-title">See what you are missing.</h1>
        </div>
        <div className="home-intro-actions">
          <p className="intro-copy">Follow what changed, see what each view uses, and step back into the larger question.</p>
          <form action="/en/reframe" className="bring-form" method="get">
            <label htmlFor="home-claim">Bring a link, quote, or question</label>
            <div>
              <input aria-describedby="bring-limit" id="home-claim" maxLength={320} name="claim" placeholder="Paste a claim or ask a question" required type="text" />
              <button type="submit">Reframe it <span aria-hidden="true">↗</span></button>
            </div>
            <p id="bring-limit">A link is treated as text. This preview does not fetch it or accept files.</p>
          </form>
          <Link className="first-read-link" href="/en/onboarding">New here? Read the two-minute guide <span aria-hidden="true">↗</span></Link>
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

      <section className="home-stage" aria-label={`${direction.label} Syāt Frame demonstration`}>
        <DirectionSignature direction={direction} />
        <SyatFrame />
      </section>

      <section className="reading-promise" aria-label="How Syāt labels a story">
        <div><span className="legend-mark documented" /><strong>Documented</strong><p>What a source directly supports.</p></div>
        <div><span className="legend-mark interpreted" /><strong>Interpreted</strong><p>What reasonable people conclude from it.</p></div>
        <div><span className="legend-mark unresolved" /><strong>Unresolved</strong><p>What still needs better evidence.</p></div>
      </section>

      {content.sections.map((section, index) => {
        const sectionId = `editorial-section-${index + 1}`;
        return <section className="editorial-section" key={section.title} aria-labelledby={sectionId}>
          <div className="section-heading"><h2 id={sectionId}>{section.title}</h2><p>{section.intro}</p></div>
          <div className="teaser-grid">
            {section.items.map((item) => (
              <article className="story-teaser" key={`${item.href}-${item.title}`}>
                <p className="teaser-label">{item.label}</p>
                <h3>{item.type === "internet" ? <a href={item.href} rel="noreferrer" target="_blank">{item.title} <span aria-hidden="true">↗</span></a> : <Link href={item.href}>{item.title}</Link>}</h3>
                <p>{item.dek}</p>
                {item.type === "internet" ? <a className="teaser-arrow" href={item.href} rel="noreferrer" target="_blank" aria-label={`Open original source: ${item.title}`}>Original source <span aria-hidden="true">↗</span></a> : <Link className="teaser-arrow" href={item.href} aria-label={`Open ${item.title}`}>Read <span aria-hidden="true">↗</span></Link>}
              </article>
            ))}
          </div>
        </section>;
      })}

      <section className="source-note" aria-labelledby="source-note-title">
        <div><p className="micro-copy">A source is more than a link</p><h2 id="source-note-title">Every published story will show who said what, when, and how far the evidence reaches.</h2></div>
        <Link href="/en/about">Why Syāt is built this way <span aria-hidden="true">↗</span></Link>
      </section>
    </SiteChrome>
  );
}
