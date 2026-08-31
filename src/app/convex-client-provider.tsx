"use client";

import { ConvexBetterAuthProvider, type AuthClient } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Convex is not deployed during the private preview. Constructing the client
// without an address throws while the page is being prerendered, so only build it
// when an address exists. Without one, the page still renders and reads normally;
// sign-in simply stays unavailable instead of pretending to be connected.
const convex = convexUrl ? new ConvexReactClient(convexUrl) : undefined;

// The component's public type only models its own client plugin. The passkey
// client plugin is valid at runtime but widens the generic beyond that type.
// Keep the cast at this package boundary; do not weaken any app-domain types.
const providerAuthClient = authClient as unknown as AuthClient;

export function ConvexClientProvider({ children, initialToken }: { children: ReactNode; initialToken?: string | null }) {
  if (!convex) return <>{children}</>;

  return (
    <ConvexBetterAuthProvider authClient={providerAuthClient} client={convex} initialToken={initialToken}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
