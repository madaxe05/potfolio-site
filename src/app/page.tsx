import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { AppMarquee } from "@/components/AppMarquee";
import { Work } from "@/components/Work";
import { Playground } from "@/components/Playground";
import { Studios } from "@/components/Studios";
import { Services } from "@/components/Services";
import { Toolkit } from "@/components/Toolkit";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Grain } from "@/components/Grain";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[70]"
      >
        Skip to work
      </a>
      <Grain />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <AppMarquee />
        <Work />
        {/* 2026-08-30: ShotRail (the pinned "every screen" rail) pulled at
            Sohan's request. Component kept at src/components/ShotRail.tsx, so
            re-adding it is one import and one line. */}
        <Playground />
        <Studios />
        <Services />
        <Toolkit />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
