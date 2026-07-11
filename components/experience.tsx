"use client"

import { Reveal, SectionHeading } from "@/components/reveal"

const timeline = [
  {
    period: "od marca 2025",
    role: "Owner & Maintainer",
    company: "anime.surf",
    description:
      "Wcześniej znana jako AniWorld.pl. Projekt założony przez mnie z tak naprawdę nudów. Pierwsza wersja strony powstała w 3 dni. Dużo się nauczyłem przy tym projekcie i wciąż go rozwijam."
  },
  {
    period: "2024",
    role: "Założyciel & Developer",
    company: "MoreRP",
    description:
      "W 2024 postawiłem serwer RolePlay na FiveM. Konfiguracja, skrypty, gracze, rozwój. Wszystko od zera, własnymi rękami. Serwer był dość popularny, ale wszystko co dobre szybko się kończy. Serwer był whitelist-on a z uwagi na sprzeczki zarządowe i osoby które stały u steru musiał się zakończyć.",
  },
  {
    period: "Ciężko powiedzieć",
    role: "Developer",
    company: "Wiele różnych projektów",
    description:
      "Pracowałem nad wieloma projektami, od witryn internetowych, przez serwery fivem, ciężko by mi było wylistować wszystkie.",
  },
]

export function Experience() {
  return (
    <section id="doswiadczenie" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="04" title="Doświadczenie" />

        <div className="relative">
          <div className="absolute left-0 top-2 h-full w-px bg-border sm:left-44" />
          <div className="space-y-10">
            {timeline.map((entry, i) => (
              <Reveal key={`${entry.company}-${entry.period}`} delay={i * 0.08}>
                <div className="relative grid gap-3 pl-8 sm:grid-cols-[11rem_1fr] sm:gap-10 sm:pl-0">
                  <div className="font-mono text-sm text-muted-foreground sm:pr-8 sm:text-right">
                    {entry.period}
                  </div>
                  <div className="relative">
                    <span className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background sm:-left-[3.8rem]" />
                    <h3 className="text-lg font-semibold">
                      {entry.role}{" "}
                      <span className="text-primary">@ {entry.company}</span>
                    </h3>
                    <p className="mt-2 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
