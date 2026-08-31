export type StudioEnvironment = "production" | "protected_preview";

export type TrustedEditorIdentity = {
  subject: string;
};

export type EditorAccessInput = {
  environment: StudioEnvironment;
  sharedStorageAvailable: boolean;
  editorAllowList: readonly string[];
  trustedIdentity?: TrustedEditorIdentity;
  // This deliberately has no effect. It makes the boundary clear in tests and
  // prevents a future caller from mistaking browser-submitted identity data for
  // an access grant.
  untrustedClientSubmission?: unknown;
};

export type EditorAccess = {
  kind: "shared_editor" | "browser_only_private_review" | "blocked";
  canWriteSharedReview: boolean;
  canWriteBrowserReview: boolean;
  label: string;
  reason: string;
};

const blocked: EditorAccess = {
  kind: "blocked",
  canWriteSharedReview: false,
  canWriteBrowserReview: false,
  label: "Private Review Studio is unavailable",
  reason: "Shared editor access needs verified sign-in, an allowed editor identity, and connected storage."
};

export function resolveEditorAccess(input: EditorAccessInput): EditorAccess {
  const allowedIdentity = input.trustedIdentity && input.editorAllowList.includes(input.trustedIdentity.subject);

  if (input.sharedStorageAvailable && allowedIdentity) {
    return {
      kind: "shared_editor",
      canWriteSharedReview: true,
      canWriteBrowserReview: false,
      label: "Shared editor review",
      reason: "Your verified editor identity can record only source-research decisions."
    };
  }

  if (input.environment === "protected_preview" && !input.sharedStorageAvailable) {
    return {
      kind: "browser_only_private_review",
      canWriteSharedReview: false,
      canWriteBrowserReview: true,
      label: "browser-only private review",
      reason: "Changes stay in this browser. They are not shared, authenticated, or a publishing decision."
    };
  }

  return blocked;
}

export function studioEnvironmentFromServer(environment: NodeJS.ProcessEnv = process.env): StudioEnvironment {
  return environment.VERCEL_ENV === "preview" && environment.NODE_ENV === "production" && environment.SYAT_PROTECTED_REVIEW_GATE === "allow-browser-only-review"
    ? "protected_preview"
    : "production";
}

export function editorAllowListFromServer(environment: NodeJS.ProcessEnv = process.env) {
  return (environment.SYAT_EDITOR_SUBJECTS ?? "").split(",").map((subject) => subject.trim()).filter(Boolean);
}

export function hasSharedEditorialConfiguration(environment: NodeJS.ProcessEnv = process.env) {
  return Boolean(
    environment.NEXT_PUBLIC_CONVEX_URL
    && environment.NEXT_PUBLIC_CONVEX_SITE_URL
    && environment.GOOGLE_CLIENT_ID
    && environment.GOOGLE_CLIENT_SECRET
  );
}
