"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowClockwiseIcon, TrophyIcon } from "@phosphor-icons/react";

const SIZE = 4;
const TARGET = 1024;
const BEST_KEY = "merge1024:best";

type Dir = "up" | "down" | "left" | "right";
type Tile = { id: number; value: number; r: number; c: number; merged?: boolean };

let nextId = 1;
const newId = () => nextId++;

function emptyCells(tiles: Tile[]) {
  const taken = new Set(tiles.map((t) => `${t.r},${t.c}`));
  const free: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (!taken.has(`${r},${c}`)) free.push([r, c]);
  return free;
}

function spawn(tiles: Tile[]): Tile[] {
  const free = emptyCells(tiles);
  if (free.length === 0) return tiles;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  return [...tiles, { id: newId(), value: Math.random() < 0.9 ? 2 : 4, r, c }];
}

function start(): Tile[] {
  return spawn(spawn([]));
}

/** Slide and merge one move. Returns the new board, points scored, and whether anything moved. */
function step(tiles: Tile[], dir: Dir): { tiles: Tile[]; gained: number; moved: boolean } {
  const vertical = dir === "up" || dir === "down";
  const toEnd = dir === "down" || dir === "right";
  const next: Tile[] = [];
  let gained = 0;
  let moved = false;

  for (let line = 0; line < SIZE; line++) {
    const inLine = tiles
      .filter((t) => (vertical ? t.c === line : t.r === line))
      .sort((a, b) => {
        const av = vertical ? a.r : a.c;
        const bv = vertical ? b.r : b.c;
        return toEnd ? bv - av : av - bv;
      });

    let cursor = toEnd ? SIZE - 1 : 0;
    const stepDir = toEnd ? -1 : 1;
    let i = 0;

    while (i < inLine.length) {
      const a = inLine[i];
      const b = inLine[i + 1];
      const r = vertical ? cursor : line;
      const c = vertical ? line : cursor;

      if (b && b.value === a.value) {
        // The survivor takes b's id. b is the tile further from the edge, so
        // `layout` animates it travelling into the merge, instead of a ghost
        // fading out where it used to sit.
        gained += a.value * 2;
        next.push({ id: b.id, value: a.value * 2, r, c, merged: true });
        moved = true;
        i += 2;
      } else {
        if (a.r !== r || a.c !== c) moved = true;
        next.push({ id: a.id, value: a.value, r, c });
        i += 1;
      }
      cursor += stepDir;
    }
  }
  return { tiles: next, gained, moved };
}

function stuck(tiles: Tile[]) {
  if (emptyCells(tiles).length > 0) return false;
  return (["up", "down", "left", "right"] as Dir[]).every((d) => !step(tiles, d).moved);
}

/** Tile colour ramp. Stays inside the page palette: one accent, rising presence. */
function tileStyle(v: number) {
  const ramp: Record<number, string> = {
    2: "bg-surface-2 text-muted ring-1 ring-line",
    4: "bg-[#1d1512] text-fg/80 ring-1 ring-line",
    8: "bg-[#2a1710] text-fg ring-1 ring-accent/25",
    16: "bg-[#3a1c11] text-fg ring-1 ring-accent/35",
    32: "bg-[#4d2213] text-fg ring-1 ring-accent/45",
    64: "bg-[#682a15] text-fg ring-1 ring-accent/60",
    128: "bg-[#8a3419] text-fg ring-1 ring-accent/75",
    256: "bg-[#ad401d] text-fg ring-1 ring-accent",
    512: "bg-[#cf4d22] text-accent-ink ring-1 ring-accent",
  };
  return ramp[v] ?? "bg-accent text-accent-ink ring-1 ring-accent";
}

/**
 * Merge 1024, playable.
 *
 * Every bit of game computation happens in the event handler, never inside a
 * setState updater. React runs updaters during render and double-invokes them
 * under StrictMode, which Next enables by default, so a `setTiles(cur => ...)`
 * that also scored, wrote localStorage and called Math.random would double the
 * score in development. Refs mirror the live values so the handler can read
 * them without a functional update.
 *
 * Motion weighting: Jhey. This is a game, so tile arrival can be expressive.
 * Movement uses Motion's `layout` so tiles travel between cells, and a merged
 * tile gets one short spring pop. Under reduced motion everything snaps.
 */
