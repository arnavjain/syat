import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  GuidedOnboarding,
  getOnboardingProgressLabel,
  getOnboardingStepAriaCurrent,
  getSafeBrowserStorage,
} from "./guided-onboarding";

describe("guided onboarding storage", () => {
  it("stays available when reading the localStorage property throws", () => {
    const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

    try {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: {
          get localStorage(): never { throw new Error("storage is blocked"); },
        },
      });

      expect(getSafeBrowserStorage()).toBeUndefined();
    } finally {
      if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });

  it("announces completion honestly and only marks the active step as current", () => {
    expect(getOnboardingProgressLabel(true, 0, 5)).toBe("Guide completed");
    expect(getOnboardingProgressLabel(false, 2, 5)).toBe("Step 3 of 5");
    expect(getOnboardingStepAriaCurrent(2, 2, false)).toBe("step");
    expect(getOnboardingStepAriaCurrent(1, 2, false)).toBeUndefined();
    expect(getOnboardingStepAriaCurrent(0, 0, true)).toBeUndefined();
  });
});

describe("guided onboarding page", () => {
  it("prefers a real accepted preview and falls back to the labelled teaching story", async () => {
    const { getOnboardingExample } = await import("../app/en/onboarding/page");
    const { getNewsStoryIndexProjection } = await import("@/lib/reader-stories");
    const example = getOnboardingExample();
    const accepted = getNewsStoryIndexProjection();

    if (accepted.length > 0) {
      expect(example.isTeachingFixture).toBe(false);
      expect(accepted.map((story) => story.slug)).toContain(example.slug);
    } else {
      expect(example.slug).toBe("street-plan-daily-realities");
      expect(example.isTeachingFixture).toBe(true);
    }
  });

  it("renders Back, Next and Skip with the story action for the supplied example", () => {
    const html = renderToStaticMarkup(createElement(GuidedOnboarding, {
      example: { slug: "delhi-water-review", title: "A real accepted preview", isTeachingFixture: false }
    }));

    expect(html).toContain("Back");
    expect(html).toContain("Next");
    expect(html).toContain("Skip the guide");
    expect(html).toContain('href="/en/news/delhi-water-review#evidence"');
    expect(html).toContain("real accepted preview");
    expect(html).not.toContain("street-plan-daily-realities");
  });

  it("disables Back on the first step and moves focus to the step heading", () => {
    const html = renderToStaticMarkup(createElement(GuidedOnboarding, {
      example: { slug: "street-plan-daily-realities", title: "Teaching story", isTeachingFixture: true }
    }));

    expect(html).toMatch(/<button[^>]*disabled[^>]*>(?:<span[^>]*>←<\/span>)?\s*Back/u);
    expect(html).toContain('id="guided-onboarding-title"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain("clearly labelled fictional teaching story");
  });
});
