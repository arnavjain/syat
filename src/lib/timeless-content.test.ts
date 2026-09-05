import { describe, expect, it } from "vitest";

import { authoredTopicCount, getTopicContent, timelessContent } from "./timeless-content";
import { readingLenses, themeSlug, timelessThemes, timelessTopics, topicsInTheme } from "./timeless-topics";

describe("Timeless catalogue content", () => {
  it("has authored content for every question and no orphans", () => {
    const slugs = new Set(timelessTopics.map((topic) => topic.slug));

    expect(authoredTopicCount).toBe(slugs.size);
    for (const slug of slugs) expect(getTopicContent(slug), `missing content for ${slug}`).toBeDefined();
    for (const slug of Object.keys(timelessContent)) expect(slugs.has(slug), `orphan content ${slug}`).toBe(true);
  });

  it("gives every question at least three genuinely distinct standpoints", () => {
    for (const [slug, content] of Object.entries(timelessContent)) {
      expect(content.standpoints.length, slug).toBeGreaterThanOrEqual(3);
      const labels = content.standpoints.map((standpoint) => standpoint.label);
      expect(new Set(labels).size, `${slug} repeats a standpoint label`).toBe(labels.length);
      const seen = content.standpoints.map((standpoint) => standpoint.sees);
      expect(new Set(seen).size, `${slug} repeats what a standpoint sees`).toBe(seen.length);
    }
  });

  it("states a limit on every standpoint, so none is presented as the answer", () => {
    for (const [slug, content] of Object.entries(timelessContent)) {
      for (const standpoint of content.standpoints) {
        expect(standpoint.mayMiss.length, `${slug}/${standpoint.label}`).toBeGreaterThan(20);
        expect(standpoint.values.length, `${slug}/${standpoint.label}`).toBeGreaterThan(10);
      }
      expect(content.contested.length, slug).toBeGreaterThan(30);
      expect(content.changeYourMind.length, slug).toBeGreaterThan(20);
    }
  });

  it("writes in plain punctuation and never asserts a figure", () => {
    for (const [slug, content] of Object.entries(timelessContent)) {
      const everything = [content.opening, content.contested, content.changeYourMind, ...content.standpoints.flatMap((s) => [s.label, s.sees, s.values, s.mayMiss])].join(" ");
      expect(everything, `${slug} uses a decorative dash`).not.toMatch(/[–—]/);
      // These are open questions, not reporting. A statistic here would be an invention.
      expect(everything, `${slug} asserts a figure`).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:per cent|%|crore|lakh|million|billion)\b/i);
    }
  });

  it("never opens two questions with the same first six words", () => {
    const openings = Object.entries(timelessContent).map(([slug, content]) => [slug, content.opening.toLowerCase().split(/\s+/).slice(0, 6).join(" ")] as const);
    const seen = new Map<string, string>();
    for (const [slug, opening] of openings) {
      expect(seen.has(opening), `${slug} opens like ${seen.get(opening)}`).toBe(false);
      seen.set(opening, slug);
    }
  });
});

describe("themes and lenses", () => {
  it("covers every theme with every question reachable from one", () => {
    expect(timelessThemes.length).toBeGreaterThanOrEqual(10);
    expect(timelessThemes.reduce((total, theme) => total + theme.count, 0)).toBe(timelessTopics.length);
    for (const theme of timelessThemes) expect(topicsInTheme(theme.theme).length).toBe(theme.count);
  });

  it("builds a stable url segment for each theme", () => {
    expect(themeSlug("Cities and public life")).toBe("cities-and-public-life");
    expect(new Set(timelessThemes.map((theme) => theme.slug)).size).toBe(timelessThemes.length);
  });

  it("accounts for every question under a reading lens", () => {
    expect(readingLenses.reduce((total, lens) => total + lens.count, 0)).toBe(timelessTopics.length);
  });
});
