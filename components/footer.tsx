import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <span>© {new Date().getFullYear()} SKYT. Zbudowane przy pomocy Next.js z nudów.</span>
        <a href="#" className="font-mono transition-colors hover:text-primary">
          Wróć na górę ↑
        </a>
      </div>
    </footer>
  )
}
