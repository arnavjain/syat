import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";

import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

// Convex evaluates this module at push time without deployment environment variables, and it
// calls createAuthOptions during that analysis, so there is nowhere here a missing SITE_URL can
// be thrown on without breaking every deploy. The fallback is therefore unavoidable.
//
// It is not what guards cross-origin access. That is the allow-list in http.ts, which fails
// closed and never names localhost unless this deployment's own SITE_URL is localhost. A
// deployment missing SITE_URL answers no cross-origin request at all.
const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const relyingPartyId = new URL(siteUrl).hostname;

export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth, {
  local: { schema: authSchema }
});

function googleProvider() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  return clientId && clientSecret ? { google: { clientId, clientSecret } } : undefined;
}

export function createAuthOptions(ctx: GenericCtx<DataModel>) {
  return {
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: { enabled: false },
    socialProviders: googleProvider(),
    plugins: [
      convex({ authConfig }),
      passkey({
        rpID: relyingPartyId,
        rpName: "Syāt",
        origin: siteUrl
      })
    ]
  } satisfies BetterAuthOptions;
}

export function createAuth(ctx: GenericCtx<DataModel>) {
  return betterAuth(createAuthOptions(ctx));
}

export const getCurrentUser = query({
  args: {},
  handler: (ctx) => authComponent.getAuthUser(ctx)
});
