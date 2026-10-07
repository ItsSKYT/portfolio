"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/data/site";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Lines } from "../fx/Reveal";
import { SectionLabel, headingClass } from "./SectionLabel";

function MarqueeRow({ items, reverse = false }: { items: readonly string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="fade-x flex overflow-hidden whitespace-nowrap border-t border-black/10 py-5 last:border-b sm:py-7">
      <div className={`marquee flex shrink-0 items-center ${reverse ? "marquee-reverse" : ""}`}>
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`px-5 text-5xl font-semibold leading-[1.05] tracking-[-0.05em] sm:px-10 sm:text-7xl lg:px-12 lg:text-[7.5rem] ${
                i % 2 === 1 ? "text-outline-dark" : ""
              }`}
            >
              {s}
            </span>
            <span className="text-xl font-light text-black/25 sm:text-3xl lg:text-4xl" aria-hidden>
              ✕
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const inset = useTransform(scrollYProgress, [0, 1], [3, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const clipPath = useMotionTemplate`inset(0% ${inset}% 0% ${inset}% round ${radius}px)`;

  const all = site.skills.flatMap((g) => g.items as readonly string[]);
  const half = Math.ceil(all.length / 2);

  return (
    <section ref={ref} id="umiejetnosci" className="relative">
      <motion.div style={{ clipPath }} className="section-y bg-white text-black">
        <div className="wrap">
          <SectionLabel id="umiejetnosci" dark />
          <h2 className={headingClass}>
            <Lines lines={["Narzędzia,", "których używam"]} />
          </h2>
        </div>

        <div className="gap-body -mx-4 -rotate-1" aria-hidden>
          <MarqueeRow items={all.slice(0, half)} />
          <MarqueeRow items={all.slice(half)} reverse />
        </div>

        <div className="wrap gap-body grid gap-x-10 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-0">
          {site.skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: i * 0.1 }}
              className="border-black/15 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="t-label flex gap-3 text-black/45">
                <span>0{i + 1}</span>
                <span className="text-black">{group.category}</span>
              </p>
              <ul className="mt-5 border-t border-black/15">
                {group.items.map((item) => (
                  <li key={item} className="group/item relative border-b border-black/10">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-px w-4 origin-left scale-x-0 bg-black transition-transform duration-500 ease-out-soft group-hover/item:scale-x-100"
                    />
                    <span className="block py-3 text-[1.0625rem] font-medium tracking-[-0.015em] transition-transform duration-500 ease-out-soft group-hover/item:translate-x-6">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
