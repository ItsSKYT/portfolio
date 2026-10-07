"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { Counter } from "../fx/Counter";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Reveal, Rule, ScrollText } from "../fx/Reveal";
import { SectionLabel } from "./SectionLabel";

const statCls = [
  "pr-5 sm:pr-8",
  "border-l pl-5 sm:pl-8",
  "border-t pr-5 sm:pr-8 lg:border-l lg:border-t-0 lg:pl-8",
  "border-l border-t pl-5 sm:pl-8 lg:border-t-0",
];

export function About() {
  const [first, ...rest] = site.about.paragraphs;
  return (
    <section id="o-mnie" className="section-y relative">
      <div className="wrap">
        <SectionLabel index="01" label="O mnie" />

        <div className="gap-head grid gap-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 lg:col-span-3">
            <Reveal className="t-label space-y-1 text-white/45 md:pt-3">
              <p>{site.role}</p>
              <p>
                {site.realName} / {site.location}
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <ScrollText
              text={first}
              className="t-lead max-w-[22ch] sm:max-w-[24ch] lg:max-w-[26ch]"
            />
            <div className="mt-10 grid max-w-4xl gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2 lg:gap-12">
              {rest.map((p, i) => (
                <Reveal key={i} delay={i * 0.1} className="t-body max-w-[38ch] text-white/60">
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="gap-body">
          <Rule className="bg-white/15" />
          <div className="grid grid-cols-2 lg:grid-cols-4">
          {site.about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.15 + i * 0.1 }}
              className={`border-white/15 py-8 sm:py-11 ${statCls[i] ?? ""}`}
            >
              <div className="text-[3.25rem] font-medium leading-none tracking-[-0.05em] tabular-nums sm:text-7xl lg:text-[5.5rem]">
                <Counter value={s.value} />
              </div>
              <p className="t-label mt-4 text-white/45 sm:mt-5">{s.label}</p>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
