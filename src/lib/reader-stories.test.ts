import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("server-only", () => ({}));

import {
  getFeaturedNewsStories,
  getNewsStory,
  getNewsStoryIndex,
  getNewsStoryIndexProjection,
  getNewsStoryStaticParams,
  validateNewsStoryFileParity
} from "./reader-stories";

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
    eventTimeEvidence: { claimIds: ["claim-start"], sourceIds: ["ward-note"] },
    collectedAt: "2026-08-31T08:00:00.000Z",
    generatedAt: "2026-08-31T09:00:00.000Z",
    updatedAt: "2026-08-31T10:00:00.000Z",
    readingMinutes: 3,
    body: [
      { id: "opening", kind: "paragraph", text: "The municipal note says the trial starts on 1 September and changes one Bazaar Road lane.", section: { id: "what-changes", title: "What changes on Bazaar Road" }, claimIds: ["claim-start"], sourceIds: ["ward-note"] },
      { id: "change", kind: "paragraph", text: "The note describes a bus-priority lane and a walking route along the market edge.", section: { id: "what-record-shows", title: "What the record shows" }, claimIds: ["claim-change"], sourceIds: ["ward-note"] },
      { id: "question", kind: "paragraph", text: "Whether the trial works for different daily routines remains a question for later evidence.", section: { id: "what-remains-open", title: "What remains open" }, claimIds: ["claim-unknown"], sourceIds: ["ward-note"] }
    ],
    statements: [
      { id: "claim-start", type: "documented", basis: "official_claim", text: "The municipal note names 1 September 2026 as the street trial's start date.", sourceIds: ["ward-note"], sourceScope: "This reports the planned date stated in the municipal note.", limits: "It does not confirm that implementation happened on that date." },
      { id: "claim-change", type: "documented", basis: "official_claim", text: "The municipal note describes a bus-priority lane and a walking route.", sourceIds: ["ward-note"], sourceScope: "This records the lane and walking route described by the municipal note.", limits: "It does not establish how either change worked on the ground." },
      { id: "claim-unknown", type: "unresolved", basis: "evidence_gap", text: "The note alone cannot establish how the trial will affect every routine.", sourceIds: ["ward-note"], sourceScope: "The supplied note describes a plan but contains no measured outcome.", limits: "The note contains no independent access checks or affected-person reporting." }
    ],
    timeline: [{ id: "notice-published", time: { kind: "exact_date", value: "2026-08-28", label: "28 August 2026" }, text: "The municipal corporation published the street trial note.", claimIds: ["claim-start"], sourceIds: ["ward-note"] }],
    perspectives: [{ id: "commuter", label: "Daily commuter", rationale: "The note describes a bus-priority lane that directly concerns this journey.", sees: "A possible change to a regular bus journey.", values: "Predictable, affordable travel.", uses: "The published note and a regular travel routine.", mayMiss: "The immediate pressure on people who work beside the road.", sourceIds: ["ward-note"] }],
    people: [{ id: "municipal-corporation", kind: "institution", label: "Nadi Nagar Municipal Corporation", association: "It published the source note that describes the proposed street trial.", sourceIds: ["ward-note"] }],
    unresolved: [{ id: "access-outcome", question: "How will the trial affect people with different mobility and work needs?", whatWouldHelp: "Independent access checks and reporting from people who use the street.", sourceIds: ["ward-note"] }],
    contextBridge: { topicSlug: "street-vending", question: "What does a street vendor make possible?", connection: "The trial changes how a market street is used, linking it to questions about work and public space." },
    sources: [{ id: "ward-note", publisher: "Nadi Nagar Municipal Corporation", title: "Bazaar Road walking and bus-priority trial note", url: "https://example.invalid/nadi-nagar-bazaar-road", sourceKind: "official_statement", publishedAt: "2026-08-28T08:00:00.000Z", accessedAt: "2026-08-31T09:00:00.000Z", use: "Supports the stated terms and timing of the municipal trial.", scope: "The note describes the corporation's announced plan, not its outcomes.", rightsBasis: "link_only", reviewStatus: "approved", linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false }],
    media: [{ id: "street-trial-diagram", kind: "chart", label: "Bazaar Road trial evidence path", alt: "A diagram of the bus-priority lane and walking route in the proposed trial.", caption: "A Syāt visual based on the municipal trial note.", creator: "Syāt visual desk", creditLine: "Syāt visual desk", sourceUrl: "https://example.invalid/nadi-nagar-bazaar-road", rightsBasis: "owned", reviewStatus: "approved", reviewedAt: "2026-08-31T10:00:00.000Z", rightsProof: { kind: "documented_record", recordId: "rights-street-trial-diagram", note: "The Syāt visual desk recorded ownership of this authored illustration." }, limitation: "It shows the announced layout, not whether the trial works in practice.", claimIds: ["claim-start", "claim-unknown"], sourceIds: ["ward-note"] }],
    authoredVisual: { mediaId: "street-trial-diagram", kind: "process", title: "Bazaar Road trial evidence path", description: "A source-led view separates the announcement, road observation and later assessment.", limitation: "The visual does not show whether the trial worked in practice.", claimIds: ["claim-start", "claim-unknown"], sourceIds: ["ward-note"] },
    relatedCoverage: [],
    reframe: { kind: "question", value: "How can a street trial be read from different daily routines?" },
    generation: { model: "deepseek/deepseek-v4-flash-0731", promptVersion: "syat.story-draft.v2", inputHash: "a".repeat(64), generatedBy: "openrouter", reviewedAt: "2026-08-31T10:00:00.000Z" },
    quality: { status: "passed", blockers: [], warnings: [], scores: { clarity: 4, usefulness: 4, evidenceDiscipline: 5, indiaRelevance: 4, humanVoice: 4, perspectiveQuality: 4, sourceTransparency: 5 } },
    publication: { approvedByHuman: false, finalReporting: false }
  };
}

