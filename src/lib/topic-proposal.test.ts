import { describe, expect, it } from "vitest";

import { MAXIMUM_QUESTION_LENGTH, readProposals, saveProposal, validateProposal } from "./topic-proposal";

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

const good = { question: "Who decides when a road stops being a place?", reason: "It keeps coming up locally.", theme: "Cities and public life" };

describe("reader proposals", () => {
  it("accepts a real question and normalises its spacing", () => {
    const result = validateProposal({ ...good, question: "  Who decides   when a road stops being a place?  " });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.proposal.question).toBe("Who decides when a road stops being a place?");
  });

  it("refuses something that is not a question, or is too short or too long", () => {
    expect(validateProposal({ ...good, question: "Roads are interesting." }).ok).toBe(false);
    expect(validateProposal({ ...good, question: "Why?" }).ok).toBe(false);
    expect(validateProposal({ ...good, question: `${"a".repeat(MAXIMUM_QUESTION_LENGTH + 1)}?` }).ok).toBe(false);
    expect(validateProposal({ ...good, theme: "" }).ok).toBe(false);
  });

  it("keeps proposals on the device and never marks them publishable", () => {
    const store = storage();
    const result = validateProposal(good);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(saveProposal(store, result.proposal)).toBe(true);
    const saved = readProposals(store);
    expect(saved).toHaveLength(1);
    expect(saved[0]).not.toHaveProperty("published");
    expect(JSON.stringify(saved)).not.toMatch(/publicationAllowed|published/);
  });

  it("survives a browser that refuses to store anything", () => {
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    const result = validateProposal(good);
    if (!result.ok) throw new Error("fixture should validate");

    expect(readProposals(broken)).toEqual([]);
    expect(saveProposal(broken, result.proposal)).toBe(false);
  });
});
