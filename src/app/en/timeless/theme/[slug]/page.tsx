import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { TopicVisual } from "@/components/topic-visual";
import { getTopicContent } from "@/lib/timeless-content";
import { getThemeBySlug, timelessThemes, topicsInTheme } from "@/lib/timeless-topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return timelessThemes.map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const theme = getThemeBySlug((await params).slug);
  return theme ? { title: `${theme.theme} · Syāt`, description: `${theme.count} open questions read through the ${theme.readingLens} lens.` } : { title: "Theme not found" };
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const theme = getThemeBySlug((await params).slug);
  if (!theme) notFound();
  const topics = topicsInTheme(theme.theme);

  return (
    <SiteChrome active="explore">
      <div className="theme-page">
        <header className="theme-header">
          <p className="topic-eyebrow"><Link href="/en/explore">All themes</Link><span aria-hidden="true"> · </span><span>{theme.readingLens} lens</span></p>
          <h1>{theme.theme}</h1>
          <p>{theme.count} questions, each with the standpoints that disagree about it.</p>
        </header>
        <div className="theme-topic-grid">
          {topics.map((topic) => (
            <article className="theme-topic-card" key={topic.slug}>
              <TopicVisual topic={topic} />
              <h2><Link href={`/en/timeless/topic/${topic.slug}`}>{topic.title}</Link></h2>
              <p>{getTopicContent(topic.slug)?.opening.split(". ")[0]}.</p>
              <span>{getTopicContent(topic.slug)?.standpoints.length ?? 0} standpoints</span>
            </article>
          ))}
        </div>
        <nav className="theme-other" aria-label="Other themes">
          <h2>Other themes</h2>
          <ul>
            {timelessThemes.filter((item) => item.slug !== theme.slug).map((item) => (
              <li key={item.slug}><Link href={`/en/timeless/theme/${item.slug}`}>{item.theme}</Link> <span>{item.count}</span></li>
            ))}
          </ul>
        </nav>
      </div>
    </SiteChrome>
  );
}
