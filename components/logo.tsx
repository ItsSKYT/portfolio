import { LogoMark } from "@/components/logo-mark"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-6 w-6 shrink-0 text-foreground transition-colors group-hover:text-primary" />
      <span className="font-mono text-sm font-bold tracking-tight">skyt.pl</span>
    </span>
  )
}
