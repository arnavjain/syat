import { describe, expect, it } from "vitest";

import { getSafeBrowserStorage } from "./guided-onboarding";

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
});
