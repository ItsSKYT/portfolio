# skyt.dev

SKYT's portfolio, built on the skyt.dev design system: Night/Day themes, motion tokens and animated React components.

## Run

```bash
npm install
npm run dev
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | All copy and links. Edit text here. Set `email` to route the big "Napisz" link to mail (empty = Discord). |
| `design/tokens.json` | Design tokens (colours per theme, type, spacing, radii, shadows, durations, easings). |
| `src/styles/tokens.css` | Generated from `tokens.json` by `npm run tokens`. Don't edit by hand. |
| `src/styles/skyt.css` | Component styles; every value comes from a token. |
| `src/components/skyt/` | The components: Hero, NavBar, ProjectCard, Timeline, ContactCTA, DotField, CursorFollower, ThemeToggle… |
| `src/app/` | Layout (fonts via `next/font`, metadata, theme bootstrap) and the page. |

## Motion

Entrances run once when a block scrolls into view; hover responses are instant. Everything honours
`prefers-reduced-motion` (short fades only, no tilt, no loops). Content stays visible without JavaScript.
