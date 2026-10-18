import Image from "next/image";
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { demos } from "@/data/demos";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const artwork = ["ember", "brew", "aurelia", "vertex", "maison", "fitness"];
const taglines = [
  "A seat at something special.",
  "Good coffee. Higher ground.",
  "Space to live beautifully.",
  "Wear your own direction.",
  "Less, but considered.",
  "Make your next move.",
];

export function Services() {
  return (
    <section id="services" className="websites-section">
      <div className="section-shell">
        <div className="section-intro">
          <Reveal>
            <p className="section-eyebrow">
              <span>02 / Websites</span>
              <span>A good first impression</span>
            </p>
            <SectionHeading>Built for your world.</SectionHeading>
          </Reveal>
          <Reveal index={1}>
            <p className="section-description">
              Restaurants, independent brands, and businesses with a story to
              tell. Thoughtful websites that look right, work well, and make the
              next step obvious.
            </p>
          </Reveal>
        </div>
        <div className="websites-grid">
          {demos.map((d, i) => {
            const content = (
              <>
                <div className={`website-visual website-${artwork[i]}`}>
                  <div className="browser-chrome" aria-hidden>
                    <span />
                    <span />
                    <span />
                    <p>{d.href ? new URL(d.href).hostname : d.title}</p>
                    <ArrowUpRightIcon size={13} />
                  </div>
                  <div className="website-scene" aria-hidden>
                    <Image
                      src={`/websites/${artwork[i]}.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="website-scrim" />
                    <div className="website-wordmark">{d.title}</div>
                    <div className="website-headline">{taglines[i]}</div>
                    <span className="website-mini-cta">
                      Explore the collection <ArrowRightIcon size={12} />
                    </span>
                  </div>
                  <span className="website-visit">
                    Explore live website <ArrowUpRightIcon size={17} />
                  </span>
                </div>
                <div className="website-meta">
                  <div>
                    <h3>{d.title}</h3>
                    <p>{d.kind}</p>
                  </div>
                  <span className="round-arrow">
                    <ArrowUpRightIcon size={20} aria-hidden />
                  </span>
                </div>
              </>
            );
            return (
              <Reveal key={d.title} index={i % 2}>
                {d.href ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-card"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="website-card">{content}</div>
                )}
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div className="services-banner">
            <div>
              <p className="section-eyebrow">Your idea could be next</p>
              <h3>Something good starts with a conversation.</h3>
              <p>Websites · Web apps · Android apps · Workflow automation</p>
            </div>
            <a href="#contact" className="button-primary">
              Tell me about it <ArrowUpRightIcon size={18} aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
