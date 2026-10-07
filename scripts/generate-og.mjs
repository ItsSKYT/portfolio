/**
 * Generuje statyczny obrazek podglądu linku: public/og.png (1200×630, czarno-biały).
 * Użycie: npm run og   (wymaga Node >= 22 (strip-types) i Chrome/Chromium)
 * Ścieżkę przeglądarki można podać w CHROME_PATH.
 */
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { site } = await import(path.join(root, "src/data/site.ts"));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600&family=Geist+Mono&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#000;color:#fff;font-family:"Inter Tight",sans-serif;
       display:flex;flex-direction:column;justify-content:space-between;padding:60px 70px}
  .mono{font-family:"Geist Mono",monospace;font-size:20px;letter-spacing:.2em;text-transform:uppercase;color:#8a8a8a;display:flex;justify-content:space-between}
  .name{font-size:270px;font-weight:600;letter-spacing:-0.07em;line-height:.8;margin-left:-8px}
  .rule{height:1px;background:#444;margin-top:44px}
  .row{display:flex;justify-content:space-between;font-size:30px;color:#bbb;margin-top:24px}
</style></head><body>
  <div class="mono"><span>(Portfolio) / ${esc(site.realName ?? "")}</span><span>${esc(site.footer.year)}</span></div>
  <div>
    <div class="name">${esc(site.name)}</div>
    <div class="rule"></div>
    <div class="row"><span>${esc(site.role)}</span><span>${esc(site.location)}</span></div>
  </div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, "public/og.png") });
await browser.close();
console.log("✓ public/og.png wygenerowany");
