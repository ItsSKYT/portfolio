"use client";

import { Fragment, type ReactNode } from "react";
import { noLongDash } from "@/lib/lanyard";

/**
 * Lekki renderer bio z Discorda (podzbiór markdown: **pogrubienie**, *kursywa*, `kod`,
 * [tekst](url) i gołe linki). Zastępuje react-markdown ze starego portfolio.
 */
const TOKEN = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|_[^_\s][^_]*_|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (!part) return null;
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__")))
      return (
        <strong key={key} className="font-medium text-white">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={key} className="border border-white/15 px-1 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    const md = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (md || /^https?:\/\//.test(part)) {
      const href = md ? md[2] : part;
      const label = md ? md[1] : part.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="link-line text-white">
          {label}
        </a>
      );
    }
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_")))
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function DiscordBio({ content, className }: { content: string; className?: string }) {
  const lines = noLongDash(content).split("\n").filter((l) => l.trim().length > 0);
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p key={i} className="not-first:mt-1.5">
          {renderInline(line, String(i))}
        </p>
      ))}
    </div>
  );
}
