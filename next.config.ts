import type { NextConfig } from "next";

/**
 * Dwa tryby budowania:
 *  - domyślnie: build serwerowy (dla `next start`, np. na VPS za reverse-proxy / tunelem)
 *  - STATIC_EXPORT=1: statyczny eksport do `out/` (np. Cloudflare Pages / GitHub Pages)
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
