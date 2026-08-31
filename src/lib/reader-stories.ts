import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

import {
  readerStoryIndexItemSchema,
  readerStorySchema,
  type ReaderStory,
  type ReaderStoryIndexItem
} from "./reader-story-schema";

const newsDirectory = () => join(process.cwd(), "data/stories/news");
const storySlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const newsStoryIndexSchema = z.object({
  contractVersion: z.literal("syat.reader-story-index.v1"),
  generatedAt: z.iso.datetime(),
  items: z.array(readerStoryIndexItemSchema).max(100)
}).strict().superRefine((index, ctx) => {
  const seen = new Set<string>();
  for (const [position, item] of index.items.entries()) {
    if (seen.has(item.slug)) {
      ctx.addIssue({ code: "custom", message: `News index slug ${item.slug} is repeated.`, path: ["items", position, "slug"] });
    }
    seen.add(item.slug);
  }
});

type NewsStoryIndex = z.infer<typeof newsStoryIndexSchema>;

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadValidatedNewsIndex(): NewsStoryIndex {
  const indexPath = join(newsDirectory(), "index.json");
  if (!existsSync(indexPath)) throw new Error("News story index is missing.");
  return newsStoryIndexSchema.parse(readJson(indexPath));
}

function loadValidatedNewsCorpus(): { index: NewsStoryIndex; storiesBySlug: ReadonlyMap<string, ReaderStory> } {
  const directory = newsDirectory();
  const index = loadValidatedNewsIndex();
  const storiesBySlug = new Map<string, ReaderStory>();

  for (const item of index.items) {
    const fileName = `${item.slug}.json`;
    const storyPath = join(directory, fileName);
    if (!existsSync(storyPath)) throw new Error(`News index slug ${item.slug} has no matching story file.`);
    const story = readerStorySchema.parse(readJson(join(directory, fileName)));
    if (story.slug !== item.slug) {
      throw new Error(`News story file ${fileName} must contain the slug ${item.slug}.`);
    }
    if (storiesBySlug.has(story.slug)) throw new Error(`News story slug ${story.slug} is repeated.`);
    storiesBySlug.set(story.slug, story);
    if (
      item.title !== story.title ||
      item.dek !== story.dek ||
      JSON.stringify(item.eventTime) !== JSON.stringify(story.eventTime)
    ) {
      throw new Error(`News index card for ${item.slug} must match its story title, dek, and event time.`);
    }
  }

  return { index, storiesBySlug };
}

export function validateNewsStoryFileParity(): { indexedFiles: number; storyFiles: number } {
  const directory = newsDirectory();
  const { index } = loadValidatedNewsCorpus();
  const indexedSlugs = new Set(index.items.map((item) => item.slug));
  const storyFiles = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
    .map((entry) => entry.name);

  for (const fileName of storyFiles) {
    const slugFromFileName = fileName.slice(0, -".json".length);
    const story = readerStorySchema.parse(readJson(join(directory, fileName)));
    if (story.slug !== slugFromFileName) throw new Error(`News story file ${fileName} must contain the slug ${slugFromFileName}.`);
    if (!indexedSlugs.has(story.slug)) throw new Error(`News story file ${story.slug}.json has no index row.`);
  }
  return { indexedFiles: index.items.length, storyFiles: storyFiles.length };
}

export function getNewsStory(slug: string): ReaderStory | undefined {
  if (!storySlugSchema.safeParse(slug).success) return undefined;
  return loadValidatedNewsCorpus().storiesBySlug.get(slug);
}

export function getNewsStoryIndex(): readonly ReaderStoryIndexItem[] {
  return loadValidatedNewsCorpus().index.items;
}

/** Lightweight card projection for Home and the archive. It never opens story-body files. */
export function getNewsStoryIndexProjection(): readonly ReaderStoryIndexItem[] {
  return loadValidatedNewsIndex().items;
}

export function getNewsStoryStaticParams(): Array<{ slug: string }> {
  return getNewsStoryIndex().map(({ slug }) => ({ slug }));
}

export function getFeaturedNewsStories(limit: number): readonly ReaderStoryIndexItem[] {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  return getNewsStoryIndex().filter((story) => story.featured).slice(0, Math.floor(limit));
}
