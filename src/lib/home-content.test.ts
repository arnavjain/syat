import { describe, expect, it } from "vitest";

import NewsHomePage from "../app/page";
import ExplorePage from "../app/en/explore/page";
import TimelessHomePage from "../app/en/timeless/page";

import { getHomeContent, getHomeModeHref, isCurrentFixtureDestination } from "./home-content";

describe("getHomeContent", () => {
  it("opens in News with a current-story reading path", () => {
    const home = getHomeContent("news");

    expect(home.modeLabel).toBe("News");
    expect(home.feature.cta.href).toMatch(/^\/en\/news\//);
    expect(home.sections.some((section) => section.title === "Reframe")).toBe(false);
  });

  it("does not hardcode a source-intake count on the public News introduction", () => {
    const sourceDesk = getHomeContent("news").sections.find((section) => section.title === "Source desk preview");

    expect(sourceDesk?.intro).not.toMatch(/\bone hundred\b|\b100\b/i);
  });

  it("switches to a separate Timeless editorial path", () => {
    const home = getHomeContent("timeless");

    expect(home.modeLabel).toBe("Timeless");
    expect(home.feature.cta.href).toMatch(/^\/en\/timeless\//);
    expect(home.feature.kicker).toContain("Timeless");
  });

  it("backs every internal home link with a live static page or matching fixture", () => {
    const internalHomeLinks = (["news", "timeless"] as const).flatMap((mode) => {
      const home = getHomeContent(mode);
      return [home.feature.cta.href, ...home.sections.flatMap((section) => section.items.filter((item) => item.type !== "internet").map((item) => item.href))];
    });
    const staticPages = new Map([
      [getHomeModeHref("news"), NewsHomePage],
      [getHomeModeHref("timeless"), TimelessHomePage],
      ["/en/explore", ExplorePage]
    ]);
    const fixtureLinks = internalHomeLinks.filter((href) => href !== "/en/explore");

    for (const page of staticPages.values()) {
      expect(page).toBeTypeOf("function");
    }
    expect(internalHomeLinks.filter((href) => href === "/en/explore")).toHaveLength(4);
    expect(fixtureLinks.every(isCurrentFixtureDestination)).toBe(true);
    expect(isCurrentFixtureDestination("/en/news/not-a-fixture")).toBe(false);
    expect(isCurrentFixtureDestination("/en/timeless/not-a-fixture")).toBe(false);
  });

  it("uses stable route paths for the editorial modes", () => {
    const modePaths = [getHomeModeHref("news"), getHomeModeHref("timeless")];

    expect(modePaths).toEqual(["/", "/en/timeless"]);
  });
});
