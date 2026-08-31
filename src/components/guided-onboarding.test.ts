import { describe, expect, it } from "vitest";

import {
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
    expect(getOnboardingProgressLabel(true, 0, 4)).toBe("Guide completed");
    expect(getOnboardingProgressLabel(false, 2, 4)).toBe("Step 3 of 4");
    expect(getOnboardingStepAriaCurrent(2, 2, false)).toBe("step");
    expect(getOnboardingStepAriaCurrent(1, 2, false)).toBeUndefined();
    expect(getOnboardingStepAriaCurrent(0, 0, true)).toBeUndefined();
  });
});
