import type { ReactNode } from "react";
import { vars } from "@/lib/cx";
import { DotField } from "./Ambient";
import { Button } from "./Button";
import { Reveal, SplitText, WordCycle } from "./Motion";
import { StatusBadge, Tag } from "./Primitives";

export type HeroAction = { label: string; href: string; external?: boolean };

/** The opening screen: dot-field sky, live status, the name rising letter by letter, a cycling lead and two actions. */
export function Hero({
  name,
  role,
  lead,
  words,
  srLead,
  tagline,
  actions = [],
  aside,
}: {
  name: string;
  role: string;
  lead: string;
  words: string[];
  srLead?: string;
  tagline?: string;
  actions?: HeroAction[];
  /** Right column on wide screens (below the actions on narrow ones), e.g. a live status panel. */
  aside?: ReactNode;
}) {
  return (
    <section className="sk-hero" aria-label={name}>
      <DotField />
      <div className="sk-hero__inner">
        <div className="sk-hero__main">
          <Reveal className="sk-hero__eyebrow" variant="fade" delay={80}>
            <StatusBadge status="live">{role}</StatusBadge>
          </Reveal>
          <h1 className="sk-hero__name display-xl">
            <SplitText text={name} stagger={80} delay={160} />
          </h1>
          <Reveal as="p" className="sk-hero__lead body-l" delay={620}>
            {lead} <WordCycle words={words} srText={srLead} />
          </Reveal>
          {tagline && (
            <Reveal as="p" className="sk-hero__tagline body" delay={700}>
              {tagline}
            </Reveal>
          )}
          {actions.length > 0 && (
            <Reveal className="sk-hero__actions" delay={780}>
              {actions.map((a, i) => (
                <Button
                  key={a.label}
                  href={a.href}
                  variant={i === 0 ? "primary" : "ghost"}
                  size="lg"
                  target={a.external ? "_blank" : undefined}
                  rel={a.external ? "noopener noreferrer" : undefined}
                >
                  {a.label}
                </Button>
              ))}
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal className="sk-hero__aside" variant="blur" delay={900}>
            {aside}
          </Reveal>
        )}
      </div>
      <span className="sk-hero__scroll" aria-hidden="true">
        <span />
      </span>
    </section>
  );
}

export type Service = { title: string; text?: string; tags: string[] };

/** Numbered rows of what you do; a raised surface rises behind the hovered row. */
export function ServiceList({ items }: { items: Service[] }) {
  return (
    <ol className="sk-services">
      {items.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 90} className="sk-service">
          <span className="sk-service__index">{String(i + 1).padStart(2, "0")}</span>
          <div className="sk-service__body">
            <h3 className="sk-service__title heading">{s.title}</h3>
            {s.text && <p className="sk-service__text">{s.text}</p>}
          </div>
          <ul className="sk-service__tags" aria-label="Narzędzia">
            {s.tags.map((t, ti) => (
              <li key={t} style={vars({ "--i": ti })}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ol>
  );
}
