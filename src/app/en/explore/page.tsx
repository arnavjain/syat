import Link from "next/link";

import { RandomTopicPicker } from "@/components/random-topic-picker";
import { SiteChrome } from "@/components/site-chrome";
import { timelessTopicPath, timelessTopics } from "@/lib/timeless-topics";

export default function ExplorePage() {
  const themes = Array.from(new Set(timelessTopics.map((topic) => topic.theme)));
  return <SiteChrome active="explore"><section className="explore-page"><p className="micro-copy">Explore</p><h1>Questions that keep opening.</h1><p className="page-lede">One hundred static, non-AI starting points for timeless reading. Each needs sources and editorial work before it becomes a published subject.</p><RandomTopicPicker topics={timelessTopics} /><div className="theme-row" aria-label="Topic themes">{themes.map((theme) => <span key={theme}>{theme}</span>)}</div><div className="topic-grid">{timelessTopics.map((topic) => {
    const href = timelessTopicPath(topic.slug);
    if (!href) return null;
    return <article key={topic.id} className="topic-card"><p>{topic.theme}</p><h2>{topic.title}</h2><span>{topic.readingLens} lens</span><Link href={href}>Open this subject <span aria-hidden="true">↗</span></Link></article>;
  })}</div></section></SiteChrome>;
}
