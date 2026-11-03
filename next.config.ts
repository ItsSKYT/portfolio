import type { NextConfig } from "next";

/**
 * The site is fully static (live Discord data loads in the browser), so the build is a static
 * export to out/ for Cloudflare Pages. Set STATIC_EXPORT=0 for a server build (`next start`).
 */
const staticExport = process.env.STATIC_EXPORT !== "0";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
