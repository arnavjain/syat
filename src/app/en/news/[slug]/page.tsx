import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { StoryPage as SharedStoryPage } from "@/components/story-page";
import { getPreviewStory } from "@/lib/preview-content";

export default async function NewsStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const story = getPreviewStory((await params).slug);
  if (!story || story.mode !== "news") notFound();
  return <NewsStory story={story} />;
}

function NewsStory({ story }: { story: NonNullable<ReturnType<typeof getPreviewStory>> }) {
  return <SiteChrome active="home"><SharedStoryPage story={story} /></SiteChrome>;
}
