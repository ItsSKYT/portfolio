import { DiscordCard, PresencePill } from "@/components/discord/DiscordCard";
import { DiscordProvider } from "@/components/discord/DiscordProvider";
import {
  Button,
  ContactCTA,
  CopyEmail,
  Counter,
  CursorFollower,
  EasterEgg,
  Hero,
  Marquee,
  NavBar,
  ProjectCard,
  Reveal,
  SectionHeader,
  ServiceList,
  Tag,
  TextLink,
  ThemeToggle,
  Timeline,
} from "@/components/skyt";
import {
  about,
  contact,
  easterEgg,
  experience,
  hero,
  marquee,
  nav,
  now,
  personal,
  projects,
  sectionNumber,
  services,
  site,
  skills,
} from "@/content/site";

export default function Home() {
  return (
    <DiscordProvider userId={site.discordId}>
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
          tagline={hero.tagline}
          actions={[
            { label: "Zobacz projekty", href: "#projekty" },
            { label: "Napisz do mnie", href: "#kontakt" },
          ]}
          aside={<PresencePill href="#poza-kodem" />}
        />

        <div className="marquee-band">
          <Marquee label="Technologie" items={marquee} />
        </div>

        <section className="section" id="o-mnie" aria-labelledby="h-o-mnie">
          <div className="wrap">
            <div className="about">
              <SectionHeader index={sectionNumber("o-mnie")} eyebrow="O mnie" title={about.title} id="h-o-mnie" />
              <Reveal className="about__text body-l" delay={200}>
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Reveal>
            </div>
            <ul className="stats">
              {about.stats.map((s, i) => (
                <Reveal as="li" key={s.label} delay={i * 100}>
                  <span className="stats__value">
                    <Counter value={s.value} />
                  </span>
                  <span className="stats__label">{s.label}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="co-robie" aria-labelledby="h-co-robie">
          <div className="wrap">
            <SectionHeader
              index={sectionNumber("co-robie")}
              eyebrow="Co robię"
              title={services.title}
              kicker={services.kicker}
              id="h-co-robie"
            />
            <ServiceList items={services.items} />
          </div>
        </section>

        <section className="section" id="projekty" aria-labelledby="h-projekty">
          <div className="wrap">
            <SectionHeader index={sectionNumber("projekty")} eyebrow="Projekty" title={projects.title} id="h-projekty" />
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
            <SectionHeader index={sectionNumber("umiejetnosci")} eyebrow="Umiejętności" title={skills.title} id="h-umiejetnosci" />
            <div className="skills">
              {skills.groups.map((group, i) => (
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
            <SectionHeader index={sectionNumber("doswiadczenie")} eyebrow="Doświadczenie" title={experience.title} id="h-doswiadczenie" />
            <Timeline items={experience.items} />
          </div>
        </section>

        <section className="section" id="obecnie" aria-labelledby="h-obecnie">
          <div className="wrap">
            <SectionHeader index={sectionNumber("obecnie")} eyebrow="Obecnie" title={now.title} kicker={now.kicker} id="h-obecnie" />
            <ul className="now-list">
              {now.items.map((item, i) => (
                <Reveal as="li" key={item.label} delay={i * 110}>
                  <div className="now-item">
                    <p className="now-item__label">
                      {i === 0 && (
                        <span className="sk-status sk-status--live" aria-hidden="true">
                          <span className="sk-status__dot" />
                        </span>
                      )}
                      {item.label}
                    </p>
                    <h3 className="now-item__title title">{item.title}</h3>
                    <p className="body">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="poza-kodem" aria-labelledby="h-poza-kodem">
          <div className="wrap">
            <SectionHeader index={sectionNumber("poza-kodem")} eyebrow="Poza kodem" title={personal.title} id="h-poza-kodem" />
            <div className="personal">
              <div>
                <Reveal as="p" className="personal__lead body-l">
                  {personal.lead}
                </Reveal>
                <Reveal as="p" className="personal__text body" delay={120}>
                  {personal.text}
                </Reveal>
                <ul className="interests">
                  {personal.interests.map((item, i) => (
                    <Reveal as="li" key={item} delay={180 + i * 80}>
                      <span className="interests__n">{String(i + 1).padStart(2, "0")}</span>
                      <span className="interests__t">{item}</span>
                    </Reveal>
                  ))}
                </ul>
                <Reveal className="personal__links" delay={300}>
                  <TextLink tone="signal" href={site.links.discord} target="_blank" rel="noopener noreferrer">
                    Discord ↗
                  </TextLink>
                  <TextLink tone="signal" href={site.links.spotify} target="_blank" rel="noopener noreferrer">
                    Spotify ↗
                  </TextLink>
                </Reveal>
              </div>
              <Reveal delay={150}>
                <DiscordCard fallbackName={site.name} profileUrl={site.links.discord} />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section" id="kontakt" aria-label="Kontakt">
          <div className="wrap contact">
            <ContactCTA
              lead={`${sectionNumber("kontakt")} / Kontakt · ${contact.lead}`}
              title={contact.title}
              href={`mailto:${site.email}`}
              links={[
                { label: "GitHub", href: site.links.github, external: true },
                { label: "Discord", href: site.links.discord, external: true },
                { label: "Spotify", href: site.links.spotify, external: true },
              ]}
            />
            <Reveal className="contact__mail" delay={300}>
              <CopyEmail email={site.email} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <span className="site-foot__note">
          © {site.footer.year} {site.name}
          <EasterEgg copy={easterEgg} />
        </span>
        <span>{site.footer.note}</span>
        <TextLink href="#top">Do góry ↑</TextLink>
      </footer>
    </DiscordProvider>
  );
}
