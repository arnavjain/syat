import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SaveButton } from "@/components/save-button";
import { StandpointDeck } from "@/components/standpoint-deck";
import { SiteChrome } from "@/components/site-chrome";
import { TopicVisual } from "@/components/topic-visual";
import { storiesIllustrating } from "@/lib/reader-stories";
import { getTopicContent } from "@/lib/timeless-content";
import { getTimelessTopic, themeSlug, timelessTopics, topicsInTheme } from "@/lib/timeless-topics";

export const dynamicParams = false;

export function generateStaticParams() {
  return timelessTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const topic = getTimelessTopic((await params).slug);
  if (!topic) return { title: "Question not found" };
  return { title: `${topic.title} · Syāt`, description: getTopicContent(topic.slug)?.opening.slice(0, 180) };
}

export default async function TimelessTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const topic = getTimelessTopic((await params).slug);
  if (!topic) notFound();
  const content = getTopicContent(topic.slug);
  if (!content) notFound();

  const siblings = topicsInTheme(topic.theme).filter((item) => item.slug !== topic.slug).slice(0, 4);
  const illustrations = storiesIllustrating(topic.slug);

  return (
    <SiteChrome active="explore">
      <article className="topic-page">
        <header className="topic-header">
          <p className="topic-eyebrow">
            <Link href={`/en/timeless/theme/${themeSlug(topic.theme)}`}>{topic.theme}</Link>
            <span aria-hidden="true"> · </span>
            <span>{topic.readingLens} lens</span>
          </p>
          <h1>{topic.title}</h1>
          <p className="topic-opening">{content.opening}</p>
        </header>

        <SaveButton entry={{ kind: "topic", slug: topic.slug, title: topic.title, context: topic.theme }} />

        <TopicVisual topic={topic} />

        <section className="topic-standpoints" aria-labelledby="standpoints-title">
          <div className="topic-section-heading">
            <h2 id="standpoints-title">Who is looking, and what that shows</h2>
            <p>Each standpoint is a position someone genuinely holds. None of them is the answer, and the disagreement between them is the point.</p>
          </div>
          <StandpointDeck idPrefix={`standpoint-${topic.slug}`} standpoints={content.standpoints} />
        </section>

        <section className="topic-contested" aria-labelledby="contested-title">
          <h2 id="contested-title">Where careful people still disagree</h2>
          <p>{content.contested}</p>
        </section>

        <section className="topic-change" aria-labelledby="change-title">
          <h2 id="change-title">What would change your mind</h2>
          <p>{content.changeYourMind}</p>
        </section>

        {illustrations.length > 0 ? (
          <section className="topic-instances" aria-labelledby="instances-title">
            <div>
              <p className="micro-copy">Where this question turns up</p>
              <h2 id="instances-title">{illustrations.length === 1 ? "A documented instance." : `${illustrations.length} documented instances.`}</h2>
              <p>These News previews were written from public records and bridge to this question. The question came first and outlives them.</p>
            </div>
            <ul>
              {illustrations.map((story) => (
                <li key={story.slug}>
                  <Link href={`/en/news/${story.slug}`}>{story.title}</Link>
                  <small>{story.dek}</small>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="topic-next" aria-labelledby="next-title">
          <h2 id="next-title">Keep reading</h2>
          <div className="topic-next-list">
            {siblings.map((item) => (
              <Link className="topic-next-item" href={`/en/timeless/topic/${item.slug}`} key={item.slug}>
                <span>{item.theme}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
          <p className="topic-next-links">
            <Link href={`/en/timeless/theme/${themeSlug(topic.theme)}`}>All questions in {topic.theme}</Link>
            <Link href="/en/explore">Browse every question</Link>
            <Link href={`/en/reframe?topic=${topic.slug}`}>Reframe this question</Link>
          </p>
        </section>
      </article>
    </SiteChrome>
  );
}
