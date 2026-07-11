"use client"

import { Reveal, SectionHeading } from "@/components/reveal"

const stats = [
  { value: "1", label: "Działający własny projekt" },
  { value: "10+", label: "Zrealizowanych projektów" },
  { value: "500+", label: "Godzin nauki" },
  { value: "1000+", label: "Godzin kodowania" },
]

export function About() {
  return (
    <section id="o-mnie" className="relative -mt-20 scroll-mt-24 px-6 pb-24 pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading index="01" title="O mnie" />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="space-y-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            <p>
              Cześć! Jestem <span className="text-foreground">SKYT</span>, a tak
              naprawdę Sebastian. Jestem jeszcze juniorem czylisię uczę, ale
              lubię robić rzeczy, i myslę że wychodzi mi to nie najgorzej. Od interfejsu, przez
              API i bazę, aż po trzymanie tego na produkcji. 
            </p>
            <p>
              Najczęściej siedzę w{" "}
              <span className="text-foreground">React / Next.js</span> i{" "}
              <span className="text-foreground">Node.js</span>, ale to nie jedyne co potrafię.
              Bazy danych, proxy, serwer, wprowadzenie na serwer. Wszystko co potrzebujesz do działania aplikacji.
            </p>
            <p>
              Poza kodem uwielbiam też gry, oglądanie anime, spacery z moim owczarkiem niemieckim i wiele innych rzeczy.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50"
              >
                <div className="font-mono text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
