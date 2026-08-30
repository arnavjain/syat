import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";
import { timelessTopics } from "@/lib/timeless-topics";
import { formatSignalDate, latestNewsSignals } from "@/lib/news-signals";

export default function ExplorePage() {
  const themes = Array.from(new Set(timelessTopics.map((topic) => topic.theme)));
  return <SiteChrome active="explore"><section className="explore-page"><p className="micro-copy">Explore</p><h1>Questions that keep opening.</h1><p className="page-lede">One hundred static, non-AI starting points for timeless reading. Each needs sources and editorial work before it becomes a published subject.</p><section className="signal-strip" aria-labelledby="signal-title"><div><p className="micro-copy">Current source signals</p><h2 id="signal-title">The original publishers, not a rewritten feed.</h2></div><div>{latestNewsSignals.slice(0, 5).map((signal) => <a href={signal.url} key={signal.id} rel="noreferrer" target="_blank"><span>{signal.publisher} · {formatSignalDate(signal.publishedAt)}</span><strong>{signal.title}</strong></a>)}</div></section><div className="theme-row" aria-label="Topic themes">{themes.map((theme) => <span key={theme}>{theme}</span>)}</div><div className="topic-grid">{timelessTopics.map((topic) => <article key={topic.id} className="topic-card"><p>{topic.theme}</p><h2>{topic.title}</h2><span>{topic.readingLens} lens</span><Link href={topic.slug === "how-cities-move" ? "/en/timeless/how-cities-move" : `/en/reframe?topic=${topic.slug}`}>Open a reading path <span aria-hidden="true">↗</span></Link></article>)}</div></section></SiteChrome>;
}
