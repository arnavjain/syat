import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { getPreviewStory } from "@/lib/preview-content";

export default async function TimelessStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = getPreviewStory((await params).slug);
  if (!story || story.mode !== "timeless") notFound();
  return <SiteChrome active="explore"><article className="story-page"><header className="story-header"><p className="micro-copy">{story.kicker}</p><h1>{story.title}</h1><p className="page-lede">{story.dek}</p></header><section className="story-summary"><div><p className="micro-copy">The question</p><p>{story.whatChanged}</p></div><div><p className="micro-copy">Why keep it open</p><p>{story.whyItMatters}</p></div></section><section className="perspective-section"><p className="micro-copy">Reading lens</p><h2>Two ways in, with room for more.</h2><div>{story.perspectives.map((item) => <article key={item.label}><h3>{item.label}</h3><dl><div><dt>Sees</dt><dd>{item.sees}</dd></div><div><dt>Values</dt><dd>{item.values}</dd></div><div><dt>May miss</dt><dd>{item.mayMiss}</dd></div></dl></article>)}</div></section><section className="source-trail"><p className="micro-copy">Scope</p><h2>This is a teaching fixture.</h2><p>It opens a question and shows the reading structure. A public timeless edition needs an editor-selected source trail, rights-cleared media, and English/Hindi review.</p></section></article></SiteChrome>;
}
