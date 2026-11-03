"use client";

import { useRef } from "react";
import { cx, vars } from "@/lib/cx";
import { useInView } from "@/lib/motion";
import { Arrow } from "./Arrow";
import { TextLink } from "./Primitives";

export type ContactLink = { label: string; href: string; external?: boolean };

/** The last word: a giant word that fills with signal on hover, an orb arrow, and a row of links. */
export function ContactCTA({
  lead,
  title = "Napisz",
  href,
  external,
  links = [],
  className,
}: {
  lead?: string;
  title?: string;
  href: string;
  external?: boolean;
  links?: ContactLink[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={cx("sk-cta", inView && "is-in", className)}>
      {lead && <p className="sk-cta__lead">{lead}</p>}
      <a
        className="sk-cta__link"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        <span className="sk-cta__text">
          {title}
          <span className="sk-cta__fill" aria-hidden="true">
            {title}
          </span>
        </span>
        <span className="sk-cta__orb" aria-hidden="true">
          <Arrow />
        </span>
      </a>
      {links.length > 0 && (
        <ul className="sk-cta__links">
          {links.map((l, i) => (
            <li key={l.label} style={vars({ "--i": i })}>
              <TextLink
                tone="signal"
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
              >
                {l.label}
              </TextLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
