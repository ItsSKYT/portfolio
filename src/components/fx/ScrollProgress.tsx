"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      id="scroll-progress"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-white mix-blend-difference"
      style={{ scaleX }}
    />
  );
}
