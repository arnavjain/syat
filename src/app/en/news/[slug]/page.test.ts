import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { generateMetadata, getNewsRouteStaticParams } from "./page";

describe("News story route", () => {
  it("serves generated previews and the labelled teaching fixture from one route without duplicates", () => {
    const params = getNewsRouteStaticParams();
    const slugs = params.map((param) => param.slug);

    expect(slugs).toContain("street-plan-daily-realities");
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps every News page out of search indexes, including a slug that does not exist", async () => {
    const found = await generateMetadata({ params: Promise.resolve({ slug: "street-plan-daily-realities" }) });
    const missing = await generateMetadata({ params: Promise.resolve({ slug: "not-a-story" }) });

    expect(found.robots).toEqual({ index: false, follow: false });
    expect(missing.robots).toEqual({ index: false, follow: false });
    expect(missing.title).toBe("News preview not found");
  });

  it("describes a real preview with its own headline and standfirst", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "street-plan-daily-realities" }) });

    expect(metadata.title).toContain("Syāt");
    expect(String(metadata.description ?? "")).not.toHaveLength(0);
  });
});
