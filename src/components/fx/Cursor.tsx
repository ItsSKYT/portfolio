"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useRichEffects } from "./hooks";

/** Biały kursor z mix-blend-difference. Rośnie nad linkami, pokazuje etykietę z data-cursor="…". */
export function Cursor() {
  const enabled = useRichEffects();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.45 });
  const [state, setState] = useState<{ hover: boolean; label: string }>({ hover: false, label: "" });
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      const labelEl = t?.closest?.("[data-cursor]");
      const label = labelEl?.getAttribute("data-cursor") ?? "";
      const hover = !!t?.closest?.("a, button") || !!label;
      setState((s) => (s.hover === hover && s.label === label ? s : { hover, label }));
    };
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.label ? 88 : state.hover ? 52 : 12;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: size, height: size, opacity: visible ? 1 : 0, scale: down ? 0.85 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
    >
      <motion.span
        className="t-label !text-[10px] text-black"
        animate={{ opacity: state.label ? 1 : 0, scale: state.label ? 1 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        {state.label}
      </motion.span>
    </motion.div>
  );
}
