import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// The browser calls these routes from the Next.js origin, which is a different host from the
// Convex deployment serving them, so the preflight has to be answered or every POST is blocked
// before it is sent.
//
// Exactly one origin is trusted, and it comes from this deployment's own SITE_URL. An earlier
// version also listed http://localhost:3000 unconditionally, which meant the production
// deployment answered credentialed cross-origin requests from anything an attacker could get
// running on a victim's port 3000. Local development is served by setting SITE_URL to localhost
// on the development deployment, not by trusting it everywhere.
//
// With no SITE_URL this disables cross-origin access rather than guessing an origin. Convex
// evaluates this module at push time without deployment environment variables, so throwing here
// would break every deploy; failing closed gives the same protection and still pushes.
const siteUrl = process.env.SITE_URL;

authComponent.registerRoutes(http, createAuth, siteUrl ? { cors: { allowedOrigins: [siteUrl] } } : {});

export default http;
