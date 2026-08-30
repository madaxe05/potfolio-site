import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { shipped } from "@/data/projects";
import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/** Layout family: single-column statement, then two hairline record lists. */
export function About() {
  return (
    <section id="about" className="border-t border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
        <div className="max-w-[52rem]">
          <Reveal>
            <SectionHeading>About</SectionHeading>
          </Reveal>

          <Reveal index={1}>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted sm:text-xl">
              <p>
                I am a Software Developer at{" "}
                <a
                  href={site.experience[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-fg underline decoration-accent/40 decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  Octacore Solutions
                </a>
                , where I interned for two months and moved into
                the developer role a week ago. Alongside that I ship my own
                Android apps under two Play Store studios.
              </p>
              <p>
                Most of what I build has to run on someone else&apos;s phone,
                which is a good filter. {shipped.length} are live on Google
                Play, plus Ethereum
                contracts that had to survive a forged document and an LSTM
                model that had to make a defensible prediction.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal index={2}>
            <div className="border-t border-line pt-8">
              <p className="label">Experience</p>
              <ul className="mt-6 space-y-7">
                {site.experience.map((e) => (
                  <li key={e.role + e.period}>
                    <p className="flex items-center gap-2 font-mono text-xs text-faint">
                      {e.period}
                      {e.current && (
                        <span className="rounded-full bg-accent-wash px-2 py-0.5 text-[0.6rem] tracking-wide text-accent">
                          current
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-base text-fg">{e.role}</p>
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-1 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
                    >
                      {e.org}
                      <ArrowUpRightIcon
                        size={13}
                        aria-hidden
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                    <p className="mt-2 max-w-[46ch] text-sm text-muted">{e.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal index={3}>
            <div className="border-t border-line pt-8">
              <p className="label">Education</p>
              <ul className="mt-6 space-y-7">
                {site.education.map((e) => (
                  <li key={e.degree}>
                    <p className="font-mono text-xs text-faint">{e.years}</p>
                    <p className="mt-2 text-base text-fg">{e.degree}</p>
                    <p className="mt-1 max-w-[46ch] text-sm text-muted">
                      {e.school}, {e.place}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
