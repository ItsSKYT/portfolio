import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Statyczny eksport → `npm run build` tworzy katalog `out/` (Cloudflare Pages). */
  output: "export",
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
