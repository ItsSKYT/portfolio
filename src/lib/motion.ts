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

/**
 * Eases a 2D value toward a target once per frame and stops when it settles.
 * Used for pointer-driven motion instead of CSS transitions, which restart on every pointermove and stutter.
 */
export function createFollower(apply: (x: number, y: number) => void, ease = 0.18) {
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let raf = 0;
  const step = () => {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    if (Math.abs(tx - x) < 0.01 && Math.abs(ty - y) < 0.01) {
      x = tx;
      y = ty;
      raf = 0;
    } else {
      raf = requestAnimationFrame(step);
    }
    apply(x, y);
  };
  return {
    set(nx: number, ny: number) {
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(step);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
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
