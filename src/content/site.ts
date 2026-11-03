// Cała treść strony w jednym miejscu. Edytuj tekst i linki tylko tutaj.

export const site = {
  /** Publiczny adres (meta/OG). Nadpisz zmienną SITE_URL przy buildzie. */
  url: process.env.SITE_URL ?? "https://skyt.dev",
  name: "SKYT",
  realName: "Sebastian",
  role: "Junior Full Stack Developer",
  location: "Polska",
  description: "SKYT, Junior Full Stack Developer. Robię strony i apki od frontu po backend. Twórca anime.surf.",
  email: "hello@skyt.dev",
  discordId: "490026522560823296",
  github: "ItsSKYT",
  availability: "Szukam ciekawych projektów",

  links: {
    github: "https://github.com/ItsSKYT",
    discord: "https://discord.com/users/490026522560823296",
    spotify: "https://open.spotify.com/user/puede.santiago?si=677482f8b65e476e",
  },

  footer: {
    year: 2026,
    note: "Zbudowane przy pomocy Next.js z nudów.",
  },
};

/** Numerowane sekcje w kolejności wyświetlania: numery w nagłówkach i nawigacji liczą się stąd. */
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

export function sectionNumber(id: SectionId) {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}

export const nav = sections.filter((s) => s.id !== "obecnie");

export const hero = {
  lead: "Tworzę",
  words: ["strony.", "aplikacje.", "API.", "backendy."],
  srLead: "strony i aplikacje.",
  tagline: "Wciąż się uczę, ale myślę, że wychodzi mi to nienajgorzej. Frontend, backend, baza danych, wdrożenie na serwer.",
};

export const marquee = [
  "React", "Next.js", "TypeScript", "Node.js", "Express", "Prisma",
  "PostgreSQL", "MariaDB", "Tailwind CSS", "Framer Motion", "Caddy", "Cloudflare",
];

export const about = {
  title: "Od interfejsu po produkcję.",
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
};

export const services = {
  title: "Od interfejsu po serwer.",
  kicker: "Wszystko, czego potrzebujesz do działania aplikacji.",
  items: [
    { title: "Strony internetowe", text: "Od interfejsu po gotowy, działający serwis. Najczęściej w React i Next.js.", tags: ["Next.js", "React", "Tailwind CSS"] },
    { title: "Aplikacje webowe", text: "Interaktywne aplikacje, w których front i backend grają razem.", tags: ["TypeScript", "Redux", "Framer Motion"] },
    { title: "API i backend", text: "Serwer i API, które spinają aplikację z danymi.", tags: ["Node.js", "Express", "GraphQL", "tRPC"] },
    { title: "Bazy danych i wdrożenie", text: "Bazy danych, proxy, serwer i wdrożenie. Też to, co dzieje się po premierze.", tags: ["PostgreSQL", "Prisma", "Caddy", "Cloudflare"] },
  ],
};

export const projects = {
  title: "Rzeczy, które działają.",
  lead: {
    index: "01",
    year: "od 03.2025",
    title: "anime.surf",
    href: "https://anime.surf",
    status: "building" as const,
    statusLabel: "Wciąż rozwijany",
    role: "Platforma z anime",
    description:
      "Strona do oglądania anime z masą funkcji. Jest ich tyle, że ciężko je wszystkie wypisać, najlepiej sprawdzić samemu. Projekt cały czas się rozwija i regularnie dochodzą nowe funkcje.",
    facts: [
      { label: "Rola", value: "Owner & Maintainer" },
      { label: "Start", value: "Marzec 2025" },
      { label: "Wcześniej", value: "AniWorld.pl" },
      { label: "Pierwsza wersja", value: "W 3 dni" },
    ],
    stack: ["Next.js", "Tailwind CSS", "Node.js", "Axios", "Prisma", "MariaDB", "Express", "Caddy", "Cloudflare"],
  },
  others: [
    {
      index: "02",
      year: "2024",
      title: "MoreRP",
      status: "archived" as const,
      statusLabel: "Zakończony",
      role: "Serwer RolePlay FiveM",
      description: "Serwer z whitelistą postawiony od zera: konfiguracja, skrypty, gracze, rozwój.",
      stack: ["FiveM"],
    },
  ],
};

export const skills = {
  title: "Narzędzia na co dzień.",
  groups: [
    { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux", "Shadcn/UI"] },
    { name: "Backend", items: ["Node.js", "Express", "Axios", "GraphQL", "tRPC", "Python", "C++"] },
    { name: "Bazy danych", items: ["PostgreSQL", "MariaDB", "MongoDB", "Redis", "Prisma"] },
    { name: "DevOps i chmura", items: ["Caddy", "Cloudflare", "Windows Server", "Linux"] },
  ],
};

export const experience = {
  title: "Krok po kroku.",
  items: [
    {
      period: "Od marca 2025",
      role: "Owner & Maintainer",
      org: "@anime.surf",
      body: "Wcześniej znana jako AniWorld.pl. Projekt założony właściwie z nudów. Pierwsza wersja strony powstała w 3 dni. Dużo się przy nim nauczyłem i wciąż go rozwijam.",
      current: true,
    },
    {
      period: "2024",
      role: "Założyciel & Developer",
      org: "@MoreRP",
      body: "Postawiłem serwer RolePlay na FiveM: konfiguracja, skrypty, gracze, rozwój. Wszystko od zera, własnymi rękami. Serwer (z whitelistą) był dość popularny, ale przez spory w zarządzie musiał się zakończyć.",
    },
    {
      period: "Ciężko powiedzieć",
      role: "Developer",
      org: "@Wiele różnych projektów",
      body: "Pracowałem nad wieloma projektami, od stron internetowych po serwery FiveM. Ciężko byłoby wylistować wszystkie.",
    },
  ],
};

export const now = {
  title: "Wciąż się uczę.",
  kicker: "Jestem jeszcze juniorem, czyli ciągle się uczę. Ale lubię robić rzeczy i myślę, że wychodzi mi to nienajgorzej.",
  items: [
    { label: "Rozwijam", title: "anime.surf", text: "Projekt cały czas się rozwija i regularnie dodaję nowe funkcje." },
    { label: "Na co dzień", title: "React / Next.js i Node.js", text: "Tu siedzę najczęściej, ale to nie jedyne, co potrafię." },
    { label: "Szukam", title: "Ciekawych projektów i współpracy", text: "Strony, aplikacje, API, bazy danych i wdrożenie. Mail albo Discord." },
  ],
};

export const personal = {
  title: "Poza kodem.",
  lead: "Poza kodem uwielbiam gry, oglądanie anime, spacery z moim owczarkiem niemieckim i wiele innych rzeczy.",
  text: "Najprościej złapać mnie na Discordzie. Obok widać na żywo, czy jestem dostępny i czego akurat słucham.",
  interests: ["Gry", "Anime", "Spacery z owczarkiem niemieckim"],
};

export const contact = {
  lead: "Szukam ciekawych projektów i współpracy. Mail albo Discord, zwykle odpisuję w ciągu doby.",
  title: "Napisz",
};

/** Ukryta niespodzianka: serduszko w stopce (3 szybkie kliknięcia). */
export const easterEgg = {
  heartLabel: "Serduszko",
  question: "Czy nazywasz się Gabi?",
  yes: "Tak",
  no: "Nie",
  message: "Kocham Cię",
  note: "Dla Gabi",
  close: "Zamknij",
};
