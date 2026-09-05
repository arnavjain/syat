import { getTopicContent } from "./timeless-content";
import { timelessTopics } from "./timeless-topics";

export type SearchEntry = {
  slug: string;
  title: string;
  theme: string;
  themeSlug: string;
  lens: string;
  /** Lowercased haystack: title, theme, lens and every standpoint label. */
  haystack: string;
  /** Which library the entry belongs to, so one search can cover both. */
  kind?: "timeless" | "news";
  /** Where the entry actually lives. Timeless entries fall back to their topic route. */
  href?: string;
  /** Shown under the title in results. */
  summary?: string;
};

/**
 * One index across both libraries.
 *
 * A reader looking for "water" does not know or care whether the answer is a News preview or an
 * enduring question, so searching only one of them is a worse answer than no search at all.
 */
export function buildCombinedSearchIndex(news: readonly { slug: string; title: string; dek: string; theme: string }[]): SearchEntry[] {
  const newsEntries: SearchEntry[] = news.map((story) => ({
    slug: story.slug,
    title: story.title,
    theme: story.theme,
    themeSlug: story.theme.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    lens: "news",
    kind: "news",
    href: `/en/news/${story.slug}`,
    summary: story.dek,
    haystack: `${story.title} ${story.dek} ${story.theme}`.toLocaleLowerCase("en-IN")
  }));
  return [...buildSearchIndex().map((entry) => ({ ...entry, kind: "timeless" as const, href: `/en/timeless/topic/${entry.slug}` })), ...newsEntries];
}

/** Built once at module load and shipped to the client as data, so search needs no backend. */
export function buildSearchIndex(): SearchEntry[] {
  return timelessTopics.map((topic) => {
    const content = getTopicContent(topic.slug);
    const standpoints = content?.standpoints.map((standpoint) => standpoint.label).join(" ") ?? "";
    return {
      slug: topic.slug,
      title: topic.title,
      theme: topic.theme,
      themeSlug: topic.theme.toLocaleLowerCase("en-IN").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      lens: topic.readingLens,
      haystack: `${topic.title} ${topic.theme} ${topic.readingLens} ${standpoints} ${content?.opening ?? ""}`.toLocaleLowerCase("en-IN")
    };
  });
}

export function searchTopics(entries: readonly SearchEntry[], rawQuery: string, limit = 24): SearchEntry[] {
  const query = rawQuery.trim().toLocaleLowerCase("en-IN");
  if (query.length < 2) return [];
  const terms = query.split(/\s+/).filter(Boolean);

  return entries
    .map((entry) => {
      if (!terms.every((term) => entry.haystack.includes(term))) return null;
      // A title match is what the reader almost always means.
      const titleHits = terms.filter((term) => entry.title.toLocaleLowerCase("en-IN").includes(term)).length;
      return { entry, score: titleHits * 10 + terms.length };
    })
    .filter((scored): scored is { entry: SearchEntry; score: number } => scored !== null)
    .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title))
    .slice(0, limit)
    .map((scored) => scored.entry);
}
