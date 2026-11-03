import type { NextConfig } from "next";

/**
 * Two build modes:
 *  - default: server build for `next start` (the VPS runs it under pm2 behind Cloudflare Tunnel)
 *  - STATIC_EXPORT=1: static export to out/ (Cloudflare Pages or any static host)
 * The default must stay the server build: `next start` re-reads this file and refuses to run with output: "export".
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
