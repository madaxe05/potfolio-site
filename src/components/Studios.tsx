import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { studios } from "@/data/projects";
import { Reveal } from "./Reveal";

export function Studios() {
  return (
    <section id="studios" className="section-shell studios-section">
      <Reveal>
        <div className="studios-heading">
          <div>
            <p className="section-eyebrow">Independent, by design</p>
            <h2>Two studios. Plenty of ideas.</h2>
          </div>
          <p>Made with care. Published for everyone.</p>
        </div>
      </Reveal>
      <div className="studios-grid">
        {studios.map((s, i) => (
          <Reveal key={s.name} index={i}>
            <div className="studio-panel">
              <div className="studio-panel-top">
                <span className="studio-mark" aria-hidden>
                  {i === 0 ? "V" : "M"}
                  <span>✳</span>
                </span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.blurb}</p>
                </div>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button"
                  aria-label={`Visit ${s.name} on Google Play`}
                >
                  <ArrowUpRightIcon size={20} aria-hidden />
                </a>
              </div>
              <div className="studio-apps">
                {s.apps.map(
                  (a) =>
                    a.icon && (
                      <a
                        key={a.slug}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${a.title} on Google Play`}
                        className="studio-app"
                      >
                        <Image src={a.icon} alt="" width={44} height={44} />
                        <span>{a.title}</span>
                      </a>
                    ),
                )}
              </div>
              <div className="studio-panel-bottom">
                <span>{s.apps.length} published releases</span>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Visit studio <ArrowUpRightIcon size={15} aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
