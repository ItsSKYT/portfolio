import Link from "next/link";
import { site } from "@/data/site";

export const metadata = { title: "404: Nie znaleziono" };

export default function NotFound() {
  return (
    <main className="wrap flex min-h-screen flex-col justify-between py-6 sm:py-8">
      <div className="t-label flex justify-between text-white/45">
        <span>{site.name}</span>
        <span>Błąd 404</span>
      </div>
      <div>
        <h1 className="-ml-[0.04em] text-[38vw] font-semibold leading-[0.8] tracking-[-0.06em] sm:text-[30vw]">404</h1>
        <div className="mt-8 h-px bg-white/20" />
        <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <p className="t-body text-white/60">Ta strona nie istnieje albo została przeniesiona.</p>
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 self-start overflow-hidden rounded-full border border-white px-6 py-3 text-sm font-medium"
          >
            <span className="fill-wipe absolute inset-0 bg-white" aria-hidden />
            <span className="relative transition-colors duration-500 group-hover:text-black">← Wróć na stronę główną</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
