import { describe, expect, it } from "vitest";

import { timelessTopics } from "./timeless-topics";

describe("timeless topic catalogue", () => {
  it("ships one hundred varied, stable subjects for the preview", () => {
    expect(timelessTopics).toHaveLength(100);
    expect(new Set(timelessTopics.map((topic) => topic.slug)).size).toBe(100);
    expect(new Set(timelessTopics.map((topic) => topic.theme)).size).toBeGreaterThanOrEqual(10);
  });

  it("keeps topics as questions rather than unsupported conclusions", () => {
    expect(timelessTopics.every((topic) => topic.title.endsWith("?"))).toBe(true);
  });
});
