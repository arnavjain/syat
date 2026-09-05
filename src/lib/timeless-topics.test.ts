import { describe, expect, it } from "vitest";

import * as topics from "./timeless-topics";

const { timelessTopics } = topics;

describe("timeless topic catalogue", () => {
  it("ships one hundred varied, stable subjects for the preview", () => {
    expect(timelessTopics.length).toBeGreaterThanOrEqual(100);
    expect(new Set(timelessTopics.map((topic) => topic.slug)).size).toBe(timelessTopics.length);
    expect(new Set(timelessTopics.map((topic) => topic.theme)).size).toBeGreaterThanOrEqual(10);
  });

  it("keeps topics as questions rather than unsupported conclusions", () => {
    expect(timelessTopics.every((topic) => topic.title.endsWith("?"))).toBe(true);
  });

  it("finds a catalogue subject from its route slug", () => {
    const topic = (topics as typeof topics & { getTimelessTopic?: (slug: string) => (typeof timelessTopics)[number] | undefined }).getTimelessTopic?.("archive-silence");

    expect(topic).toMatchObject({
      slug: "archive-silence",
      title: "What does an archive leave out?",
    });
  });

  it("provides a subject-page path for each known catalogue slug", () => {
    const topicPath = (topics as typeof topics & { timelessTopicPath?: (slug: string) => string | undefined }).timelessTopicPath;

    expect(topicPath?.("archive-silence")).toBe("/en/timeless/topic/archive-silence");
    expect(timelessTopics.map((topic) => topicPath?.(topic.slug)).every(Boolean)).toBe(true);
  });

  it("does not create a destination for an unknown subject", () => {
    const getTimelessTopic = (topics as typeof topics & { getTimelessTopic?: (slug: string) => (typeof timelessTopics)[number] | undefined }).getTimelessTopic;
    const topicPath = (topics as typeof topics & { timelessTopicPath?: (slug: string) => string | undefined }).timelessTopicPath;

    expect(getTimelessTopic?.("not-in-the-catalogue")).toBeUndefined();
    expect(topicPath?.("not-in-the-catalogue")).toBeUndefined();
  });
});
