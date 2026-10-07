# Portfolio SKYT

Osobiste portfolio zbudowane w Next.js (App Router) i Tailwind CSS. Monochromatyczny, minimalistyczny design z animacjami (framer-motion + lenis).

## Treść

Cała treść strony znajduje się w jednym pliku: `src/data/site.ts` (imię, opis, umiejętności, projekty, doświadczenie, kontakt).

## Struktura

- `src/components/sections/*`: sekcje strony (Hero, O mnie, Co robię, Projekty, Umiejętności, Doświadczenie, Obecnie, Kontakt)
- `src/components/fx/*`: efekty (intro/preloader, smooth scroll, pasek postępu, kursor, reveal, magnetic, licznik)
- `src/data/site.ts`: treść
- Styl: czarno-biały, Inter Tight + Geist Mono. Animacje respektują `prefers-reduced-motion`, cięższe efekty wyłączone na urządzeniach dotykowych.

## Rozwój

```bash
npm install
npm run dev
```

## Build

`next.config.ts` ma ustawione `output: "export"`, więc `npm run build` tworzy statyczną stronę w katalogu `out/`.

Obrazek podglądu (OG) to statyczny `public/og.png` (1200x630). Zmienna `SITE_URL` ustawia absolutne linki w metadanych:

```bash
npm run build
```

Po zmianie imienia, roli lub lokalizacji odśwież obrazek podglądu:

```bash
npm run og
```

## Deploy (Cloudflare Pages)

```bash
npm run deploy
```

Przy budowaniu z repozytorium w panelu Cloudflare Pages: build command `npm run build`, output `out`, zmienna `NODE_VERSION=22`.
