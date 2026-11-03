"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useInView, useReducedMotion } from "@/lib/motion";

export type TimelineItem = { period?: string; role: string; org?: string; body?: ReactNode; current?: boolean };

/** Experience list: items land one by one and a signal line fills down to each dot. */
export function Timeline({ items, step = 320, className }: { items: TimelineItem[]; step?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [stepped, setStepped] = useState(0);
  const reached = reduced && inView ? items.length : stepped;

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setStepped(i);
      if (i >= items.length) window.clearInterval(t);
    }, step);
    return () => window.clearInterval(t);
  }, [inView, reduced, items.length, step]);

  // The fill ends at the centre of the last reached dot (offsets ignore the items' entrance transform).
  useLayoutEffect(() => {
    const measure = () => {
      const root = ref.current;
      const fill = fillRef.current;
      if (!root || !fill) return;
      const li = root.querySelectorAll<HTMLLIElement>(".sk-tl__item")[Math.min(reached, items.length) - 1];
      const dot = li?.querySelector<HTMLElement>(".sk-tl__dot");
      const center = li && dot ? li.offsetTop + dot.offsetTop + dot.offsetHeight / 2 : 8;
      fill.style.height = `${Math.max(0, center - 8)}px`;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reached, items.length]);

  return (
    <div ref={ref} className={cx("sk-tl", className)}>
      <div className="sk-tl__line" aria-hidden="true">
        <span className="sk-tl__fill" ref={fillRef} />
      </div>
      <ol className="sk-tl__list">
        {items.map((it, i) => (
          <li key={i} className={cx("sk-tl__item", i < reached && "is-on", it.current && "sk-tl__item--current")}>
            <span className="sk-tl__dot" aria-hidden="true" />
            {it.period && <p className="sk-tl__period">{it.period}</p>}
            <h3 className="sk-tl__role title">{it.role}</h3>
            {it.org && <p className="sk-tl__org">{it.org}</p>}
            {it.body && <p className="sk-tl__body">{it.body}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
