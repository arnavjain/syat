import { describe, expect, it } from "vitest";

import { deduplicateSourcePacks, sourcePackSchema, validatePreviewSourcePack } from "./source-pack";
import { pibUseDecision } from "./source-rights";

const headlineOnlySource = {
  id: "the-print-example",
  publisherId: "the-print",
  publisher: "ThePrint",
  title: "A related report",
  url: "https://theprint.in/example",
  sourceKind: "reputable_reporting" as const,
  publishedAt: "2026-08-31T00:00:00.000Z",
  accessedAt: "2026-08-31T12:00:00.000Z",
  evidenceText: "",
  linkAllowed: true,
  modelInputAllowed: false,
  mediaReuseAllowed: false,
  rightsBasis: "link_only" as const,
  policyUrl: "https://theprint.in/",
  reviewedAt: "2026-08-31T00:00:00.000Z",
  creditLine: "ThePrint"
};

const reusableSource = {
  id: "pib-2305021",
  publisherId: "pib",
  publisher: "Press Information Bureau",
  title: "Century-old limit on turning heat into electricity surpassed",
  url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305021",
  sourceKind: "official_statement" as const,
  publishedAt: "2026-08-31T00:00:00.000Z",
  accessedAt: "2026-08-31T12:00:00.000Z",
  evidenceText: "Researchers reported a thermoelectric result with an explicit measurement and an India connection.",
  ...pibUseDecision
};

function makePack(overrides: Record<string, unknown> = {}) {
  return {
    contractVersion: "syat.source-pack.v1",
    id: "pib-2305021",
    title: reusableSource.title,
    indiaConnection: "The result was announced by an Indian government science ministry.",
    collectedAt: "2026-08-31T12:00:00.000Z",
    sources: [reusableSource],
    relatedCoverage: [headlineOnlySource],
    ...overrides
  };
}

describe("source packs", () => {
  it("requires reusable evidence and an explicit India connection", () => {
    const result = sourcePackSchema.safeParse(makePack({ indiaConnection: "", sources: [headlineOnlySource] }));
    expect(result.success).toBe(false);
  });

  it("does not let related newsroom links fill the model-input evidence requirement", () => {
    expect(() => validatePreviewSourcePack(makePack({ sources: [], relatedCoverage: [headlineOnlySource] }))).toThrow(
      "The source pack has no evidence permitted for model input."
    );
  });

  it("rejects a link-only decision relabelled as model-input permission", () => {
    const relabelled = { ...reusableSource, rightsBasis: "link_only" as const };
    expect(sourcePackSchema.safeParse(makePack({ sources: [relabelled] })).success).toBe(false);
  });

  it("rejects titles outside the unattended preview risk boundary", () => {
    const blockedTitles = [
      "Police investigate alleged child sexual abuse",
      "Graphic violence reported after overnight clashes",
      "Unverified communal rumour spreads across district",
      "New medical treatment advice issued for patients",
      "Programme centred on minors begins this week",
      "Officials make live election vote-count claim",
      "Allegation against private individual is investigated"
    ];
    for (const title of blockedTitles) {
      expect(() => validatePreviewSourcePack(makePack({ title }))).toThrow(
        "The source pack is outside the unattended preview risk boundary."
      );
    }
  });

  it("deduplicates exact source URLs and strongly similar event titles", () => {
    const sameUrl = makePack({ id: "same-url", title: "A different label for the same release" });
    const sameEvent = makePack({
      id: "same-event",
      title: "Century old heat to electricity limit surpassed",
      sources: [{ ...reusableSource, id: "pib-2305022", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305022" }]
    });
    expect(deduplicateSourcePacks([makePack(), sameUrl, sameEvent].map(validatePreviewSourcePack))).toEqual([validatePreviewSourcePack(makePack())]);
  });

  it("keeps distinct events", () => {
    const other = makePack({
      id: "pib-2306000",
      title: "New coastal wetland restoration programme begins in Odisha",
      sources: [{ ...reusableSource, id: "pib-2306000", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2306000" }]
    });
    expect(deduplicateSourcePacks([makePack(), other].map(validatePreviewSourcePack))).toHaveLength(2);
  });
});
