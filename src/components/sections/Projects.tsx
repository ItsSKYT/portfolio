"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { site } from "@/data/site";
import { DUR, EASE, EASE_OUT, useRichEffects } from "../fx/hooks";
import { Magnetic } from "../fx/Magnetic";
import { Lines, Reveal, Rule } from "../fx/Reveal";
import { SectionLabel, headingClass } from "./SectionLabel";

/** Monochromatyczny podgląd podążający za kursorem (tylko desktop). */
type Project = (typeof site.projects)[number];

function Preview({ items, active, x, y }: { items: readonly Project[]; active: number | null; x: MotionValue<number>; y: MotionValue<number> }) {
  const visible = active !== null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 h-[250px] w-[360px] overflow-hidden border border-white/20 bg-black"
      style={{ x, y, translateX: "14%", translateY: "-50%" }}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
        clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(50% 0% 50% 0%)",
      }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <motion.div className="h-full" animate={{ y: `${-(active ?? 0) * 100}%` }} transition={{ duration: 0.7, ease: EASE }}>
        {items.map((p, i) => (
          <div key={p.title} className={`pattern-${(i + 1) % 6} relative flex h-full flex-col justify-between p-5 text-white`}>
            <div className="t-label flex justify-between !text-[10px] text-white/55">
              <span>{p.category}</span>
              <span>{p.year}</span>
            </div>
            <div>
              <span className="block text-[6.5rem] font-semibold leading-[0.8] tracking-[-0.06em]">
                {String(i + 2).padStart(2, "0")}
              </span>
              <span className="mt-3 block text-lg font-medium tracking-[-0.02em]">{p.title}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}


/** Duży blok "projekt główny" w stylu case study (dla pierwszego projektu z site.projects). */
function Featured({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const innerY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 65%"] });
  const inset = useTransform(enter, [0, 1], [8, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
  const href = project.links.demo || project.links.code;
  const f = "featured" in project ? project.featured : undefined;
  const host = href ? href.replace(/^https?:\/\//, "").replace(/\/$/, "") : project.title;

  const frame = (
    <>
      <div className="t-label relative z-10 flex h-10 items-center gap-4 border-b border-white/15 bg-black px-4 text-white/45 sm:h-11">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full border border-white/40" />
          <span className="h-2 w-2 rounded-full border border-white/40" />
          <span className="h-2 w-2 rounded-full border border-white/40" />
        </span>
        <span className="mx-auto truncate border border-white/15 px-3 py-1 !text-[10px] !leading-none">{host}</span>
        <span aria-hidden className={href ? "text-white transition-transform duration-500 ease-out-soft group-hover:rotate-45" : "invisible"}>
          ↗
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          style={{ y: innerY }}
          className={`pattern-2 absolute -inset-y-[8%] inset-x-0 transition-transform duration-[900ms] ease-out-soft ${href ? "group-hover:scale-[1.035]" : ""}`}
        />
        <div className="relative flex h-full flex-col justify-between p-5 sm:p-8">
          <div className="t-label flex justify-between text-white/55">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <p className="t-label mb-3 text-white/45 sm:mb-4">01</p>
            <p className="text-[13vw] font-semibold leading-[0.85] tracking-[-0.055em] sm:text-[11vw] lg:text-[7rem] xl:text-[8.5rem]">
              {project.title}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div ref={ref} className="gap-body grid gap-10 lg:grid-cols-12 lg:gap-8">
      <motion.div style={{ clipPath }} className="lg:col-span-7">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Odwiedź"
            aria-label={`${project.title}: otwórz w nowej karcie`}
            className="group flex aspect-square flex-col overflow-hidden border border-white/15 bg-black transition-colors duration-500 hover:border-white/40 focus-visible:outline-offset-[-1px] sm:aspect-[16/11]"
          >
            {frame}
          </a>
        ) : (
          <div className="flex aspect-square flex-col overflow-hidden border border-white/15 bg-black sm:aspect-[16/11]">{frame}</div>
        )}
      </motion.div>

      <div className="flex flex-col lg:col-span-5 lg:pl-6 xl:pl-10">
        <Reveal className="t-label flex gap-3 text-white/45">
          <span>(Projekt główny)</span>
          <span className="text-white/70">{project.category}</span>
        </Reveal>
        <h3 className="mt-5 text-[2.75rem] font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[4rem]">
          <Lines lines={[project.title]} />
        </h3>
        <Reveal delay={0.1} className="t-body mt-6 max-w-[42ch] text-white/60">
          <p>{project.description}</p>
        </Reveal>

        {f && (
          <dl className="mt-10 border-b border-white/15">
            {f.facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
                className="grid grid-cols-12 gap-4 border-t border-white/15 py-3.5"
              >
                <dt className="t-label col-span-5 pt-1 text-white/45">{fact.label}</dt>
                <dd className="col-span-7 text-[0.9375rem] font-medium tracking-[-0.01em]">{fact.value}</dd>
              </motion.div>
            ))}
          </dl>
        )}

        <Reveal delay={0.2} className="mt-8">
          <p className="t-label mb-3 text-white/45">Stack</p>
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li key={t} className="t-label border border-white/15 px-2 py-1 !text-[10px] !leading-none text-white/60">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        {href && (
          <Reveal delay={0.3} className="mt-10 lg:mt-auto lg:pt-10">
            <Magnetic
              href={href}
              external
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/80 px-6 py-3.5 text-[0.9375rem] font-medium leading-none transition-colors duration-500 hover:border-white"
            >
              <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />
              <span className="relative transition-colors duration-500 ease-out-soft group-hover:text-black">
                {f?.cta ?? "Zobacz projekt"}
              </span>
              <span className="relative transition-[transform,color] duration-500 ease-out-soft group-hover:rotate-45 group-hover:text-black" aria-hidden>
                ↗
              </span>
            </Magnetic>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const rich = useRichEffects();
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 24, mass: 0.5 });
  const y = useSpring(my, { stiffness: 170, damping: 24, mass: 0.5 });
  const [main, ...others] = site.projects as readonly Project[];
  const showPreview = rich && others.length > 0;

  const onMove = (e: PointerEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section id="projekty" className="section-y relative">
      <div className="wrap">
        <SectionLabel id="projekty" />
        <div className="flex items-end justify-between gap-6">
          <h2 className={headingClass}>
            <Lines lines={["Wybrane", "realizacje"]} />
          </h2>
          <span className="t-label pb-2 tabular-nums text-white/45">
            ({String(site.projects.length).padStart(2, "0")})
          </span>
        </div>

        {main && <Featured project={main} />}

        {/* Pozostałe projekty: wiersze z odwróceniem po najechaniu (tylko gdy mają link) */}
        {others.length > 0 && (
        <div className="gap-body">
          <Rule className="bg-white/15" />
          <ul onPointerMove={showPreview ? onMove : undefined} onPointerLeave={() => setActive(null)}>
            {others.map((p, i) => {
              const href = p.links.demo || p.links.code;
              /** Klasy hover tylko dla wierszy z linkiem; wiersz bez linku jest statyczny. */
              const hv = (cls: string) => (href ? cls : "");
              const inner = (
                <>
                  {href && <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />}
                  <span className={`t-label relative col-span-2 pt-2.5 tabular-nums text-white/45 sm:col-span-1 sm:pl-4 sm:pt-4 lg:pt-5 ${hv("transition-colors duration-500 ease-out-soft group-hover:text-black/45")}`}>
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <span className="relative col-span-10 sm:col-span-11 lg:col-span-7">
                    <span className={`block text-[2rem] font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem] ${hv("transition-[transform,color] duration-700 ease-out-soft group-hover:translate-x-2 group-hover:text-black")}`}>
                      {p.title}
                    </span>
                    <span className={`t-body mt-4 block max-w-[46ch] text-white/60 sm:mt-5 ${hv("transition-colors duration-500 ease-out-soft group-hover:text-black/65")}`}>
                      {p.description}
                    </span>
                    <span className="mt-5 flex flex-wrap gap-1.5 sm:mt-6">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className={`t-label border border-white/15 px-2 py-1 !text-[10px] !leading-none text-white/60 ${hv("transition-colors duration-500 ease-out-soft group-hover:border-black/15 group-hover:text-black/65")}`}
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className={`t-label relative col-span-7 col-start-3 text-white/45 sm:col-span-6 sm:col-start-2 lg:col-span-2 lg:col-start-auto lg:pt-5 ${hv("transition-colors duration-500 ease-out-soft group-hover:text-black/55")}`}>
                    {p.category}
                  </span>
                  <span className={`t-label relative col-span-3 flex items-center justify-end gap-4 text-white/45 sm:col-span-5 sm:pr-4 lg:col-span-2 lg:items-start lg:pt-5 ${hv("transition-colors duration-500 ease-out-soft group-hover:text-black")}`}>
                    <span className="whitespace-nowrap">{p.year}</span>
                    {href && (
                      <span
                        aria-hidden
                        className={`-mt-1 text-xl leading-none text-white ${hv("transition-[transform,color] duration-500 ease-out-soft group-hover:rotate-45 group-hover:text-black")}`}
                      >
                        ↗
                      </span>
                    )}
                  </span>
                </>
              );
              const rowCls =
                "relative grid grid-cols-12 items-start gap-x-4 gap-y-5 overflow-hidden py-9 sm:gap-x-6 sm:py-12 lg:py-14";
              return (
                <motion.li
                  key={p.title}
                  initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                  whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 1.1, ease: EASE, delay: i * 0.08 }}
                  className="border-b border-white/15"
                >
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Zobacz"
                      aria-label={`${p.title}: otwórz w nowej karcie`}
                      onPointerEnter={() => showPreview && setActive(i)}
                      className={`group ${rowCls} focus-visible:outline-offset-[-1px]`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div onPointerEnter={() => setActive(null)} className={`${rowCls} cursor-default select-text`}>
                      {inner}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
        )}

        {showPreview && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.4 }}
            className="t-label mt-6 text-white/35"
          >
            Najedź na projekt, aby zobaczyć podgląd
          </motion.p>
        )}
      </div>

      <AnimatePresence>{showPreview && <Preview items={others} active={active} x={x} y={y} />}</AnimatePresence>
    </section>
  );
}
