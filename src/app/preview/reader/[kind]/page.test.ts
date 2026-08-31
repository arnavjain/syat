import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import ReaderPreviewPage, { buildReaderPreviewStory, getReaderPreviewStaticParams, isAuthoredVisualKind, metadata } from "./page";

describe("reader design-review route", () => {
  it("covers every authored visual kind so each layout can be reviewed in a browser", () => {
    expect(getReaderPreviewStaticParams().map((param) => param.kind)).toEqual([
      "timeline",
      "process",
      "relationship_map",
      "source_role_map",
      "number_stack",
      "comparison"
    ]);
  });

  it("stays out of search indexes and rejects an unknown kind", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(isAuthoredVisualKind("timeline")).toBe(true);
    expect(isAuthoredVisualKind("bar_chart")).toBe(false);
  });

  it("keeps the review fixture unpublishable whichever visual is requested", () => {
    for (const { kind } of getReaderPreviewStaticParams()) {
      const story = buildReaderPreviewStory(kind);
      expect(story.status).toBe("private_preview");
      expect(story.publicationAllowed).toBe(false);
      expect(story.authoredVisual.kind).toBe(kind);
    }
  });

  it("says plainly that the page is a fixture rather than reporting", async () => {
    const html = renderToStaticMarkup(await ReaderPreviewPage({ params: Promise.resolve({ kind: "comparison" }) }));

    expect(html).toContain("This page renders a fixture, not reporting.");
    expect(html).toContain("Design review only");
  });

  it("renders no external image or embed while no media has cleared rights review", async () => {
    const html = renderToStaticMarkup(await ReaderPreviewPage({ params: Promise.resolve({ kind: "source_role_map" }) }));

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<embed");
  });
});
