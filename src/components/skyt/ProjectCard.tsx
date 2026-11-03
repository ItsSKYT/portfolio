"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { cx, vars } from "@/lib/cx";
import { createFollower, useReducedMotion } from "@/lib/motion";
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
  const tiltFollower = useRef<ReturnType<typeof createFollower> | null>(null);
  const spot = useRef({ x: 50, y: 50, raf: 0 });
  const reduced = useReducedMotion();

  useEffect(
    () => () => {
      tiltFollower.current?.stop();
      cancelAnimationFrame(spot.current.raf);
    },
    [],
  );

  function setTilt(rx: number, ry: number) {
    tiltFollower.current ??= createFollower((x, y) => {
      ref.current?.style.setProperty("--rx", `${x.toFixed(2)}deg`);
      ref.current?.style.setProperty("--ry", `${y.toFixed(2)}deg`);
    }, 0.12);
    tiltFollower.current.set(rx, ry);
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    // Spotlight: at most one style write per frame, however fast the pointer events come.
    spot.current.x = px * 100;
    spot.current.y = py * 100;
    if (!spot.current.raf) {
      spot.current.raf = requestAnimationFrame(() => {
        spot.current.raf = 0;
        el.style.setProperty("--px", `${spot.current.x.toFixed(1)}%`);
        el.style.setProperty("--py", `${spot.current.y.toFixed(1)}%`);
      });
    }
    if (tilt && !reduced) setTilt((0.5 - py) * 6, (px - 0.5) * 8);
  }

  function onPointerLeave() {
    if (tiltFollower.current) setTilt(0, 0);
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
