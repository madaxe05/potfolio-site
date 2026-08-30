import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { studios } from "@/data/projects";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/** Layout family: two wide account panels. The apps stack their own icons. */
export function Studios() {
  return (
    <section id="studios" className="border-y border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-[22ch]">Two Play Store studios</SectionHeading>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {studios.map((s, i) => (
            <Reveal key={s.name} index={i}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight text-fg transition-colors duration-200 group-hover:text-accent sm:text-3xl">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-[0.95rem] text-muted">{s.blurb}</p>
                  </div>
                  <ArrowUpRightIcon
                    size={22}
                    aria-hidden
                    className="mt-1 shrink-0 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {s.apps.map((a) =>
                    a.icon ? (
                      <Image
                        key={a.slug}
                        src={a.icon}
                        alt=""
                        title={a.title}
                        width={44}
                        height={44}
                        className="size-11 rounded-xl ring-1 ring-line transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                      />
                    ) : null
                  )}
                </div>

                <p className="mt-6 font-mono text-[0.7rem] tracking-wide text-faint">
                  {s.apps.length} {s.apps.length === 1 ? "app" : "apps"} on Google Play
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
