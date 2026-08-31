import { describe, expect, it } from "vitest";

import {
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  isOnboardingComplete,
  markOnboardingComplete,
  onboardingSteps,
} from "./onboarding";

function makeStorage(initialValue: string | null = null) {
  const values = new Map<string, string>();
  if (initialValue) values.set(ONBOARDING_STORAGE_KEY, initialValue);

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, nextValue: string) => { values.set(key, nextValue); },
  };
}

describe("guided onboarding", () => {
  it("keeps the four reading lessons in their intended order", () => {
    expect(onboardingSteps.map((step) => step.id)).toEqual([
      "welcome",
      "sources-and-viewpoints",
      "news-and-timeless",
      "save-and-reframe",
    ]);
  });

  it("gives a first-time reader one concrete fixture practice instead of an abstract promise", () => {
    const practice = onboardingSteps.find((step) => step.id === "sources-and-viewpoints");

    expect(onboardingSteps[0]?.title).not.toMatch(/truth-shaped thing/i);
    expect(practice?.description).toMatch(/identify a documented statement/i);
    expect(practice?.description).toMatch(/open its source note/i);
    expect(practice?.description).toMatch(/different viewpoint/i);
  });

  it("writes and recognises only the current versioned completion marker", () => {
    const storage = makeStorage();

    expect(ONBOARDING_STORAGE_KEY).toContain(`v${ONBOARDING_VERSION}`);
    expect(isOnboardingComplete(storage)).toBe(false);
    expect(markOnboardingComplete(storage)).toBe(true);
    expect(storage.getItem(ONBOARDING_STORAGE_KEY)).toBe(`complete:v${ONBOARDING_VERSION}`);
    expect(isOnboardingComplete(storage)).toBe(true);
    expect(isOnboardingComplete(makeStorage("an-old-version"))).toBe(false);
  });

  it("keeps reading available when browser storage cannot be used", () => {
    const unavailableStorage = {
      getItem: () => { throw new Error("storage is unavailable"); },
      setItem: () => { throw new Error("storage is unavailable"); },
    };

    expect(isOnboardingComplete(unavailableStorage)).toBe(false);
    expect(markOnboardingComplete(unavailableStorage)).toBe(false);
  });
});
