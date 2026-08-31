import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getFeaturedNewsStories,
  getNewsStory,
  getNewsStoryIndex,
  getNewsStoryStaticParams
} from "./reader-stories";

describe("static news story loader", () => {
  it("reads the explicitly empty private-preview index without loading a story corpus", () => {
    expect(getNewsStoryIndex()).toEqual([]);
    expect(getNewsStoryStaticParams()).toEqual([]);
    expect(getFeaturedNewsStories(6)).toEqual([]);
  });

  it("returns undefined when a requested story file is absent", () => {
    expect(getNewsStory("missing-story")).toBeUndefined();
  });
});
