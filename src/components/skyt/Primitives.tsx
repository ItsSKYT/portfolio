import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx, vars } from "@/lib/cx";
import { Arrow } from "./Arrow";

/** Inline link whose underline draws in from the left on hover and leaves to the right. */
export function TextLink({ tone, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: "sky" | "signal" }) {
  return <a {...rest} className={cx("sk-link", tone && `sk-link--${tone}`, className)} />;
}

/** Mono pill naming a technology or a short fact. */
export function Tag({ tone = "neutral", className, ...rest }: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "signal" | "sky" }) {
  return <span {...rest} className={cx("sk-tag", `sk-tag--${tone}`, className)} />;
}

const STATUS_WORDS = { live: "Na żywo", building: "W budowie", archived: "Archiwum" } as const;
export type Status = keyof typeof STATUS_WORDS;

/** A state word with a dot: live pulses, building breathes, archived is still. The word is always shown. */
export function StatusBadge({ status = "live", children, className }: { status?: Status; children?: ReactNode; className?: string }) {
  return (
    <span className={cx("sk-status", `sk-status--${status}`, className)}>
      <span className="sk-status__dot" aria-hidden="true" />
      <span>{children ?? STATUS_WORDS[status]}</span>
    </span>
  );
}

/** Endless horizontal ticker with signal diamonds between items; pauses on hover. */
export function Marquee({
  items,
  duration = 36,
  reverse,
  size = "lg",
  label,
  className,
}: {
  items: ReactNode[];
  duration?: number;
  reverse?: boolean;
  size?: "lg" | "sm";
  label?: string;
  className?: string;
}) {
  const row = (hidden: boolean) => (
    <ul className="sk-marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="sk-marquee__item">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={cx("sk-marquee", `sk-marquee--${size}`, reverse && "sk-marquee--reverse", className)}
      style={vars({ "--sk-marquee-dur": `${duration}s` })}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div className="sk-marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** "Currently" chip with a live equalizer. With href it becomes a link. */
export function NowCard({
  label = "Obecnie",
  title,
  detail,
  playing = true,
  href,
  external,
  className,
}: {
  label?: string;
  title: ReactNode;
  detail?: ReactNode;
  playing?: boolean;
  href?: string;
  external?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <span className="sk-now__eq" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={vars({ "--i": i })} />
        ))}
      </span>
      <span className="sk-now__text">
        <span className="sk-now__label">{label}</span>
        <span className="sk-now__title">{title}</span>
        {detail && <span className="sk-now__detail">{detail}</span>}
      </span>
      {href && <Arrow className="sk-now__arrow" />}
    </>
  );
  const classes = cx("sk-now", !playing && "is-paused", href && "sk-now--link", className);
  return href ? (
    <a className={classes} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  );
}
