import { describe, expect, it } from "vitest";

import { composeContestedPack, concentrationWarnings, selectRelatedCoverage, type CoverageSignal } from "./contested-pack";
import { cagUseDecision, pibUseDecision } from "./source-rights";
import type { SourcePack, SourcePackSource } from "./source-pack";

function auditSource(overrides: Partial<SourcePackSource> = {}): SourcePackSource {
  return {
    id: "cag-126046",
    publisherId: "cag",
    publisher: "Comptroller and Auditor General of India",
    title: "Report No. 3 of 2026: State Finances of Jharkhand",
    url: "https://cag.gov.in/en/audit-report/details/126046",
    sourceKind: "audit_report",
    publishedAt: "2026-08-11T00:00:00.000Z",
    accessedAt: "2026-09-01T00:00:00.000Z",
    evidenceText: "The audit comments on the quality of accounts rendered by Jharkhand departments and on non-compliance with prescribed financial rules.",
    ...cagUseDecision,
    ...overrides
  } as SourcePackSource;
}

function signal(overrides: Partial<CoverageSignal> = {}): CoverageSignal {
  return {
    id: "signal-abc123",
    title: "Jharkhand accounts questioned as audit flags financial rules compliance",
    url: "https://www.thehindu.com/news/national/jharkhand-audit/article1.ece",
    publisher: "The Hindu",
    publishedAt: "2026-08-12T00:00:00.000Z",
    accessedAt: "2026-09-01T00:00:00.000Z",
    ...overrides
  };
}

describe("related coverage", () => {
  it("credits newsroom links without ever letting them become model input", () => {
    const coverage = selectRelatedCoverage({ title: "Jharkhand state finances audit", sources: [auditSource()] }, [signal()]);

    expect(coverage).toHaveLength(1);
    expect(coverage[0].publisher).toBe("The Hindu");
    expect(coverage[0].modelInputAllowed).toBe(false);
    expect(coverage[0].evidenceText).toBe("");
    expect(coverage[0].rightsBasis).toBe("link_only");
  });

  it("spreads coverage across publishers instead of stacking one newsroom", () => {
    const signals = [
      signal({ id: "signal-1", publisher: "The Hindu" }),
      signal({ id: "signal-2", publisher: "The Hindu" }),
      signal({ id: "signal-3", publisher: "The Times of India" }),
      signal({ id: "signal-4", publisher: "OpIndia" }),
      signal({ id: "signal-5", publisher: "Frontline" })
    ];
    const publishers = selectRelatedCoverage({ title: "Jharkhand state finances audit", sources: [auditSource()] }, signals).map((item) => item.publisher);

    expect(new Set(publishers).size).toBe(publishers.length);
    expect(publishers).toContain("OpIndia");
    expect(publishers).toContain("Frontline");
  });

  it("ignores an unrelated headline and an unregistered publisher", () => {
    const unrelated = signal({ id: "signal-x", title: "Mumbai monsoon disrupts suburban trains" });
    const unknown = signal({ id: "signal-y", publisher: "Some Unregistered Blog" });

    expect(selectRelatedCoverage({ title: "Jharkhand state finances audit", sources: [auditSource()] }, [unrelated, unknown])).toHaveLength(0);
  });
});

describe("contested pack composition", () => {
  it("keeps a real India connection instead of a boilerplate line", () => {
    const pack = composeContestedPack({
      id: "jharkhand-state-finances-2026",
      title: "What Jharkhand's own accounts do and do not show for 2024-25",
      indiaConnection: "The audit concerns how a state government in India records public money, and what a resident could verify.",
      sources: [auditSource()],
      signals: [signal()],
      collectedAt: "2026-09-01T00:00:00.000Z"
    });

    expect(pack.indiaConnection).not.toMatch(/This release is an official Government of India public record/);
    expect(pack.indiaConnection).toMatch(/India/);
    expect(pack.relatedCoverage).toHaveLength(1);
  });

  it("pairs an audit with an institution's own statement so the records can disagree", () => {
    const departmentClaim = auditSource({
      id: "pib-2304410",
      publisherId: "pib",
      publisher: "Press Information Bureau",
      title: "Department reports improved financial reporting",
      url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304410",
      sourceKind: "official_statement",
      evidenceText: "The department states that its financial reporting practices improved during the year under review.",
      ...pibUseDecision
    });
    const pack = composeContestedPack({
      id: "jharkhand-accounts-dispute",
      title: "An audit and a department describe the same accounts differently",
      indiaConnection: "Two Indian public records describe the same state accounts, and they do not agree.",
      sources: [auditSource(), departmentClaim],
      signals: [signal()],
      collectedAt: "2026-09-01T00:00:00.000Z"
    });

    expect(pack.sources.map((source) => source.sourceKind).sort()).toEqual(["audit_report", "official_statement"]);
    expect(pack.sources.every((source) => source.modelInputAllowed)).toBe(true);
  });
});

describe("concentration warnings", () => {
  function pack(coveragePublishers: readonly string[], kinds: readonly SourcePackSource["sourceKind"][]): SourcePack {
    return {
      contractVersion: "syat.source-pack.v1",
      id: "pack",
      title: "A pack",
      indiaConnection: "An Indian public record.",
      collectedAt: "2026-09-01T00:00:00.000Z",
      sources: kinds.map((sourceKind, index) => auditSource({ id: `src-${index}`, sourceKind })),
      relatedCoverage: coveragePublishers.map((publisher, index) => ({ publisher, id: `c-${index}` }))
    } as unknown as SourcePack;
  }

  it("warns when one newsroom or one kind of record dominates", () => {
    const warnings = concentrationWarnings([pack(["The Hindu", "The Hindu", "The Hindu", "OpIndia"], ["audit_report", "audit_report", "audit_report"])]);

    expect(warnings.some((warning) => warning.kind === "publisher" && warning.name === "The Hindu")).toBe(true);
    expect(warnings.some((warning) => warning.kind === "source_role" && warning.name === "audit_report")).toBe(true);
  });

  it("stays quiet on a balanced batch and never labels a publisher's politics", () => {
    const warnings = concentrationWarnings([pack(["The Hindu", "OpIndia", "Frontline", "Organiser"], ["audit_report", "official_statement", "government_open_data"])]);

    expect(warnings).toHaveLength(0);
    expect(JSON.stringify(warnings)).not.toMatch(/left|right|centre|bias/i);
  });
});
