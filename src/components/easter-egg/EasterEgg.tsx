"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/data/site";
import { EASE, EASE_OUT } from "../fx/hooks";

const CLICKS_NEEDED = 3;
/** Kliknięcia muszą paść w miarę szybko po sobie, inaczej licznik startuje od nowa */
const CLICK_WINDOW_MS = 2500;

const HEART_PATH =
  "M12 20.5s-7.5-4.6-9.6-9.3C.9 7.9 2.9 4.5 6.3 4.5c2.1 0 3.8 1.2 5.7 3.4 1.9-2.2 3.6-3.4 5.7-3.4 3.4 0 5.4 3.4 3.9 6.7-2.1 4.7-9.6 9.3-9.6 9.3z";

function HeartIcon({ className, filled = false, strokeWidth = 1.25 }: { className?: string; filled?: boolean; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
      <path d={HEART_PATH} />
    </svg>
  );
}

type Floater = { id: number; x: number; size: number; delay: number; duration: number; drift: number; opacity: number; filled: boolean; rotate: number };
type Dot = { id: number; x: number; y: number; size: number; delay: number; duration: number };

/** Losowe parametry generowane w handlerze kliknięcia (nie w renderze). */
function makeScene() {
  const floaters: Floater[] = Array.from({ length: 28 }, (_, id) => ({
    id,
    x: Math.random() * 100,
    size: 10 + Math.random() * 34,
    delay: Math.random() * 6,
    duration: 7 + Math.random() * 7,
    drift: (Math.random() - 0.5) * 120,
    opacity: 0.15 + Math.random() * 0.55,
    filled: Math.random() > 0.55,
    rotate: (Math.random() - 0.5) * 40,
  }));
  const dots: Dot[] = Array.from({ length: 60 }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));
  return { floaters, dots };
}

