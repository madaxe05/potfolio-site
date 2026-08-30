import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { demos, servicePitch } from "@/data/demos";
import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * Layout family: split pitch. Left column carries the offer, right column the
 * demo links. Renders a clear empty state until the demos array has entries.
 */
export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading>{servicePitch.heading}</SectionHeading>
          </Reveal>
          <Reveal index={1}>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-muted">
              {servicePitch.body}
            </p>
          </Reveal>
          <Reveal index={2}>
            <ul className="mt-8 space-y-3">
              {servicePitch.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[0.95rem] text-fg/90">
                  <CheckIcon
                    size={17}
                    aria-hidden
                    className="mt-1 shrink-0 text-accent"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={3}>
            <a
              href={`mailto:${site.email}?subject=Website%20project`}
              className="mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Get in touch
              <ArrowUpRightIcon size={16} aria-hidden />
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal index={1}>
            <div className="rounded-2xl border border-line bg-surface p-7 sm:p-9">
              <p className="label">Demo sites</p>

              {demos.length === 0 ? (
                <p className="mt-5 max-w-[48ch] text-[0.95rem] leading-relaxed text-muted">
                  Live demos are being prepared. Email me and I will send the
                  current set, along with what each one was built to do.
                </p>
              ) : (
                <ul className="mt-6 divide-y divide-line-soft">
                  {demos.map((d) => {
                    const body = (
                      <>
                        <span className="min-w-0">
                          <span className="block text-lg text-fg transition-colors group-hover:text-accent">
                            {d.title}
                          </span>
                          <span className="mt-1 block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
                            {d.kind}
                          </span>
                        </span>
                        {d.href ? (
                          <ArrowUpRightIcon
                            size={20}
                            aria-hidden
                            className="shrink-0 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                          />
                        ) : (
                          <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">
                            Link soon
                          </span>
                        )}
                      </>
                    );
                    return (
                      <li key={d.title}>
                        {d.href ? (
                          <a
                            href={d.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex cursor-pointer items-center justify-between gap-6 py-5"
                          >
                            {body}
                          </a>
                        ) : (
                          <div className="group flex items-center justify-between gap-6 py-5">
                            {body}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
