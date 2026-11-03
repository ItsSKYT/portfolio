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
  actions = [],
}: {
  name: string;
  role: string;
  lead: string;
  words: string[];
  srLead?: string;
  actions?: HeroAction[];
}) {
  return (
    <section className="sk-hero" aria-label={name}>
      <DotField />
      <div className="sk-hero__inner">
        <Reveal className="sk-hero__eyebrow" variant="fade" delay={80}>
          <StatusBadge status="live">{role}</StatusBadge>
        </Reveal>
        <h1 className="sk-hero__name display-xl">
          <SplitText text={name} stagger={80} delay={160} />
        </h1>
        <Reveal as="p" className="sk-hero__lead body-l" delay={620}>
          {lead} <WordCycle words={words} srText={srLead} />
        </Reveal>
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
      <span className="sk-hero__scroll" aria-hidden="true">
        <span />
      </span>
    </section>
  );
}

export type Service = { title: string; tags: string[] };

/** Numbered rows of what you do; a raised surface rises behind the hovered row. */
export function ServiceList({ items }: { items: Service[] }) {
  return (
    <ol className="sk-services">
      {items.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 90} className="sk-service">
          <span className="sk-service__index">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="sk-service__title heading">{s.title}</h3>
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
