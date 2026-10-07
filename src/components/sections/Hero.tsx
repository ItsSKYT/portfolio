"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { DUR, EASE, EASE_OUT, EASE_SMOOTH, INTRO_DELAY } from "../fx/hooks";
import { Magnetic } from "../fx/Magnetic";

function RoleCycler({ roles }: { roles: readonly string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % roles.length), 3000);
    return () => window.clearInterval(t);
  }, [roles.length]);
  return (
    <span className="relative block h-[1.3em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[i]}
          className="absolute left-0 top-0 block whitespace-nowrap"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          exit={{ y: "-105%" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR.reveal, ease: EASE_OUT, delay: INTRO_DELAY + delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const d = INTRO_DELAY;

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-between gap-12 overflow-hidden pt-28 sm:pt-32 lg:gap-10 lg:pt-36">
      {/* górny pasek informacji */}
      <motion.div style={{ opacity: fade }} className="wrap grid gap-7 md:grid-cols-12 md:gap-8">
        <div className="t-label space-y-1 text-white/45 md:col-span-3">
          <motion.p {...fadeUp(0.1)}>(Portfolio)</motion.p>
          <motion.p {...fadeUp(0.15)}>
            {site.hero.greeting} {site.name}
          </motion.p>
          <motion.p {...fadeUp(0.2)}>
            ({site.realName})
          </motion.p>
        </div>
        <motion.div {...fadeUp(0.2)} className="text-[1.625rem] font-medium leading-none tracking-[-0.03em] sm:text-3xl md:col-span-5 md:text-xl lg:text-2xl xl:text-[2rem]">
          <RoleCycler roles={site.hero.roles} />
        </motion.div>
        <motion.p
          {...fadeUp(0.3)}
          className="t-body max-w-[26rem] text-white/60 md:col-span-4 md:justify-self-end md:text-right"
        >
          {site.hero.tagline}
        </motion.p>
      </motion.div>

      {/* wielka nazwa */}
      <div className="wrap wordmark-box">
        <motion.h1 style={{ y: nameY }} aria-label={site.name} className="hero-wordmark">
          {/* Jedna wspólna maska dla całego słowa: litery wjeżdżają osobno, ale od początku stoją
              w docelowym, ciasnym rozstawie (bez przerw między literami). */}
          <span className="mask-line" aria-hidden>
            {site.name.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease: EASE_OUT, delay: d + i * 0.07 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </motion.h1>
      </div>

      {/* dolny pasek */}
      <div className="wrap pb-6 sm:pb-8">
        <motion.div
          className="h-px origin-left bg-white/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: EASE_SMOOTH, delay: d + 0.25 }}
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-6 sm:mt-6">
          <div className="t-label flex flex-wrap items-center gap-x-8 gap-y-2.5 text-white/55">
            <motion.span {...fadeUp(0.5)} className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {site.availability}
            </motion.span>
            <motion.span {...fadeUp(0.55)}>{site.location}</motion.span>
            <motion.a {...fadeUp(0.6)} href="#o-mnie" className="link-draw hidden pb-0.5 hover:text-white sm:inline">
              Przewiń ↓
            </motion.a>
          </div>
          <motion.div {...fadeUp(0.7)} className="flex items-center gap-6">
            <Magnetic
              href={site.hero.primaryCta.href}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/80 px-6 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-500 hover:border-white"
            >
              <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />
              <span className="relative transition-colors duration-500 ease-out-soft group-hover:text-black">
                {site.hero.primaryCta.label}
              </span>
              <span className="relative transition-[transform,color] duration-500 ease-out-soft group-hover:rotate-45 group-hover:text-black" aria-hidden>↗</span>
            </Magnetic>
            <Magnetic
              href={site.hero.secondaryCta.href}
              className="link-draw hidden pb-1 text-[0.9375rem] text-white/65 hover:text-white sm:inline-block"
            >
              {site.hero.secondaryCta.label}
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
