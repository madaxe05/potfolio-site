import { skillGroups } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * Layout family: grouped columns with one hairline per group. Not a bulleted
 * list, and not a row-per-item table with a border under every line.
 */
export function Toolkit() {
  return (
    <section
      id="toolkit"
      className="border-y border-line-soft bg-surface/40"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-24">
        <Reveal>
          <SectionHeading className="max-w-[16ch]">What I build with</SectionHeading>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} index={i}>
              <div className="border-t border-line pt-5">
                <p className="label">{g.title}</p>
                <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm text-fg/90 ring-1 ring-line-soft ring-inset"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
