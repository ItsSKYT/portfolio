// Everything the page says lives here. Edit copy and links in this file only.

export const site = {
  name: "SKYT",
  url: "https://skyt.dev",
  role: "Junior Full Stack Developer",
  description: "SKYT — junior full stack developer z Polski. Tworzę strony i aplikacje: frontend, backend, bazy danych i wdrożenie na serwer.",

  /** Contact address for the big "Napisz" link. Leave empty to send people to Discord instead. */
  email: "",

  links: {
    github: "https://github.com/ItsSKYT",
    discord: "https://discord.com/users/490026522560823296",
    spotify: "https://open.spotify.com/user/puede.santiago?si=677482f8b65e476e",
  },
};

export const nav = [
  { id: "o-mnie", label: "O mnie" },
  { id: "co-robie", label: "Co robię" },
  { id: "projekty", label: "Projekty" },
  { id: "umiejetnosci", label: "Umiejętności" },
  { id: "doswiadczenie", label: "Doświadczenie" },
  { id: "kontakt", label: "Kontakt" },
];

export const hero = {
  lead: "Tworzę",
  words: ["strony.", "aplikacje.", "API.", "backendy."],
  srLead: "strony i aplikacje.",
};

export const marquee = [
  "React", "Next.js", "TypeScript", "Node.js", "Express", "Prisma",
  "PostgreSQL", "MariaDB", "Tailwind CSS", "Framer Motion", "Caddy", "Cloudflare",
];

export const about = [
  "Junior, który wciąż się uczy. Na co dzień piszę w React / Next.js i Node.js.",
  "Ogarniam też to, co dzieje się dalej: bazy danych, proxy, serwery i wdrożenia.",
];

export const services = [
  { title: "Strony internetowe", tags: ["Next.js", "React", "Tailwind CSS"] },
  { title: "Aplikacje webowe", tags: ["TypeScript", "Redux", "Framer Motion"] },
  { title: "API i backend", tags: ["Node.js", "Express", "GraphQL", "tRPC"] },
  { title: "Bazy danych i wdrożenie", tags: ["PostgreSQL", "Prisma", "Caddy", "Cloudflare"] },
];

export const projects = {
  lead: {
    index: "01",
    year: "03.2025 →",
    title: "anime.surf",
    href: "https://anime.surf",
    status: "building" as const,
    statusLabel: "Wciąż rozwijany",
    role: "Owner & Maintainer",
    description: "Platforma do oglądania anime, wcześniej AniWorld.pl. Pierwsza wersja powstała w 3 dni.",
    stack: ["Next.js", "Tailwind CSS", "Node.js", "Axios", "Prisma", "MariaDB", "Express", "Caddy", "Cloudflare"],
  },
  others: [
    {
      index: "02",
      year: "2024",
      title: "MoreRP",
      status: "archived" as const,
      statusLabel: "Zamknięty",
      role: "Founder & Developer",
      description: "Serwer roleplay FiveM z whitelistą: konfiguracja, skrypty i budowa społeczności.",
      stack: ["FiveM"],
    },
  ],
};

export const skills = [
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux", "shadcn/ui"] },
  { name: "Backend", items: ["Node.js", "Express", "Axios", "GraphQL", "tRPC", "Python", "C++"] },
  { name: "Bazy danych", items: ["PostgreSQL", "MariaDB", "MongoDB", "Redis", "Prisma"] },
  { name: "DevOps i chmura", items: ["Caddy", "Cloudflare", "Windows Server", "Linux"] },
];

export const experience = [
  {
    period: "2025 — teraz",
    role: "Owner & Maintainer",
    org: "anime.surf",
    body: "Projekt zaczęty z nudów, który urósł w pełną platformę: frontend, API, baza danych i serwer.",
    current: true,
  },
  {
    period: "2024",
    role: "Founder & Developer",
    org: "MoreRP — serwer roleplay FiveM",
    body: "Konfiguracja, skrypty i rozwój społeczności serwera z whitelistą. Zamknięty po sporach w zarządzie.",
  },
  {
    period: "Wcześniej",
    role: "Developer",
    org: "Różne projekty",
    body: "Od stron internetowych po serwery FiveM.",
  },
];

export const now = {
  title: "Rozwijam anime.surf",
  detail: "React / Next.js · Node.js",
  text: "Szukam ciekawych projektów i współpracy.",
};

export const offline = {
  text: "Gry, anime i spacery z owczarkiem niemieckim.",
};

export const contact = {
  lead: "Szukam ciekawych projektów i współpracy. Zwykle odpisuję w ciągu dnia.",
};
