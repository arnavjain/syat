const BUCKET_STORAGE_KEY = "syat:bucket:v1";

/**
 * A coarse, random, per-browser token used only to slow bursts of proposals.
 *
 * It is generated on the device, never derived from anything about the person, and carries
 * no identity. It exists so one browser cannot flood the review queue, and it is deliberately
 * useless for anything else.
 */
export function getSubmitterBucket(storage: Pick<Storage, "getItem" | "setItem"> | null | undefined): string {
  try {
    const existing = storage?.getItem(BUCKET_STORAGE_KEY);
    if (existing && /^[a-z0-9]{8,32}$/.test(existing)) return existing;
    const fresh = Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6);
    storage?.setItem(BUCKET_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // Storage blocked: still send something bounded so the cap applies per session.
    return "session-" + Math.random().toString(36).slice(2, 10);
  }
}
