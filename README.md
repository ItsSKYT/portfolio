# skyt.dev

Portfolio SKYT na systemie projektowym skyt.dev: motywy Noc/Dzień, tokeny ruchu i animowane komponenty React (Next.js 16, App Router).

## Rozwój

```bash
npm install
npm run dev
```

## Gdzie co jest

| Ścieżka | Co |
| --- | --- |
| `src/content/site.ts` | Cała treść i linki (sekcje, statystyki, projekty, mail, ID Discorda, serduszko). |
| `design/tokens.json` | Tokeny (kolory per motyw, typografia, odstępy, promienie, cienie, czasy, krzywe). |
| `src/styles/tokens.css` | Generowany z `tokens.json`: `npm run tokens`. Nie edytuj ręcznie. |
| `src/styles/*.css` | Style komponentów (`skyt.css`), karty Discord (`discord.css`), efektów (`fx.css`). |
| `src/components/skyt/` | Komponenty: Hero, NavBar, ProjectCard, Timeline, ContactCTA, DotField, kursor, intro, Lenis, liczniki, serduszko… |
| `src/components/discord/` | Status Discord na żywo (Lanyard: websocket + REST) i profil (dcdn.dstn.to). |
| `src/app/` | Layout (fonty `next/font`, metadane, motyw i intro przed pierwszym renderem), strona, 404, obrazek OG. |

## Build i deploy

Produkcja działa na VPS-ie: proces pm2 `SKYT` (`next start` na 127.0.0.1:3010) za Cloudflare Tunnel.

```bash
npm run build          # build serwerowy pod next start
npm start              # next start
npm run build:static   # statyczny eksport do out/ (STATIC_EXPORT=1), np. Cloudflare Pages
```

Wdrożenie na VPS-ie (z `/root/portfolio`): `bash scripts/deploy-vps.sh`. Skrypt buduje `main` obok działającej strony,
testuje go na porcie 3019, podmienia katalogi i restartuje tylko `SKYT`. Poprzednia wersja zostaje w `/root/portfolio-prev`,
a `bash scripts/deploy-vps.sh rollback` wraca do niej.

`SITE_URL` ustawia absolutne linki w metadanych (domyślnie `https://skyt.dev`).
Obrazek podglądu linku (`/opengraph-image`) generuje się przy buildzie z fontów w `assets/fonts/`.

## Ruch

Wejścia odpalają się raz, gdy blok wjeżdża w widok; reakcje na hover są natychmiastowe. Intro gra raz na sesję karty.
Wszystko respektuje `prefers-reduced-motion`, a treść jest widoczna także bez JavaScriptu.
