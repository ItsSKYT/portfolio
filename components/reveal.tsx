"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  index,
  title,
}: {
  index: string
  title: string
}) {
  return (
    <Reveal className="mb-12 flex items-baseline gap-4">
      <span className="font-mono text-sm text-primary">{index}</span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <span className="h-px flex-1 translate-y-[-4px] bg-border" />
    </Reveal>
  )
}
