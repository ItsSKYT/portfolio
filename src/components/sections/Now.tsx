"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Lines, Reveal, Rule } from "../fx/Reveal";
import { SectionLabel } from "./SectionLabel";

/** (06) Obecnie: czym się teraz zajmuję, w juniorskim duchu "wciąż się uczę". */
export function Now() {
  const { headingLines, intro, items } = site.now;
  return (
    <section id="obecnie" className="section-y relative">
      <div className="wrap">
        <SectionLabel id="obecnie" />

        <div className="gap-head grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 className="t-h2">
              <Lines lines={headingLines} />
            </h2>
            <Reveal delay={0.15} className="t-body mt-8 max-w-[34ch] text-white/60 sm:mt-10">
              <p>{intro}</p>
            </Reveal>
            <Reveal delay={0.25} className="t-label mt-8 flex items-center gap-2 text-white/55 sm:mt-10">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {site.role}
            </Reveal>
          </div>

          <ol className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7 md:pt-3">
            {items.map((item, i) => (
              <li key={item.title} className="not-first:mt-0">
                <Rule className="bg-white/15" delay={i * 0.08} />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
                  className="grid grid-cols-12 gap-x-4 gap-y-3 py-8 sm:gap-x-6 sm:py-10"
                >
                  <p className="t-label col-span-12 flex gap-3 text-white/45 sm:col-span-4 sm:pt-2">
                    <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-white/70">{item.label}</span>
                  </p>
                  <div className="col-span-12 sm:col-span-8">
                    <h3 className="t-h3 font-medium">{item.title}</h3>
                    <p className="t-body mt-2 max-w-[38ch] text-white/60">{item.text}</p>
                  </div>
                </motion.div>
              </li>
            ))}
            <Rule className="bg-white/15" delay={items.length * 0.08} />
          </ol>
        </div>
      </div>
    </section>
  );
}
