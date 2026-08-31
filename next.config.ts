import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md holds the owner's product working notes and is the documented entry
  // point for contributors. Keep `next dev` from injecting its own managed block
  // into it; the Next 16 upgrade notes live in node_modules/next/dist/docs/.
  agentRules: false,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["zod"]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" }
        ]
      }
    ];
  }
};

export default nextConfig;
