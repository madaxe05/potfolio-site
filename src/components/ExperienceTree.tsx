import { site } from "@/data/site";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";

export function ExperienceTree() {
  return (
    <section id="journey" className="section-shell journey-section">
      <details className="journey-disclosure">
        <summary>
          <span>
            <span className="section-eyebrow">The journey / 2022 — 2026</span>
            <span className="journey-title">
              Every step builds on the last.
            </span>
          </span>
          <span className="journey-toggle">
            <span>Explore the timeline</span>
            <ArrowDownIcon size={22} aria-hidden />
          </span>
        </summary>
        <ol className="journey-timeline">
          {site.journey.map((step) => (
            <li key={step.title}>
              <span className="journey-year">{step.year}</span>
              <div>
                <h3>
                  {step.title}
                  {step.current && <span className="now-badge">Now</span>}
                </h3>
                {step.note && <p>{step.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
