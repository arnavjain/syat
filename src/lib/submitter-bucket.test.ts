import { describe, expect, it } from "vitest";

import { getSubmitterBucket } from "./submitter-bucket";

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe("submitter bucket", () => {
  it("is stable for one browser so the rate limit can apply", () => {
    const store = storage();
    expect(getSubmitterBucket(store)).toBe(getSubmitterBucket(store));
  });

  it("differs between browsers", () => {
    expect(getSubmitterBucket(storage())).not.toBe(getSubmitterBucket(storage()));
  });

  it("carries nothing about the person and stays bounded", () => {
    const bucket = getSubmitterBucket(storage());
    expect(bucket).toMatch(/^[a-z0-9]{8,32}$/);
    expect(bucket.length).toBeLessThanOrEqual(32);
  });

  it("still returns a capped value when storage is blocked", () => {
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    const bucket = getSubmitterBucket(broken);
    expect(bucket.startsWith("session-")).toBe(true);
    expect(bucket.length).toBeLessThanOrEqual(64);
  });

  it("replaces a tampered value rather than trusting it", () => {
    const store = storage();
    store.setItem("syat:bucket:v1", "../../etc/passwd");
    expect(getSubmitterBucket(store)).toMatch(/^[a-z0-9]{8,32}$/);
  });
});
