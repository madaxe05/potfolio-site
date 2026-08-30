import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/** Layout family: single vertical spine, one node per line. Not a grid. */
export function ExperienceTree() {
  return (
    <section id="journey" className="border-t border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading className="mx-auto max-w-[18ch] text-center">
            The road so far
          </SectionHeading>
        </Reveal>

        <ol className="relative mx-auto mt-14 max-w-[42rem] border-l border-line pl-8 text-left">
          {site.journey.map((step, i) => (
            <li key={step.title} className="relative pb-10 last:pb-0">
              <Reveal index={Math.min(i, 6)}>
                <span
                  aria-hidden
                  className={`absolute -left-[calc(2rem+4.5px)] top-1 size-[9px] rounded-full ${
                    step.current ? "bg-accent" : "bg-faint"
                  }`}
                />
                <p className="flex items-center gap-2 font-mono text-xs text-faint">
                  {step.year}
                  {step.current && (
                    <span className="rounded-full bg-accent-wash px-2 py-0.5 text-[0.6rem] tracking-wide text-accent">
                      now
                    </span>
                  )}
                </p>
                <p className="mt-2 text-base text-fg sm:text-lg">{step.title}</p>
                {step.note && (
                  <p className="mt-1.5 max-w-[46ch] text-sm text-muted">{step.note}</p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
