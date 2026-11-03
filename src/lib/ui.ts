"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* ---------- Toasts: fire-and-forget messages shown by <Toaster /> ---------- */

export const TOAST_EVENT = "skyt:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

/** Copies text (Clipboard API, then the legacy selection fallback) and always tells the visitor what happened. */
export async function copyText(text: string, label = text): Promise<boolean> {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
  }
  toast(ok ? `Skopiowano ${label}` : `Nie udało się skopiować: ${label}`);
  return ok;
}

/* ---------- Theme: Night/Day with a circular reveal from a point ---------- */

export type Theme = "dark" | "light";

function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, readTheme, () => "dark");
}

/** Switches theme, saves it, and grows the new theme as a circle from (x, y) where View Transitions exist. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = readTheme() === "dark" ? "light" : "dark";
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !document.startViewTransition) {
    apply();
    return next;
  }
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? innerHeight / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
  return next;
}

/* ---------- Scrolling: through Lenis when it runs, natively otherwise ---------- */

type SmoothScroller = { scrollTo: (target: number | HTMLElement, options?: { offset?: number }) => void };

let scroller: SmoothScroller | null = null;

/** SmoothScroll registers its Lenis instance here (window.lenis is Lenis's own metadata). */
export function setSmoothScroller(s: SmoothScroller | null) {
  scroller = s;
}

export function scrollToId(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  if (scroller) {
    scroller.scrollTo(id === "top" ? 0 : el, { offset: -80 });
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "top") window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/* ---------- Local time in Poland ---------- */

const warsaw = new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit", hour12: false });

/** "14:32" in Europe/Warsaw, refreshed every 15 s; null until mounted (no hydration mismatch). */
export function useWarsawTime() {
  const [time, setTime] = useState<{ text: string; hour: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const text = warsaw.format(new Date());
      setTime({ text, hour: parseInt(text.slice(0, 2), 10) });
    };
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return time;
}

/** A short, honest note about what the hour means. */
export function dayNote(hour: number) {
  if (hour < 6) return "pewnie śpię";
  if (hour < 10) return "rano, kawa";
  if (hour < 18) return "w ciągu dnia";
  if (hour < 23) return "wieczór";
  return "późno, ale jeszcze siedzę";
}

/* ---------- Platform ---------- */

function noop() {
  return () => {};
}

/** True on Apple platforms, for showing ⌘ instead of Ctrl. False during SSR. */
export function useIsMac() {
  return useSyncExternalStore(noop, () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent), () => false);
}
