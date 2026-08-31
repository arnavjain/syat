import { describe, expect, it } from "vitest";

import { getPreviewStory, previewStories } from "./preview-content";
import { getTimelessTopic } from "./timeless-topics";

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

  it("gives every story a real source trail, Reframe input, and related Timeless subject", () => {
    for (const story of previewStories) {
      expect(story.actions.sourceTrailTarget).toBe("source-trail");
      expect(story.actions.reframe.topic ?? story.actions.reframe.claim).toBeTruthy();
      expect(getTimelessTopic(story.actions.relatedTimelessTopicSlug)).toBeDefined();
    }
  });
});
