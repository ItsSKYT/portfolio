"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { DUR, EASE, EASE_OUT } from "../fx/hooks";
import { Lines, Reveal } from "../fx/Reveal";
import { SectionLabel } from "./SectionLabel";

/** (02) Co robię: cztery obszary, od interfejsu po serwer. */
export function Services() {
  const { headingLines, intro, items } = site.services;
  return (
    <section id="co-robie" className="section-y relative">
      <div className="wrap">
        <SectionLabel id="co-robie" />

        <div className="gap-head grid items-end gap-8 md:grid-cols-12 md:gap-8">
          <h2 className="t-h2 md:col-span-7">
            <Lines lines={headingLines} />
          </h2>
          <Reveal delay={0.15} className="t-body max-w-[38ch] text-white/60 md:col-span-5 md:justify-self-end md:pb-3">
            <p>{intro}</p>
          </Reveal>
        </div>

        <ul className="gap-body grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: DUR.reveal, ease: EASE, delay: i * 0.08 }}
              className="flex min-h-[19rem] flex-col bg-black p-6 sm:min-h-[22rem] sm:p-7 lg:min-h-[26rem] lg:p-8"
            >
              <div className="t-label flex items-center justify-between text-white/45">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden>/ {String(items.length).padStart(2, "0")}</span>
              </div>
              <motion.div
                className="flex flex-1 flex-col pt-14 sm:pt-20 lg:pt-28"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.25 + i * 0.08 }}
              >
                <h3 className="t-h3 font-medium">{item.title}</h3>
                <p className="t-body mt-3 max-w-[30ch] text-white/60">{item.text}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-8" aria-label="Technologie">
                  {item.tags.map((t) => (
                    <li key={t} className="t-label border border-white/15 px-2 py-1 !text-[10px] !leading-none text-white/60">
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
