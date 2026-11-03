"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/motion";
import { copyText, setSmoothScroller, useWarsawTime } from "@/lib/ui";

/** "Polska 14:32" for the footer; blank until mounted so the server HTML never shows a wrong time. */
export function LocalTime() {
  const time = useWarsawTime();
  return <span className="foot-time">Polska {time?.text ?? "--:--"}</span>;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Counts "1000+" up from 0 when scrolled into view, keeping the suffix. Non-numeric values show as is. */
export function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\d+)(.*)$/);
    if (!inView || !m || !el) return;
    if (reduced) {
      el.textContent = value;
      return;
    }
    const target = parseInt(m[1], 10);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      el.textContent = `${Math.round(easeOutExpo(p) * target)}${m[2]}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  return (
    <>
      <span className="sk-sr">{value}</span>
      <span ref={ref} aria-hidden="true">
        {match ? `0${match[2]}` : value}
      </span>
    </>
  );
}

/**
 * Preloader: 000 → 100, then the ground lifts away, then a signal sheet behind it.
 * Runs once per tab session; the inline script in layout.tsx adds html.is-intro before first paint.
 */
export function Intro({ name, year }: { name: string; year: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("is-intro")) return;
    const start = performance.now();
    let raf = 0;
    let leave = 0;
    let done = 0;
    const finish = () => {
      html.classList.remove("is-intro");
      try {
        sessionStorage.setItem("skyt-intro", "1");
      } catch {
        // Storage blocked: the intro simply plays again next time.
      }
    };
    const tick = (now: number) => {
      const p = easeInOut(Math.min(1, (now - start) / 1100));
      if (countRef.current) countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (now - start < 1100) {
        raf = requestAnimationFrame(tick);
        return;
      }
      leave = window.setTimeout(() => {
        rootRef.current?.classList.add("is-leaving");
        done = window.setTimeout(finish, 1050);
      }, 180);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  return (
    <div ref={rootRef} className="sk-intro" aria-hidden="true">
      <div className="sk-intro__under" />
      <div className="sk-intro__panel">
        <div className="sk-intro__top">
          <span>{name} / Portfolio</span>
          <span>{year}</span>
        </div>
        <div className="sk-intro__name">
          <span>{name}</span>
        </div>
        <div className="sk-intro__bottom">
          <span className="sk-intro__bar">
            <span ref={barRef} />
          </span>
          <span ref={countRef} className="sk-intro__count">
            000
          </span>
        </div>
      </div>
    </div>
  );
}

/** Lenis smooth scrolling on fine pointers; off for touch and reduced motion. Paused while the intro plays. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -80 } });
    setSmoothScroller(lenis);
    const html = document.documentElement;
    const sync = () => (html.classList.contains("is-intro") ? lenis.stop() : lenis.start());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mo.disconnect();
      lenis.destroy();
      setSmoothScroller(null);
    };
  }, []);
  return null;
}

/** A 2px signal line across the top that tracks how far down the page you are. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div ref={ref} className="sk-progress" aria-hidden="true" />;
}

/** Shows the address with a copy button; "Skopiowano" confirms for two seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    if (!(await copyText(email))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="sk-copy">
      <a className="sk-link" href={`mailto:${email}`}>
        {email}
      </a>
      <button type="button" className={`sk-copy__btn${copied ? " is-copied" : ""}`} onClick={copy}>
        <span className="sk-copy__label">Kopiuj</span>
        <span className="sk-copy__done">Skopiowano</span>
      </button>
      <span className="sk-sr" aria-live="polite">
        {copied ? "Adres skopiowany" : ""}
      </span>
    </div>
  );
}
