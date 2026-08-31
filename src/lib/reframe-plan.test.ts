import { describe, expect, it } from "vitest";

import * as reframePlan from "./reframe-plan";

const { makeReframePlan } = reframePlan;

describe("reframe plan", () => {
  it("does not claim to analyse an empty submission", () => {
    expect(makeReframePlan("").state).toBe("needs_input");
  });

  it("routes supplied text into a local, consent-first review flow", () => {
    const plan = makeReframePlan("A short claim from a post");

    expect(plan.state).toBe("ready_for_review");
    expect(plan.steps.map((step) => step.id)).toEqual(["extract", "separate", "trace", "question"]);
    expect(plan.steps.every((step) => step.sendsOriginalFile === false)).toBe(true);
  });

  it("names the supplied subject in the reading plan", () => {
    const plan = makeReframePlan("What does an archive leave out?");

    expect(plan.state).toBe("ready_for_review");
    expect(plan.steps[0]?.description).toContain("What does an archive leave out?");
  });

  it("creates meaningfully different plans for different supplied subjects", () => {
    const archivePlan = makeReframePlan("What does an archive leave out?");
    const waterPlan = makeReframePlan("Who gets water first?");

    expect(archivePlan.steps.map((step) => step.description)).not.toEqual(waterPlan.steps.map((step) => step.description));
  });

  it("re-classifies edited input and makes editable evidence, interpretation, and unresolved slots", () => {
    const claimPlan = makeReframePlan("The bus lane reduced commute times.") as unknown as { inputKind?: string; statements?: string[]; slots?: Array<{ id: string; editable: boolean }> };
    const questionPlan = makeReframePlan("Did the bus lane reduce commute times?") as unknown as { inputKind?: string; statements?: string[]; slots?: Array<{ id: string; editable: boolean }> };
    const passagePlan = makeReframePlan("The bus lane opened. Shopkeepers asked for a delivery window.") as unknown as { inputKind?: string; statements?: string[]; slots?: Array<{ id: string; editable: boolean }> };

    expect(claimPlan.inputKind).toBe("claim");
    expect(questionPlan.inputKind).toBe("question");
    expect(passagePlan.inputKind).toBe("passage");
    expect(passagePlan.statements).toEqual(["The bus lane opened.", "Shopkeepers asked for a delivery window."]);
    expect(claimPlan.slots).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "documented", editable: true }),
      expect.objectContaining({ id: "interpretation", editable: true }),
      expect.objectContaining({ id: "unresolved", editable: true }),
    ]));
  });

  it("normalizes and bounds already-decoded query text", () => {
    const normalizeReframeInput = (reframePlan as typeof reframePlan & { normalizeReframeInput?: (value: string | null | undefined) => string }).normalizeReframeInput;

    expect(normalizeReframeInput?.("  C++ is useful  ")).toBe("C++ is useful");
    expect(normalizeReframeInput?.("A %25 saving is still visible")).toBe("A %25 saving is still visible");
    expect(normalizeReframeInput?.("A malformed % claim stays visible")).toBe("A malformed % claim stays visible");
    expect(normalizeReframeInput?.("a".repeat(500))).toHaveLength(320);
  });

  it("uses an approved catalogue question or an explicit claim as the initial input", () => {
    const resolveReframeInitialInput = (reframePlan as typeof reframePlan & { resolveReframeInitialInput?: (topic: string | null, claim: string | null) => { value: string; kind: string } }).resolveReframeInitialInput;

    expect(resolveReframeInitialInput?.("archive-silence", null)).toEqual({ value: "What does an archive leave out?", kind: "topic" });
    expect(resolveReframeInitialInput?.("archive-silence", "  A different claim  ")).toEqual({ value: "A different claim", kind: "claim" });
    expect(resolveReframeInitialInput?.(null, "C++ is useful")).toEqual({ value: "C++ is useful", kind: "claim" });
  });
});
