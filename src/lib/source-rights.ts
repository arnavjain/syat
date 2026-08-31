export type SourceUseDecision = {
  linkAllowed: boolean;
  modelInputAllowed: boolean;
  mediaReuseAllowed: boolean;
  rightsBasis: "link_only" | "government_reproduction_policy" | "government_open_data" | "explicit_licence";
  policyUrl: string;
  reviewedAt: string;
  creditLine: string;
};

export const PIB_COPYRIGHT_POLICY_URL = "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3";
export const GOVERNMENT_OPEN_DATA_POLICY_URL = "https://ap.data.gov.in/godl";
export const CAG_COPYRIGHT_POLICY_URL = "https://cag.gov.in/en/page-copyright";
export const CAG_RIGHTS_REVIEWED_AT = "2026-09-01T00:00:00.000Z";
export const SOURCE_RIGHTS_REVIEWED_AT = "2026-08-31T00:00:00.000Z";

export const pibUseDecision: SourceUseDecision = {
  linkAllowed: true,
  modelInputAllowed: true,
  mediaReuseAllowed: false,
  rightsBasis: "government_reproduction_policy",
  policyUrl: PIB_COPYRIGHT_POLICY_URL,
  reviewedAt: SOURCE_RIGHTS_REVIEWED_AT,
  creditLine: "Press Information Bureau, Government of India"
};

// Reviewed and approved by the owner on 1 September 2026. cag.gov.in/en/page-copyright
// permits reproduction free of charge, provided material is reproduced accurately, is not
// used in a derogatory manner or a misleading context, and the source is prominently
// acknowledged. It excludes material identified as a third party's copyright, so an audit
// report's embedded third-party content is never reusable under this decision.
export const cagUseDecision: SourceUseDecision = {
  linkAllowed: true,
  modelInputAllowed: true,
  mediaReuseAllowed: false,
  rightsBasis: "government_reproduction_policy",
  policyUrl: CAG_COPYRIGHT_POLICY_URL,
  reviewedAt: CAG_RIGHTS_REVIEWED_AT,
  creditLine: "Comptroller and Auditor General of India"
};

export const governmentOpenDataUseDecision: SourceUseDecision = {
  linkAllowed: true,
  modelInputAllowed: true,
  mediaReuseAllowed: false,
  rightsBasis: "government_open_data",
  policyUrl: GOVERNMENT_OPEN_DATA_POLICY_URL,
  reviewedAt: SOURCE_RIGHTS_REVIEWED_AT,
  creditLine: "Open Government Data Platform India"
};

export function linkOnlyUseDecision(creditLine: string, policyUrl: string): SourceUseDecision {
  return {
    linkAllowed: true,
    modelInputAllowed: false,
    mediaReuseAllowed: false,
    rightsBasis: "link_only",
    policyUrl,
    reviewedAt: SOURCE_RIGHTS_REVIEWED_AT,
    creditLine
  };
}

export function canEnterModelInput<T extends { modelInputAllowed: boolean }>(source: T): boolean {
  return source.modelInputAllowed === true;
}
