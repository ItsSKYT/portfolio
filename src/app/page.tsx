import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Now } from "@/components/sections/Now";
import { Personal } from "@/components/sections/Personal";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <a href="#o-mnie" className="skip-link t-label">
        Przejdź do treści
      </a>
      <Nav />
      <main id="top" className="relative overflow-x-clip">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Skills />
        <Experience />
        <Now />
        <Personal />
        <Contact />
      </main>
    </>
  );
}
