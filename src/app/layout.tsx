import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter_Tight } from "next/font/google";
import { site } from "@/data/site";
import { Cursor } from "@/components/fx/Cursor";
import { Intro } from "@/components/fx/Intro";
import { MotionProvider } from "@/components/fx/MotionProvider";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const title = `${site.name} | ${site.role}`;
const description = site.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: ["portfolio", site.name, site.role, "Next.js", "React", "TypeScript", "web developer"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: site.name,
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${interTight.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <MotionProvider>
          <Intro />
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
