import { describe, expect, it } from "vitest";

import { applyRepairPatch, buildRepairPrompt, collectRepairTargets } from "./draft-repair";
import { findCloseCopyMatches, parseGeneratedStoryV2, type GeneratedStoryV2, type SourceDossierRecord } from "./generation-contract";

const evidence = "The audit examined the implementation of the rural employment guarantee scheme in the district and found that muster rolls were not maintained in the prescribed manner during the period under review. It was placed before the legislature on 11 August 2026.";

const dossier: SourceDossierRecord[] = [{
  id: "audit-record", publisherId: "cag", publisher: "Comptroller and Auditor General of India", title: "Audit of the district scheme",
  url: "https://cag.gov.in/en/audit-report/details/126028", sourceKind: "audit_report",
  publishedAt: "2026-08-11T00:00:00.000Z", accessedAt: "2026-09-01T00:00:00.000Z",
  evidenceText: evidence,
  linkAllowed: true, modelInputAllowed: true, mediaReuseAllowed: false, rightsBasis: "government_reproduction_policy",
  policyUrl: "https://cag.gov.in/en/page-copyright", reviewedAt: "2026-09-01T00:00:00.000Z",
  creditLine: "Comptroller and Auditor General of India"
}];

/** A draft whose opening paragraph copies a seven-token run, which is the real failure mode. */
function makeCopyingDraft(): GeneratedStoryV2 {
  return {
    contractVersion: "syat.story-draft.v2", sourcePackId: "audit-district", sourceIds: ["audit-record"], language: "en-IN",
    editorialStatus: "needs_editorial_review", format: "explainer",
    story: {
      mode: "news", title: "District audit reports gaps in scheme record keeping",
      dek: "The audit sets out what its own sample can establish about the district's records, and what it cannot.",
      theme: "Public services",
      indiaConnection: "The audit concerns a rural employment scheme in an Indian district and the records a resident could inspect.",
      eventTime: { kind: "exact_date", value: "2026-08-11", label: "11 August 2026" },
      eventTimeEvidence: { claimIds: ["claim-1"], sourceIds: ["audit-record"] },
      reframe: { kind: "question", value: "What would show whether scheme records match the work actually done?" }
    },
    bodySections: [
      { id: "finding", title: "What the audit found", paragraphs: [{ id: "para-1", text: "The report states that muster rolls were not maintained in the prescribed manner across the sampled blocks, and that the gap is recorded rather than explained.", claimIds: ["claim-1"], sourceIds: ["audit-record"] }] },
      { id: "reach", title: "How far the finding reaches", paragraphs: [{ id: "para-2", text: "Its conclusion covers only the blocks the auditors visited and the months they chose, so a reader cannot read it as a verdict on the whole district or on later work.", claimIds: ["claim-1"], sourceIds: ["audit-record"] }] },
      { id: "checks", title: "What would settle the rest", paragraphs: [{ id: "para-3", text: "Payment dates held by the block office, alongside accounts from people who worked those weeks, would show whether the paperwork gap reached anyone's wages.", claimIds: ["claim-1"], sourceIds: ["audit-record"] }] }
    ],
    timeline: [{ id: "tabled", time: { kind: "exact_date", value: "2026-08-11", label: "11 August 2026" }, text: "The audit report reached the legislature on this date.", claimIds: ["claim-1"], sourceIds: ["audit-record"] }],
    statements: [{ id: "claim-1", type: "documented", basis: "direct_record", text: "The audit records gaps in the district's scheme paperwork.", sourceIds: ["audit-record"], sourceScope: "The audit covers only the blocks and period it sampled.", limits: "It does not establish how many workers were affected." }],
    perspectives: [{ id: "auditor", label: "The auditor", rationale: "The audit examined the paperwork itself.", sees: "Gaps between the paperwork and the prescribed process.", values: "Records another person can check.", uses: "Its own sample of blocks.", mayMiss: "What happened outside the sampled blocks.", sourceIds: ["audit-record"] }],
    people: [{ id: "audit-office", kind: "institution", label: "State audit office", association: "It carried out the audit and published the finding.", sourceIds: ["audit-record"] }],
    unresolved: [{ id: "worker-effect", question: "How many workers were paid late because of the record gaps?", whatWouldHelp: "Payment records and accounts from workers in the sampled blocks.", sourceIds: ["audit-record"] }],
    contextBridge: { topicSlug: "informal-work", question: "When does informal work become essential infrastructure?", connection: "A scheme's paperwork decides who is recognised as having worked." },
    authoredVisual: { kind: "process", title: "From sample to finding", description: "The visual separates the audit's sample from the conclusion it supports.", limitation: "It does not measure how many people were affected.", claimIds: ["claim-1"], sourceIds: ["audit-record"] },
    mediaPlan: [], modelNotes: ["Keep the audit's sample distinct from the whole district."]
  } as GeneratedStoryV2;
}

