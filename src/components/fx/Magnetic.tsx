"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";
import { useRichEffects } from "./hooks";

export function Magnetic({
  children,
  href,
  className,
  strength = 0.18,
  external,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
  external?: boolean;
}) {
  const rich = useRichEffects();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.35 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!rich) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.97 }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}
