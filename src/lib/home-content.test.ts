import { describe, expect, it } from "vitest";

import { getHomeContent, getHomeModeHref, isCurrentHomeDestination } from "./home-content";

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

  it("backs every internal home link with a current static route or matching fixture", () => {
    const internalHomeLinks = (["news", "timeless"] as const).flatMap((mode) => {
      const home = getHomeContent(mode);
      return [home.feature.cta.href, ...home.sections.flatMap((section) => section.items.filter((item) => item.type !== "internet").map((item) => item.href))];
    });

    expect(internalHomeLinks.every(isCurrentHomeDestination)).toBe(true);
    expect(isCurrentHomeDestination("/en/explore")).toBe(true);
    expect(isCurrentHomeDestination("/en/news/not-a-fixture")).toBe(false);
    expect(isCurrentHomeDestination("/en/timeless/not-a-fixture")).toBe(false);
  });

  it("uses stable route paths for the editorial modes", () => {
    const modePaths = [getHomeModeHref("news"), getHomeModeHref("timeless")];

    expect(modePaths).toEqual(["/", "/en/timeless"]);
    expect(modePaths.every(isCurrentHomeDestination)).toBe(true);
  });
});
