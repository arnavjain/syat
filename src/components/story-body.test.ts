import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { makeReaderStoryFixture } from "@/lib/reader-story-fixture";
import { StoryBody } from "./story-body";

describe("StoryBody", () => {
  it("renders canonical sections and source-bound paragraphs as static HTML", () => {
    const story = makeReaderStoryFixture();
    const html = renderToStaticMarkup(createElement(StoryBody, { blocks: story.body }));

    expect(html).toContain("What opened for review");
    expect(html).toContain("opens a review of neighbourhood water records");
    expect(html).toContain('href="#water-note"');
    expect(html).not.toContain("<blockquote");
  });
});
