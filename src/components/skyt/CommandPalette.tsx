"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/cx";
import { copyText, scrollToId, toast, toggleTheme, useIsMac } from "@/lib/ui";

const OPEN_EVENT = "skyt:palette";

/** Opens the palette from anywhere (the nav button, other components). */
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Command = { id: string; group: string; label: string; hint?: string; keywords?: string; run: () => void };

export type PaletteConfig = {
  sections: readonly { id: string; label: string }[];
  email: string;
  links: { label: string; href: string }[];
};

/** Lower-case, no Polish diacritics, so "umiejetnosci" finds "Umiejętności". */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l");

function useCommands({ sections, email, links }: PaletteConfig): Command[] {
  return useMemo(
    () => [
      { id: "top", group: "Sekcje", label: "Na górę", hint: "00", run: () => scrollToId("top") },
      ...sections.map((s, i) => ({
        id: `s-${s.id}`,
        group: "Sekcje",
        label: s.label,
        hint: String(i + 1).padStart(2, "0"),
        run: () => scrollToId(s.id),
      })),
      {
        id: "copy-email",
        group: "Akcje",
        label: "Kopiuj adres e-mail",
        hint: email,
        keywords: "mail kontakt",
        run: () => void copyText(email),
      },
      { id: "write", group: "Akcje", label: "Napisz maila", hint: "mailto", keywords: "kontakt email", run: () => (window.location.href = `mailto:${email}`) },
      { id: "theme", group: "Akcje", label: "Przełącz motyw", hint: "Noc / Dzień", keywords: "ciemny jasny dark light", run: () => toast(toggleTheme() === "light" ? "Motyw: Dzień" : "Motyw: Noc") },
      {
        id: "intro",
        group: "Akcje",
        label: "Odtwórz intro",
        keywords: "animacja preloader",
        run: () => {
          try {
            sessionStorage.removeItem("skyt-intro");
          } catch {
            // Without storage the intro already plays on every load.
          }
          window.scrollTo(0, 0);
          window.location.reload();
        },
      },
      ...links.map((l) => ({
        id: `l-${l.label}`,
        group: "Linki",
        label: l.label,
        hint: l.href.replace(/^https?:\/\/(www\.)?/, "").split(/[/?]/)[0],
        run: () => window.open(l.href, "_blank", "noopener,noreferrer"),
      })),
    ],
    [sections, email, links],
  );
}

/** The ⌘K / Ctrl K palette: jump to a section, copy the email, switch theme, open links. "/" opens it too. */
export function CommandPalette(config: PaletteConfig) {
  const [open, setOpen] = useState(false);
  const commands = useCommands(config);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);
  return open ? createPortal(<Dialog commands={commands} onClose={close} />, document.body) : null;
}

function Dialog({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean);
    if (!words.length) return commands;
    return commands.filter((c) => {
      const hay = fold(`${c.label} ${c.group} ${c.hint ?? ""} ${c.keywords ?? ""}`);
      return words.every((w) => hay.includes(w));
    });
  }, [commands, query]);

  const current = Math.min(active, Math.max(0, results.length - 1));

  // Focus the field, lock the page, and give focus back on close.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    // On touch screens the palette is the menu: don't pop the keyboard over it.
    if (window.matchMedia("(pointer: coarse)").matches) dialogRef.current?.focus();
    else inputRef.current?.focus();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${current}"]`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  function run(cmd: Command | undefined) {
    if (!cmd) return;
    onClose();
    // Let the dialog unmount (and the scroll lock lift) before scrolling or navigating.
    window.setTimeout(cmd.run, 0);
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((current + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((current - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[current]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  let lastGroup = "";
  const rows: ReactNode[] = [];
  results.forEach((cmd, i) => {
    if (cmd.group !== lastGroup) {
      lastGroup = cmd.group;
      rows.push(
        <li key={`g-${cmd.group}`} className="cmd__group" role="presentation">
          {cmd.group}
        </li>,
      );
    }
    rows.push(
      <li
        key={cmd.id}
        id={`${listId}-${i}`}
        data-index={i}
        role="option"
        aria-selected={i === current}
        className={cx("cmd__item", i === current && "is-active")}
        onPointerMove={() => i !== current && setActive(i)}
        onClick={() => run(cmd)}
      >
        <span>{cmd.label}</span>
        {cmd.hint && <span className="cmd__hint">{cmd.hint}</span>}
      </li>,
    );
  });

  return (
    <div className="cmd-backdrop" data-lenis-prevent onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className="cmd" role="dialog" aria-modal="true" aria-label="Paleta komend" tabIndex={-1} onKeyDown={onKeyDown}>
        <div className="cmd__field">
          <svg viewBox="0 0 20 20" width={16} height={16} aria-hidden="true" focusable="false">
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth={1.6} />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Szukaj: sekcja, akcja, link…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${current}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <ul ref={listRef} id={listId} className="cmd__list" role="listbox" aria-label="Wyniki">
          {rows}
        </ul>
        {results.length === 0 && <p className="cmd__empty">Nic nie pasuje do „{query}”.</p>}
        <div className="cmd__foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> wybierz
          </span>
          <span>
            <kbd>Enter</kbd> uruchom
          </span>
        </div>
      </div>
    </div>
  );
}

/** Nav trigger: "⌘K" / "Ctrl K" on desktop, "Menu" on small screens. */
export function PaletteButton() {
  const mac = useIsMac();
  return (
    <button type="button" className="cmd-trigger" onClick={openPalette} aria-label="Otwórz paletę komend" aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}>
      <span className="cmd-trigger__menu">Menu</span>
      <kbd className="cmd-trigger__kbd">{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}

/** Bottom-centre message for copy confirmations and palette actions. */
export function Toaster() {
  const [item, setItem] = useState<{ id: number; text: string } | null>(null);
  useEffect(() => {
    let timer = 0;
    const onToast = (e: Event) => {
      setItem({ id: Date.now(), text: (e as CustomEvent<string>).detail });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setItem(null), 2400);
    };
    window.addEventListener("skyt:toast", onToast);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("skyt:toast", onToast);
    };
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {item && (
        <span key={item.id} className="toast">
          <span className="toast__dot" aria-hidden="true" />
          {item.text}
        </span>
      )}
    </div>
  );
}
