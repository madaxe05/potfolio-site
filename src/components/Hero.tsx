"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { shipped } from "@/data/projects";
import { site } from "@/data/site";
import { Magnetic } from "./Magnetic";

const NAME = ["Sohan", "Dhungel"];

/**
 * Motivation: hierarchy. The name resolves letter group by letter group, then
 * the role, then the actions, which is the order a reader needs them in.
 *
 * `initial` is never branched on useReducedMotion. That hook is null on the
 * server and real on the client, so branching it desynchronises hydration and
 * can strand an element at opacity 0. Only transitions are branched.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  // Measured on enter, not per move. getBoundingClientRect forces a layout read.
  const rect = useRef<DOMRect | null>(null);

  // Portrait drifts slower than the page. Transform only, so it composites.
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });
  // Ranges collapse under reduced motion rather than the style being dropped.
  // Branching the style itself would desync hydration, since useReducedMotion
  // is null on the server and a real boolean on the client's first render.
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  // Cursor-tracked light across the name. Motivation: the first thing on the
  // page answers a pointer, which tells the reader this page is not a poster.
  // Motion values only, so a pointer move never re-renders React.
  const mx = useSpring(useMotionValue(30), { stiffness: 90, damping: 22, mass: 0.6 });
  const my = useSpring(useMotionValue(40), { stiffness: 90, damping: 22, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(38rem circle at ${mx}% ${my}%, var(--color-accent) 0%, transparent 62%)`;

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0 }
      : { duration: 0.7, delay: 0.5 + 0.08 * i, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="top"
      ref={wrap}
      onPointerEnter={() => {
        rect.current = wrap.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = rect.current ?? wrap.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerLeave={() => {
        rect.current = null;
      }}
      className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:pt-24"
    >
      {/* Style is never branched on useReducedMotion, or the server and the
          hydrating client disagree. The pointer handler early-returns under
          reduced motion, so the gradient simply stays at its seed position.
          No blur filter here: a full-viewport Gaussian re-blur on every
          pointer move is the most expensive thing this page could do. The
          gradient's own soft falloff gives the same look for free. */}
      <motion.div
        aria-hidden
        style={{ backgroundImage: glow }}
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(3.25rem,11vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.045em]">
            {NAME.map((word, w) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="reveal inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 0.9, delay: 0.1 + w * 0.11, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <span className={w === 1 ? "text-accent" : undefined}>{word}</span>
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...rise(0)}
            className="reveal mt-8 max-w-[46ch] text-lg leading-relaxed text-muted sm:text-xl"
          >
            Software Engineer at Octacore Solutions, in Kathmandu. {shipped.length}{" "}
            Android apps and games live on Google Play, plus web and on-chain work.
          </motion.p>

          <motion.div
            {...rise(1)}
            className="reveal mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink transition-[filter] duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                View work
                <ArrowRightIcon
                  size={16}
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.cv}
                download
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                <ArrowDownIcon size={16} aria-hidden />
                Download CV
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          }
          className="reveal relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-surface">
            <motion.div
              style={{ y: portraitY, scale: portraitScale }}
              className="absolute inset-0"
            >
              <Image
                src="/portrait.jpg"
                alt="Sohan Dhungel"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[50%_28%] contrast-[1.04] saturate-[0.8]"
              />
            </motion.div>
            {/* Scrim: settles a bright daylight photo into the dark page. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/5"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
