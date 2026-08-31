import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { extractCagReportLinks, findCagJurisdiction, parseCagDate, parseCagReport } from "./cag-source-parser";
import { sourcePackSourceSchema } from "./source-pack";

const detail = readFileSync(new URL("./__fixtures__/cag-report-detail.html", import.meta.url), "utf8");
const url = "https://cag.gov.in/en/audit-report/details/126046";

describe("CAG report parser", () => {
  it("reads a real audit report page into a schema-valid reusable source", () => {
    const source = parseCagReport(detail, url, new Date("2026-09-01T00:00:00.000Z"));

    expect(() => sourcePackSourceSchema.parse(source)).not.toThrow();
    expect(source.id).toBe("cag-126046");
    expect(source.publisherId).toBe("cag");
    expect(source.sourceKind).toBe("audit_report");
    expect(source.title).toContain("Report No. 3 of 2026");
    expect(source.publishedAt).toBe("2026-08-11T00:00:00.000Z");
  });

  it("carries the audit's own overview as evidence, not the page's navigation", () => {
    const source = parseCagReport(detail, url, new Date("2026-09-01T00:00:00.000Z"));

    expect(source.evidenceText).toContain("Article 151 of the Constitution");
    expect(source.evidenceText.length).toBeGreaterThan(600);
    expect(source.evidenceText).not.toMatch(/About Us|Organisation Chart|Skip to|MENU/i);
  });

  it("decodes the punctuation entities CAG actually publishes", () => {
    const source = parseCagReport(detail, url, new Date("2026-09-01T00:00:00.000Z"));

    expect(source.evidenceText).not.toMatch(/&(?:ndash|rsquo|lsquo|mdash|nbsp|amp);/);
  });

  it("names the jurisdiction the audit is about", () => {
    expect(findCagJurisdiction("Performance Audit on Jal Jeevan Mission in Rajasthan")).toBe("Rajasthan");
    expect(findCagJurisdiction("State Finances, Government of Jharkhand")).toBe("Jharkhand");
    expect(findCagJurisdiction("A report with no place named")).toBeUndefined();
  });

  it("keeps the reviewed rights basis and refuses media reuse", () => {
    const source = parseCagReport(detail, url, new Date("2026-09-01T00:00:00.000Z"));

    expect(source.rightsBasis).toBe("government_reproduction_policy");
    expect(source.modelInputAllowed).toBe(true);
    expect(source.mediaReuseAllowed).toBe(false);
    expect(source.creditLine).toBe("Comptroller and Auditor General of India");
    expect(source.policyUrl).toBe("https://cag.gov.in/en/page-copyright");
  });

  it("fails loudly rather than inventing a missing field", () => {
    const accessedAt = new Date("2026-09-01T00:00:00.000Z");

    expect(() => parseCagReport(detail, "https://cag.gov.in/en/audit-report/details/", accessedAt)).toThrow(/report id/i);
    expect(() => parseCagReport(detail.replace(/singTitle/g, "otherTitle"), url, accessedAt)).toThrow(/title is missing/i);
    expect(() => parseCagReport(detail.replace(/Date on which Report Tabled/g, "Some other label"), url, accessedAt)).toThrow(/tabling date is missing/i);
    expect(() => parseCagReport(detail.replace(/<h4[^>]*>\s*Overview\s*<\/h4>/i, "<h4>Nothing</h4>"), url, accessedAt)).toThrow(/missing|too thin/i);
  });

  it("reads CAG's own date format and rejects anything else", () => {
    expect(parseCagDate("Tue 11 Aug, 2026")).toBe("2026-08-11T00:00:00.000Z");
    expect(parseCagDate("Fri 24 Apr, 2026")).toBe("2026-04-24T00:00:00.000Z");
    expect(() => parseCagDate("11/08/2026")).toThrow(/expected format/i);
    expect(() => parseCagDate("11 Xyz, 2026")).toThrow(/unknown month/i);
  });

  it("finds every report on a listing page without duplicates", () => {
    const listing = `
      <a href="/en/audit-report/details/126046">One</a>
      <a href="/en/audit-report/details/126046">One again</a>
      <a href="/en/audit-report/details/126055">Two</a>
      <a href="/en/page-copyright">Not a report</a>`;
    const links = extractCagReportLinks(listing);

    expect(links.map((link) => link.id)).toEqual(["126046", "126055"]);
    expect(links[0].url).toBe("https://cag.gov.in/en/audit-report/details/126046");
  });
});
