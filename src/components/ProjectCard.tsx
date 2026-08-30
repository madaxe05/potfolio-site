"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRightIcon, GithubLogoIcon, GooglePlayLogoIcon } from "@phosphor-icons/react";
import type { Project } from "@/data/projects";

/**
 * Motivation: feedback. A spotlight follows the pointer across the card and
 * the card tilts a degree or two toward it, so the surface reacts to where you
 * actually are. Driven entirely by motion values, never useState, so it does
 * not re-render React on every pointer move.
 */
export function ProjectCard({
  project,
  onOpenShots,
}: {
  project: Project;
  onOpenShots: (p: Project, index: number) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${px}% ${py}%, rgba(232,97,63,0.14), transparent 72%)`;

  // Measured once per hover, not once per move. getBoundingClientRect forces a
  // layout read, and the card box only changes on scroll, resize or a refilter.
  const rect = useRef<DOMRect | null>(null);

  const onPointerEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = rect.current ?? ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x * 100);
    py.set(y * 100);
    ry.set((x - 0.5) * 5);
    rx.set((0.5 - y) * 5);
  };

  const onPointerLeave = () => {
    rect.current = null;
    rx.set(0);
    ry.set(0);
    px.set(50);
    py.set(50);
  };

  const shots = project.shots ?? [];
  const LinkIcon =
    project.hrefLabel === "GitHub" ? GithubLogoIcon : GooglePlayLogoIcon;

  return (
    <motion.div
      ref={ref}
      layout
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // Always rendered, never branched on useReducedMotion, or the server and
      // the hydrating client disagree on the transform. The springs rest at 0
      // and onPointerMove early-returns under reduced motion, so nothing tilts.
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7"
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-4">
        {project.icon ? (
          <Image
            src={project.icon}
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-2xl ring-1 ring-line"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent-wash text-lg font-medium text-accent ring-1 ring-line">
            {project.title.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="label">{project.status}</p>
          <h3 className="mt-1.5 text-xl font-medium leading-tight tracking-tight text-fg">
            {project.title}
          </h3>
        </div>
      </div>

      <p className="relative mt-5 text-[0.9rem] leading-relaxed text-muted">
        {project.blurb}
      </p>

      {shots.length > 0 && (
        <div className="relative mt-6 flex gap-2.5">
          {shots.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onOpenShots(project, i)}
              aria-label={`View ${project.title} screenshot ${i + 1}`}
              className="relative aspect-[9/19] w-full max-w-[4.5rem] cursor-pointer overflow-hidden rounded-lg ring-1 ring-line transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:ring-accent"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="90px"
                className="object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative mt-auto pt-6">
        <ul className="flex flex-wrap gap-2">
          {project.stack.slice(0, 5).map((s) => (
            <li
              key={s}
              className="rounded-full border border-line-soft px-2.5 py-1 font-mono text-[0.68rem] text-faint"
            >
              {s}
            </li>
          ))}
        </ul>

        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex cursor-pointer items-center gap-2 text-sm text-fg transition-colors hover:text-accent"
          >
            <LinkIcon size={17} aria-hidden />
            {project.hrefLabel === "GitHub" ? "View source" : "Get it on Play"}
            <ArrowUpRightIcon
              size={14}
              aria-hidden
              className="text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        ) : (
          <p className="mt-5 font-mono text-[0.7rem] tracking-wide text-faint">
            Not public yet
          </p>
        )}
      </div>
    </motion.div>
  );
}
