import { describe, expect, it } from "vitest";

import {
  isSensitiveNewsSignal,
  isSignalSnapshotCurrent,
  latestNewsSignals,
  newsSignalMetadata,
  previewNewsSignals,
  selectPublicPreviewSignals,
} from "./news-signals";

describe("news signal projection", () => {
  it("surfaces one hundred dated, link-only source signals without calling them published stories", () => {
    expect(newsSignalMetadata.itemCount).toBe(100);
    expect(latestNewsSignals).toHaveLength(100);
    expect(latestNewsSignals.every((item) => item.status === "needs_editorial_review" && item.rights === "link_only" && item.url.startsWith("https://"))).toBe(true);
  });

  it("keeps graphic or violent titles out of a public source-signal strip", () => {
    const graphicSignal = latestNewsSignals.find((signal) => signal.title.includes("Bullet-ridden body"));

    expect(graphicSignal).toBeDefined();
    expect(isSensitiveNewsSignal(graphicSignal!)).toBe(true);
    expect(previewNewsSignals.some((signal) => signal.id === graphicSignal?.id)).toBe(false);
  });

  it("keeps public source-signal previews empty until an explicit reviewed fixture ID is supplied", () => {
    const safeFixture = { ...latestNewsSignals[0]!, id: "reviewed-safe-fixture", title: "A reviewed fixture title" };
    const unreviewedSignal = { ...latestNewsSignals[0]!, id: "unreviewed-signal", title: "An ordinary intake title" };

    expect(selectPublicPreviewSignals([safeFixture, unreviewedSignal], ["reviewed-safe-fixture"])).toEqual([safeFixture]);
    expect(previewNewsSignals).toEqual([]);
  });

  it("does not call an expired source snapshot current for a public surface", () => {
    expect(isSignalSnapshotCurrent({ generatedAt: "2026-08-01T00:00:00.000Z", windowDays: 7 }, new Date("2026-08-31T00:00:00.000Z"))).toBe(false);
  });
});
