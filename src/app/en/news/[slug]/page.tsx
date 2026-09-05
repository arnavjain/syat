import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { StoryPage } from "@/components/story-page";
import { getPreviewStory, getPreviewStoryStaticParams } from "@/lib/preview-content";
import { getNewsStory, getNewsStoryStaticParams } from "@/lib/reader-stories";

export const dynamicParams = false;

export function getNewsRouteStaticParams() {
  const params = [...getNewsStoryStaticParams(), ...getPreviewStoryStaticParams("news")];
  return [...new Map(params.map((item) => [item.slug, item])).values()];
}

export function generateStaticParams() {
  return getNewsRouteStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getNewsStory(slug) ?? getPreviewStory(slug);
  if (!story || story.mode !== "news") return { title: "Story not found" };
  return {
    title: `${story.title} · Syāt`,
    description: story.dek,
  };
}

export default async function NewsStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getNewsStory(slug) ?? getPreviewStory(slug);
  if (!story || story.mode !== "news") notFound();
  return <SiteChrome active="home"><StoryPage story={story} /></SiteChrome>;
}
