/**
 * ============================================================
 *  CAŁA TREŚĆ STRONY W JEDNYM MIEJSCU
 *  Po edycji treści uruchom build ponownie.
 *  (po zmianie imienia/roli/lokalizacji uruchom `npm run og`, aby odświeżyć public/og.png)
 * ============================================================
 */

export const site = {
  /**
   * Publiczny adres strony (używany w meta/OG, link podglądu musi być absolutny).
   * Domyślnie Cloudflare Pages; można nadpisać zmienną SITE_URL przy buildzie
   * (np. po podpięciu własnej domeny).
   */
  url: process.env.SITE_URL ?? "https://skyt-portfolio.pages.dev",

  name: "SKYT",
  realName: "Sebastian",
  role: "Junior Full Stack Developer",
  /** Opis strony dla wyszukiwarek / podglądu linku */
  description:
    "SKYT, Junior Full Stack Developer. Robię strony i apki od frontu po backend. Twórca anime.surf.",
  /** Nie podano wprost na skyt.dev, wywnioskowane (polskojęzyczna strona). Zmień, jeśli trzeba. */
  location: "Polska",
  availability: "Szukam ciekawych projektów",

  hero: {
    greeting: "Cześć, jestem",
    /** Rotujące hasła pod imieniem w sekcji hero */
    roles: ["Junior Full Stack Developer", "React / Next.js & Node.js", "Frontend + backend", "Twórca anime.surf"],
    tagline:
      "Tworzę strony i aplikacje. Wciąż się uczę, ale myślę, że wychodzi mi to nienajgorzej. Frontend, backend, baza danych, wdrożenie na serwer.",
    primaryCta: { label: "Zobacz projekty", href: "#projekty" },
    secondaryCta: { label: "Napisz do mnie", href: "#kontakt" },
  },

  about: {
    paragraphs: [
      "Cześć! Jestem SKYT, a tak naprawdę Sebastian. Jestem jeszcze juniorem, czyli ciągle się uczę, ale lubię robić rzeczy: od interfejsu, przez API i bazę, aż po trzymanie tego na produkcji.",
      "Najczęściej siedzę w React / Next.js i Node.js, ale to nie jedyne, co potrafię. Bazy danych, proxy, serwer, wdrożenie na serwer. Wszystko, czego potrzebujesz do działania aplikacji.",
    ],
    stats: [
      { value: "1", label: "działający własny projekt" },
      { value: "10+", label: "zrealizowanych projektów" },
      { value: "500+", label: "godzin nauki" },
      { value: "1000+", label: "godzin kodowania" },
    ],
  },

  /** Sekcja "Co robię": na podstawie opisu ze skyt.dev ("od interfejsu, przez API i bazę, aż po produkcję") i realnego stacku. */
  services: {
    headingLines: ["Od interfejsu", "po serwer."],
    intro:
      "Wszystko, czego potrzebujesz do działania aplikacji. Od interfejsu, przez API i bazę, aż po trzymanie tego na produkcji.",
    items: [
      {
        title: "Strony internetowe",
        text: "Strony od interfejsu po gotowy, działający serwis. Najczęściej w React i Next.js.",
        tags: ["Next.js", "React", "Tailwind CSS"],
      },
      {
        title: "Aplikacje webowe",
        text: "Interaktywne aplikacje, w których front i backend grają razem.",
        tags: ["TypeScript", "Redux", "Framer Motion"],
      },
      {
        title: "API i backend",
        text: "Serwer i API, które spinają aplikację z danymi.",
        tags: ["Node.js", "Express", "GraphQL", "tRPC"],
      },
      {
        title: "Bazy danych i wdrożenie",
        text: "Bazy danych, proxy, serwer i wdrożenie na serwer. Też to, co dzieje się po premierze.",
        tags: ["PostgreSQL", "Prisma", "Caddy", "Cloudflare"],
      },
    ],
  },

  skills: [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux", "Shadcn/UI"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Axios", "GraphQL", "tRPC", "Python", "C++"],
    },
    {
      category: "Bazy danych",
      items: ["PostgreSQL", "MariaDB", "MongoDB", "Redis", "Prisma"],
    },
    {
      category: "DevOps & chmura",
      items: ["Caddy", "Cloudflare", "Windows Server", "Linux"],
    },
  ],

  projects: [
    {
      title: "anime.surf",
      description:
        "Strona do oglądania anime z masą funkcji. Jest ich tyle, że ciężko je wszystkie wypisać, najlepiej sprawdzić samemu. Projekt cały czas się rozwija i regularnie dochodzą nowe funkcje.",
      tags: ["Next.js", "Tailwind CSS", "Node.js", "Axios", "Prisma", "MariaDB", "Express", "Caddy", "Cloudflare"],
      links: { demo: "https://anime.surf", code: "" },
      year: "od 03.2025",
      category: "Platforma z anime",
      /** Szczegóły bloku "projekt główny" (fakty ze skyt.dev: sekcja projektów i doświadczenia) */
      featured: {
        facts: [
          { label: "Rola", value: "Owner & Maintainer" },
          { label: "Start", value: "Marzec 2025" },
          { label: "Wcześniej", value: "AniWorld.pl" },
          { label: "Pierwsza wersja", value: "W 3 dni" },
          { label: "Status", value: "Wciąż rozwijany" },
        ],
        cta: "Odwiedź anime.surf",
      },
    },
  ],

  experience: [
    {
      period: "Od marca 2025",
      role: "Owner & Maintainer",
      company: "@anime.surf",
      description:
        "Wcześniej znana jako AniWorld.pl. Projekt założony przeze mnie właściwie z nudów. Pierwsza wersja strony powstała w 3 dni. Dużo się przy nim nauczyłem i wciąż go rozwijam.",
    },
    {
      period: "2024",
      role: "Założyciel & Developer",
      company: "@MoreRP",
      description:
        "Postawiłem serwer RolePlay na FiveM: konfiguracja, skrypty, gracze, rozwój. Wszystko od zera, własnymi rękami. Serwer (z whitelistą) był dość popularny, ale przez spory w zarządzie musiał się zakończyć.",
    },
    {
      period: "Ciężko powiedzieć",
      role: "Developer",
      company: "@Wiele różnych projektów",
      description:
        "Pracowałem nad wieloma projektami, od stron internetowych po serwery FiveM. Ciężko byłoby wylistować wszystkie.",
    },
  ],

  /** Sekcja "Obecnie": juniorskie "wciąż się uczę", tylko fakty ze skyt.dev */
  now: {
    headingLines: ["Wciąż", "się uczę."],
    intro:
      "Jestem jeszcze juniorem, czyli ciągle się uczę. Ale lubię robić rzeczy i myślę, że wychodzi mi to nienajgorzej.",
    items: [
      {
        label: "Rozwijam",
        title: "anime.surf",
        text: "Projekt cały czas się rozwija i regularnie dodaję nowe funkcje.",
      },
      {
        label: "Na co dzień",
        title: "React / Next.js i Node.js",
        text: "Tu siedzę najczęściej, ale to nie jedyne, co potrafię.",
      },
      {
        label: "Szukam",
        title: "Ciekawych projektów i współpracy",
        text: "Strony, aplikacje, API, bazy danych i wdrożenie. Mail albo Discord.",
      },
    ],
  },

  /** Sekcja "Poza kodem": osobisty blok z żywym statusem Discord (Lanyard). Tylko fakty ze skyt.dev. */
  personal: {
    headingLines: ["Poza", "kodem."],
    lead: "Poza kodem uwielbiam gry, oglądanie anime, spacery z moim owczarkiem niemieckim i wiele innych rzeczy.",
    text: "Jestem jeszcze juniorem, więc ciągle się uczę. Najprościej złapać mnie na Discordzie. Obok widać na żywo, czy jestem dostępny i czego akurat słucham.",
    interests: ["Gry", "Anime", "Spacery z owczarkiem niemieckim"],
    discordCta: "Otwórz profil na Discordzie",
    spotifyCta: "Spotify",
  },

  contact: {
    /** Linie wielkiego nagłówka w sekcji kontakt */
    headingLines: ["Masz coś", "do zrobienia?", "Napisz."],
    text: "Szukam ciekawych projektów i współpracy. Mail albo Discord, zwykle odpisuję w ciągu doby.",
    email: "hello@skyt.dev",
    socials: [
      { label: "GitHub", href: "https://github.com/ItsSKYT" },
      { label: "Discord", href: "https://discord.com/users/490026522560823296" },
      { label: "Spotify", href: "https://open.spotify.com/user/puede.santiago?si=677482f8b65e476e" },
    ],
  },

  footer: {
    year: 2026,
    note: "Zbudowane przy pomocy Next.js z nudów.",
  },
} as const;

/**
 * Numerowane sekcje strony, w kolejności wyświetlania. Jedno źródło prawdy:
 * numer sekcji (01, 02...) i łączna liczba w etykietach oraz w nawigacji liczą się stąd.
 */
export const sections = [
  { id: "o-mnie", label: "O mnie" },
  { id: "co-robie", label: "Co robię" },
  { id: "projekty", label: "Projekty" },
  { id: "umiejetnosci", label: "Umiejętności" },
  { id: "doswiadczenie", label: "Doświadczenie" },
  { id: "obecnie", label: "Obecnie" },
  { id: "poza-kodem", label: "Poza kodem" },
  { id: "kontakt", label: "Kontakt" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Numer sekcji jako "01", "02"... */
export function sectionNumber(id: SectionId) {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}

export const sectionTotal = String(sections.length).padStart(2, "0");

/** Nawigacja = wszystkie numerowane sekcje (te same numery co w etykietach sekcji) */
export const navLinks = sections;
