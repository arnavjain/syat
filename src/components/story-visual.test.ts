import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ReaderStory } from "@/lib/reader-story-schema";

import { makeReaderStoryFixture } from "@/lib/reader-story-fixture";
import { StoryVisual } from "./story-visual";

describe("StoryVisual", () => {
  it("renders the authored visual's credit, limitation, and evidence links", () => {
    const story = makeReaderStoryFixture();
    const html = renderToStaticMarkup(createElement(StoryVisual, { story }));

    expect(html).toContain("Syāt visual desk");
    expect(html).toContain(story.authoredVisual.limitation);
    expect(html).toContain('href="#water-note"');
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<iframe");
  });

  it.each<ReaderStory["authoredVisual"]["kind"]>(["timeline", "process", "relationship_map", "source_role_map", "number_stack", "comparison"])("has a deliberate static rendering for %s", (kind) => {
    const base = makeReaderStoryFixture();
    const story = makeReaderStoryFixture({ authoredVisual: { ...base.authoredVisual, kind } });
    const html = renderToStaticMarkup(createElement(StoryVisual, { story }));

    expect(html).toContain(`data-visual-kind="${kind}"`);
    expect(html).toContain(base.authoredVisual.title);
  });
});

