import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";
import { StoryMotif } from "@/components/story-motif";
import type { ReaderStoryIndexItem } from "@/lib/reader-story-schema";
import { getNewsStoryIndexProjection } from "@/lib/reader-stories";

function themeId(theme: string) {
  return `theme-${theme.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function groupByTheme(items: readonly ReaderStoryIndexItem[]) {
  const groups = new Map<string, ReaderStoryIndexItem[]>();
  for (const item of items) groups.set(item.theme, [...(groups.get(item.theme) ?? []), item]);
  return [...groups.entries()];
}

/** True once at least one theme has gathered more than one story. */
function themeGroupingHelps(items: readonly ReaderStoryIndexItem[]) {
  return groupByTheme(items).some(([, stories]) => stories.length > 1);
}

function StoryIndexRow({ story, showTheme = false }: { story: ReaderStoryIndexItem; showTheme?: boolean }) {
  return (
    <article className="news-index-row">
      <StoryMotif story={story} />
      <div className="news-index-body">
      <div className="news-index-meta">
        {showTheme ? <span className="news-index-theme">{story.theme}</span> : null}
        <span>{story.format.replaceAll("_", " ")}</span>
        <time dateTime={story.updatedAt}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(story.updatedAt))}</time>
        <span>{story.readingMinutes} min</span>
      </div>
      <h3><Link href={`/en/news/${story.slug}`}>{story.title}</Link></h3>
      <p>{story.dek}</p>
      <Link className="news-index-read" href={`/en/news/${story.slug}`}>Read with its source trail <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}

export default function NewsArchivePage() {
  const items = getNewsStoryIndexProjection();
  const groups = groupByTheme(items);
  const grouped = themeGroupingHelps(items);

  return (
    <SiteChrome active="home">
      <div className="news-archive">
        <header className="news-archive-header">
          <p className="micro-copy">News</p>
          <h1>What changed, and what the record can actually show.</h1>
          <p>Every story keeps the event, the source it rests on, the limits of that source and the questions it leaves open, together on one page.</p>
          <dl><div><dt>Stories</dt><dd>{items.length}</dd></div></dl>
        </header>

        {items.length > 0 && grouped ? groups.map(([theme, stories]) => (
          <section className="news-theme-section" id={themeId(theme)} aria-labelledby={`${themeId(theme)}-title`} key={theme}>
            <header><h2 id={`${themeId(theme)}-title`}>{theme}</h2><p>{stories.length} {stories.length === 1 ? "story" : "stories"}</p></header>
            <div>{stories.map((story) => <StoryIndexRow story={story} key={story.slug} />)}</div>
          </section>
        )) : items.length > 0 ? (
          <section className="news-flat-list" aria-labelledby="news-flat-title">
            <h2 id="news-flat-title">Most recent first</h2>
            <div>{items.map((story) => <StoryIndexRow showTheme story={story} key={story.slug} />)}</div>
          </section>
        ) : (
          <section className="news-archive-empty" aria-labelledby="news-empty-title">
            <h2 id="news-empty-title">The first story is on its way.</h2>
            <p>Nothing is here yet. You can still see how Syāt reads a subject through the worked teaching example.</p>
            <Link className="primary-action" href="/en/news/street-plan-daily-realities">Read the teaching story</Link>
          </section>
        )}
      </div>
    </SiteChrome>
  );
}
