"use client";

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type PointerEvent, type ReactNode, type Ref } from "react";
import { cx } from "@/lib/cx";
import { useReducedMotion } from "@/lib/motion";
import { Arrow } from "./Arrow";
import { RollText } from "./RollText";

type Own = {
  /** primary = signal fill (one per view); ghost = outlined; link = bare text + signal arrow. */
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  icon?: "arrow" | null;
  /** Follows the pointer a few px while hovered. Off under reduced motion. */
  magnetic?: boolean;
  className?: string;
  children?: ReactNode;
};

type LinkProps = Own & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Own> & { href: string };
type NativeButtonProps = Own & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Own> & { href?: undefined };
export type ButtonProps = LinkProps | NativeButtonProps;

/** Pill button with magnetic pull, a letter-roll label and a swapping arrow. Renders <a> when href is set. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon = "arrow", magnetic = true, className, children, ...rest } = props;
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  function setOffset(x: number, y: number) {
    ref.current?.style.setProperty("--mx", `${x.toFixed(2)}px`);
    ref.current?.style.setProperty("--my", `${y.toFixed(2)}px`);
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || !magnetic || reduced || (el instanceof HTMLButtonElement && el.disabled)) return;
    const r = el.getBoundingClientRect();
    setOffset(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6, ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 5);
  }

  const shared = {
    className: cx("sk-btn", `sk-btn--${variant}`, `sk-btn--${size}`, "sk-roll-host", className),
    onPointerMove,
    onPointerLeave: () => setOffset(0, 0),
  };

  const content = (
    <>
      <span className="sk-btn__label">{typeof children === "string" ? <RollText>{children}</RollText> : children}</span>
      {icon === "arrow" && (
        <span className="sk-btn__icon">
          <Arrow className="sk-arrow--a" />
          <Arrow className="sk-arrow--b" />
        </span>
      )}
    </>
  );

  if (typeof rest.href === "string") {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} {...shared} ref={ref as Ref<HTMLAnchorElement>}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...buttonProps} {...shared} ref={ref as Ref<HTMLButtonElement>}>
      {content}
    </button>
  );
}
