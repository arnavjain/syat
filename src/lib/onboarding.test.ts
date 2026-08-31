import { describe, expect, it } from "vitest";

import {
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  isOnboardingComplete,
  markOnboardingComplete,
  onboardingActionHref,
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
  it("walks the reader through the real actions in the order the product uses them", () => {
    expect(onboardingSteps.map((step) => step.id)).toEqual([
      "reading-layers",
      "statement-basis",
      "saving",
      "context-bridge",
      "reframe",
    ]);
  });

  it("gives every step one concrete action rather than an abstract promise", () => {
    for (const step of onboardingSteps) {
      expect(step.action.label.length).toBeGreaterThan(0);
      expect(step.action.note.length).toBeGreaterThan(0);
      expect(onboardingActionHref(step.action, "/en/news/example")).toMatch(/^\/en\//u);
    }

    // The first step must name all three reading layers, wherever it says them.
    const firstStep = `${onboardingSteps[0].title} ${onboardingSteps[0].description}`;
    for (const layer of [/documented/i, /interpreted/i, /unresolved/i]) expect(firstStep).toMatch(layer);
  });

  it("points story actions at the supplied reading example instead of a hardcoded slug", () => {
    const layers = onboardingSteps[0];
    const saving = onboardingSteps.find((step) => step.id === "saving")!;

    expect(onboardingActionHref(layers.action, "/en/news/delhi-water-review")).toBe("/en/news/delhi-water-review#evidence");
    expect(onboardingActionHref(saving.action, "/en/news/delhi-water-review")).toBe("/en/saved");
  });

  it("says sign-in is unavailable and never implies a working account", () => {
    const saving = onboardingSteps.find((step) => step.id === "saving")!;
    const everyWord = onboardingSteps.map((step) => `${step.title} ${step.description} ${step.action.note}`).join(" ");

    expect(saving.description).toMatch(/not available/i);
    expect(saving.title).toMatch(/this device only/i);
    expect(everyWord).not.toMatch(/sign in to sync|your account|signed in|connect your google/i);
  });

  it("marks Reframe optional so it never reads as the main way to use Syāt", () => {
    const reframe = onboardingSteps.find((step) => step.id === "reframe")!;

    expect(reframe.optional).toBe(true);
    expect(reframe).toBe(onboardingSteps.at(-1));
    expect(onboardingSteps.filter((step) => step.optional).length).toBe(1);
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
