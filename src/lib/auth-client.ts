import { passkeyClient } from "@better-auth/passkey/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth runs on Convex, not on this app.
 *
 * `convex/http.ts` registers the auth routes on the Convex deployment, and the Next.js route at
 * /api/auth/[...all] is only a proxy. That proxy answers GET but returns 404 for the POSTs the
 * client makes, so sign-in failed with "could not start" while every GET endpoint looked healthy.
 * Pointing the client at the Convex site directly removes the proxy from the path entirely.
 */
const baseURL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  plugins: [convexClient(), passkeyClient()]
});
