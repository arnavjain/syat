import { describe, expect, it } from "vitest";

import { buildSearchIndex, searchTopics } from "./topic-search";

const entries = buildSearchIndex();

describe("topic search", () => {
  it("indexes every question with its theme and standpoints", () => {
    expect(entries).toHaveLength(100);
    expect(entries.every((entry) => entry.haystack.length > 40)).toBe(true);
  });

  it("finds a question by a plain word from its title", () => {
    const results = searchTopics(entries, "water");

    expect(results.length).toBeGreaterThan(0);
    expect(results.map((entry) => entry.slug)).toContain("water-sharing");
  });

  it("ranks a title match above a body-only match", () => {
    const results = searchTopics(entries, "archive");

    expect(results[0].title.toLowerCase()).toContain("archive");
  });

  it("requires every term to match and stays quiet on a stub query", () => {
    expect(searchTopics(entries, "a")).toEqual([]);
    expect(searchTopics(entries, "water zzzznotaword")).toEqual([]);
  });

  it("matches on theme so a category behaves like a search term", () => {
    expect(searchTopics(entries, "memory").length).toBeGreaterThan(1);
  });
});
