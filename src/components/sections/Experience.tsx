"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { site } from "@/data/site";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Lines } from "../fx/Reveal";
import { SectionLabel, headingClass } from "./SectionLabel";

type Item = (typeof site.experience)[number];

function TimelineItem({ e, last }: { e: Item; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 72%", "end 62%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  return (
    <li ref={ref} className="relative pl-8 not-first:pt-14 sm:pl-14 sm:not-first:pt-16">
      <div className="relative">
        {/* odcinek linii do następnej kropki: tor + biała linia rysowana przy scrollu */}
        {!last && (
          <>
            <span
              aria-hidden
              className="absolute -left-[calc(2rem-3.5px)] top-2 h-[calc(100%+3.5rem)] w-px bg-white/12 sm:-left-[calc(3.5rem-3.5px)] sm:h-[calc(100%+4rem)] md:top-4"
            />
            <motion.span
              aria-hidden
              style={{ scaleY }}
              className="absolute -left-[calc(2rem-3.5px)] top-2 h-[calc(100%+3.5rem)] w-px origin-top bg-white sm:-left-[calc(3.5rem-3.5px)] sm:h-[calc(100%+4rem)] md:top-4"
            />
          </>
        )}
        <motion.span
          aria-hidden
          className="absolute -left-8 top-1 h-2 w-2 rounded-full bg-white ring-[5px] ring-black sm:-left-14 md:top-3"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -28% 0px" }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
        />
        <motion.div
          className={`grid gap-x-8 gap-y-3 md:grid-cols-12 ${last ? "" : "border-b border-white/10 pb-14 sm:pb-16"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: DUR.reveal, ease: EASE_OUT }}
        >
          <p className="t-label text-white/45 md:col-span-3 md:pt-2.5">{e.period}</p>
          <div className="md:col-span-4">
            <h3 className="t-h3">{e.role}</h3>
            <p className="mt-2 text-[0.9375rem] tracking-[-0.01em] text-white/45">{e.company}</p>
          </div>
          <p className="t-body mt-2 max-w-[46ch] text-white/60 md:col-span-5 md:mt-0 md:pt-1">{e.description}</p>
        </motion.div>
      </div>
    </li>
  );
}

export function Experience() {
  return (
    <section id="doswiadczenie" className="section-y relative">
      <div className="wrap">
        <SectionLabel index="05" label="Doświadczenie" />
        <h2 className={headingClass}>
          <Lines lines={["Moja droga"]} />
        </h2>
        <ol className="gap-body">
          {site.experience.map((e, i) => (
            <TimelineItem key={e.role + e.period} e={e} last={i === site.experience.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}
