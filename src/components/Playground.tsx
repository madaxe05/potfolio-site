import { PlayMerge } from "./PlayMerge";
import { PaletteLab } from "./PaletteLab";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * Layout family: two live panels. Everything else on the page describes work.
 * This section is the work, running.
 */
export function Playground() {
  return (
    <section id="playground" className="border-y border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-[20ch]">
            Have a go at two of them
          </SectionHeading>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
            Both of these ship as Android apps. These are working browser
            versions, not screenshots.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal index={1} className="h-full">
            <PlayMerge />
          </Reveal>
          <Reveal index={2} className="h-full">
            <PaletteLab />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
