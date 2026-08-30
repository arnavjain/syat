"use client";

import { ConvexBetterAuthProvider, type AuthClient } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// The component's public type only models its own client plugin. The passkey
// client plugin is valid at runtime but widens the generic beyond that type.
// Keep the cast at this package boundary; do not weaken any app-domain types.
const providerAuthClient = authClient as unknown as AuthClient;

export function ConvexClientProvider({ children, initialToken }: { children: ReactNode; initialToken?: string | null }) {
  return (
    <ConvexBetterAuthProvider authClient={providerAuthClient} client={convex} initialToken={initialToken}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
