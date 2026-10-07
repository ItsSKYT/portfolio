"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** Animowany licznik: "30+" → liczy 0..30 i dokleja "+". Wartości nieliczbowe (np. "∞") pokazuje od razu. */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const m = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    const mm = value.match(/^(\d+)(.*)$/);
    if (!inView || !mm || !ref.current) return;
    const el = ref.current;
    const target = parseInt(mm[1], 10);
    const suffix = mm[2];
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{m ? `0${m[2]}` : value}</span>;
}
