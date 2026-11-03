import type { Metadata, Viewport } from "next";
import { Intro, ScrollProgress, SmoothScroll } from "@/components/skyt";
import { site } from "@/content/site";
import { body, display, mono } from "./fonts";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/skyt.css";
import "@/styles/discord.css";
import "@/styles/fx.css";
import "./globals.css";

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: ["portfolio", site.name, site.role, "Next.js", "React", "TypeScript", "web developer"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
  ],
};

// Before first paint: restore the saved theme, and queue the intro once per tab session
// (with a failsafe so a broken bundle can never leave the page covered).
const bootScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(!sessionStorage.getItem("skyt-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("is-intro");setTimeout(function(){d.classList.remove("is-intro")},6000)}}catch(e){}`;

// Without JavaScript, entrance animations would leave content hidden: show everything instead.
const noScriptCss = `.sk-reveal,.sk-split__unit,.sk-cycle__word:first-child,.sk-tl__item,.sk-cta__link,.sk-cta__links li,.sk-section-head__eyebrow{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}.sk-section-head__rule,.sk-tl__dot{transform:none!important}.sk-intro{display:none!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" data-theme="dark" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>
      </head>
      <body id="top">
        <Intro name={site.name} year={site.footer.year} />
        <SmoothScroll />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
