import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { generateMetadata, getNewsRouteStaticParams } from "./page";

describe("News story route", () => {
  it("serves generated stories and the worked teaching example from one route without duplicates", () => {
    const params = getNewsRouteStaticParams();
    const slugs = params.map((param) => param.slug);

    expect(slugs).toContain("street-plan-daily-realities");
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("leaves search indexing open now that the stories are published", async () => {
    const found = await generateMetadata({ params: Promise.resolve({ slug: "street-plan-daily-realities" }) });
    const missing = await generateMetadata({ params: Promise.resolve({ slug: "not-a-story" }) });

    expect(found.robots).toBeUndefined();
    expect(missing.robots).toBeUndefined();
    expect(missing.title).toBe("Story not found");
  });

  it("describes a real preview with its own headline and standfirst", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "street-plan-daily-realities" }) });

    expect(metadata.title).toContain("Syāt");
    expect(String(metadata.description ?? "")).not.toHaveLength(0);
  });
});
