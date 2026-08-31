import Link from "next/link";

import { designDirections, getViewpointPositionClass, type DesignDirection } from "@/lib/design-direction";
import { getHomeContent, getHomeModeHref, type HomeMode } from "@/lib/home-content";

import { SiteChrome } from "./site-chrome";

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
          <p className="micro-copy">A different way to follow what matters</p>
          <h1 id="home-title">See what you are missing.</h1>
          <Link className="first-read-link" href="/en/onboarding">New here? Take the two-minute reading guide <span aria-hidden="true">↗</span></Link>
        </div>
        <p className="intro-copy">Read the event, the evidence, and the lives around it. Syāt helps you hold more than one honest view without flattening the differences.</p>
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

      <section className="feature-story" aria-labelledby="feature-title">
        <div className="feature-copy">
          <p className="feature-kicker">{content.feature.kicker}</p>
          <h2 id="feature-title">{content.feature.title}</h2>
          <p className="feature-dek">{content.feature.dek}</p>
          <div className="feature-actions">
            <Link className="primary-action" href={content.feature.cta.href}>{content.feature.cta.label}<span aria-hidden="true">↗</span></Link>
            <span className="fixture-note">Illustrated editorial sample</span>
          </div>
        </div>

        <figure className="perspective-frame" aria-labelledby="frame-caption">
          <svg viewBox="0 0 560 430" role="img" aria-labelledby="frame-title frame-desc">
            <title id="frame-title">A perspective map around a fictional Indian street plan</title>
            <desc id="frame-desc">A violet street grid is crossed by a bus corridor. Four everyday standpoints sit around the map.</desc>
            <rect className="map-paper" x="22" y="20" width="516" height="372" rx="34" />
            <path className="map-route soft" d="M98 110C156 66 219 91 269 130c43 33 82 15 128-14 37-24 81-14 111 18" />
            <path className="map-route" d="M72 293c49-43 83-69 133-53 44 14 62 51 115 42 42-7 58-60 104-65 37-4 63 22 94 50" />
            <path className="map-route thin" d="M118 62v277M211 61v286M307 51v300M400 67v273M482 91v220" />
            <path className="map-route thin horizontal" d="M61 159h439M50 233h460M75 315h411" />
            <path className="street-loop" d="M206 143c45-35 123-39 183-2 55 35 63 117 18 164-47 50-139 52-192 15-60-43-61-132-9-177Z" />
            <circle className="map-point one" cx="175" cy="147" r="9" />
            <circle className="map-point two" cx="397" cy="134" r="9" />
            <circle className="map-point three" cx="405" cy="284" r="9" />
            <circle className="map-point four" cx="187" cy="292" r="9" />
            <path className="corner-mark" d="M22 89V20h70M468 20h70v69M22 323v69h70M468 392h70v-69" />
          </svg>
          {content.feature.perspectives.map((perspective, index) => <div className={`frame-label ${getViewpointPositionClass(index, content.feature.perspectives.length)}`} key={perspective}>{perspective}</div>)}
          <figcaption id="frame-caption">One fictional street plan, four starting points. Open the story to see what each view uses and may miss.</figcaption>
        </figure>
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
