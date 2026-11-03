"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { useReducedMotion } from "@/lib/motion";

/**
 * A canvas of dots on a grid that twinkle in line-strong and warm to signal, parting slightly, under the pointer.
 * Fills its positioned parent; reads colours from the tokens and re-reads them when the theme changes.
 */
export function DotField({ gap = 24, radius = 160, className }: { gap?: number; radius?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const cur = { x: -9999, y: -9999 };
    const colors = { dot: "#5f6987", hot: "#a3b3ff" };
    const t0 = performance.now();
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;

    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors.dot = cs.getPropertyValue("--line-strong").trim() || colors.dot;
      colors.hot = cs.getPropertyValue("--signal-ink").trim() || colors.hot;
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      cur.x += (mouse.x - cur.x) * 0.14;
      cur.y += (mouse.y - cur.y) * 0.14;
      const t = (now - t0) / 1000;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - cur.x;
          const dy = y - cur.y;
          const d = Math.hypot(dx, dy) || 1;
          const k = reduced ? 0 : Math.max(0, 1 - d / radius);
          const tw = reduced ? 0.5 : (Math.sin(t * 1.3 + x * 0.045 + y * 0.07) + 1) / 2;
          const px = x + (dx / d) * k * 10;
          const py = y + (dy / d) * k * 10;
          ctx.globalAlpha = 0.28 + tw * 0.32;
          ctx.fillStyle = colors.dot;
          ctx.beginPath();
          ctx.arc(px, py, 1 + tw * 0.4, 0, Math.PI * 2);
          ctx.fill();
          if (k > 0.01) {
            ctx.globalAlpha = k;
            ctx.fillStyle = colors.hot;
            ctx.beginPath();
            ctx.arc(px, py, 1 + k * 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (cur.x < -9000) {
        cur.x = mouse.x;
        cur.y = mouse.y;
      }
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, gap, radius]);

  return <canvas ref={ref} className={cx("sk-dotfield", className)} aria-hidden="true" />;
}

/** A signal dot trailing the pointer; rings links and buttons, shows data-cursor labels. Fine pointers only. */
export function CursorFollower({ ease = 0.2 }: { ease?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const label = el?.querySelector<HTMLSpanElement>(".sk-cursor__label");
    if (!el || !label || reduced || window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let first = true;
    let raf = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (first) {
        pos.x = target.x;
        pos.y = target.y;
        first = false;
      }
      el.classList.add("is-visible");
      const hit = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], input, textarea, select, label");
      const text = hit?.getAttribute("data-cursor") ?? "";
      el.classList.toggle("is-hover", !!hit && !text);
      el.classList.toggle("is-label", !!text);
      label.textContent = text;
    };
    const onLeave = () => el.classList.remove("is-visible");
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced, ease]);

  if (reduced) return null;
  return (
    <div ref={ref} className="sk-cursor" aria-hidden="true">
      <span className="sk-cursor__label" />
    </div>
  );
}
