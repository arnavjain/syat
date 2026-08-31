import { describe, expect, it } from "vitest";

import { getPreviewStory, getPreviewStoryStaticParams, isValidReframeAction, previewStories } from "./preview-content";
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

  it("exposes the public news fixture as a stable static route", () => {
    expect(getPreviewStoryStaticParams("news")).toEqual([{ slug: "street-plan-daily-realities" }]);
  });

  it("gives every story a real source trail, Reframe input, and related Timeless subject", () => {
    for (const story of previewStories) {
      expect(story.actions.sourceTrailTarget).toBe("source-trail");
      expect(isValidReframeAction(story.actions.reframe)).toBe(true);
      if (typeof story.actions.reframe.topic === "string") {
        expect(getTimelessTopic(story.actions.reframe.topic)).toBeDefined();
      } else {
        expect(story.actions.reframe.claim?.trim().length).toBeGreaterThan(0);
        expect(story.actions.reframe.claim?.length).toBeLessThanOrEqual(320);
      }
      expect(getTimelessTopic(story.actions.relatedTimelessTopicSlug)).toBeDefined();
    }
  });

  it("rejects a Reframe action with both, neither, an unknown topic, or an unbounded claim", () => {
    expect(isValidReframeAction({ topic: "street-vending", claim: "Both inputs are not allowed" })).toBe(false);
    expect(isValidReframeAction({})).toBe(false);
    expect(isValidReframeAction({ topic: "not-in-the-catalogue" })).toBe(false);
    expect(isValidReframeAction({ claim: " ".repeat(321) })).toBe(false);
  });
});
