import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StatementBasisSheet } from "./statement-basis-sheet";

describe("StatementBasisSheet", () => {
  it("gives a statement a native, truthful basis-and-limits fallback", () => {
    const html = renderToStaticMarkup(createElement(StatementBasisSheet, {
      statement: "The teaching-policy document describes a daytime bus corridor.",
      basis: {
        id: "basis-policy-rule",
        statementType: "documented",
        basis: "A made-up sample policy note.",
        sourceScope: "The fictional policy document only.",
        limits: "It does not show a real outcome.",
      },
      sourceIds: ["fixture-policy"],
    }));

    expect(html).toContain("<details");
    expect(html).toContain("Tap for basis");
    expect(html).toContain("Statement type");
    expect(html).toContain("documented");
    expect(html).toContain("Source scope");
    expect(html).toContain("Limits");
    expect(html).not.toContain("automatically supported");
  });
});
