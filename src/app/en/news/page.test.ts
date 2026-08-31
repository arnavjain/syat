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
  it("offers the labelled teaching story while no generated preview has passed its gate", () => {
    const html = render();

    expect(html).toContain("The News pilot, kept in one clear index.");
    expect(html).toContain("The first pilot story is still being checked.");
    expect(html).toContain('href="/en/news/street-plan-daily-realities"');
    expect(html).not.toContain("One hundred News previews");
  });

  it("files accepted previews under their theme and links each story page", () => {
    projection.items = [card(), card({ slug: "trai-consultation", title: "TRAI extends a consultation window", theme: "Regulation" })];
    const html = render();

    expect(html).toContain('id="theme-public-services"');
    expect(html).toContain('id="theme-regulation"');
    expect(html).toContain('href="/en/news/delhi-water-review"');
    expect(html).toContain('href="/en/news/trai-consultation"');
    expect(html).not.toContain("The first pilot story is still being checked.");
  });

  it("claims a complete preview set only at exactly one hundred accepted pages", () => {
    projection.items = Array.from({ length: 99 }, (_, index) => card({ slug: `story-${index}` }));
    expect(render()).not.toContain("One hundred News previews");

    projection.items = Array.from({ length: 100 }, (_, index) => card({ slug: `story-${index}` }));
    const complete = render();
    expect(complete).toContain("One hundred News previews");
    expect(complete).toContain("Preview set complete");
  });

  it("labels every accepted preview as AI-assisted and never publishes a score or confidence figure", () => {
    projection.items = [card()];
    const html = render();

    expect(html).toContain("AI-assisted private preview");
    expect(html).not.toMatch(/credibility|confidence score|disagreement level|% (?:verified|accurate)/i);
  });
});
