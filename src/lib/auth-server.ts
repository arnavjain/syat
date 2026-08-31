import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

import { hasSharedEditorialConfiguration } from "./editor-access";

// Convex and Google are deliberately unconfigured during the private preview, and
// the public reading pages must build and serve without them. Constructing the
// Convex adapter unconditionally throws at module evaluation and fails the whole
// production build, so build it only when the shared configuration is actually
// present and otherwise answer honestly that sign-in is unavailable.
function unavailable() {
  return Response.json(
    { error: "Sign-in is not available in this preview yet.", reason: "shared_editorial_configuration_missing" },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}

const unconfiguredHandler = { GET: unavailable, POST: unavailable };

function createAuthServer() {
  if (!hasSharedEditorialConfiguration()) return { handler: unconfiguredHandler } as const;

  return convexBetterAuthNextJs({
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
    convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!
  });
}

export const authServerConfigured = hasSharedEditorialConfiguration();

export const { handler } = createAuthServer();
