import type { Metadata, Viewport } from "next";
import { body, display, mono } from "./fonts";
import { site } from "@/content/site";
import "@/styles/tokens.css";
import "@/styles/skyt.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: "skyt.dev",
    locale: "pl_PL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
  ],
};

// Applies the saved theme before first paint, so Day visitors never see a Night flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// Without JavaScript, entrance animations would leave content hidden: show everything instead.
const noScriptCss = `.sk-reveal,.sk-split__unit,.sk-cycle__word:first-child,.sk-tl__item,.sk-cta__link,.sk-cta__links li,.sk-section-head__eyebrow{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}.sk-section-head__rule{transform:none!important}.sk-tl__dot{transform:none!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      data-theme="dark"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
