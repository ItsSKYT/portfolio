"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { useReducedMotion } from "@/lib/motion";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Night/Day switch. The new theme grows as a circle from the button where View Transitions exist. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const reduced = useReducedMotion();
  const next: Theme = theme === "dark" ? "light" : "dark";

  function apply() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the choice then lasts for this visit only.
    }
  }

  function onClick(e: MouseEvent<HTMLButtonElement>) {
    if (reduced || !document.startViewTransition) {
      apply();
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }

  return (
    <button
      type="button"
      className={cx("sk-theme", theme === "light" && "is-light")}
      onClick={onClick}
      aria-label={next === "light" ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
      title={next === "light" ? "Jasny motyw" : "Ciemny motyw"}
    >
      <svg className="sk-theme__moon" viewBox="0 0 20 20" width={18} height={18} aria-hidden="true" focusable="false">
        <path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      <svg className="sk-theme__sun" viewBox="0 0 20 20" width={18} height={18} aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="3.4" fill="none" stroke="currentColor" strokeWidth={1.6} />
        <path
          d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
