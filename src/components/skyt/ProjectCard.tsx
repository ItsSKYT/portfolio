"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cx, vars } from "@/lib/cx";
import { useReducedMotion } from "@/lib/motion";
import { Arrow } from "./Arrow";
import { StatusBadge, Tag, type Status } from "./Primitives";

/** Project tile: tilts toward the pointer, a signal-soft spotlight under it, a signal arc lighting the border. */
export function ProjectCard({
  title,
  href,
  external,
  index,
  year,
  role,
  description,
  stack = [],
  facts = [],
  status,
  statusLabel,
  tilt = true,
  className,
}: {
  /** Short label/value pairs shown as a definition list (role, start date…). */
  facts?: { label: string; value: string }[];
  title: string;
  href?: string;
  external?: boolean;
  index?: string;
  year?: string;
  role?: string;
  description?: ReactNode;
  stack?: string[];
  status?: Status;
  statusLabel?: string;
  tilt?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${(px * 100).toFixed(2)}%`);
    el.style.setProperty("--py", `${(py * 100).toFixed(2)}%`);
    if (tilt && !reduced) {
      el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
    }
  }

  function onPointerLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <article
      ref={ref}
      className={cx("sk-card", href && "sk-card--link", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="sk-card__top">
        {index && <span className="sk-card__index">{index}</span>}
        {year && <span className="sk-card__year">{year}</span>}
        {status && (
          <StatusBadge status={status} className="sk-card__status">
            {statusLabel}
          </StatusBadge>
        )}
      </div>
      <h3 className="sk-card__title heading">
        {href ? (
          <a
            className="sk-card__link"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            data-cursor="Otwórz"
          >
            {title}
            <Arrow className="sk-card__arrow" />
          </a>
        ) : (
          title
        )}
      </h3>
      {role && <p className="sk-card__role">{role}</p>}
      {description && <p className="sk-card__desc">{description}</p>}
      {facts.length > 0 && (
        <dl className="sk-card__facts">
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {stack.length > 0 && (
        <ul className="sk-card__stack" aria-label="Stack">
          {stack.map((s, i) => (
            <li key={s} style={vars({ "--i": i })}>
              <Tag>{s}</Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
