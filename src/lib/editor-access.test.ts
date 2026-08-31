import { describe, expect, it } from "vitest";

import { resolveEditorAccess, studioEnvironmentFromServer } from "./editor-access";

describe("editor access", () => {
  it("fails closed in production when shared auth or storage is missing", () => {
    const access = resolveEditorAccess({
      environment: "production",
      sharedStorageAvailable: false,
      editorAllowList: ["user_1"]
    });

    expect(access).toMatchObject({
      kind: "blocked",
      canWriteSharedReview: false,
      canWriteBrowserReview: false
    });
  });

  it("allows the labelled browser-only fallback only in a protected preview without shared storage", () => {
    const access = resolveEditorAccess({
      environment: "protected_preview",
      sharedStorageAvailable: false,
      editorAllowList: []
    });

    expect(access).toMatchObject({
      kind: "browser_only_private_review",
      canWriteSharedReview: false,
      canWriteBrowserReview: true
    });
    expect(access.label).toContain("browser-only private review");
  });

  it("requires an explicit server-only gate for a protected Vercel review preview", () => {
    expect(studioEnvironmentFromServer({ NODE_ENV: "production", VERCEL_ENV: "preview" })).toBe("production");
    expect(studioEnvironmentFromServer({ NODE_ENV: "development", VERCEL_ENV: "preview" })).toBe("production");
    expect(studioEnvironmentFromServer({ NODE_ENV: "production", VERCEL_ENV: "preview", SYAT_PROTECTED_REVIEW_GATE: "unexpected" })).toBe("production");
    expect(studioEnvironmentFromServer({ NODE_ENV: "production", VERCEL_ENV: "preview", NEXT_PUBLIC_SYAT_PROTECTED_REVIEW_GATE: "allow-browser-only-review" })).toBe("production");
    expect(studioEnvironmentFromServer({ NODE_ENV: "production", VERCEL_ENV: "preview", SYAT_PROTECTED_REVIEW_GATE: "allow-browser-only-review" })).toBe("protected_preview");
    expect(studioEnvironmentFromServer({ NODE_ENV: "production", VERCEL_ENV: "production", SYAT_PROTECTED_REVIEW_GATE: "allow-browser-only-review" })).toBe("production");
  });

  it("uses trusted server identity claims and an explicit allow-list, not a client role or email", () => {
    const access = resolveEditorAccess({
      environment: "production",
      sharedStorageAvailable: true,
      editorAllowList: ["trusted-user"],
      trustedIdentity: { subject: "trusted-user" },
      untrustedClientSubmission: { email: "attacker@example.com", role: "editor", publicationApproved: true }
    });

    expect(access).toMatchObject({
      kind: "shared_editor",
      canWriteSharedReview: true,
      canWriteBrowserReview: false
    });

    const untrustedOnly = resolveEditorAccess({
      environment: "production",
      sharedStorageAvailable: true,
      editorAllowList: ["trusted-user"],
      untrustedClientSubmission: { subject: "trusted-user", role: "editor" }
    });

    expect(untrustedOnly.kind).toBe("blocked");
  });
});
