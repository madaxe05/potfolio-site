"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDownIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  categories,
  projects,
  type Category,
  type Project,
} from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { Lightbox, type LightboxState } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const featuredSlugs = ["veritas-guard", "huepilot", "jetpack-max"];
const ordered = [...projects].sort((a, b) => {
  const rank = (p: Project) =>
    featuredSlugs.includes(p.slug)
      ? featuredSlugs.indexOf(p.slug)
      : featuredSlugs.length;
  return rank(a) - rank(b);
});
const PREVIEW = 3;

export function Work() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [box, setBox] = useState<LightboxState>(null);
  const heading = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((c) => [
          c.id,
          c.id === "all"
            ? projects.length
            : projects.filter((p) => p.category === c.id).length,
        ]),
      ),
    [],
  );
  const matching = useMemo(
    () =>
      ordered.filter(
        (p) =>
          (filter === "all" || p.category === filter) &&
          `${p.title} ${p.blurb} ${p.stack.join(" ")}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );
  const shown =
    expanded || query.trim() ? matching : matching.slice(0, PREVIEW);
  const openShots = useCallback((p: Project, index: number) => {
    if (p.shots?.length) setBox({ title: p.title, shots: p.shots, index });
  }, []);
  const closeBox = useCallback(() => setBox(null), []);
  const move = useCallback(
    (delta: number) =>
      setBox((s) =>
        s
          ? { ...s, index: (s.index + delta + s.shots.length) % s.shots.length }
          : s,
      ),
    [],
  );
  return (
    <section id="work" className="section-shell">
      <div ref={heading} className="section-intro">
        <Reveal>
          <p className="section-eyebrow">
            <span>01 / Selected work</span>
            <span>Built. Shipped. Improving.</span>
          </p>
          <SectionHeading>Ideas made tangible.</SectionHeading>
        </Reveal>
        <Reveal index={1}>
          <p className="section-description">
            Everyday tools, one-more-go games, and a few experiments along the
            way. A selection of things I’ve taken from the first line of code to
            the real world.
          </p>
        </Reveal>
      </div>
      <div className="work-toolbar">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="project-filters"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => {
                setFilter(c.id);
                setExpanded(false);
              }}
              className={filter === c.id ? "active" : ""}
            >
              {c.id === "all" ? "All projects" : c.label}
              <span>{counts[c.id]}</span>
            </button>
          ))}
        </div>
        <label className="project-search">
          <MagnifyingGlassIcon size={18} aria-hidden />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            placeholder="Find a project…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(false);
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear project search"
            >
              <XIcon size={16} />
            </button>
          )}
        </label>
      </div>
      <p aria-live="polite" className="sr-only">
        {shown.length} of {matching.length} projects shown
      </p>
      <motion.div layout={!reduce} className="project-grid">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout={!reduce}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            >
              <ProjectCard project={p} onOpenShots={openShots} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {matching.length === 0 && (
        <div className="empty-projects">
          <MagnifyingGlassIcon size={32} aria-hidden />
          <h3>No projects found</h3>
          <p>Try a name or a technology like Flutter.</p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Clear filters <XIcon size={16} />
          </button>
        </div>
      )}
      {!query.trim() && matching.length > PREVIEW && (
        <div className="work-more">
          <span>
            Showing {shown.length} of {matching.length} projects
          </span>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              if (expanded)
                heading.current?.scrollIntoView({
                  behavior: reduce ? "instant" : "smooth",
                  block: "start",
                });
              setExpanded((v) => !v);
            }}
          >
            {expanded ? "Show selected work" : "Explore all projects"}
            <ArrowDownIcon
              size={17}
              className={expanded ? "rotate-180" : ""}
              aria-hidden
            />
          </button>
        </div>
      )}
      <Lightbox state={box} onClose={closeBox} onMove={move} />
    </section>
  );
}
