"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { vars } from "@/lib/cx";

const CLICKS_NEEDED = 3;
/** Clicks have to come quickly, otherwise the count starts over. */
const CLICK_WINDOW_MS = 2500;

const HEART =
  "M12 20.5s-7.5-4.6-9.6-9.3C.9 7.9 2.9 4.5 6.3 4.5c2.1 0 3.8 1.2 5.7 3.4 1.9-2.2 3.6-3.4 5.7-3.4 3.4 0 5.4 3.4 3.9 6.7-2.1 4.7-9.6 9.3-9.6 9.3z";

function Heart({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={HEART} />
    </svg>
  );
}

type Copy = { heartLabel: string; question: string; yes: string; no: string; message: string; note: string; close: string };
type Scene = { floaters: CSSProperties[]; sparks: CSSProperties[]; filled: boolean[] };

/** Random layout, made in the click handler (never during render). */
function makeScene(): Scene {
  const floaters = Array.from({ length: 28 }, () =>
    vars({
      "--x": `${Math.random() * 100}%`,
      "--size": `${10 + Math.random() * 34}px`,
      "--delay": `${Math.random() * 6}s`,
      "--dur": `${7 + Math.random() * 7}s`,
      "--drift": `${(Math.random() - 0.5) * 120}px`,
      "--rot": `${(Math.random() - 0.5) * 40}deg`,
      "--o": (0.2 + Math.random() * 0.6).toFixed(2),
    }),
  );
  const sparks = Array.from({ length: 60 }, () =>
    vars({
      "--x": `${Math.random() * 100}%`,
      "--y": `${Math.random() * 100}%`,
      "--size": `${1 + Math.random() * 2}px`,
      "--delay": `${Math.random() * 4}s`,
      "--dur": `${2 + Math.random() * 3}s`,
    }),
  );
  return { floaters, sparks, filled: floaters.map(() => Math.random() > 0.55) };
}

function Question({ copy, onYes, onNo }: { copy: Copy; onYes: () => void; onNo: () => void }) {
  const yesRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    yesRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onNo();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNo]);

  return (
    <div className="egg-backdrop" data-lenis-prevent onClick={onNo}>
      <div className="egg-modal" role="dialog" aria-modal="true" aria-labelledby="egg-question" onClick={(e) => e.stopPropagation()}>
        <div className="egg-modal__top">
          <span>(Pytanie)</span>
          <Heart className="egg-modal__heart" />
        </div>
        <p id="egg-question" className="egg-modal__q">
          {copy.question}
        </p>
        <div className="egg-modal__actions">
          <button ref={yesRef} type="button" className="sk-btn sk-btn--primary sk-btn--md" onClick={onYes}>
            {copy.yes}
          </button>
          <button type="button" className="sk-btn sk-btn--ghost sk-btn--md" onClick={onNo}>
            {copy.no}
          </button>
        </div>
      </div>
    </div>
  );
}

function Love({ copy, scene, onClose }: { copy: Copy; scene: Scene; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const letters = Array.from(copy.message);

  return (
    <div className="egg-love" role="dialog" aria-modal="true" aria-label={copy.message} data-lenis-prevent onClick={onClose}>
      <div className="egg-love__glow" aria-hidden="true" />
      <div className="egg-love__sparks" aria-hidden="true">
        {scene.sparks.map((style, i) => (
          <span key={i} style={style} />
        ))}
      </div>
      <div className="egg-love__floaters" aria-hidden="true">
        {scene.floaters.map((style, i) => (
          <span key={i} style={style}>
            <Heart filled={scene.filled[i]} />
          </span>
        ))}
      </div>

      <div className="egg-love__center">
        <svg className="egg-love__heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path className="egg-love__stroke" d={HEART} pathLength={1} />
          <path className="egg-love__fill" d={HEART} />
        </svg>
        <h2 className="egg-love__word" aria-label={copy.message}>
          {letters.map((ch, i) => (
            <span key={i} aria-hidden="true" style={vars({ "--i": i })}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h2>
        <p className="egg-love__note" style={vars({ "--n": letters.length })}>
          ({copy.note})
        </p>
      </div>

      <button
        ref={closeRef}
        type="button"
        className="egg-love__close sk-link"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        {copy.close}
      </button>
    </div>
  );
}

/** A quiet heart in the footer. Three quick clicks open a question. */
export function EasterEgg({ copy }: { copy: Copy }) {
  const [stage, setStage] = useState<"idle" | "ask" | "love">("idle");
  const [scene, setScene] = useState<Scene | null>(null);
  const [pulse, setPulse] = useState(0);
  const clicks = useRef(0);
  const last = useRef(0);

  function onHeart() {
    const now = Date.now();
    clicks.current = now - last.current > CLICK_WINDOW_MS ? 1 : clicks.current + 1;
    last.current = now;
    setPulse((p) => p + 1);
    if (clicks.current >= CLICKS_NEEDED) {
      clicks.current = 0;
      setStage("ask");
    }
  }

  const close = useCallback(() => {
    clicks.current = 0;
    setStage("idle");
  }, []);

  useEffect(() => {
    if (stage === "idle") return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [stage]);

  return (
    <>
      <button type="button" className="egg-trigger" onClick={onHeart} aria-label={copy.heartLabel}>
        <span key={pulse} className={pulse ? "egg-trigger__beat" : undefined}>
          <Heart />
        </span>
      </button>
      {stage !== "idle" &&
        createPortal(
          stage === "ask" ? (
            <Question
              copy={copy}
              onYes={() => {
                setScene(makeScene());
                setStage("love");
              }}
              onNo={close}
            />
          ) : (
            scene && <Love copy={copy} scene={scene} onClose={close} />
          ),
          document.body,
        )}
    </>
  );
}