const binding = { sourcePackId: "audit-district", language: "en-IN" as const, mode: "news" as const, format: "explainer" as const, indiaConnection: "The audit concerns a rural employment scheme in an Indian district and the records a resident could inspect.", selectedExactTime: { value: "2026-08-11", label: "11 August 2026" } };

function targetsFor(draft: GeneratedStoryV2) {
  return collectRepairTargets(draft, dossier);
}

describe("close-copy repair targets", () => {
  it("flags only the field that actually reused the source wording", () => {
    const draft = makeCopyingDraft();
    const targets = targetsFor(draft);

    expect(targets).toHaveLength(1);
    expect(targets[0].fieldId).toBe("paragraph:para-1");
    expect(targets[0].avoidWording).toContain("muster rolls were not maintained");
  });

  it("names the wording to avoid in the prompt and asks for plain words", () => {
    const prompt = buildRepairPrompt(targetsFor(makeCopyingDraft()));

    expect(prompt).toContain("field_id: paragraph:para-1");
    expect(prompt).toContain("run_already_reused:");
    expect(prompt).toMatch(/seven consecutive words/);
    expect(prompt).toMatch(/Return only a JSON object/);
    // Without the source in front of it the model just swaps one borrowed run for another.
    expect(prompt).toContain("source_id: audit-record");
    expect(prompt).toContain("muster rolls were not maintained in the prescribed manner");
  });
});

describe("repair patch refusals", () => {
  const draft = makeCopyingDraft();
  const targets = targetsFor(draft);

  it("refuses a field that was never flagged", () => {
    expect(() => applyRepairPatch(draft, { "story:title": "A different headline entirely" }, targets)).toThrow(/not flagged for repair/);
  });

  it("refuses a rewrite that changes or invents a number", () => {
    const withNumber = makeCopyingDraft();
    withNumber.bodySections[0].paragraphs[0].text = "The report states that 42 muster rolls were not maintained in the prescribed manner across the sampled blocks.";
    const numberTargets = targetsFor(withNumber);

    expect(() => applyRepairPatch(withNumber, { "paragraph:para-1": "The report says 43 record sheets fell short of the required method in the blocks it checked." }, numberTargets)).toThrow(/changed the numbers/);
    expect(() => applyRepairPatch(withNumber, { "paragraph:para-1": "The report says record sheets fell short of the required method in the blocks it checked." }, numberTargets)).toThrow(/changed the numbers/);
  });

  it("refuses an empty, non-string or dash-bearing rewrite", () => {
    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "   " }, targets)).toThrow(/emptied/);
    expect(() => applyRepairPatch(draft, { "paragraph:para-1": 42 }, targets)).toThrow(/non-string/);
    // A dash is a typographic habit, not a meaning. Losing a usable rewrite over one would be
    // worse than normalising it, so it is normalised and the stored text carries none.
    const normalised = applyRepairPatch(draft, { "paragraph:para-1": "The report says records — in the blocks it checked — fell short of the required method." }, targets);
    const storedText = normalised.bodySections[0].paragraphs[0].text;
    expect(storedText).not.toMatch(/[–—]/);
    expect(storedText).toContain("records, in the blocks it checked, fell short");
  });

  it("refuses a response that is not an object of rewrites", () => {
    expect(() => applyRepairPatch(draft, "a string", targets)).toThrow(/not a JSON object/);
    expect(() => applyRepairPatch(draft, ["an array"], targets)).toThrow(/not a JSON object/);
    expect(() => applyRepairPatch(draft, {}, targets)).toThrow(/rewrote no fields/);
  });

  it("never lets a wording fix reach an id, a claim reference or the publication state", () => {
    for (const fieldId of ["context-bridge", "authored-visual", "reframe", "statement:claim-1:id", "sourceIds"]) {
      expect(() => applyRepairPatch(draft, { [fieldId]: "anything at all" }, targets)).toThrow();
    }
  });
});

