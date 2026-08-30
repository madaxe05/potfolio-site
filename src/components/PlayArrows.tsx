"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowClockwiseIcon, TrophyIcon } from "@phosphor-icons/react";

const SIZE = 5;
const START_PIECES = 9;

type Dir = "up" | "down" | "left" | "right";
type Piece = { id: number; r: number; c: number; dir: Dir };

const DIRS: Dir[] = ["up", "down", "left", "right"];
const DELTA: Record<Dir, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};
const ROTATION: Record<Dir, number> = { up: -90, right: 0, down: 90, left: 180 };

let nextId = 1;

/** Is every cell from a piece to the board edge, in its direction, empty? */
function pathClear(pieces: Piece[], piece: Piece) {
  const [dr, dc] = DELTA[piece.dir];
  let r = piece.r + dr;
  let c = piece.c + dc;
  while (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
    if (pieces.some((p) => p.id !== piece.id && p.r === r && p.c === c)) return false;
    r += dr;
    c += dc;
  }
  return true;
}

/**
 * Builds the puzzle backwards, which is what makes it guaranteed solvable.
 * A piece is only ever added on a cell whose exit path is clear at that moment,
 * so removing them in reverse insertion order is always a valid solution.
 */
function generate(): Piece[] {
  const pieces: Piece[] = [];
  let guard = 0;

  while (pieces.length < START_PIECES && guard < 600) {
    guard++;
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (pieces.some((p) => p.r === r && p.c === c)) continue;

    const dirs = [...DIRS].sort(() => Math.random() - 0.5);
    const dir = dirs.find((d) => pathClear(pieces, { id: -1, r, c, dir: d }));
    if (!dir) continue;

    pieces.push({ id: nextId++, r, c, dir });
  }
  return pieces;
}

/** Any piece that can still leave the board. */
function hasMove(pieces: Piece[]) {
  return pieces.some((p) => pathClear(pieces, p));
}

/**
 * Arrow Escape, playable.
 *
 * Tap an arrow and it leaves the board along its direction, but only if every
 * cell between it and the edge is empty. Clear the board to win.
 *
 * Motion weighting: Jhey. A piece that escapes flies off in its own direction
 * rather than fading, so the rule of the game is taught by the animation. A
 * blocked tap shakes, which is feedback and nothing more. Under reduced motion
 * both collapse to an instant state change.
 */
export function PlayArrows() {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [escaping, setEscaping] = useState<Piece | null>(null);
  const [blocked, setBlocked] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const reset = useCallback(() => {
    setPieces(generate());
    setEscaping(null);
    setBlocked(null);
    setMoves(0);
  }, []);

  // Client-only seed: a random board rendered on the server would guarantee a
  // hydration mismatch, and there is no client-safe value to use during render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    reset();
  }, [reset]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (blocked === null) return;
    const t = setTimeout(() => setBlocked(null), 420);
    return () => clearTimeout(t);
  }, [blocked]);

  const tap = (piece: Piece) => {
    if (!pathClear(pieces, piece)) {
      setBlocked(piece.id);
      return;
    }
    setEscaping(piece);
    setPieces((cur) => cur.filter((p) => p.id !== piece.id));
    setMoves((m) => m + 1);
  };

  const won = pieces.length === 0 && moves > 0;
  const stuck = pieces.length > 0 && !hasMove(pieces);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Playable</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-tight text-fg">
            Arrow Escape
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Stat label="Left" value={pieces.length} live />
          <Stat label="Moves" value={moves} />
        </div>
      </div>

      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
        Tap an arrow to send it off the board. It only leaves if nothing stands
        between it and the edge. Clear all nine.
      </p>

      <div className="relative mt-6 aspect-square w-full rounded-xl bg-ink p-2.5 ring-1 ring-line">
        <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
          {Array.from({ length: SIZE * SIZE }).map((_, i) => (
            <div key={i} className="rounded-lg bg-surface-2/60" />
          ))}
        </div>

        <div className="absolute inset-2.5 grid grid-cols-5 grid-rows-5 gap-2">
          <AnimatePresence>
            {pieces.map((p) => {
              const isBlocked = blocked === p.id;
              return (
                <motion.button
                  key={p.id}
                  type="button"
                  onClick={() => tap(p)}
                  aria-label={`Arrow pointing ${p.dir} at row ${p.r + 1}, column ${p.c + 1}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={
                    isBlocked && !reduce
                      ? { scale: 1, opacity: 1, x: [0, -5, 5, -3, 3, 0] }
                      : { scale: 1, opacity: 1, x: 0 }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : isBlocked
                        ? { duration: 0.38, ease: "easeInOut" }
                        : { type: "spring", stiffness: 480, damping: 32 }
                  }
                  style={{ gridRowStart: p.r + 1, gridColumnStart: p.c + 1 }}
                  className={`flex cursor-pointer items-center justify-center rounded-lg text-lg transition-colors duration-200 ${
                    isBlocked
                      ? "bg-surface-2 text-faint ring-1 ring-line"
                      : "bg-accent-wash text-accent ring-1 ring-accent/40 hover:bg-accent hover:text-accent-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    style={{ transform: `rotate(${ROTATION[p.dir]}deg)` }}
                    className="block leading-none"
                  >
                    &rarr;
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {/* The escaping piece continues in its own direction, so the rule of
              the game is visible rather than explained. */}
          <AnimatePresence>
            {escaping && !reduce && (
              <motion.span
                key={`fly-${escaping.id}`}
                aria-hidden
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: DELTA[escaping.dir][1] * 260,
                  y: DELTA[escaping.dir][0] * 260,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onAnimationComplete={() => setEscaping(null)}
                style={{
                  gridRowStart: escaping.r + 1,
                  gridColumnStart: escaping.c + 1,
                }}
                className="pointer-events-none flex items-center justify-center rounded-lg bg-accent text-lg text-accent-ink"
              >
                <span
                  style={{ transform: `rotate(${ROTATION[escaping.dir]}deg)` }}
                  className="block leading-none"
                >
                  &rarr;
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(won || stuck) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-ink/85 backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-lg text-fg">
                {won && <TrophyIcon size={20} aria-hidden className="text-accent" />}
                {won ? `Cleared in ${moves} moves` : "Nothing can escape"}
              </p>
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                New board
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] tracking-wide text-faint">
          Every board is solvable
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <ArrowClockwiseIcon size={15} aria-hidden />
          New board
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, live }: { label: string; value: number; live?: boolean }) {
  return (
    <div className="rounded-xl border border-line-soft px-3 py-2 text-right">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
        {label}
      </p>
      <p
        aria-live={live ? "polite" : undefined}
        className="font-mono text-sm text-fg"
      >
        {value}
      </p>
    </div>
  );
}
