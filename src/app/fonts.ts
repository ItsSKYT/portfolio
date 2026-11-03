import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--nf-display",
  display: "swap",
});

export const body = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--nf-body",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--nf-mono",
  display: "swap",
});
