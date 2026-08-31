import { describe, expect, it } from "vitest";

import { readerStorySchema } from "./reader-story-schema";

function makeValidReaderStory() {
  return {
    contractVersion: "syat.reader-story.v1",
    id: "news-nadi-nagar-bazaar-road-trial",
    slug: "nadi-nagar-bazaar-road-trial",
    mode: "news",
    locale: "en-IN",
    status: "private_preview",
    publicationAllowed: false,
    disclosure: "AI-assisted private preview",
    format: "news_brief",
    title: "Nadi Nagar prepares a Bazaar Road street trial",
    dek: "The municipal note describes a trial that readers can inspect through its sources.",
    theme: "Cities and public life",
    indiaConnection: "The local street trial concerns public transport and market access in an Indian city.",
    eventTime: { kind: "exact_date", value: "2026-09-01", label: "1 September 2026" },
    collectedAt: "2026-08-31T08:00:00.000Z",
    generatedAt: "2026-08-31T09:00:00.000Z",
    updatedAt: "2026-08-31T10:00:00.000Z",
    readingMinutes: 3,
    body: [
      {
        id: "opening",
        kind: "paragraph",
        text: "The municipal note says the trial starts on 1 September and changes one Bazaar Road lane.",
        claimIds: ["claim-start"],
        sourceIds: ["ward-note"]
      },
      {
        id: "change",
        kind: "paragraph",
        text: "The note describes a bus-priority lane and a walking route along the market edge.",
        claimIds: ["claim-change"],
        sourceIds: ["ward-note"]
      },
      {
        id: "question",
        kind: "paragraph",
        text: "Whether the trial works for different daily routines remains a question for later evidence.",
        claimIds: ["claim-unknown"],
        sourceIds: ["ward-note"]
      }
    ],
    statements: [
      {
        id: "claim-start",
        type: "documented",
        text: "The municipal note names 1 September 2026 as the street trial's start date.",
        sourceIds: ["ward-note"]
      },
      {
        id: "claim-change",
        type: "documented",
        text: "The municipal note describes a bus-priority lane and a walking route.",
        sourceIds: ["ward-note"]
      },
      {
        id: "claim-unknown",
        type: "unresolved",
        text: "The note alone cannot establish how the trial will affect every routine.",
        sourceIds: ["ward-note"],
        whatWouldHelp: "Independent access checks and reporting from people who use the street."
      }
    ],
    timeline: [
      {
        id: "notice-published",
        time: { kind: "exact_date", value: "2026-08-28", label: "28 August 2026" },
        text: "The municipal corporation published the street trial note.",
        sourceIds: ["ward-note"]
      }
    ],
    perspectives: [
      {
        id: "commuter",
        label: "Daily commuter",
        sees: "A possible change to a regular bus journey.",
        values: "Predictable, affordable travel.",
        uses: "The published note and a regular travel routine.",
        mayMiss: "The immediate pressure on people who work beside the road.",
        sourceIds: ["ward-note"]
      }
    ],
    people: [
      {
        id: "municipal-corporation",
        kind: "institution",
        label: "Nadi Nagar Municipal Corporation",
        association: "It published the source note that describes the proposed street trial.",
        sourceIds: ["ward-note"]
      }
    ],
    unresolved: [
      {
        id: "access-outcome",
        question: "How will the trial affect people with different mobility and work needs?",
        whatWouldHelp: "Independent access checks and reporting from people who use the street.",
        sourceIds: ["ward-note"]
      }
    ],
    contextBridge: {
      topicSlug: "street-vending",
      question: "What does a street vendor make possible?",
      connection: "The trial changes how a market street is used, linking it to questions about work and public space."
    },
    sources: [
      {
        id: "ward-note",
        publisher: "Nadi Nagar Municipal Corporation",
        title: "Bazaar Road walking and bus-priority trial note",
        url: "https://example.invalid/nadi-nagar-bazaar-road",
        sourceKind: "official_statement",
        publishedAt: "2026-08-28T08:00:00.000Z",
        accessedAt: "2026-08-31T09:00:00.000Z",
        use: "Supports the stated terms and timing of the municipal trial.",
        scope: "The note describes the corporation's announced plan, not its outcomes.",
        rightsBasis: "link_only",
        reviewStatus: "approved"
      }
    ],
    media: [
      {
        id: "street-trial-diagram",
        kind: "illustration",
        label: "Bazaar Road trial diagram",
        alt: "A diagram of the bus-priority lane and walking route in the proposed trial.",
        caption: "A Syāt visual based on the municipal trial note.",
        creator: "Syāt visual desk",
        creditLine: "Syāt visual desk",
        sourceUrl: "https://example.invalid/nadi-nagar-bazaar-road",
        rightsBasis: "owned",
        reviewStatus: "approved",
        reviewedAt: "2026-08-31T10:00:00.000Z",
        limitation: "It shows the announced layout, not whether the trial works in practice.",
        sourceIds: ["ward-note"]
      }
    ],
    relatedCoverage: [],
    reframe: { kind: "question", value: "How can a street trial be read from different daily routines?" },
    generation: {
      model: "deepseek/deepseek-v4-flash-0731",
      promptVersion: "syat.story-draft.v2",
      inputHash: "a".repeat(64),
      generatedBy: "openrouter",
      reviewedAt: "2026-08-31T10:00:00.000Z"
    },
    quality: {
      status: "passed",
      blockers: [],
      warnings: [],
      scores: {
        clarity: 4,
        usefulness: 4,
        evidenceDiscipline: 5,
        indiaRelevance: 4,
        humanVoice: 4,
        perspectiveQuality: 4,
        sourceTransparency: 5
      }
    },
    publication: { approvedByHuman: false, finalReporting: false }
  };
}

describe("readerStorySchema", () => {
  it("accepts only a non-publishable private-preview story", () => {
    const parsed = readerStorySchema.parse(makeValidReaderStory());

    expect(parsed.status).toBe("private_preview");
    expect(parsed.publicationAllowed).toBe(false);
    expect(parsed.disclosure).toBe("AI-assisted private preview");
  });

  it("rejects an unknown claim or source reference", () => {
    const story = makeValidReaderStory();
    story.body[0].sourceIds = ["missing-source"];

    expect(() => readerStorySchema.parse(story)).toThrow(/missing-source/);
  });

  it("rejects an unknown Timeless topic and duplicate record IDs", () => {
    const story = makeValidReaderStory();
    story.contextBridge.topicSlug = "missing-topic";
    story.media.push({ ...story.media[0], id: "street-trial-diagram" });

    expect(() => readerStorySchema.parse(story)).toThrow(/missing-topic|street-trial-diagram/);
  });
});
