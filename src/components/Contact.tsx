import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Instagram", href: site.instagram },
];

/** Layout family: split. Details on the left, the form on the right. */
export function Contact() {
  return (
    <section id="contact" className="border-t border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading className="max-w-[14ch]">Get in touch</SectionHeading>
            </Reveal>

            <Reveal index={1}>
              <p className="mt-7 max-w-[42ch] text-lg leading-relaxed text-muted">
                Fill in the form and it lands in my inbox. Tell me what you are
                building and roughly when you need it.
              </p>
            </Reveal>

            <Reveal index={2}>
              <dl className="mt-12 space-y-8 border-t border-line pt-8">
                <div>
                  <dt className="label">Email</dt>
                  {/* Plain text on purpose, not a mailto link. */}
                  <dd className="mt-3 select-all font-mono text-base text-fg">
                    {site.email}
                  </dd>
                </div>
                <div>
                  <dt className="label">Phone</dt>
                  <dd className="mt-3 select-all font-mono text-base text-fg">
                    {site.phone}
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

          <div className="lg:col-span-7">
            <Reveal index={1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
