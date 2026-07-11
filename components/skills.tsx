"use client"

import { motion } from "framer-motion"
import { Reveal, SectionHeading } from "@/components/reveal"

const groups = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux", "Shadcn/UI"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Axios", "GraphQL", "tRPC", "Python", "C++"],
  },
  {
    title: "Bazy danych",
    items: ["PostgreSQL", "MariaDB", "MongoDB", "Redis", "Prisma"],
  },
  {
    title: "DevOps & Chmura",
    items: ["Caddy", "Cloudflare", "Windows Server", "Linux"],
  },
]

export function Skills() {
  return (
    <section id="umiejetnosci" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="02" title="Stack technologiczny" />

        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((group, gi) => (
            <Reveal
              key={group.title}
              delay={gi * 0.1}
              className="rounded-2xl border border-border bg-card/50 p-8"
            >
              <h3 className="mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: gi * 0.1 + i * 0.04 }}
                    className="rounded-lg border border-border bg-secondary/60 px-3.5 py-1.5 font-mono text-sm text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
