import { describe, expect, it } from "vitest";

import { publisherRegistry } from "./publisher-registry";
import { canEnterModelInput, governmentOpenDataUseDecision, pibUseDecision } from "./source-rights";

describe("source rights", () => {
  it("does not infer model permission from attribution or link permission", () => {
    expect(canEnterModelInput({ linkAllowed: true, modelInputAllowed: false, creditLine: "ThePrint" })).toBe(false);
  });

  it("records the exact policy behind reusable government text and data", () => {
    expect(pibUseDecision).toMatchObject({
      linkAllowed: true,
      modelInputAllowed: true,
      mediaReuseAllowed: false,
      rightsBasis: "government_reproduction_policy",
      policyUrl: "https://www.pib.gov.in/Content/102_2_Copyright-Policy.aspx?lang=1&reg=3"
    });
    expect(governmentOpenDataUseDecision).toMatchObject({
      linkAllowed: true,
      modelInputAllowed: true,
      mediaReuseAllowed: false,
      rightsBasis: "government_open_data",
      policyUrl: "https://ap.data.gov.in/godl"
    });
  });

  it("keeps every named newsroom link-only by default", () => {
    const newsroomIds = ["indian-express", "the-hindu", "the-print", "the-wire", "scroll", "mongabay-india", "ndtv"];
    for (const id of newsroomIds) {
      expect(publisherRegistry.find((publisher) => publisher.id === id)?.sourceUse).toMatchObject({
        linkAllowed: true,
        modelInputAllowed: false,
        mediaReuseAllowed: false,
        rightsBasis: "link_only"
      });
    }
  });
});
