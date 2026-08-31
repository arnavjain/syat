import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { getTimelessTopic, timelessTopics } from "@/lib/timeless-topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return timelessTopics.map((topic) => ({ slug: topic.slug }));
}

export default async function TimelessTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const topic = getTimelessTopic((await params).slug);
  if (!topic) notFound();

  return <SiteChrome active="explore"><article className="story-page"><header className="story-header"><p className="micro-copy">{topic.theme} · {topic.readingLens} lens</p><h1>{topic.title}</h1><p className="page-lede">{topic.prompt}</p></header><section className="story-summary"><div><p className="micro-copy">A starting point</p><p>This question is a static catalogue subject. It is not a published Syāt story.</p></div><div><p className="micro-copy">What is still needed</p><p>An editor-reviewed source pack, checked claims, and rights-cleared media must come before publication.</p></div></section><section className="source-trail"><p className="micro-copy">Source trail</p><h2>No reviewed source pack is published yet.</h2><p>This page names the gap plainly. You can use the question to make a local reading plan, without sending it anywhere.</p><Link className="primary-action" href={`/en/reframe?topic=${topic.slug}`}>Reframe this question <span aria-hidden="true">↗</span></Link></section></article></SiteChrome>;
}
