import { describe, expect, it } from "vitest";

import { getPreviewStory, previewStories } from "./preview-content";

describe("preview editorial content", () => {
  it("keeps every visible fixture tied to a source card and at least two standpoints", () => {
    for (const story of previewStories) {
      expect(story.sources.length).toBeGreaterThan(0);
      expect(story.perspectives.length).toBeGreaterThanOrEqual(2);
      expect(story.evidence.length).toBeGreaterThan(0);
    }
  });

  it("returns the India-first street-plan fixture by its stable public slug", () => {
    expect(getPreviewStory("street-plan-daily-realities")?.title).toMatch(/street plan/i);
  });
});
