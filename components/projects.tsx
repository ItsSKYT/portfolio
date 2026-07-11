"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Code2 } from "lucide-react"
import { Reveal, SectionHeading } from "@/components/reveal"

const projects = [
  {
    title: "anime.surf",
    description:
      "Strona do oglądania anime. Posiada wiele funkcji które ciężko było by wszystkie wypisać. Najlepiej abyś sam sprawdził. Tak naprawdę jest to projekt który wciąż się rozwija i dodaję nowe funkcje.",
    image: "/projects/anime-surf.png",
    tags: ["Next.js", "Tailwind CSS", "Node.js", "Axios", "Prisma", "MariaDB", "Express", "Caddy", "Cloudflare"],
    live: "https://anime.surf",
    repo: null,
  },
]

export function Projects() {
  return (
    <section id="projekty" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="03" title="Wybrane projekty" />

        <div className="space-y-6">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
              <motion.article
                whileHover={{ y: -4 }}
                className="group grid overflow-hidden rounded-3xl border border-border bg-card/50 transition-colors hover:border-primary/40 lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <Image
                    src={project.image}
                    alt={`Zrzut ekranu projektu ${project.title}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:bg-gradient-to-r" />
                </div>

                <div className="flex flex-col justify-center gap-5 p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                    <div className="flex gap-3">
                      {project.repo && <a
                        href={project.repo} target="_blank"
                        aria-label={`Repozytorium projektu ${project.title}`}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Code2 size={18} />
                      </a>}
                      <a
                        href={project.live} target="_blank"
                        aria-label={`Podgląd na żywo projektu ${project.title}`}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        <ArrowUpRight size={18} />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
