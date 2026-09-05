import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import { StoryMotif } from "./story-motif";
import type { ReaderStoryIndexItem } from "@/lib/reader-story-schema";

type Stub = Pick<ReaderStoryIndexItem, "slug" | "format" | "title">;
const formats = ["news_brief", "explainer", "timeline", "source_map", "public_impact"] as const;
const render = (story: Stub) => renderToStaticMarkup(createElement(StoryMotif, { story }));

describe("StoryMotif", () => {
  it("draws a mark for every story format", () => {
    for (const format of formats) {
      const markup = render({ slug: "cag-126002", format, title: "A story about public money" });
      expect(markup).toContain("<svg");
      expect(markup).toContain(`motif-${format.replaceAll("_", "-")}`);
    }
  });

  it("is deterministic, so a story never changes its mark between builds", () => {
    const story: Stub = { slug: "cag-125984", format: "timeline", title: "A story about public money" };
    expect(render(story)).toBe(render(story));
  });

  it("draws different marks for different stories in the same format", () => {
    const a = render({ slug: "cag-125984", format: "timeline", title: "One story" });
    const b = render({ slug: "cag-126309", format: "timeline", title: "Another story" });
    expect(a).not.toBe(b);
  });

  it("never emits a third-party image, embed or outbound request", () => {
    // Every newsroom source in the News lane is link-only, so no external media may sit beside a story.
    for (const format of formats) {
      const markup = render({ slug: "cag-126077", format, title: "A story about public money" });
      expect(markup).not.toMatch(/<img|<iframe|<image|xlink:href|https?:\/\//);
    }
  });

  it("stays decorative, because the headline beside it already carries the meaning", () => {
    const markup = render({ slug: "cag-126055", format: "explainer", title: "A story about public money" });
    expect(markup).toContain('aria-hidden="true"');
  });
});
