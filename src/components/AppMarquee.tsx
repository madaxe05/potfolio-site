import Image from "next/image";
import { projects } from "@/data/projects";

const shipped = projects.filter((p) => p.icon);

/**
 * One half of the track must be at least as wide as the widest viewport, or
 * the -50% translate exposes empty space before the loop restarts. Nine icons
 * is roughly 675px, so the row is repeated until a half clears ~2700px, which
 * covers everything up to an ultrawide. Only nine unique images are fetched.
 */
const REPEATS = 4;
const half = Array.from({ length: REPEATS }, () => shipped).flat();

/**
 * The only marquee on the page.
 *
 * Motivation: the row says "these are all shipped" faster than a sentence can,
 * and the drift shows the list runs past the edge of the viewport. Pure CSS
 * transform so it costs nothing on the main thread, paused on hover, frozen
 * into a static wrapped row under prefers-reduced-motion.
 */
export function AppMarquee() {
  return (
    <div className="border-y border-line-soft py-7">
      <div className="marquee-mask group relative overflow-hidden">
        {/* No flex `gap`: the last item would have no trailing gap, so one
            half of the track is one gap narrower than a whole number of items
            and the loop jumps at every restart. Per-item padding makes the
            period exact. Focus pauses it too, or tabbing the real links means
            chasing a moving target (WCAG 2.2.2). */}
        <ul className="marquee-track flex w-max items-center group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
          {[...half, ...half].map((p, i) => {
            // Everything past the first pass is a visual duplicate: hidden from
            // assistive tech and skipped by the tab order.
            const duplicate = i >= shipped.length;
            return (
              <li
                key={`${p.slug}-${i}`}
                data-clone={duplicate || undefined}
                className="shrink-0 pr-5"
              >
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.title}
                  aria-hidden={duplicate}
                  tabIndex={duplicate ? -1 : 0}
                  className="block cursor-pointer rounded-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                  <Image
                    src={p.icon!}
                    alt={duplicate ? "" : p.title}
                    width={56}
                    height={56}
                    className="size-14 rounded-2xl ring-1 ring-line"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
