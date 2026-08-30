import { describe, expect, it } from "vitest";

import { getHomeContent } from "./home-content";

describe("getHomeContent", () => {
  it("opens in News with a current-story reading path", () => {
    const home = getHomeContent("news");

    expect(home.modeLabel).toBe("News");
    expect(home.feature.cta.href).toMatch(/^\/en\/news\//);
    expect(home.sections.some((section) => section.title === "Reframe")).toBe(false);
  });

  it("switches to a separate Timeless editorial path", () => {
    const home = getHomeContent("timeless");

    expect(home.modeLabel).toBe("Timeless");
    expect(home.feature.cta.href).toMatch(/^\/en\/timeless\//);
    expect(home.feature.kicker).toContain("Timeless");
  });
});
