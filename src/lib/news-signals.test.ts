import { describe, expect, it } from "vitest";

import { latestNewsSignals, newsSignalMetadata } from "./news-signals";

describe("news signal projection", () => {
  it("surfaces one hundred dated, link-only source signals without calling them published stories", () => {
    expect(newsSignalMetadata.itemCount).toBe(100);
    expect(latestNewsSignals).toHaveLength(100);
    expect(latestNewsSignals.every((item) => item.status === "needs_editorial_review" && item.rights === "link_only" && item.url.startsWith("https://"))).toBe(true);
  });
});
