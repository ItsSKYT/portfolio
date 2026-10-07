"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/data/site";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Magnetic } from "../fx/Magnetic";
import { Lines, Reveal, Rule } from "../fx/Reveal";
import { SectionLabel } from "./SectionLabel";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  return (
    <section ref={ref} id="kontakt" className="section-y relative overflow-hidden !pb-0">
      <div className="wrap">
        <SectionLabel id="kontakt" />

        <motion.div style={{ y }} className="gap-head">
          <h2 className="text-[15vw] font-semibold leading-[0.9] tracking-[-0.055em] lg:text-[10.5rem]">
            <Lines lines={site.contact.headingLines} />
          </h2>
        </motion.div>

        <div className="gap-body grid items-end gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <Reveal className="t-body max-w-[40ch] text-white/60">
              <p>{site.contact.text}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 sm:mt-10">
              <a
                href={`mailto:${site.contact.email}`}
                className="link-line break-all pb-2 text-[2rem] font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]"
              >
                {site.contact.email}
              </a>
            </Reveal>
          </div>
          <div className="flex md:col-span-4 md:justify-end">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.25 }}
            >
              <Magnetic
                href={`mailto:${site.contact.email}`}
                strength={0.3}
                className="group relative grid h-36 w-36 place-items-center overflow-hidden rounded-full border border-white/80 transition-colors duration-500 hover:border-white sm:h-44 sm:w-44"
              >
                <span className="fill-wipe absolute inset-0 rounded-full bg-white" aria-hidden />
                <span className="relative flex flex-col items-center gap-1.5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-500 ease-out-soft group-hover:text-black">
                  <span className="text-2xl leading-none transition-transform duration-500 ease-out-soft group-hover:rotate-45" aria-hidden>↗</span>
                  {site.hero.secondaryCta.label}
                </span>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        <div className="gap-body">
          <p className="t-label mb-4 text-white/45 sm:mb-5">Social</p>
          <Rule className="bg-white/15" />
          <ul className="grid sm:grid-cols-3">
            {site.contact.socials.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
                className="border-b border-white/15 sm:border-b-0 sm:border-l sm:first:border-l-0"
              >
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between py-6 text-[1.375rem] font-medium tracking-[-0.025em] sm:py-8 sm:text-2xl ${
                    i === 0 ? "sm:pr-8" : "sm:px-8"
                  }`}
                >
                  <span className="relative -my-[0.15em] overflow-hidden py-[0.15em]">
                    <span className="block transition-transform duration-[650ms] ease-wipe group-hover:-translate-y-[130%]">
                      {s.label}
                    </span>
                    <span className="absolute left-0 top-[130%] block transition-transform duration-[650ms] ease-wipe group-hover:-translate-y-[130%]" aria-hidden>
                      {s.label}
                    </span>
                  </span>
                  <span className="text-white/45 transition-[transform,color] duration-500 ease-out-soft group-hover:rotate-45 group-hover:text-white" aria-hidden>↗</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="wrap mt-24 sm:mt-32 lg:mt-40">
        <Rule className="bg-white/15" />
        <div className="t-label flex flex-col gap-3 py-8 text-white/45 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <p>
            © {site.footer.year} {site.name}
          </p>
          <p>{site.footer.note}</p>
          <a href="#top" className="link-draw self-start pb-0.5 hover:text-white sm:self-auto">
            Do góry ↑
          </a>
        </div>
      </footer>
    </section>
  );
}
