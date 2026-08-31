import { describe, expect, it } from "vitest";

import { publicationStorySchema } from "./content-schema";

const readyStory = {
  id: "news-nadi-nagar-bazaar-road-trial",
  mode: "news",
  locale: "en-IN",
  title: "One street trial can mean different daily realities",
  dek: "A carefully labelled editorial fixture for the private Syāt preview.",
  status: "ready_for_review",
  createdAt: "2026-08-31T08:00:00.000Z",
  updatedAt: "2026-08-31T09:00:00.000Z",
  sources: [
    {
      id: "source-ward-note",
      publisher: "Nadi Nagar Municipal Corporation",
      title: "Bazaar Road walking and bus-priority trial note",
      url: "https://example.invalid/nadi-nagar-bazaar-road",
      sourceKind: "primary_document",
      publishedAt: "2026-08-28T08:00:00.000Z",
      accessedAt: "2026-08-31T09:00:00.000Z"
    }
  ],
  media: [
    {
      id: "media-road-map",
      kind: "illustration",
      alt: "A small map showing proposed changes on Bazaar Road.",
      creditLine: "Syāt editorial illustration",
      rightsBasis: "owned",
      reviewStatus: "approved"
    }
  ],
  viewpoints: [
    {
      id: "commuter",
      label: "Daily commuter",
      sees: "A possible change on a route that already costs time and money.",
      values: "Predictable travel and an affordable commute.",
      uses: "The published trial note and daily travel experience.",
      mayMiss: "How the trial may affect people who work on the roadside."
    },
    {
      id: "planner",
      label: "Urban planner",
      sees: "A short trial intended to make buses and crossings work better.",
      values: "Safer streets, cleaner air, and reliable public transport.",
      uses: "Street counts, access checks, and transport models.",
      mayMiss: "The short-term stress on individual households and businesses."
    }
  ]
};

describe("publicationStorySchema", () => {
  it("accepts a review-ready story with traceable source, credited media, and distinct viewpoints", () => {
    const result = publicationStorySchema.parse(readyStory);

    expect(result.id).toBe("news-nadi-nagar-bazaar-road-trial");
    expect(result.viewpoints).toHaveLength(2);
  });

  it("rejects a story that tries to publish media without a rights decision", () => {
    const result = publicationStorySchema.safeParse({
      ...readyStory,
      media: [{ ...readyStory.media[0], rightsBasis: "unknown" }]
    });

    expect(result.success).toBe(false);
  });
});
