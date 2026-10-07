"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { EASE, EASE_OUT, EASE_SMOOTH } from "./hooks";

const COUNT_S = 1.15;

/** Preloader: licznik 000 → 100, potem czarna kurtyna odjeżdża w górę, a za nią biała. */
export function Intro() {
  const [show, setShow] = useState(true);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = window.setTimeout(() => setShow(false), 0);
      return () => window.clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    let t = 0;
    const controls = animate(0, 100, {
      duration: COUNT_S,
      ease: EASE_SMOOTH,
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
      onComplete: () => {
        t = window.setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
        }, 180);
      },
    });
    return () => {
      controls.stop();
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" className="fixed inset-0 z-[100]" aria-hidden>
          <motion.div
            className="absolute inset-0 bg-white"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.14 }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col justify-between bg-black px-5 py-6 text-white sm:px-8 sm:py-8 lg:px-12"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="t-label flex justify-between text-white/50">
              <span>{site.name} / Portfolio</span>
              <span>{site.footer.year}</span>
            </div>
            <div className="mask-line">
              <motion.p
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
                className="text-[22vw] font-semibold leading-[0.82] tracking-[-0.06em] sm:text-[13vw]"
              >
                {site.name}
              </motion.p>
            </div>
            <div className="flex items-end justify-between gap-8">
              <div className="mb-3 h-px flex-1 overflow-hidden bg-white/15 sm:max-w-md">
                <motion.div
                  className="h-full origin-left bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: COUNT_S, ease: EASE_SMOOTH }}
                />
              </div>
              <span ref={countRef} className="font-mono text-5xl font-light tabular-nums leading-none sm:text-7xl">
                000
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
