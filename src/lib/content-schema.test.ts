import { describe, expect, it } from "vitest";

import { publicationStorySchema } from "./content-schema";

const readyStory = {
  id: "news-river-city-congestion-pricing",
  mode: "news",
  locale: "en-IN",
  title: "A city toll can be one policy and six different daily realities",
  dek: "A carefully labelled editorial fixture for the private Syāt preview.",
  status: "ready_for_review",
  createdAt: "2026-08-31T08:00:00.000Z",
  updatedAt: "2026-08-31T09:00:00.000Z",
  sources: [
    {
      id: "source-city-order",
      publisher: "City of Rivergate",
      title: "Congestion pricing implementation order",
      url: "https://example.org/rivergate-order",
      sourceKind: "primary_document",
      publishedAt: "2026-08-28T08:00:00.000Z",
      accessedAt: "2026-08-31T09:00:00.000Z"
    }
  ],
  media: [
    {
      id: "media-road-map",
      kind: "illustration",
      alt: "A small map showing the city-centre toll boundary.",
      creditLine: "Syāt editorial illustration",
      rightsBasis: "owned",
      reviewStatus: "approved"
    }
  ],
  viewpoints: [
    {
      id: "commuter",
      label: "Daily commuter",
      sees: "A new charge on a route that already costs time and money.",
      values: "Predictable travel and an affordable commute.",
      uses: "The published fee schedule and daily travel experience.",
      mayMiss: "How road use affects residents who do not drive."
    },
    {
      id: "planner",
      label: "Urban planner",
      sees: "A tool intended to reduce traffic and fund alternatives.",
      values: "Safer streets, cleaner air, and reliable public transport.",
      uses: "Traffic counts, public-health evidence, and transport models.",
      mayMiss: "The short-term stress on individual households and businesses."
    }
  ]
};

describe("publicationStorySchema", () => {
  it("accepts a review-ready story with traceable source, credited media, and distinct viewpoints", () => {
    const result = publicationStorySchema.parse(readyStory);

    expect(result.id).toBe("news-river-city-congestion-pricing");
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
