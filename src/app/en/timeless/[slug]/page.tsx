import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { StoryPage } from "@/components/story-page";
import { getPreviewStory } from "@/lib/preview-content";

export default async function TimelessStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = getPreviewStory((await params).slug);
  if (!story || story.mode !== "timeless") notFound();
  return <SiteChrome active="explore"><StoryPage story={story} /></SiteChrome>;
}
