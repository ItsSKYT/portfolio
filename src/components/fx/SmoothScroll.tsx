"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || touch) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -64 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
