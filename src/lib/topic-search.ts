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
};

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
