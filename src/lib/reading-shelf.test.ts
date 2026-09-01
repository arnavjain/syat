import { describe, expect, it } from "vitest";

import { MAXIMUM_SHELF_ITEMS, SHELF_STORAGE_KEY, isSaved, readShelf, removeFromShelf, toggleSaved } from "./reading-shelf";

function storage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set(SHELF_STORAGE_KEY, initial);
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

const topic = { kind: "topic" as const, slug: "water-sharing", title: "How do communities decide who gets water first?", context: "Food and land" };

describe("reading shelf", () => {
  it("saves, reports saved, and unsaves with the same call", () => {
    const store = storage();

    const added = toggleSaved(store, topic);
    expect(added.saved).toBe(true);
    expect(added.stored).toBe(true);
    expect(isSaved(readShelf(store), "topic", "water-sharing")).toBe(true);

    const removed = toggleSaved(store, topic);
    expect(removed.saved).toBe(false);
    expect(readShelf(store)).toHaveLength(0);
  });

  it("keeps the most recent save first", () => {
    const store = storage();
    toggleSaved(store, topic);
    toggleSaved(store, { ...topic, slug: "soil", title: "Why is soil more than a growing medium?" });

    expect(readShelf(store)[0].slug).toBe("soil");
  });

  it("drops malformed stored entries instead of trusting them", () => {
    const store = storage(JSON.stringify([
      { ...topic, savedAt: new Date().toISOString() },
      { kind: "topic", slug: "../../etc/passwd", title: "bad", context: "" },
      { kind: "invalid", slug: "x", title: "bad", context: "" },
      "not an object",
      null
    ]));

    const items = readShelf(store);
    expect(items).toHaveLength(1);
    expect(items[0].slug).toBe("water-sharing");
  });

  it("survives corrupt JSON and a browser that refuses storage", () => {
    expect(readShelf(storage("{not json"))).toEqual([]);

    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    const result = toggleSaved(broken, topic);
    expect(result.stored).toBe(false);
    expect(result.saved).toBe(true);
    expect(readShelf(broken)).toEqual([]);
  });

  it("caps the shelf so stored data cannot grow without bound", () => {
    const many = Array.from({ length: MAXIMUM_SHELF_ITEMS + 20 }, (_, index) => ({ ...topic, slug: `topic-${index}`, savedAt: new Date().toISOString() }));
    expect(readShelf(storage(JSON.stringify(many)))).toHaveLength(MAXIMUM_SHELF_ITEMS);
  });

  it("removes only the named item", () => {
    const store = storage();
    toggleSaved(store, topic);
    toggleSaved(store, { ...topic, slug: "soil", title: "Why is soil more than a growing medium?" });

    const left = removeFromShelf(store, "topic", "soil");
    expect(left.map((item) => item.slug)).toEqual(["water-sharing"]);
  });
});
