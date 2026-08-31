import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { parseBatchArguments } from "./generate-preview-batch";

describe("preview batch arguments", () => {
  it("defaults to a paid wave and accepts the free scoring lane", () => {
    expect(parseBatchArguments([])).toMatchObject({ pilot: false, dryRun: false, start: 0, count: 10 });
    expect(parseBatchArguments(["--dry-run", "--count", "6"])).toMatchObject({ dryRun: true, count: 6 });
  });

  it("keeps the pilot fixed at exactly six packs from the start of the approved set", () => {
    expect(parseBatchArguments(["--pilot", "--count", "6"])).toMatchObject({ pilot: true, count: 6, start: 0 });
    expect(() => parseBatchArguments(["--pilot", "--count", "3"])).toThrow(/exactly six/i);
    expect(() => parseBatchArguments(["--pilot", "--start", "2", "--count", "6"])).toThrow(/exactly six/i);
  });

  it("refuses an argument it does not understand rather than guessing", () => {
    expect(() => parseBatchArguments(["--dryrun"])).toThrow(/Unknown preview batch argument/);
    expect(() => parseBatchArguments(["--count"])).toThrow(/requires a value/);
  });
});