type ReaderStoryFixture = ReturnType<typeof makeValidReaderStory>;

function cardFor(story: ReaderStoryFixture) {
  return {
    slug: story.slug,
    format: story.format,
    title: story.title,
    dek: story.dek,
    theme: story.theme,
    eventTime: story.eventTime,
    updatedAt: story.updatedAt,
    readingMinutes: story.readingMinutes,
    featured: false
  };
}

let restoreCorpus: (() => void) | undefined;

afterEach(() => restoreCorpus?.());

function useNewsCorpus(items: unknown[], stories: ReaderStoryFixture[]) {
  const root = mkdtempSync(join(tmpdir(), "syat-reader-stories-"));
  const directory = join(root, "data/stories/news");
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.json"), JSON.stringify({ contractVersion: "syat.reader-story-index.v1", generatedAt: "2026-08-31T00:00:00.000Z", items }));
  for (const story of stories) writeFileSync(join(directory, `${story.slug}.json`), JSON.stringify(story));
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(root);
  restoreCorpus = () => {
    cwd.mockRestore();
    rmSync(root, { recursive: true, force: true });
    restoreCorpus = undefined;
  };
  return directory;
}

describe("static news story loader", () => {
  it("reads the explicitly empty private-preview index without loading a story corpus", () => {
    expect(getNewsStoryIndex()).toEqual([]);
    expect(getNewsStoryStaticParams()).toEqual([]);
    expect(getFeaturedNewsStories(6)).toEqual([]);
  });

  it("returns undefined when a requested story file is absent", () => {
    expect(getNewsStory("missing-story")).toBeUndefined();
  });

  it("rejects an index row without a matching story file", () => {
    const story = makeValidReaderStory();
    useNewsCorpus([cardFor(story)], []);

    expect(getNewsStoryIndex).toThrow(/no matching story file/);
    expect(getNewsStoryIndexProjection()).toEqual([cardFor(story)]);
  });

  it("keeps unindexed pre-activation story files invisible to readers and flags them in an offline parity check", () => {
    useNewsCorpus([], [makeValidReaderStory()]);

    expect(getNewsStoryIndex()).toEqual([]);
    expect(getNewsStory("nadi-nagar-bazaar-road-trial")).toBeUndefined();
    expect(validateNewsStoryFileParity).toThrow(/has no index row/);
  });

  it("keeps the old index usable before activation and reads the new story only after the index changes", () => {
    const oldStory = makeValidReaderStory();
    const newStory = { ...makeValidReaderStory(), id: "news-new-water-review", slug: "new-water-review", title: "A new district water review record becomes available", dek: "The second record is durable on disk but must remain invisible until its index is activated." };
    const directory = useNewsCorpus([cardFor(oldStory)], [oldStory, newStory]);

    expect(getNewsStoryIndex().map((story) => story.slug)).toEqual([oldStory.slug]);
    expect(getNewsStory(oldStory.slug)?.slug).toBe(oldStory.slug);
    expect(getNewsStory(newStory.slug)).toBeUndefined();

    writeFileSync(join(directory, "index.json"), JSON.stringify({ contractVersion: "syat.reader-story-index.v1", generatedAt: "2026-08-31T01:00:00.000Z", items: [cardFor(oldStory), cardFor(newStory)] }));

    expect(getNewsStoryIndex().map((story) => story.slug)).toEqual([oldStory.slug, newStory.slug]);
    expect(getNewsStory(newStory.slug)?.title).toBe(newStory.title);
    expect(validateNewsStoryFileParity()).toEqual({ indexedFiles: 2, storyFiles: 2 });
  });

  it("rejects an index card whose title differs from its story", () => {
    const story = makeValidReaderStory();
    useNewsCorpus([{ ...cardFor(story), title: "A different but still valid story card title" }], [story]);

    expect(getNewsStoryIndex).toThrow(/must match its story title, dek, and event time/);
  });
});