/** Pełnoekranowe "Kocham Cię": litery z rozmyciem, rysowane serce z biciem, unoszące się serduszka i iskry. */
function LoveOverlay({ scene, onClose }: { scene: ReturnType<typeof makeScene>; onClose: () => void }) {
  const reduced = useReducedMotion();
  const e = site.easterEgg;
  const letters = e.message.split("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={e.message}
      data-lenis-prevent
      className="fixed inset-0 z-[85] grid cursor-pointer place-items-center overflow-hidden bg-black text-white"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
    >
      {/* miękka poświata w tle (biała, bez koloru) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 50% 50%, rgba(255,255,255,0.09), transparent 70%)" }}
      />

      {!reduced && (
        <>
          {/* iskry */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {scene.dots.map((d) => (
              <motion.span
                key={d.id}
                className="absolute rounded-full bg-white"
                style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0, 1, 0] }}
                transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* unoszące się serduszka */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {scene.floaters.map((f) => (
              <motion.span
                key={f.id}
                className="absolute bottom-0 text-white"
                style={{ left: `${f.x}%`, width: f.size, height: f.size }}
                initial={{ y: "10vh", x: 0, opacity: 0, rotate: 0 }}
                animate={{ y: "-110vh", x: [0, f.drift, -f.drift / 2, f.drift / 3], opacity: [0, f.opacity, f.opacity, 0], rotate: f.rotate }}
                transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
              >
                <HeartIcon className="h-full w-full" filled={f.filled} strokeWidth={1} />
              </motion.span>
            ))}
          </div>
        </>
      )}

      {reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {scene.floaters.slice(0, 12).map((f) => (
            <span
              key={f.id}
              className="absolute text-white"
              style={{ left: `${f.x}%`, top: `${(f.id * 37) % 90}%`, width: f.size, height: f.size, opacity: f.opacity * 0.6 }}
            >
              <HeartIcon className="h-full w-full" filled={f.filled} strokeWidth={1} />
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* serce rysowane linią, potem bije */}
        <motion.div
          aria-hidden
          className="mb-8 h-20 w-20 sm:mb-10 sm:h-28 sm:w-28"
          animate={reduced ? undefined : { scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{ duration: 1.4, delay: 2.2, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full overflow-visible" fill="none" stroke="white" strokeWidth={0.6} strokeLinejoin="round">
            <motion.path
              d={HEART_PATH}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
            />
            <motion.path
              d={HEART_PATH}
              fill="white"
              stroke="none"
              initial={reduced ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: "12px 12px" }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.7 }}
            />
          </svg>
        </motion.div>

        <h2 className="text-[17vw] font-semibold leading-[0.9] tracking-[-0.05em] sm:text-[13vw] lg:text-[11rem]" aria-label={e.message}>
          {letters.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block whitespace-pre"
              initial={reduced ? false : { opacity: 0, y: "0.35em", filter: "blur(18px)", scale: 1.25 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.6 + i * 0.08 }}
            >
              {ch}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className="t-label mt-8 text-white/55 sm:mt-10"
          initial={reduced ? false : { opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.14em" }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.6 + letters.length * 0.08 + 0.3 }}
        >
          ({e.note})
        </motion.p>
      </div>

      <motion.button
        ref={closeRef}
        type="button"
        onClick={(ev) => {
          ev.stopPropagation();
          onClose();
        }}
        className="t-label link-draw absolute bottom-8 left-1/2 -translate-x-1/2 pb-0.5 text-white/45 hover:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 3, duration: 0.8 }}
      >
        {e.close}
      </motion.button>
    </motion.div>
  );
}

/** Pytanie "Czy nazywasz się Gabi?" w monochromatycznym oknie. */
function QuestionModal({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  const e = site.easterEgg;
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    yesRef.current?.focus({ preventScroll: true });
    const onKey = (ev: KeyboardEvent) => ev.key === "Escape" && onNo();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNo]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-5"
      data-lenis-prevent
      onClick={onNo}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="egg-question"
        onClick={(ev) => ev.stopPropagation()}
        className="w-full max-w-md border border-white/20 bg-black p-7 sm:p-9"
        initial={{ opacity: 0, y: 24, clipPath: "inset(0 0 100% 0)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="t-label flex items-center justify-between text-white/45">
          <span>(Pytanie)</span>
          <HeartIcon className="h-3.5 w-3.5 text-white/60" />
        </div>
        <div className="mt-6 h-px bg-white/15" />
        <p id="egg-question" className="mt-8 text-[2rem] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[2.5rem]">
          {e.question}
        </p>
        <div className="mt-10 flex items-center gap-6">
          <button
            ref={yesRef}
            type="button"
            onClick={onYes}
            className="group relative inline-flex items-center overflow-hidden rounded-full border border-white/80 px-7 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-500 hover:border-white"
          >
            <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />
            <span className="relative transition-colors duration-500 ease-out-soft group-hover:text-black">{e.yes}</span>
          </button>
          <button type="button" onClick={onNo} className="link-draw pb-1 text-[0.9375rem] text-white/65 hover:text-white">
            {e.no}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Dyskretne serduszko w stopce. 3 kliknięcia otwierają pytanie. */
export function EasterEgg() {
  const [stage, setStage] = useState<"idle" | "ask" | "love">("idle");
  const [scene, setScene] = useState<ReturnType<typeof makeScene> | null>(null);
  const [pulse, setPulse] = useState(0);
  /** Portal montowany przy pierwszym kliknięciu i zostaje (żeby animacje wyjścia mogły się odegrać) */
  const [portalOn, setPortalOn] = useState(false);
  const clicks = useRef(0);
  const lastClick = useRef(0);

  const onHeart = () => {
    const now = Date.now();
    clicks.current = now - lastClick.current > CLICK_WINDOW_MS ? 1 : clicks.current + 1;
    lastClick.current = now;
    setPortalOn(true);
    setPulse((p) => p + 1);
    if (clicks.current >= CLICKS_NEEDED) {
      clicks.current = 0;
      setStage("ask");
    }
  };

  const close = useCallback(() => {
    clicks.current = 0;
    setStage("idle");
  }, []);

  const yes = () => {
    setScene(makeScene());
    setStage("love");
  };

  // blokada przewijania strony, gdy otwarte okno
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
      <button
        type="button"
        onClick={onHeart}
        aria-label={site.easterEgg.heartLabel}
        className="-m-2 inline-flex p-2 text-white/20 transition-colors duration-500 ease-out-soft hover:text-white/60 focus-visible:text-white/60"
      >
        <motion.span key={pulse} className="inline-flex" initial={pulse ? { scale: 1.45 } : false} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
          <HeartIcon className="h-2.5 w-2.5" strokeWidth={1.5} />
        </motion.span>
      </button>

      {portalOn &&
        createPortal(
          <AnimatePresence>
            {stage === "ask" && <QuestionModal key="ask" onYes={yes} onNo={close} />}
            {stage === "love" && scene && <LoveOverlay key="love" scene={scene} onClose={close} />}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
