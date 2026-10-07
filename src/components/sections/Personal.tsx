"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { DiscordCard } from "../discord/DiscordCard";
import { DUR, EASE_OUT } from "../fx/hooks";
import { Lines, Reveal, Rule } from "../fx/Reveal";
import { SectionLabel } from "./SectionLabel";

/** Poza kodem: osobisty blok + żywy status Discord (Lanyard), w monochromatycznym stylu strony. */
export function Personal() {
  const p = site.personal;
  const spotify = site.contact.socials.find((s) => s.label === "Spotify");
  const discord = site.contact.socials.find((s) => s.label === "Discord");

  return (
    <section id="poza-kodem" className="section-y relative">
      <div className="wrap">
        <SectionLabel id="poza-kodem" />

        <div className="gap-head grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="t-h2">
              <Lines lines={p.headingLines} />
            </h2>

            <Reveal delay={0.1} className="t-lead mt-10 max-w-[22ch] sm:mt-12">
              <p>{p.lead}</p>
            </Reveal>
            <Reveal delay={0.2} className="t-body mt-6 max-w-[40ch] text-white/60 sm:mt-8">
              <p>{p.text}</p>
            </Reveal>

            <div className="mt-12 max-w-md sm:mt-14">
              <Rule className="bg-white/15" />
              <ul>
                {p.interests.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: DUR.reveal, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
                    className="flex items-baseline gap-5 border-b border-white/15 py-4"
                  >
                    <span className="t-label tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[1.0625rem] font-medium tracking-[-0.015em]">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <Reveal delay={0.2} className="t-label mt-8 flex flex-wrap gap-x-8 gap-y-3 text-white/55">
              {discord && (
                <a href={discord.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5 hover:text-white">
                  Discord ↗
                </a>
              )}
              {spotify && (
                <a href={spotify.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5 hover:text-white">
                  {p.spotifyCta} ↗
                </a>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.15} y={24} className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
            <DiscordCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
