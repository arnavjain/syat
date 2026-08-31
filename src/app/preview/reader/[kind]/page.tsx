import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { StoryPage } from "@/components/story-page";
import { makeReaderStoryFixture } from "@/lib/reader-story-fixture";
import type { ReaderStory } from "@/lib/reader-story-schema";

export const dynamicParams = false;

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

const authoredVisualKinds = ["timeline", "process", "relationship_map", "source_role_map", "number_stack", "comparison"] as const;

type AuthoredVisualKind = (typeof authoredVisualKinds)[number];

export function isAuthoredVisualKind(value: string): value is AuthoredVisualKind {
  return (authoredVisualKinds as readonly string[]).includes(value);
}

export function getReaderPreviewStaticParams(): Array<{ kind: AuthoredVisualKind }> {
  return authoredVisualKinds.map((kind) => ({ kind }));
}

export function generateStaticParams() {
  return getReaderPreviewStaticParams();
}

export function buildReaderPreviewStory(kind: AuthoredVisualKind): ReaderStory {
  const base = makeReaderStoryFixture();
  return makeReaderStoryFixture({ authoredVisual: { ...base.authoredVisual, kind } });
}

export default async function ReaderPreviewPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isAuthoredVisualKind(kind)) notFound();

  return (
    <SiteChrome active="home">
      <aside className="reader-preview-note" aria-labelledby="reader-preview-note-title">
        <p className="micro-copy">Design review only</p>
        <h2 id="reader-preview-note-title">This page renders a fixture, not reporting.</h2>
        <p>It exists so the reader layout can be checked at 390, 768 and 1440 pixels while the generated News index is empty. Nothing here is publishable, and the {kind.replaceAll("_", " ")} visual is drawn from fixture data.</p>
      </aside>
      <StoryPage story={buildReaderPreviewStory(kind)} />
    </SiteChrome>
  );
}
