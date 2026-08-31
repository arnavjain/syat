import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

function rule(selector: string, source = css): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return Array.from(source.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gu"))).at(-1)?.[1] ?? "";
}

const coarsePointerCss = css
  .split("\n")
  .filter((line) => !line.includes("@media (hover: hover) and (pointer: fine)"))
  .join("\n");

describe("global accessibility and interaction CSS", () => {
  it("uses the readable hibiscus token for every small editorial text role", () => {
    for (const selector of [".evidence-card.interpreted > p", ".perspective-section dt", ".topic-card > p"]) {
      expect(rule(selector)).toContain("color: var(--hibiscus-text)");
    }
  });

  it("keeps transform hover lifts out of coarse-pointer base rules", () => {
    for (const selector of [".story-teaser:hover", ".topic-card:hover", ".story-return-action:hover", ".topic-picker-button:hover"]) {
      expect(rule(selector, coarsePointerCss)).not.toContain("transform:");
    }
  });

  it("gives story-orientation links their own comfortable navigation target", () => {
    const orientationLink = rule(".story-orientation a");
    expect(orientationLink).toContain("display: inline-flex");
    expect(orientationLink).toContain("min-height: 44px");
    expect(orientationLink).toContain("padding:");
  });
});
