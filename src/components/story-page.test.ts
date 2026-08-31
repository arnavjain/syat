import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getPreviewStory } from "@/lib/preview-content";

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
