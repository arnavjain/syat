import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getPreviewStory } from "@/lib/preview-content";

import { makeReaderStoryFixture } from "@/lib/reader-story-fixture";
import { StoryPage } from "./story-page";

function renderStory(slug: string) {
  const story = getPreviewStory(slug);
  if (!story) throw new Error(`Missing fixture ${slug}`);
  return renderToStaticMarkup(createElement(StoryPage, { story }));
}

describe("StoryPage fixture media and rail", () => {
  it("renders each story's own media subject and map labels, not a shared street-plan assertion", () => {
    const news = renderStory("street-plan-daily-realities");
    const timeless = renderStory("how-cities-move");

    expect(news).toContain("A street rule is a starting point. Daily life is the question.");
    expect(news).toContain("Bus corridor");
    expect(timeless).toContain("A journey is more than a route. It is a question of time, access, and care.");
    expect(timeless).toContain("Past choices");
    expect(timeless).not.toContain("A street rule is a starting point. Daily life is the question.");
    expect(timeless).not.toContain("Bus corridor");
  });

  it("keeps every story destination named in static markup", () => {
    const html = renderStory("street-plan-daily-realities");
    for (const label of ["Basis", "Timeline", "People &amp; roles", "Context", "Sources"]) expect(html).toContain(label);
  });
});

describe("StoryPage canonical preview", () => {
  it("renders the article body and generated-preview disclosure without fixture copy", () => {
    const story = makeReaderStoryFixture();
    const html = renderToStaticMarkup(createElement(StoryPage, { story }));

    expect(html).toContain("AI-assisted private preview");
    expect(html).toContain("opens a review of neighbourhood water records");
    expect(html).not.toMatch(/fictional teaching fixture/i);
    expect(html).toContain("What remains uncertain");
  });

  it("states the honest boundary for a one-release PIB-only UX pilot", () => {
    const base = makeReaderStoryFixture();
    const story = makeReaderStoryFixture({ sources: [{ ...base.sources[0], publisher: "Press Information Bureau" }] });
    const html = renderToStaticMarkup(createElement(StoryPage, { story }));

    expect(html).toContain("one PIB evidence release");
    expect(html).toContain("no independent reporting or affected voices were supplied");
    expect(html).toContain("never used as model input without a recorded permission");
  });
});

describe("StoryPage reader navigation and media boundary", () => {
  it("offers a Context link only when the story's Timeless topic actually exists", () => {
    const base = makeReaderStoryFixture();
    const linked = renderToStaticMarkup(createElement(StoryPage, { story: base }));
    const orphaned = renderToStaticMarkup(createElement(StoryPage, {
      story: makeReaderStoryFixture({ contextBridge: { ...base.contextBridge, topicSlug: "not-an-approved-topic" } })
    }));

    expect(linked).toContain('href="#context-bridge-title"');
    expect(linked).toContain('id="context-bridge-title"');
    expect(orphaned).not.toContain('href="#context-bridge-title"');
    expect(orphaned).not.toContain('id="context-bridge-title"');
  });

  it("gives every citation an anchor that resolves on the page", () => {
    const html = renderToStaticMarkup(createElement(StoryPage, { story: makeReaderStoryFixture() }));
    const targets = new Set(Array.from(html.matchAll(/id="([^"]+)"/gu)).map((match) => match[1]));

    for (const [, anchor] of html.matchAll(/href="#([^"]+)"/gu)) expect(targets).toContain(anchor);
  });

  it("renders no external media and no manufactured credibility figure", () => {
    const html = renderToStaticMarkup(createElement(StoryPage, { story: makeReaderStoryFixture() }));

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<iframe");
    expect(html).not.toMatch(/credibility|confidence score|disagreement level|partially verified/i);
  });
});
