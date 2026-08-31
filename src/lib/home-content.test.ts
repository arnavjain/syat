import { describe, expect, it } from "vitest";

import { getHomeContent, getHomeModeHref } from "./home-content";

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

  it("keeps every internal home link on a page contract that exists today", () => {
    const internalHomeLinks = (["news", "timeless"] as const).flatMap((mode) => {
      const home = getHomeContent(mode);
      return [home.feature.cta.href, ...home.sections.flatMap((section) => section.items.filter((item) => item.type !== "internet").map((item) => item.href))];
    });

    expect(internalHomeLinks).toEqual([
      "/en/news/street-plan-daily-realities",
      "/en/timeless/how-cities-move",
      "/en/explore",
      "/en/explore",
      "/en/explore",
      "/en/explore"
    ]);
  });

  it("uses stable route paths for the editorial modes", () => {
    expect(getHomeModeHref("news")).toBe("/");
    expect(getHomeModeHref("timeless")).toBe("/en/timeless");
  });
});
