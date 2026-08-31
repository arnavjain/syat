import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

function rule(selector: string, source = css): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return Array.from(source.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gu"))).at(-1)?.[1] ?? "";
}

function baseRule(selector: string, source = css): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return Array.from(source.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gu"))).at(0)?.[1] ?? "";
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

describe("Warm Commons reader CSS", () => {
  it("keeps the mobile story rail a single scrolling row instead of a two-row grid", () => {
    const mobileRail = Array.from(css.matchAll(/@media \(max-width: 720px\)\s*\{([\s\S]*?)\n\}/gu))
      .map((match) => match[1])
      .filter((block) => block.includes(".story-rail {"))
      .join("\n");

    expect(mobileRail).toContain("flex-wrap: nowrap");
    expect(mobileRail).not.toMatch(/\.story-rail \{[^}]*display: grid/u);
    expect(mobileRail).toMatch(/\.story-rail a \{[^}]*min-height: 44px/u);
  });

  it("scopes each authored-visual layout to the visual field", () => {
    // story-visual.tsx puts `visual-${kind}` on the <figure> and reuses the same names on the
    // inner content element. An unscoped rule matches the figure too and overrides the lead surface.
    for (const layout of ["visual-sequence", "visual-process", "visual-relationships", "visual-source-roles", "visual-number-stack", "visual-comparison"]) {
      expect(css).toContain(`.reader-visual-field .${layout}`);
      expect(css).not.toMatch(new RegExp(`(?<!reader-visual-field )\\.${layout}\\b`, "u"));
    }
  });

  it("holds each evidence layer to its recorded colour role", () => {
    expect(rule(".reader-evidence-row")).toContain("border-left: 3px solid var(--cobalt)");
    expect(rule(".reader-evidence-row.evidence-interpreted")).toContain("var(--hibiscus)");
    expect(rule(".reader-evidence-row.evidence-unresolved")).toContain("var(--teal)");
    expect(rule(".evidence-interpreted .reader-evidence-type")).toContain("var(--hibiscus-text)");
    expect(rule(".evidence-unresolved .reader-evidence-type")).toContain("var(--teal)");
  });

  it("uses exactly one lead surface radius in the reader and reads in Spectral on Home", () => {
    expect(baseRule(".reader-authored-visual")).toContain("border-radius: var(--radius-lead)");
    expect(baseRule(".home-intro h1")).toContain("font-family: var(--font-editorial)");
    expect(css).not.toMatch(/\.home-intro h1 \{[^}]*text-transform: uppercase/u);
    // A line advance below 1 crowds Spectral's ascenders and descenders into each other.
    for (const declaration of [baseRule(".home-intro h1"), rule(".home-intro h1")]) {
      const lineHeight = Number(/line-height:\s*([\d.]+)/u.exec(declaration)?.[1] ?? "1");
      expect(lineHeight).toBeGreaterThanOrEqual(1);
    }
  });

  it("gives every source citation a comfortable target and lets anchors clear the sticky rail", () => {
    expect(css).toMatch(/\.story-paragraph-sources a,[\s\S]{0,320}min-height: 44px/u);
    expect(rule(".reader-source-list article[id]")).toContain("scroll-margin-top: 122px");
    expect(css).toContain("#story-body, #evidence");
  });
});
