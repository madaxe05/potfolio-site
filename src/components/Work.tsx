"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { categories, projects, type Category, type Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Lightbox, type LightboxState } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

type Filter = Category | "all";

/**
 * Filterable work grid.
 * Motivation: state transition. Picking a category is a real choice, so the
 * grid reflows with a layout animation and the active pill slides between
 * tabs (shared layoutId) instead of cutting.
 */
const PREVIEW = 3;

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const [box, setBox] = useState<LightboxState>(null);
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);

  const matching = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  // Three by default, the rest behind one button. A wall of fifteen cards is a
  // worse first impression than three good ones.
  const shown = expanded ? matching : matching.slice(0, PREVIEW);
  const hidden = matching.length - shown.length;

  const openShots = useCallback((p: Project, index: number) => {
    if (!p.shots?.length) return;
    setBox({ title: p.title, shots: p.shots, index });
  }, []);

  const move = useCallback(
    (delta: number) =>
      setBox((s) =>
        s ? { ...s, index: (s.index + delta + s.shots.length) % s.shots.length } : s
      ),
    []
  );

  const closeBox = useCallback(() => setBox(null), []);

  return (
    <section id="work" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
      <Reveal>
        <SectionHeading>Selected work</SectionHeading>
      </Reveal>

      <Reveal index={1}>
        {/* Filter buttons, not the APG tab pattern. Real tabs would need a
            tabpanel, aria-controls, roving tabindex and arrow-key navigation,
            and a half-applied tab role announces a panel that does not exist. */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mt-10 flex flex-wrap gap-2"
        >
          {categories.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(c.id);
                  setExpanded(false);
                }}
                className={`relative cursor-pointer rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active ? "text-accent-ink" : "text-muted hover:text-fg"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                )}
                <span className="relative z-10">
                  {c.label}
                  <span
                    className={`ml-2 font-mono text-[0.7rem] ${
                      active ? "text-accent-ink/70" : "text-faint"
                    }`}
                  >
                    {counts[c.id] ?? 0}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* A short status line, not aria-live on the grid itself, which would
          re-read every card's full text on each filter change. */}
      <p aria-live="polite" className="sr-only">
        {`${shown.length} of ${matching.length} projects shown`}
      </p>

      <motion.div
        layout={!reduce}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout={!reduce}
              // `initial` must not branch on useReducedMotion: the hook is
              // undefined on the server and a real boolean on the client's
              // hydration render, and Motion writes `initial` into the SSR
              // style attribute. Branch the transition instead.
              className="reveal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <ProjectCard project={p} onOpenShots={openShots} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {matching.length === 0 && (
        <p className="mt-12 text-muted">Nothing in this category yet.</p>
      )}

      {(hidden > 0 || expanded) && matching.length > PREVIEW && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            {expanded ? "Show fewer" : `View all ${matching.length}`}
            <CaretDownIcon
              size={15}
              aria-hidden
              className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}

      <Lightbox state={box} onClose={closeBox} onMove={move} />
    </section>
  );
}
