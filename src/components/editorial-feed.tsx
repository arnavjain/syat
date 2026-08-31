import Link from "next/link";

import type { HomeContent, StoryTeaser } from "@/lib/home-content";

import { ContextBridge } from "./context-bridge";

function TeaserLink({ item, className }: { item: StoryTeaser; className?: string }) {
  if (item.type === "internet") return <a className={className} href={item.href} rel="noreferrer" target="_blank">{item.title} <span aria-hidden="true">↗</span></a>;
  return <Link className={className} href={item.href}>{item.title}</Link>;
}

export function EditorialFeed({ content }: { content: HomeContent }) {
  const firstSection = content.sections[0];
  const secondSection = content.sections[1];
  const leadHref = content.feature.cta.href;

  return <div className="editorial-feed" aria-label={`${content.modeLabel} editorial feed`}>
    <section className="feed-lead-strip" aria-labelledby="feed-lead-title">
      <p className="micro-copy">Lead · what changed</p>
      <div><p>{content.feature.kicker}</p><h2 id="feed-lead-title"><Link href={leadHref}>{content.feature.title}</Link></h2></div>
      <p>{content.feature.dek}</p>
      <Link className="feed-action" href={leadHref}>{content.feature.cta.label} <span aria-hidden="true">↗</span></Link>
    </section>

    {firstSection && <section className="feed-story-row" aria-labelledby="feed-row-title">
      <div><p className="micro-copy">{firstSection.title}</p><h2 id="feed-row-title">{firstSection.intro}</h2></div>
      <div className="feed-row-list">{firstSection.items.map((item) => <article key={`${item.href}-${item.title}`}><p>{item.label}{item.type === "internet" ? " · source signal, not a Syāt story" : ""}</p><h3><TeaserLink item={item} /></h3><span>{item.dek}</span></article>)}</div>
    </section>}

    {content.contextBridge ? <ContextBridge bridge={content.contextBridge} /> : null}

    {secondSection && <section className="feed-framing-trail" aria-labelledby="feed-trail-title">
      <div><p className="micro-copy">Media / framing trail</p><h2 id="feed-trail-title">{secondSection.title}</h2><p>{secondSection.intro}</p></div>
      <ol>{secondSection.items.map((item, index) => <li key={`${item.href}-${item.title}`}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{item.label}{item.type === "internet" ? " · original publisher" : ""}</p><h3><TeaserLink item={item} /></h3><small>{item.dek}</small></div></li>)}</ol>
      <p className="feed-trail-note">A framing trail names where to look next. It does not turn source signals into published Syāt reporting.</p>
    </section>}
  </div>
}
