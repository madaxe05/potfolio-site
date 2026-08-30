"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GameControllerIcon, PaletteIcon, ArrowsOutCardinalIcon } from "@phosphor-icons/react";
import { PlayMerge } from "./PlayMerge";
import { PlayArrows } from "./PlayArrows";
import { PaletteLab } from "./PaletteLab";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const panels = [
  {
    id: "merge",
    name: "Merge 1024",
    kind: "Puzzle game",
    note: "Live on Google Play",
    Icon: GameControllerIcon,
  },
  {
    id: "arrows",
    name: "Arrow Escape",
    kind: "Puzzle game",
    note: "Coming to Play Store",
    Icon: ArrowsOutCardinalIcon,
  },
  {
    id: "palette",
    name: "Palette lab",
    kind: "Colour tool",
    note: "The idea behind HuePilot",
    Icon: PaletteIcon,
  },
] as const;

type PanelId = (typeof panels)[number]["id"];

/**
 * Arcade. Layout family: a console-style menu on the left, one large live panel
 * on the right. Deliberately unlike every other section, which are all grids.
 *
 * Motion weighting: Jhey. Switching panels is a rare, intentional action, so it
 * gets a real transition: the selected row's accent plate slides between rows
 * on a shared layoutId, and the panel crossfades with a short directional lift.
 */
export function Playground() {
  const [active, setActive] = useState<PanelId>("merge");
  const reduce = useReducedMotion();

  return (
    <section id="playground" className="border-y border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading className="max-w-[20ch]">
            Some of it runs right here
          </SectionHeading>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
            Working browser builds, not screenshots. Two of my puzzle games and
            the colour engine behind HuePilot.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal index={1} className="min-w-0 lg:col-span-4">
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {panels.map((p) => {
                const on = active === p.id;
                return (
                  <li key={p.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(p.id)}
                      className="group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-4 text-left lg:px-5 lg:py-5"
                    >
                      {on && (
                        <motion.span
                          layoutId="arcade-plate"
                          aria-hidden
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 380, damping: 34 }
                          }
                          className="absolute inset-0 rounded-2xl border border-accent/40 bg-accent-wash"
                        />
                      )}
                      <span
                        className={`relative flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                          on
                            ? "bg-accent text-accent-ink"
                            : "bg-surface-2 text-faint ring-1 ring-line group-hover:text-fg"
                        }`}
                      >
                        <p.Icon size={19} aria-hidden />
                      </span>
                      <span className="relative min-w-0">
                        <span
                          className={`block whitespace-nowrap text-base transition-colors duration-200 lg:whitespace-normal ${
                            on ? "text-fg" : "text-muted group-hover:text-fg"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className="mt-0.5 hidden font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint lg:block">
                          {p.note}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal index={2} className="min-w-0 lg:col-span-8">
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  {active === "merge" && <PlayMerge />}
                  {active === "arrows" && <PlayArrows />}
                  {active === "palette" && <PaletteLab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
