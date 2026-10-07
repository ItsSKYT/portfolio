"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { DUR, EASE_OUT, EASE_SMOOTH } from "./hooks";

const vp = { once: true, margin: "0px 0px -10% 0px" } as const;

/** Delikatny fade + przesunięcie. */
export function Reveal({ children, delay = 0, className, y = 20 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={{ duration: DUR.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Maskowane linie: każda linia wysuwa się spod maski (z zapasem na polskie znaki). */
export function Lines({
  lines,
  className,
  lineClassName = "",
  delay = 0,
  animateNow = false,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  animateNow?: boolean;
}) {
  const trigger = animateNow ? { animate: "show" } : { whileInView: "show", viewport: vp };
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
      aria-label={lines.join(" ")}
    >
      {lines.map((l, i) => (
        <span key={i} className="mask-line" aria-hidden>
          <motion.span
            className={`block ${lineClassName}`}
            variants={{
              hidden: { y: "115%", rotate: 1.5 },
              show: { y: 0, rotate: 0, transition: { duration: 1.2, ease: EASE_OUT } },
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Rysowana pozioma linia 1px. */
export function Rule({ className = "bg-white/15", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={vp}
      transition={{ duration: DUR.line, delay, ease: EASE_SMOOTH }}
    />
  );
}

/** Akapit, którego słowa rozjaśniają się z szarego do białego wraz ze scrollem. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}
