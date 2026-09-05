import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// The browser calls these routes from the Next.js origin, which is a different host from the
// Convex deployment serving them, so the preflight has to be answered or every POST is blocked
// before it is sent. Origins are listed explicitly rather than opened to all.
const allowedOrigins = [process.env.SITE_URL ?? "http://localhost:3000", "http://localhost:3000"];

authComponent.registerRoutes(http, createAuth, {
  cors: { allowedOrigins: [...new Set(allowedOrigins)] }
});

export default http;
