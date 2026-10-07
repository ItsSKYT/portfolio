"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Desktop z myszką i bez prefers-reduced-motion → efekty kursora / magnes / podgląd. */
export function useRichEffects() {
  return useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
  );
}

/* Te same krzywe co w CSS (--ease-wipe, --ease-out-soft, --ease-smooth). */
export const EASE = [0.76, 0, 0.24, 1] as const; // kurtyny, wypełnienia, przejścia
export const EASE_OUT = [0.22, 1, 0.36, 1] as const; // reveal tekstu i elementów
export const EASE_SMOOTH = [0.65, 0, 0.35, 1] as const; // linie, liczniki
export const INTRO_DELAY = 1.75; // s, start animacji hero (gdy biała kurtyna odjeżdża)

/** Standardowe czasy trwania (s) */
export const DUR = { reveal: 1.1, line: 1.4, fast: 0.6 } as const;
