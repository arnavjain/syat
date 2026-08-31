import { describe, expect, it } from "vitest";

import { authoriseGenerationBudget } from "./generation-budget";

describe("authoriseGenerationBudget", () => {
  it("warns once authorised, reserved, and estimated spend reaches ₹1,000", () => {
    expect(authoriseGenerationBudget({ spentPaise: 90_000, reservedPaise: 5_000, estimatedPaise: 5_000 })).toMatchObject({
      status: "warning",
      reason: "warning_threshold_reached",
      authorisedTotalPaise: 100_000
    });
  });

  it("refuses a job that reaches the ₹1,400 monthly ceiling", () => {
    expect(authoriseGenerationBudget({ spentPaise: 130_000, reservedPaise: 5_000, estimatedPaise: 5_000 })).toMatchObject({
      status: "refused",
      reason: "monthly_cap_reached",
      authorisedTotalPaise: 140_000
    });
  });

  it.each([-1, 10.5, Number.NaN])("fails closed for malformed paise values: %s", (spentPaise) => {
    expect(authoriseGenerationBudget({ spentPaise, reservedPaise: 0, estimatedPaise: 1 })).toMatchObject({
      status: "refused",
      reason: "invalid_cost_input"
    });
  });

  it("includes spent, existing reservation, and the new maximum estimate", () => {
    expect(authoriseGenerationBudget({ spentPaise: 99_000, reservedPaise: 900, estimatedPaise: 99 })).toMatchObject({
      status: "allowed",
      authorisedTotalPaise: 99_999
    });
  });
});
