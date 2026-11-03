"use client";

import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type PointerEvent, type ReactNode, type Ref } from "react";
import { cx } from "@/lib/cx";
import { createFollower, useReducedMotion } from "@/lib/motion";
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
  const follower = useRef<ReturnType<typeof createFollower> | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => () => follower.current?.stop(), []);

  function pull(x: number, y: number) {
    follower.current ??= createFollower((fx, fy) => {
      offset.current = { x: fx, y: fy };
      ref.current?.style.setProperty("--mx", `${fx.toFixed(2)}px`);
      ref.current?.style.setProperty("--my", `${fy.toFixed(2)}px`);
    }, 0.2);
    follower.current.set(x, y);
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || !magnetic || reduced || (el instanceof HTMLButtonElement && el.disabled)) return;
    // Measure the resting box (minus the current pull) so the button does not chase itself.
    const r = el.getBoundingClientRect();
    const cx0 = r.left - offset.current.x + r.width / 2;
    const cy0 = r.top - offset.current.y + r.height / 2;
    pull(((e.clientX - cx0) / (r.width / 2)) * 6, ((e.clientY - cy0) / (r.height / 2)) * 5);
  }

  const shared = {
    className: cx("sk-btn", `sk-btn--${variant}`, `sk-btn--${size}`, "sk-roll-host", className),
    onPointerMove,
    onPointerLeave: () => pull(0, 0),
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
