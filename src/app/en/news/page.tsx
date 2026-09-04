import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";
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
      <div className="news-index-meta">
        {showTheme ? <span className="news-index-theme">{story.theme}</span> : null}
        <span>{story.format.replaceAll("_", " ")}</span>
        <time dateTime={story.updatedAt}>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(story.updatedAt))}</time>
        <span>{story.readingMinutes} min</span>
        <span className="news-index-disclosure">AI-assisted private preview</span>
      </div>
      <h3><Link href={`/en/news/${story.slug}`}>{story.title}</Link></h3>
      <p>{story.dek}</p>
      <Link className="news-index-read" href={`/en/news/${story.slug}`}>Read with its source trail <span aria-hidden="true">↗</span></Link>
    </article>
  );
}

export default function NewsArchivePage() {
  const items = getNewsStoryIndexProjection();
  const groups = groupByTheme(items);
  const grouped = themeGroupingHelps(items);
  const complete = items.length === 100;

  return (
    <SiteChrome active="home">
      <div className="news-archive">
        <header className="news-archive-header">
          <p className="reader-preview-status">Private News library</p>
          <h1>{complete ? "One hundred News previews, filed for slower reading." : "The News pilot, kept in one clear index."}</h1>
          <p>{complete ? "Every page keeps the event, source scope, limits and open questions together." : "Accepted pilot pages appear here only after evidence, language and rights checks pass."}</p>
          <dl><div><dt>Accepted</dt><dd>{items.length}</dd></div><div><dt>Target</dt><dd>100</dd></div><div><dt>Status</dt><dd>{complete ? "Preview set complete" : "Pilot in review"}</dd></div></dl>
        </header>

        {items.length > 0 && grouped ? groups.map(([theme, stories]) => (
          <section className="news-theme-section" id={themeId(theme)} aria-labelledby={`${themeId(theme)}-title`} key={theme}>
            <header><h2 id={`${themeId(theme)}-title`}>{theme}</h2><p>{stories.length} {stories.length === 1 ? "preview" : "previews"}</p></header>
            <div>{stories.map((story) => <StoryIndexRow story={story} key={story.slug} />)}</div>
          </section>
        )) : items.length > 0 ? (
          <section className="news-flat-list" aria-labelledby="news-flat-title">
            <h2 id="news-flat-title">Most recent first</h2>
            <div>{items.map((story) => <StoryIndexRow showTheme story={story} key={story.slug} />)}</div>
          </section>
        ) : (
          <section className="news-archive-empty" aria-labelledby="news-empty-title">
            <h2 id="news-empty-title">The first pilot story is still being checked.</h2>
            <p>The archive stays empty when a generated draft fails its evidence gate. You can still learn the reading method through the clearly fictional teaching story.</p>
            <Link className="primary-action" href="/en/news/street-plan-daily-realities">Read the teaching story</Link>
          </section>
        )}
      </div>
    </SiteChrome>
  );
}
