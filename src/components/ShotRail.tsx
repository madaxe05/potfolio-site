"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { projects } from "@/data/projects";

/** Two screenshots per shipped app, so the rail stays long without being heavy. */
const rail = projects
  .filter((p) => p.shots?.length)
  .flatMap((p) => (p.shots ?? []).slice(0, 2).map((src) => ({ src, title: p.title })));

/**
 * Scroll-pinned horizontal rail.
 *
 * Motivation: storytelling. Scrolling vertically walks sideways through every
 * screen of every shipped app, which turns a list of nine products into one
 * continuous piece of evidence. The section is exactly as tall as the pan is
 * long, so the pin releases at the end with no dead scroll on either side.
 *
 * Under reduced motion the pin is dropped entirely and the same content becomes
 * an ordinary horizontally scrollable row, which is the accessible equivalent
 * rather than a degraded one.
 */
export function ShotRail() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Not a hot path: measured on mount and on resize only.
  useEffect(() => {
    const measure = () => {
      const w = track.current?.scrollWidth ?? 0;
      setDistance(Math.max(0, w - window.innerWidth + 40));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 220, damping: 40, mass: 0.4 });

  if (reduce) {
    return (
      <section className="border-y border-line-soft bg-surface/40 py-20">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <p className="label">Every screen</p>
        </div>
        <div className="mt-8 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {rail.map((s) => (
            <Shot key={s.src} src={s.src} title={s.title} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrap}
      className="relative border-y border-line-soft bg-surface/40"
      // Pan length plus one viewport of pinned travel.
      style={{ height: `${distance + 900}px` }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <p className="label">Every screen</p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1] tracking-[-0.035em]">
            Nine apps, up close
          </h2>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-5 px-5 sm:px-8">
          {rail.map((s) => (
            <Shot key={s.src} src={s.src} title={s.title} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Shot({ src, title }: { src: string; title: string }) {
  return (
    <figure className="group relative w-[42vw] shrink-0 sm:w-[22vw] lg:w-[13.5vw]">
      <div className="relative aspect-[9/19] overflow-hidden rounded-2xl ring-1 ring-line">
        <Image
          src={src}
          alt={`${title} screenshot`}
          fill
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 14vw"
          className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint">
        {title}
      </figcaption>
    </figure>
  );
}