describe("repaired drafts still face every gate", () => {
  it("accepts a genuine rewrite and leaves the rest of the draft identical", () => {
    const draft = makeCopyingDraft();
    const rewritten = "The report says the district's work registers fell short of the method the scheme requires, across the blocks it sampled, and it records the gap without explaining it.";
    const repaired = applyRepairPatch(draft, { "paragraph:para-1": rewritten }, targetsFor(draft));

    expect(findCloseCopyMatches(repaired, dossier)).toEqual([]);
    expect(() => parseGeneratedStoryV2(repaired, dossier, binding)).not.toThrow();
    expect(repaired.story.title).toBe(draft.story.title);
    expect(repaired.statements).toEqual(draft.statements);
  });

  it("still rejects a rewrite that copies a different seven-token run", () => {
    const draft = makeCopyingDraft();
    const stillCopying = "The audit examined the implementation of the rural employment guarantee scheme in the district and recorded a gap.";
    const repaired = applyRepairPatch(draft, { "paragraph:para-1": stillCopying }, targetsFor(draft));

    expect(findCloseCopyMatches(repaired, dossier).length).toBeGreaterThan(0);
    expect(() => parseGeneratedStoryV2(repaired, dossier, binding)).toThrow(/closely copies/);
  });

  it("keeps the original draft untouched so a failed repair cannot corrupt it", () => {
    const draft = makeCopyingDraft();
    const before = JSON.stringify(draft);
    applyRepairPatch(draft, { "paragraph:para-1": "The report says the district's work registers fell short of what the scheme requires." }, targetsFor(draft));

    expect(JSON.stringify(draft)).toBe(before);
  });
});

describe("repair privacy", () => {
  it("keeps source wording out of the reportable finding", () => {
    const findings = findCloseCopyMatches(makeCopyingDraft(), dossier);

    expect(findings).toHaveLength(1);
    expect(Object.keys(findings[0]).sort()).toEqual(["fieldId", "matchHash", "sourceId", "tokenCount"]);
    expect(JSON.stringify(findings)).not.toContain("prescribed manner");
  });
});

describe("dash normalisation", () => {
  it("reads a dash between figures as a range rather than a comma", () => {
    const draft = makeCopyingDraft();
    draft.bodySections[0].paragraphs[0].text = "The report states that muster rolls were not maintained in the prescribed manner in 12 of 48 panchayats.";
    const targets = collectRepairTargets(draft, dossier);
    const repaired = applyRepairPatch(draft, { "paragraph:para-1": "Between 12 — 48 panchayats the registers fell short of the required method." }, targets);

    expect(repaired.bodySections[0].paragraphs[0].text).toContain("12 to 48");
    expect(repaired.bodySections[0].paragraphs[0].text).not.toMatch(/[–—]/);
  });
});

describe("figure comparison", () => {
  function withFigure(text: string) {
    const draft = makeCopyingDraft();
    draft.bodySections[0].paragraphs[0].text = text;
    return { draft, targets: collectRepairTargets(draft, dossier) };
  }

  it("accepts a rewrite that regroups an Indian figure without changing its value", () => {
    // The same amount is written 1,50,938.84 or 150,938.84. Rejecting a rewrite for
    // regrouping a number lost honest drafts over punctuation.
    const original = "The report states that muster rolls were not maintained in the prescribed manner across a budget of Rs 1,50,938.84 crore.";
    const { draft, targets } = withFigure(original);

    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "Registers fell short of the required method across a budget of Rs 150,938.84 crore." }, targets)).not.toThrow();
  });

  it("still rejects a rewrite that changes a value", () => {
    const { draft, targets } = withFigure("The report states that muster rolls were not maintained in the prescribed manner in 46 cases.");

    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "Registers fell short of the required method in 47 cases." }, targets)).toThrow(/changed the numbers/);
  });
});

describe("fiscal year forms", () => {
  function withText(text: string) {
    const draft = makeCopyingDraft();
    draft.bodySections[0].paragraphs[0].text = text;
    return { draft, targets: collectRepairTargets(draft, dossier) };
  }

  it("treats a two-digit year and its four-digit form as the same fact", () => {
    // Indian fiscal years are written 2023-24, and splitting that on the hyphen made a rewrite
    // spelling the year out look like it had changed a figure.
    const { draft, targets } = withText("The report states that muster rolls were not maintained in the prescribed manner during 24 across the district.");

    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "Registers fell short of the required method during 2024 across the district." }, targets)).not.toThrow();
  });

  it("accepts a range written as its endpoints", () => {
    const { draft, targets } = withText("The report states that muster rolls were not maintained in the prescribed manner from 2016-24 onward.");

    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "Registers fell short of the required method between 2016 and 2024." }, targets)).not.toThrow();
  });

  it("still rejects a changed amount", () => {
    const { draft, targets } = withText("The report states that muster rolls were not maintained in the prescribed manner, leaving Rs 321 crore in arrears.");

    expect(() => applyRepairPatch(draft, { "paragraph:para-1": "Registers fell short of the required method, leaving Rs 322 crore in arrears." }, targets)).toThrow(/changed the numbers/);
  });
});
