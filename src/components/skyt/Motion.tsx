"use client";

import { useEffect, useRef, useState, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cx, vars } from "@/lib/cx";
import { useInView, useReducedMotion } from "@/lib/motion";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** up = rise + fade · blur = de-blur · fade = opacity · clip = wipe down. */
  variant?: "up" | "blur" | "fade" | "clip";
  /** ms before it starts; stagger siblings 80-120ms apart. */
  delay?: number;
  once?: boolean;
  children?: ReactNode;
};

/** Enters once when 8% of it scrolls into view. */
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, once = true, className, style, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, once);
  return (
    <Tag
      {...rest}
      ref={ref}
      className={cx("sk-reveal", `sk-reveal--${variant}`, inView && "is-in", className)}
      style={{ ...vars({ "--sk-delay": `${delay}ms` }), ...style }}
    >
      {children}
    </Tag>
  );
}

/** Masked letters (or words) that rise in, staggered, the first time they are seen. */
export function SplitText({
  text,
  by = "char",
  stagger = by === "word" ? 70 : 32,
  delay = 0,
  as: Tag = "span",
  className,
}: {
  text: string;
  by?: "char" | "word";
  stagger?: number;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  let unit = 0;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={ref}
      className={cx("sk-split", inView && "is-in", className)}
      style={vars({ "--sk-delay": `${delay}ms`, "--sk-stagger": `${stagger}ms` })}
    >
      <span className="sk-sr">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="sk-split__word">
              {(by === "word" ? [word] : Array.from(word)).map((part, pi) => (
                <span key={pi} className="sk-split__mask">
                  <span className="sk-split__unit" style={vars({ "--i": unit++ })}>
                    {part}
                  </span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** One word at a time, sliding up through a mask. Stops on the first word under reduced motion. */
export function WordCycle({ words, interval = 2400, srText, className }: { words: string[]; interval?: number; srText?: string; className?: string }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);
  const count = words.length;

  useEffect(() => {
    if (reduced || count < 2) return;
    const t = window.setInterval(() => setTick((i) => i + 1), interval);
    return () => window.clearInterval(t);
  }, [reduced, count, interval]);

  const idx = reduced ? 0 : tick % count;
  const prev = (idx - 1 + count) % count;

  return (
    <span className={cx("sk-cycle", className)}>
      <span className="sk-sr">{srText ?? words.join(", ")}</span>
      <span className="sk-cycle__track" aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className={cx("sk-cycle__word", i === idx && "is-on", count > 2 && i === prev && tick > 0 && "is-out")}>
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Numbered section opener: index, a rule that draws itself, eyebrow, title rising word by word. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  kicker,
  id,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  kicker?: ReactNode;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <header ref={ref} className={cx("sk-section-head", inView && "is-in", className)}>
      <div className="sk-section-head__meta">
        {index && <span className="sk-section-head__index">{index}</span>}
        <span className="sk-section-head__rule" aria-hidden="true" />
        {eyebrow && <span className="sk-section-head__eyebrow">{eyebrow}</span>}
      </div>
      <h2 id={id} className="sk-section-head__title display-l">
        <SplitText text={title} by="word" delay={120} />
      </h2>
      {kicker && <p className="sk-section-head__kicker body-l">{kicker}</p>}
    </header>
  );
}
