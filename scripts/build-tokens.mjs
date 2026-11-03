// Compiles design/tokens.json (the skyt.dev design system) into src/styles/tokens.css.
// Run: npm run tokens
import { readFileSync, writeFileSync } from "node:fs";

const t = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));

// next/font exposes each family as a hashed name through these variables (see src/app/fonts.ts).
const FONT_VARS = { display: "--nf-display", body: "--nf-body", mono: "--nf-mono" };

const themes = t.color.themes.map((th) => th.id);
const valueFor = (tok, theme, i) => (typeof tok.value === "string" ? (i === 0 ? tok.value : null) : tok.value[theme]);

let css = "/* skyt.dev: generated from tokens.json */\n\n";

themes.forEach((theme, i) => {
  const sel = i === 0 ? `:root,\n[data-theme="${theme}"]` : `[data-theme="${theme}"]`;
  const lines = [`  color-scheme: ${theme === "light" ? "light" : "dark"};`];
  for (const tok of [...t.color.tokens, ...t.shadow.tokens]) {
    const v = valueFor(tok, theme, i);
    if (v) lines.push(`  --${tok.name}: ${v};`);
  }
  css += `${sel} {\n${lines.join("\n")}\n}\n\n`;
});

const root = [];
for (const fam of ["spacing", "radius", "duration", "easing"]) {
  for (const tok of t[fam].tokens) root.push(`  --${tok.name}: ${tok.value};`);
}
for (const [key, stack] of Object.entries(t.type.families)) {
  root.push(`  --font-${key}: ${FONT_VARS[key] ? `var(${FONT_VARS[key]}), ` : ""}${stack};`);
}
css += `:root {\n${root.join("\n")}\n}\n\n`;

for (const group of t.type.groups) {
  for (const s of group.styles) {
    const decl = [
      `font-family: var(--font-${s.family || group.family});`,
      `font-size: ${s.fontSize};`,
      `line-height: ${s.lineHeight};`,
      `font-weight: ${s.fontWeight};`,
    ];
    if (s.letterSpacing) decl.push(`letter-spacing: ${s.letterSpacing};`);
    if (s.opticalSize) decl.push(`font-variation-settings: "opsz" ${s.opticalSize};`);
    css += `.${s.name} {\n  ${decl.join("\n  ")}\n}\n\n`;
  }
}

writeFileSync(new URL("../src/styles/tokens.css", import.meta.url), css.trimEnd() + "\n");
console.log("tokens.css written");
