export const ONBOARDING_VERSION = 2;
export const ONBOARDING_STORAGE_KEY = `syat:onboarding:v${ONBOARDING_VERSION}:completed`;
const completionValue = `complete:v${ONBOARDING_VERSION}`;

export type OnboardingStepId =
  | "reading-layers"
  | "statement-basis"
  | "saving"
  | "context-bridge"
  | "reframe";

/** Where a step's real action goes. `story` targets the lead reading example. */
export type OnboardingAction = {
  label: string;
  target: { kind: "story"; fragment?: string } | { kind: "route"; href: string };
  note: string;
};

export type OnboardingStep = {
  id: OnboardingStepId;
  eyebrow: string;
  title: string;
  description: string;
  action: OnboardingAction;
  optional?: boolean;
};

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: "reading-layers",
    eyebrow: "The three layers",
    title: "Every Syāt story separates what is documented, what is interpreted, and what is unresolved.",
    description: "A record can establish that something was announced. It usually cannot establish how the announcement landed. Syāt keeps those apart instead of blending them into one confident voice.",
    action: {
      label: "See the three layers in a story",
      target: { kind: "story", fragment: "#evidence" },
      note: "Each statement is tagged documented, interpreted or unresolved, and coloured to match."
    }
  },
  {
    id: "statement-basis",
    eyebrow: "Check the basis",
    title: "Open any statement to see the evidence behind it and the limit on it.",
    description: "A source identifier names material you can inspect. It is not a badge that proves a claim. Opening the basis shows the source scope and what the record cannot settle.",
    action: {
      label: "Open a statement's basis",
      target: { kind: "story", fragment: "#source-trail" },
      note: "The source trail lists each record, what it supports, and how far it reaches."
    }
  },
  {
    id: "saving",
    eyebrow: "Saving, honestly",
    title: "Saving keeps a story on this device only.",
    description: "There is no account yet. Google sign-in is not available in this preview, so a saved story cannot follow you to another device or browser, and clearing site data clears your shelf.",
    action: {
      label: "Look at the shelf",
      target: { kind: "route", href: "/en/saved" },
      note: "When sign-in arrives it will be described plainly before anything syncs."
    }
  },
  {
    id: "context-bridge",
    eyebrow: "Follow the larger question",
    title: "The Context Bridge moves you from one event to the question underneath it.",
    description: "News follows a moment. Timeless keeps a public question open across places and years. The bridge is the deliberate step between them.",
    action: {
      label: "Cross into a Timeless question",
      target: { kind: "story", fragment: "#context-bridge-title" },
      note: "Each story names one Timeless topic it genuinely connects to."
    }
  },
  {
    id: "reframe",
    eyebrow: "Optional",
    title: "Reframe is there when you want to read something more carefully yourself.",
    description: "It builds a local reading plan from a claim or question you bring. Nothing you type is sent anywhere, and it is a quiet tool rather than the main way to use Syāt.",
    action: {
      label: "Try Reframe",
      target: { kind: "route", href: "/en/reframe" },
      note: "You can finish the guide without opening it."
    },
    optional: true
  }
];

export function onboardingActionHref(action: OnboardingAction, storyPath: string): string {
  return action.target.kind === "route" ? action.target.href : `${storyPath}${action.target.fragment ?? ""}`;
}

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
