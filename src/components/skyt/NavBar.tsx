"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { RollText } from "./RollText";

export type NavItem = { id: string; label: string };

/** Floating pill nav. An ink pill springs to the active link; a ghost follows hover. With spy, it follows the section in view. */
export function NavBar({
  items,
  brand,
  brandHref = "#top",
  label = "Główna",
  spy = false,
  children,
}: {
  items: NavItem[];
  brand?: string;
  brandHref?: string;
  label?: string;
  spy?: boolean;
  children?: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  // Position the pills by writing styles directly: no re-render per frame.
  useLayoutEffect(() => {
    const place = (pill: HTMLSpanElement | null, id: string | null, visible: boolean) => {
      if (!pill) return;
      const link = id ? trackRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`) : null;
      if (link) {
        pill.style.transform = `translateX(${link.offsetLeft}px)`;
        pill.style.width = `${link.offsetWidth}px`;
      }
      pill.style.opacity = link && visible ? "1" : "0";
    };
    const update = () => {
      place(pillRef.current, active, true);
      place(ghostRef.current, hover, hover !== active);
    };
    update();
    const raf = requestAnimationFrame(() => navRef.current?.classList.add("is-ready"));
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, [active, hover]);

  // Scroll-spy: whichever section crosses the middle of the viewport is active.
  useEffect(() => {
    if (!spy) return;
    const sections = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const atTop = () => {
      if (window.scrollY < 80) setActive(null);
    };
    window.addEventListener("scroll", atTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", atTop);
    };
  }, [spy, items]);

  return (
    <nav ref={navRef} className="sk-nav" aria-label={label}>
      {brand && (
        <a className="sk-nav__brand sk-roll-host" href={brandHref}>
          <RollText>{brand}</RollText>
        </a>
      )}
      <div className="sk-nav__track" ref={trackRef} onPointerLeave={() => setHover(null)}>
        <span className="sk-nav__hover" ref={ghostRef} aria-hidden="true" />
        <span className="sk-nav__pill" ref={pillRef} aria-hidden="true" />
        <ul className="sk-nav__list">
          {items.map((it) => {
            const on = it.id === active;
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  data-id={it.id}
                  className={cx("sk-nav__link", on && "is-active")}
                  aria-current={on ? "true" : undefined}
                  onClick={() => setActive(it.id)}
                  onPointerEnter={() => setHover(it.id)}
                  onFocus={() => setHover(it.id)}
                  onBlur={() => setHover(null)}
                >
                  {it.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {children && <div className="sk-nav__end">{children}</div>}
    </nav>
  );
}
