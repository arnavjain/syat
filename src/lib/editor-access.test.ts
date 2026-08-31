import { describe, expect, it } from "vitest";

import { resolveEditorAccess } from "./editor-access";

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
