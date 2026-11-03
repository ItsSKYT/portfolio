import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} | ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered once at build time (the site is a static export).
export const dynamic = "force-static";

// Colours are the Night theme tokens from design/tokens.json.
const C = { bg: "#07080c", ink: "#eef0f6", muted: "#9aa2b8", line: "#232838", signal: "#ff6b35" };

export default async function Image() {
  const [display, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/GeistMono-Medium.ttf")),
  ]);

  // A 24px dot grid on the right, like the hero's sky.
  const dots = [];
  for (let y = 0; y < 10; y++) for (let x = 0; x < 13; x++) dots.push({ x: 840 + x * 24, y: 128 + y * 24 });

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 70px", background: C.bg, color: C.ink, position: "relative" }}>
        {dots.map((d, i) => (
          <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: 3, height: 3, borderRadius: 3, background: C.line }} />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: C.muted }}>
          <span>(Portfolio) / {site.realName}</span>
          <span>{site.footer.year}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Bricolage Grotesque", fontSize: 260, lineHeight: 0.8, letterSpacing: -14 }}>
            {site.name}
            <div style={{ width: 44, height: 44, marginLeft: 18, marginBottom: 14, borderRadius: 44, background: C.signal }} />
          </div>
          <div style={{ height: 2, background: C.line, marginTop: 48 }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontFamily: "Geist Mono", fontSize: 28, color: C.muted }}>
            <span>{site.role}</span>
            <span>{site.location}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: display, style: "normal", weight: 700 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
