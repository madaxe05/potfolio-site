import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Instagram", href: site.instagram },
];

/** Layout family: full-bleed closing statement. One CTA intent only. */
export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-line-soft bg-surface/40"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-36">
        <Reveal>
          <SectionHeading className="max-w-[20ch]">Get in touch</SectionHeading>
        </Reveal>

        <Reveal index={1}>
          <a
            href={`mailto:${site.email}`}
            className="mt-10 inline-block cursor-pointer break-all text-[clamp(1.35rem,4vw,2.75rem)] font-medium tracking-[-0.03em] text-accent underline decoration-accent/30 decoration-1 underline-offset-[0.2em] transition-colors duration-200 hover:decoration-accent"
          >
            {site.email}
          </a>
        </Reveal>

        <Reveal index={2}>
          <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="label">Phone</dt>
              <dd className="mt-3">
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="cursor-pointer text-base text-fg transition-colors hover:text-accent"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-3 text-base text-fg">{site.location}</dd>
            </div>
            <div>
              <dt className="label">Elsewhere</dt>
              <dd className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex cursor-pointer items-center gap-1 text-base text-fg transition-colors hover:text-accent"
                    >
                      {s.label}
                      <ArrowUpRightIcon
                        size={14}
                        aria-hidden
                        className="text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
