import { describe, expect, it } from "vitest";

import { parseContentBlocks } from "./content-blocks";

describe("content block tracing", () => {
  it("accepts a paragraph only when its claim and source references are known", () => {
    const blocks = parseContentBlocks([
      { id: "p-1", kind: "paragraph", text: "The order names a start date for the charge.", claimIds: ["claim-start"], sourceIds: ["city-order"] }
    ], { claimIds: ["claim-start"], sourceIds: ["city-order"] });

    expect(blocks[0].id).toBe("p-1");
  });

  it("rejects a block that points at an unreviewed source", () => {
    expect(() => parseContentBlocks([
      { id: "p-1", kind: "paragraph", text: "The order names a start date for the charge.", claimIds: ["claim-start"], sourceIds: ["unknown"] }
    ], { claimIds: ["claim-start"], sourceIds: ["city-order"] })).toThrow(/unknown source/i);
  });
});
