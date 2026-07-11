"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { DiscordStatus } from "@/components/discord-status"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-x-hidden px-6 pt-32 pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 50%, transparent 92%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 30% 38%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 30% 38%, black, transparent)",
          }}
        />
        <motion.div
          className="absolute -left-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[130px]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-primary/6 blur-[120px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-56 bg-gradient-to-b from-transparent via-background/70 to-background"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.p
              variants={item}
              className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
            >
              Junior Full Stack Developer
            </motion.p>

            <motion.div variants={item} className="mt-6">
              <h1 className="text-balance font-sans text-6xl font-bold leading-[0.95] tracking-tight text-primary sm:text-8xl lg:text-[7.5rem]">
                SKYT
              </h1>
              <p className="mt-1.5 font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground sm:text-base">
                Sebastian
              </p>
            </motion.div>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              Tworzę strony i aplikacje, wciąż się uczę, ale myślę że mi to wychodzi nienajgorzej.
              Frontend, backend, baza danych, wprowadzenie na serwer.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#projekty"
                className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Zobacz projekty
              </a>
              <a
                href="#kontakt"
                className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Napisz do mnie
              </a>
            </motion.div>
          </motion.div>

          <DiscordStatus />
        </div>
      </div>

      <motion.a
        href="#o-mnie"
        aria-label="Przewiń w dół"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  )
}
