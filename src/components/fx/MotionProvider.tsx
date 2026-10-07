"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** reducedMotion="user" → przy prefers-reduced-motion framer-motion wyłącza animacje transformacji. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
