import { describe, expect, it } from "vitest";

import { makeReframePlan } from "./reframe-plan";

describe("reframe plan", () => {
  it("does not claim to analyse an empty submission", () => {
    expect(makeReframePlan("").state).toBe("needs_input");
  });

  it("routes supplied text into a local, consent-first review flow", () => {
    const plan = makeReframePlan("A short claim from a post", "text");

    expect(plan.state).toBe("ready_for_review");
    expect(plan.steps.map((step) => step.id)).toEqual(["extract", "separate", "trace", "question"]);
    expect(plan.steps.every((step) => step.sendsOriginalFile === false)).toBe(true);
  });
});
