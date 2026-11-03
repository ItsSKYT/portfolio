import {
  Button,
  ContactCTA,
  CursorFollower,
  Hero,
  Marquee,
  NavBar,
  NowCard,
  ProjectCard,
  Reveal,
  SectionHeader,
  ServiceList,
  Tag,
  TextLink,
  ThemeToggle,
  Timeline,
} from "@/components/skyt";
import { about, contact, experience, hero, marquee, nav, now, offline, projects, services, site, skills } from "@/content/site";

// Cached so the static page can be prerendered; refreshed whenever the cache revalidates.
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export default function Home() {
  const contactHref = site.email ? `mailto:${site.email}` : site.links.discord;

  return (
    <>
      <a className="skip-link" href="#main">
        Przejdź do treści
      </a>
      <CursorFollower />

      <header className="site-nav">
        <NavBar items={nav} brand={site.name} spy>
          <ThemeToggle />
          <Button size="sm" href="#kontakt">
            Napisz
          </Button>
        </NavBar>
      </header>

      <main id="main">
        <Hero
          name={site.name}
          role={site.role}
          lead={hero.lead}
          words={hero.words}
          srLead={hero.srLead}
          actions={[
            { label: "Zobacz projekty", href: "#projekty" },
            { label: "Napisz do mnie", href: "#kontakt" },
          ]}
        />

        <div className="marquee-band">
          <Marquee label="Technologie" items={marquee} />
        </div>

        <section className="section" id="o-mnie" aria-labelledby="h-o-mnie">
          <div className="wrap about">
            <SectionHeader index="01" eyebrow="O mnie" title="Od bazy danych po ostatni piksel." id="h-o-mnie" />
            <Reveal className="about__text body-l" delay={200}>
              {about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section" id="co-robie" aria-labelledby="h-co-robie">
          <div className="wrap">
            <SectionHeader index="02" eyebrow="Co robię" title="Cały stack, jedna osoba." id="h-co-robie" />
            <ServiceList items={services} />
          </div>
        </section>

        <section className="section" id="projekty" aria-labelledby="h-projekty">
          <div className="wrap">
            <SectionHeader index="03" eyebrow="Projekty" title="Rzeczy, które działają." id="h-projekty" />
            <div className="projects">
              <Reveal className="projects__lead">
                <ProjectCard {...projects.lead} external />
              </Reveal>
              {projects.others.map((p, i) => (
                <Reveal key={p.title} delay={120 * (i + 1)}>
                  <ProjectCard {...p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="umiejetnosci" aria-labelledby="h-umiejetnosci">
          <div className="wrap">
            <SectionHeader index="04" eyebrow="Umiejętności" title="Narzędzia na co dzień." id="h-umiejetnosci" />
            <div className="skills">
              {skills.map((group, i) => (
                <Reveal key={group.name} delay={i * 100} className="skills__group">
                  <h3 className="label skills__name">{group.name}</h3>
                  <ul className="skills__tags">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="doswiadczenie" aria-labelledby="h-doswiadczenie">
          <div className="wrap">
            <SectionHeader index="05" eyebrow="Doświadczenie" title="Krok po kroku." id="h-doswiadczenie" />
            <div className="split">
              <Timeline items={experience} />
              <div className="side">
                <Reveal className="side__block" delay={200} id="obecnie">
                  <h3 className="label side__label">
                    <b>06</b> — Obecnie
                  </h3>
                  <NowCard title={now.title} detail={now.detail} />
                  <p className="body">{now.text}</p>
                </Reveal>
                <Reveal className="side__block" delay={320} id="poza-kodem">
                  <h3 className="label side__label">
                    <b>07</b> — Poza kodem
                  </h3>
                  <p className="body">{offline.text}</p>
                  <NowCard label="Spotify" title="Czego słucham" detail="open.spotify.com" href={site.links.spotify} external />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="kontakt" aria-label="Kontakt">
          <div className="wrap">
            <ContactCTA
              lead={`08 — Kontakt · ${contact.lead}`}
              title="Napisz"
              href={contactHref}
              external={!site.email}
              links={[
                { label: "GitHub", href: site.links.github, external: true },
                { label: "Discord", href: site.links.discord, external: true },
                { label: "Spotify", href: site.links.spotify, external: true },
              ]}
            />
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <span>
          © <CopyrightYear /> {site.name}
        </span>
        <span>skyt.dev</span>
        <TextLink href="#top">Do góry ↑</TextLink>
      </footer>
    </>
  );
}
