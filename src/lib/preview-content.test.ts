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
      expect(story.contextBridge?.targetSlug).toBe(story.actions.relatedTimelessTopicSlug);
    }
  });

  it("keeps fixture reading modules source-bound and honest about time, people, media, and viewpoints", () => {
    for (const story of previewStories) {
      const sourceIds = new Set(story.sources.map((source) => source.id));

      for (const item of story.evidence) {
        expect(item.basis.id).toMatch(/^basis-/);
        expect(item.basis.statementType).toBe(item.type);
        item.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      }

      let previousOrder = -1;
      for (const item of story.timeline) {
        expect(item.order).toBeGreaterThan(previousOrder);
        previousOrder = item.order;
        expect(["exact", "period", "unknown"]).toContain(item.time.kind);
        if (item.time.kind === "unknown") expect(item.time.label).toBe("Time not yet known");
        item.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      }

      for (const association of story.associatedPeople) {
        expect(["person", "institution", "community", "unknown_unverified"]).toContain(association.kind);
        expect(sourceIds.has(association.sourceId)).toBe(true);
        if (association.kind === "person") expect(association.fixtureLabel).toBe("Fictional teaching record");
      }

      expect(story.media.creator).not.toHaveLength(0);
      expect(story.media.source).not.toHaveLength(0);
      expect(story.media.rightsBasis).not.toHaveLength(0);
      expect(story.media.reviewStatus).toBe("fixture metadata complete");
      expect(story.media.publicationStatus).toBe("not publishable");
      story.perspectives.forEach((view) => {
        expect(view.startingPoint).not.toHaveLength(0);
        expect(view.boundary).toMatch(/starting standpoint/i);
        expect(view.reading).not.toContain("Sees:");
      });
    }
  });

  it("rejects a Reframe action with both, neither, an unknown topic, or an unbounded claim", () => {
    expect(isValidReframeAction({ topic: "street-vending", claim: "Both inputs are not allowed" })).toBe(false);
    expect(isValidReframeAction({})).toBe(false);
    expect(isValidReframeAction({ topic: "not-in-the-catalogue" })).toBe(false);
    expect(isValidReframeAction({ claim: " ".repeat(321) })).toBe(false);
  });
});
