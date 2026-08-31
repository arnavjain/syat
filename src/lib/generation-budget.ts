export const MONTHLY_AI_WARNING_PAISE = 100_000;
export const MONTHLY_AI_HARD_CAP_PAISE = 140_000;

export type GenerationBudgetInput = {
  spentPaise: number;
  reservedPaise: number;
  estimatedPaise: number;
};

export type GenerationBudgetDecision = {
  status: "allowed" | "warning" | "refused";
  reason: "within_monthly_cap" | "warning_threshold_reached" | "monthly_cap_reached" | "invalid_cost_input";
  authorisedTotalPaise: number | null;
};

function isPaise(value: number) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function authoriseGenerationBudget({
  spentPaise,
  reservedPaise,
  estimatedPaise
}: GenerationBudgetInput): GenerationBudgetDecision {
  if (![spentPaise, reservedPaise, estimatedPaise].every(isPaise)) {
    return {
      status: "refused",
      reason: "invalid_cost_input",
      authorisedTotalPaise: null
    };
  }

  const authorisedTotalPaise = spentPaise + reservedPaise + estimatedPaise;
  if (!Number.isSafeInteger(authorisedTotalPaise)) {
    return {
      status: "refused",
      reason: "invalid_cost_input",
      authorisedTotalPaise: null
    };
  }

  if (authorisedTotalPaise >= MONTHLY_AI_HARD_CAP_PAISE) {
    return {
      status: "refused",
      reason: "monthly_cap_reached",
      authorisedTotalPaise
    };
  }

  if (authorisedTotalPaise >= MONTHLY_AI_WARNING_PAISE) {
    return {
      status: "warning",
      reason: "warning_threshold_reached",
      authorisedTotalPaise
    };
  }

  return {
    status: "allowed",
    reason: "within_monthly_cap",
    authorisedTotalPaise
  };
}
