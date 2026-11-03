"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

function mediaStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)");

/** True when the visitor asked the OS for less motion. Always false during SSR. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.get, () => false);
}

/** Flips to true when any part of the element is 8% inside the viewport (once, unless once=false). */
export function useInView<T extends Element>(ref: RefObject<T | null>, once = true): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once]);

  return inView;
}
