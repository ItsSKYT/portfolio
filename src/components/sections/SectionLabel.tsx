"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "../fx/hooks";
import { Rule } from "../fx/Reveal";

/** Liczba numerowanych sekcji na stronie (O mnie ... Kontakt) */
export const SECTION_TOTAL = 7;

/** Nagłówek sekcji w stylu editorial: (01)  Nazwa ........ 01 / 07 */
export function SectionLabel({ index, label, dark = false }: { index: string; label: string; dark?: boolean }) {
  const muted = dark ? "text-black/45" : "text-white/45";
  const strong = dark ? "text-black" : "text-white";
  return (
    <div>
      <div className={`t-label flex items-center justify-between pb-4 sm:pb-5 ${muted}`}>
        <motion.span
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <span>({index})</span>
          <span className={strong}>{label}</span>
        </motion.span>
        <motion.span
          className="tabular-nums"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
        >
          {index} / {String(SECTION_TOTAL).padStart(2, "0")}
        </motion.span>
      </div>
      <Rule className={dark ? "bg-black/20" : "bg-white/20"} />
    </div>
  );
}

/** Wspólny styl dużych nagłówków sekcji */
export const headingClass = "gap-head t-h2";
