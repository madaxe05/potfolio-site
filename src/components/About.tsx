import Image from "next/image";
import {
  ArrowUpRightIcon,
  ArrowDownIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import { shipped } from "@/data/projects";
import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-shell">
        <p className="section-eyebrow">
          <span>05 / Behind the work</span>
          <span>Developer. Builder. Always learning.</span>
        </p>
        <div className="about-grid">
          <Reveal className="about-portrait">
            <div className="about-photo">
              <Image
                src="/portrait.jpg"
                alt="Sohan Dhungel in Kathmandu"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-[50%_30%]"
              />
              <span className="photo-caption">
                <MapPinIcon size={15} aria-hidden />
                Kathmandu, Nepal
              </span>
            </div>
            <div className="about-photo-note">
              <span>Curiosity is the starting point.</span>
              <span className="text-accent">Always.</span>
            </div>
          </Reveal>
          <Reveal index={1} className="about-story">
            <SectionHeading>A little about me.</SectionHeading>
            <p className="about-lead">
              I’m Sohan — a software developer who likes turning “what if” into
              something you can use.
            </p>
            <p>
              I completed a two-month software engineering internship at{" "}
              <a
                href={site.experience[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Octacore Solutions <ArrowUpRightIcon size={14} aria-hidden />
              </a>
              . I build Android apps, experiment with the web, and learn game
              development in Godot.
            </p>
            <p>
              From a grocery list to a blockchain document verifier, I care
              about the same things: a clear purpose, a considered interface,
              and software that holds up when people actually use it.
            </p>
            <div className="about-facts">
              <div>
                <strong>{shipped.length}</strong>
                <span>Apps & games shipped</span>
              </div>
              <div>
                <strong>BE</strong>
                <span>Computer Engineering</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Independent studios</span>
              </div>
            </div>
            <a href={site.cv} download className="button-secondary">
              Download my CV <ArrowDownIcon size={17} aria-hidden />
            </a>
          </Reveal>
        </div>
        <div className="background-grid">
          <Reveal>
            <div className="background-card">
              <p className="section-eyebrow">Experience</p>
              {site.experience.map((e) => (
                <div className="background-entry" key={e.role}>
                  <div>
                    <h3>{e.role}</h3>
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-link"
                    >
                      {e.org}
                      <ArrowUpRightIcon size={13} aria-hidden />
                    </a>
                  </div>
                  <span>{e.current ? "Current" : e.period}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal index={1}>
            <div className="background-card">
              <p className="section-eyebrow">Where I learned</p>
              {site.education.map((e) => (
                <div className="background-entry" key={e.degree}>
                  <div>
                    <h3>{e.degree}</h3>
                    <p>{e.school}</p>
                  </div>
                  <span>{e.years}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
