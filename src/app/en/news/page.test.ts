import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReaderStoryIndexItem } from "@/lib/reader-story-schema";

const projection = vi.hoisted(() => ({ items: [] as ReaderStoryIndexItem[] }));

vi.mock("@/lib/reader-stories", () => ({
  getNewsStoryIndexProjection: () => projection.items
}));

const { default: NewsArchivePage } = await import("./page");

function card(overrides: Partial<ReaderStoryIndexItem> = {}): ReaderStoryIndexItem {
  return {
    slug: "delhi-water-review",
    title: "Delhi opens a new public review of neighbourhood water records",
    dek: "The review sets out what the official record can show and which local effects still need evidence.",
    theme: "Public services",
    format: "explainer",
    readingMinutes: 4,
    updatedAt: "2026-08-31T10:00:00.000Z",
    featured: false,
    ...overrides
  } as ReaderStoryIndexItem;
}

function render() {
  return renderToStaticMarkup(createElement(NewsArchivePage));
}

afterEach(() => {
  projection.items = [];
});

describe("News archive", () => {
  it("offers the worked example while nothing has been written yet", () => {
    const html = render();

    expect(html).toContain("What changed, and what the record can actually show.");
    expect(html).toContain("The first story is on its way.");
    expect(html).toContain('href="/en/news/street-plan-daily-realities"');
  });

  it("reads as a flat list while every story has a theme of its own", () => {
    // Generated stories invent their own theme, so grouping by it produced one heavy section
    // heading per story, each reading "1 preview".
    projection.items = [card(), card({ slug: "trai-consultation", title: "TRAI extends a consultation window", theme: "Regulation" })];
    const html = render();

    expect(html).toContain('class="news-flat-list"');
    expect(html).not.toContain('id="theme-public-services"');
    expect(html).toContain("Public services");
    expect(html).toContain('href="/en/news/delhi-water-review"');
    expect(html).toContain('href="/en/news/trai-consultation"');
  });

  it("groups by theme once a theme actually gathers more than one story", () => {
    projection.items = [
      card(),
      card({ slug: "delhi-water-two", title: "A second Delhi water record enters review" }),
      card({ slug: "trai-consultation", title: "TRAI extends a consultation window", theme: "Regulation" })
    ];
    const html = render();

    expect(html).toContain('id="theme-public-services"');
    expect(html).toContain('id="theme-regulation"');
    expect(html).toContain("2 stories");
    expect(html).not.toContain('class="news-flat-list"');
  });

  it("counts what is actually there rather than progress towards a target", () => {
    // The archive used to report a pilot's progress, which is a fact about the project rather
    // than about anything the reader came for.
    projection.items = Array.from({ length: 7 }, (_, index) => card({ slug: `story-${index}` }));
    const html = render();

    expect(html).toContain("Stories");
    expect(html).not.toMatch(/Target|Pilot in review|preview set/i);
  });

  it("never publishes a score, a confidence figure or a disagreement level", () => {
    // These are the fake precision the project exists to avoid. Removing the preview labelling
    // must not quietly let them in.
    projection.items = [card()];
    const html = render();

    expect(html).not.toMatch(/credibility|confidence score|disagreement level|% (?:verified|accurate)/i);
  });
});
