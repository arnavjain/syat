import { describe, expect, it } from "vitest";

import * as reframePlan from "./reframe-plan";

const { makeReframePlan } = reframePlan;

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

  it("names the supplied subject in the reading plan", () => {
    const plan = makeReframePlan("What does an archive leave out?", "text");

    expect(plan.state).toBe("ready_for_review");
    expect(plan.steps[0]?.description).toContain("What does an archive leave out?");
  });

  it("creates meaningfully different plans for different supplied subjects", () => {
    const archivePlan = makeReframePlan("What does an archive leave out?", "text");
    const waterPlan = makeReframePlan("Who gets water first?", "text");

    expect(archivePlan.steps.map((step) => step.description)).not.toEqual(waterPlan.steps.map((step) => step.description));
  });

  it("decodes, normalizes, and bounds untrusted query text", () => {
    const normalizeReframeInput = (reframePlan as typeof reframePlan & { normalizeReframeInput?: (value: string | null | undefined) => string }).normalizeReframeInput;

    expect(normalizeReframeInput?.("  What%20does%20an%20archive%20leave%20out%3F  ")).toBe("What does an archive leave out?");
    expect(normalizeReframeInput?.("%E0%A4%A")).toBe("%E0%A4%A");
    expect(normalizeReframeInput?.("a".repeat(500))).toHaveLength(320);
  });

  it("uses an approved catalogue question or an explicit claim as the initial input", () => {
    const resolveReframeInitialInput = (reframePlan as typeof reframePlan & { resolveReframeInitialInput?: (topic: string | null, claim: string | null) => { value: string; kind: string } }).resolveReframeInitialInput;

    expect(resolveReframeInitialInput?.("archive-silence", null)).toEqual({ value: "What does an archive leave out?", kind: "topic" });
    expect(resolveReframeInitialInput?.("archive-silence", "  A%20different%20claim  ")).toEqual({ value: "A different claim", kind: "claim" });
  });
});
