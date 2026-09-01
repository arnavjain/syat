export const SHELF_VERSION = 1;
export const SHELF_STORAGE_KEY = `syat:shelf:v${SHELF_VERSION}`;
export const MAXIMUM_SHELF_ITEMS = 100;

export type ShelfItem = {
  kind: "topic" | "story";
  slug: string;
  title: string;
  context: string;
  savedAt: string;
};

type BrowserStorage = Pick<Storage, "getItem" | "setItem">;

function isShelfItem(value: unknown): value is ShelfItem {
  const item = value as Partial<ShelfItem> | null;
  return Boolean(
    item &&
    (item.kind === "topic" || item.kind === "story") &&
    typeof item.slug === "string" && /^[a-z0-9-]{1,80}$/.test(item.slug) &&
    typeof item.title === "string" && item.title.length > 0 && item.title.length <= 320 &&
    typeof item.context === "string" && item.context.length <= 160 &&
    typeof item.savedAt === "string"
  );
}

/**
 * The reader's shelf, kept on their own device.
 *
 * There are no accounts yet, so a shelf that claimed to sync would be a lie. This one is
 * honest about its scope and actually works: it survives a reload, it drops anything
 * malformed rather than trusting stored JSON, and it never blocks reading when storage is
 * unavailable.
 */
export function readShelf(storage: BrowserStorage | null | undefined): ShelfItem[] {
  try {
    const raw = storage?.getItem(SHELF_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isShelfItem).slice(0, MAXIMUM_SHELF_ITEMS) : [];
  } catch {
    return [];
  }
}

export function isSaved(items: readonly ShelfItem[], kind: ShelfItem["kind"], slug: string): boolean {
  return items.some((item) => item.kind === kind && item.slug === slug);
}

function write(storage: BrowserStorage | null | undefined, items: readonly ShelfItem[]): boolean {
  try {
    storage?.setItem(SHELF_STORAGE_KEY, JSON.stringify(items.slice(0, MAXIMUM_SHELF_ITEMS)));
    return Boolean(storage);
  } catch {
    return false;
  }
}

/** Adds or removes in one call, so a button can be a single toggle. */
export function toggleSaved(storage: BrowserStorage | null | undefined, entry: Omit<ShelfItem, "savedAt">, now = new Date()): { items: ShelfItem[]; saved: boolean; stored: boolean } {
  const current = readShelf(storage);
  const already = isSaved(current, entry.kind, entry.slug);
  const items = already
    ? current.filter((item) => !(item.kind === entry.kind && item.slug === entry.slug))
    : [{ ...entry, savedAt: now.toISOString() }, ...current];
  return { items: items.slice(0, MAXIMUM_SHELF_ITEMS), saved: !already, stored: write(storage, items) };
}

export function removeFromShelf(storage: BrowserStorage | null | undefined, kind: ShelfItem["kind"], slug: string): ShelfItem[] {
  const items = readShelf(storage).filter((item) => !(item.kind === kind && item.slug === slug));
  write(storage, items);
  return items;
}
