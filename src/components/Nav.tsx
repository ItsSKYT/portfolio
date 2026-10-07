"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE, EASE_OUT, INTRO_DELAY } from "./fx/hooks";
import { navLinks, site } from "@/data/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (y) => {
    setCompact(y > 40);
    if (y < window.innerHeight * 0.5) setActive("");
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: INTRO_DELAY - 0.15 }}
      >
        <motion.nav
          aria-label="Główna nawigacja"
          animate={{ paddingTop: compact ? 16 : 28, paddingBottom: compact ? 16 : 28 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="wrap flex items-center justify-between"
        >
          <a href="#top" className="text-lg font-semibold tracking-[-0.03em]">
            {site.name}
          </a>

          <ul className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            {navLinks.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`link-draw flex items-baseline gap-1.5 pb-1 text-[0.9375rem] tracking-[-0.01em] ${
                    active === l.id ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a href={`mailto:${site.contact.email}`} className="link-draw hidden pb-1 text-[0.9375rem] xl:inline-block">
            Napisz ↗
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            className="t-label relative z-[70] -m-2 p-2 xl:hidden"
          >
            <span className="relative block h-[1.5em] overflow-hidden">
              <motion.span className="block" animate={{ y: open ? "-100%" : 0 }} transition={{ duration: 0.5, ease: EASE }}>
                Menu
              </motion.span>
              <motion.span
                className="absolute left-0 top-full block"
                animate={{ y: open ? "-100%" : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                Zamknij
              </motion.span>
            </span>
          </button>
        </motion.nav>
      </motion.header>

      {/* mobilne menu pełnoekranowe */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="wrap fixed inset-0 z-[45] flex flex-col justify-between gap-10 overflow-y-auto bg-black pb-10 pt-24 xl:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <ul className="border-t border-white/15">
              {navLinks.map((l, i) => (
                <li key={l.id} className="mask-line border-b border-white/15">
                  <motion.a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 text-[2rem] font-medium leading-none tracking-[-0.04em] sm:text-[2.5rem]"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 + i * 0.05 }}
                  >
                    {l.label}
                    <span className="t-label text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex items-end justify-between gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT }}
            >
              <a href={`mailto:${site.contact.email}`} className="link-line pb-1 text-lg">
                {site.contact.email}
              </a>
              <span className="t-label text-white/40">{site.location}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