export function PlayMerge() {
  const reduce = useReducedMotion();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const [announce, setAnnounce] = useState("");

  const tilesRef = useRef<Tile[]>([]);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const lockedRef = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    const fresh = start();
    tilesRef.current = fresh;
    scoreRef.current = 0;
    lockedRef.current = false;
    setTiles(fresh);
    setScore(0);
    setWon(false);
    setOver(false);
    setAnnounce("New board dealt.");
  }, []);

  // Client-only seed. A random board or a localStorage value rendered on the
  // server would guarantee a hydration mismatch, and neither has a client-safe
  // value available during render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    reset();
    try {
      const stored = Number(window.localStorage.getItem(BEST_KEY)) || 0;
      bestRef.current = stored;
      setBest(stored);
    } catch {
      /* private mode or blocked storage, best score just stays 0 */
    }
  }, [reset]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const play = useCallback((dir: Dir) => {
    // Won or lost boards stop accepting input, so the score cannot keep
    // climbing on a board hidden behind the overlay.
    if (lockedRef.current) return;
    const current = tilesRef.current;
    if (current.length === 0) return;

    const res = step(current, dir);
    if (!res.moved) return;

    const grown = spawn(res.tiles);
    tilesRef.current = grown;
    setTiles(grown);

    if (res.gained > 0) {
      const total = scoreRef.current + res.gained;
      scoreRef.current = total;
      setScore(total);
      if (total > bestRef.current) {
        bestRef.current = total;
        setBest(total);
        try {
          window.localStorage.setItem(BEST_KEY, String(total));
        } catch {
          /* ignore */
        }
      }
    }

    const highest = grown.reduce((m, t) => Math.max(m, t.value), 0);
    setAnnounce(
      `Moved ${dir}. Highest tile ${highest}. Score ${scoreRef.current}. ${grown.length} tiles on the board.`
    );

    if (highest >= TARGET) {
      lockedRef.current = true;
      setWon(true);
    } else if (stuck(grown)) {
      lockedRef.current = true;
      setOver(true);
    }
  }, []);

  const keepPlaying = () => {
    lockedRef.current = false;
    setWon(false);
  };

  // Arrow keys are bound to the board, not the window, so the page still
  // scrolls normally when the game is not focused.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    // Normalised, or a shifted or caps-locked "W" falls through as page input.
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const dir = map[key];
    if (!dir) return;
    e.preventDefault();
    play(dir);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    touch.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const endGesture = (e: React.PointerEvent) => {
    const from = touch.current;
    touch.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    play(
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up"
    );
  };

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 520, damping: 38, mass: 0.7 } as const);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Playable</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-tight text-fg">Merge 1024</h3>
        </div>
        <div className="flex items-center gap-2">
          <Stat label="Score" value={score} />
          <Stat label="Best" value={best} />
        </div>
      </div>

      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
        Slide every tile at once. Equal numbers merge. Push a single tile all the
        way to 1024.
      </p>

      <div
        role="grid"
        aria-label="Merge 1024 board. Arrow keys or WASD to move every tile."
        aria-rowcount={SIZE}
        aria-colcount={SIZE}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={endGesture}
        onPointerCancel={() => {
          touch.current = null;
        }}
        className="relative mt-6 aspect-square w-full touch-none select-none rounded-xl bg-ink p-2.5 ring-1 ring-line focus-visible:ring-accent"
      >
        <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2.5">
          {Array.from({ length: SIZE * SIZE }).map((_, i) => (
            <div key={i} className="rounded-lg bg-surface-2/60" />
          ))}
        </div>

        <div className="absolute inset-2.5 grid grid-cols-4 grid-rows-4 gap-2.5">
          <AnimatePresence>
            {tiles.map((t) => (
              <motion.div
                key={t.id}
                role="gridcell"
                aria-label={`Row ${t.r + 1}, column ${t.c + 1}, ${t.value}`}
                layout={!reduce}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: t.merged && !reduce ? [1.16, 1] : 1,
                  opacity: 1,
                }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={spring}
                style={{ gridRowStart: t.r + 1, gridColumnStart: t.c + 1 }}
                className={`flex items-center justify-center rounded-lg font-mono text-[clamp(0.8rem,2.6vw,1.35rem)] font-medium tabular-nums ${tileStyle(
                  t.value
                )}`}
              >
                {t.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(over || won) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-ink/85 p-4 backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-center text-lg text-fg">
                {won && <TrophyIcon size={20} aria-hidden className="text-accent" />}
                {won ? `You hit ${TARGET}` : "No moves left"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {won && (
                  <button
                    type="button"
                    onClick={keepPlaying}
                    className="cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
                  >
                    Keep playing
                  </button>
                )}
                <button
                  type="button"
                  onClick={reset}
                  className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-200 active:scale-[0.98] ${
                    won
                      ? "border border-line text-fg hover:border-accent hover:text-accent"
                      : "bg-accent text-accent-ink hover:brightness-110"
                  }`}
                >
                  {won ? "New board" : "Play again"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] tracking-wide text-faint">
          Arrow keys, WASD, or drag
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <ArrowClockwiseIcon size={15} aria-hidden />
          Restart
        </button>
      </div>

      {/* Shown at every width. At desktop sizes the drag gesture works but is
          undiscoverable, so this pad is the only visible affordance. */}
      <div className="mt-5 grid max-w-[13rem] grid-cols-3 gap-2">
        <span />
        <PadButton label="Up" onClick={() => play("up")} rotate={-90} />
        <span />
        <PadButton label="Left" onClick={() => play("left")} rotate={180} />
        <PadButton label="Down" onClick={() => play("down")} rotate={90} />
        <PadButton label="Right" onClick={() => play("right")} rotate={0} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line-soft px-3 py-2 text-right">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
        {label}
      </p>
      <p className="font-mono text-sm text-fg">{value}</p>
    </div>
  );
}

function PadButton({
  label,
  onClick,
  rotate,
}: {
  label: string;
  onClick: () => void;
  rotate: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Move ${label.toLowerCase()}`}
      className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-line text-fg transition-all duration-150 hover:border-accent active:scale-95 active:border-accent"
    >
      <span style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
        &rarr;
      </span>
    </button>
  );
}
