export const ONBOARDING_VERSION = 1;
export const ONBOARDING_STORAGE_KEY = `syat:onboarding:v${ONBOARDING_VERSION}:completed`;
const completionValue = `complete:v${ONBOARDING_VERSION}`;

export type OnboardingStep = {
  id: "welcome" | "sources-and-viewpoints" | "news-and-timeless" | "save-and-reframe";
  eyebrow: string;
  title: string;
  description: string;
};

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: "welcome",
    eyebrow: "A slower way to read",
    title: "Syāt helps you hold more than one truth-shaped thing at once.",
    description: "A report, a person’s experience, and an open question can all matter. They are not the same kind of knowledge."
  },
  {
    id: "sources-and-viewpoints",
    eyebrow: "Sources and viewpoints",
    title: "See what a source supports, then notice who is looking.",
    description: "A source trail shows where a statement comes from. Viewpoints name the values and limits that shape what a person can see."
  },
  {
    id: "news-and-timeless",
    eyebrow: "Two reading rooms",
    title: "News follows a moment. Timeless keeps a question open.",
    description: "Use News for a current event. Use Timeless for a recurring public question that needs patience across places and time."
  },
  {
    id: "save-and-reframe",
    eyebrow: "Return when ready",
    title: "Save a question for later, or Reframe a claim more carefully.",
    description: "A shelf needs sign-in before it can remember anything. Reframe makes a local reading plan and does not send your text away."
  }
];

type BrowserStorage = Pick<Storage, "getItem" | "setItem">;

export function isOnboardingComplete(storage: BrowserStorage | null | undefined): boolean {
  try {
    return storage?.getItem(ONBOARDING_STORAGE_KEY) === completionValue;
  } catch {
    return false;
  }
}

export function markOnboardingComplete(storage: BrowserStorage | null | undefined): boolean {
  try {
    storage?.setItem(ONBOARDING_STORAGE_KEY, completionValue);
    return Boolean(storage);
  } catch {
    return false;
  }
}
