import Image from "next/image";
import { projects } from "@/data/projects";

const shipped = projects.filter((p) => p.icon);

/**
 * The only marquee on the page.
 *
 * Motivation: the row says "these are all shipped" faster than a sentence can,
 * and the drift communicates that the list runs past the edge of the viewport.
 * Pure CSS transform so it costs nothing on the main thread, paused on hover,
 * and frozen into a static wrapped row under prefers-reduced-motion.
 */
export function AppMarquee() {
  const row = [...shipped, ...shipped];

  return (
    <div className="border-y border-line-soft py-7">
      <div className="marquee-mask group relative overflow-hidden">
        <ul className="marquee-track flex w-max items-center gap-5 group-hover:[animation-play-state:paused]">
          {row.map((p, i) => (
            <li key={`${p.slug}-${i}`} className="shrink-0">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={p.title}
                aria-hidden={i >= shipped.length}
                tabIndex={i >= shipped.length ? -1 : 0}
                className="block cursor-pointer rounded-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
              >
                <Image
                  src={p.icon!}
                  alt={i >= shipped.length ? "" : p.title}
                  width={56}
                  height={56}
                  className="size-14 rounded-2xl ring-1 ring-line"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
