"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

const BEST_KEY = "jetpack:best";
const W = 640;
const H = 300;
const GRAVITY = 1500; // px/s^2
const THRUST = -2900; // px/s^2 while held
const MAX_VY = 520;

type Zapper = { x: number; y: number; len: number; vertical: boolean };
type Coin = { x: number; y: number; taken: boolean };
type State = "ready" | "flying" | "crashed";

/** Reads the live theme tokens, so the canvas follows light/dark and Palette lab. */
function palette() {
  const css = getComputedStyle(document.documentElement);
  const v = (n: string) => css.getPropertyValue(n).trim();
  return {
    ground: v("--color-surface-2"),
    line: v("--color-line"),
    fg: v("--color-fg"),
    faint: v("--color-faint"),
    accent: v("--color-accent"),
    wash: v("--color-accent-wash"),
  };
}

/**
 * Jetpack Max, in miniature. Hold to fly, let go to fall, dodge the zappers
 * and pick up coins.
 *
 * The whole loop lives in refs and one requestAnimationFrame callback, so a
 * frame never re-renders React. React state only changes on the three moments
 * a human notices: start, crash, and the score readout (throttled to 10 Hz).
 * The loop stops whenever the board is not flying, so an idle panel costs
 * nothing.
 */
export function PlayJetpack() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<State>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const startRef = useRef<() => void>(() => {});
  const heldRef = useRef<{ held: boolean; state: State } | null>(null);

  // The whole loop lives in this effect: canvas drawing, physics and the
  // start function. It mutates plain objects every frame, which React's
  // compiler rules only allow outside render, so none of it is a hook value.
  // `start` is handed to the handlers through a ref.
  useEffect(() => {
    const g = {
      y: H / 2,
      vy: 0,
      held: false,
      speed: 260,
      dist: 0,
      coins: 0,
      zappers: [] as Zapper[],
      pickups: [] as Coin[],
      nextSpawn: 0,
      last: 0,
      raf: 0,
      shownAt: 0,
      state: "ready" as State,
    };
    heldRef.current = g;
    let bestSoFar = 0;

    const draw = () => {
      const c = canvasRef.current?.getContext("2d");
      if (!c) return;
      const p = palette();
      c.clearRect(0, 0, W, H);

      // Floor and ceiling rails.
      c.fillStyle = p.ground;
      c.fillRect(0, 0, W, 10);
      c.fillRect(0, H - 10, W, 10);

      // Background stripes drift slower than the world, for depth.
      c.strokeStyle = p.line;
      c.lineWidth = 1;
      const off = (g.dist * 0.4) % 80;
      for (let x = -off; x < W; x += 80) {
        c.beginPath();
        c.moveTo(x, 10);
        c.lineTo(x, H - 10);
        c.stroke();
      }

      // Coins.
      for (const coin of g.pickups) {
        if (coin.taken) continue;
        c.beginPath();
        c.arc(coin.x, coin.y, 7, 0, Math.PI * 2);
        c.fillStyle = p.wash;
        c.fill();
        c.lineWidth = 2;
        c.strokeStyle = p.accent;
        c.stroke();
      }

      // Zappers: a beam between two nodes.
      for (const z of g.zappers) {
        const x2 = z.vertical ? z.x : z.x + z.len;
        const y2 = z.vertical ? z.y + z.len : z.y;
        c.lineCap = "round";
        c.lineWidth = 8;
        c.strokeStyle = p.accent;
        c.globalAlpha = 0.35;
        c.beginPath();
        c.moveTo(z.x, z.y);
        c.lineTo(x2, y2);
        c.stroke();
        c.globalAlpha = 1;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(z.x, z.y);
        c.lineTo(x2, y2);
        c.stroke();
        c.fillStyle = p.fg;
        for (const [nx, ny] of [
          [z.x, z.y],
          [x2, y2],
        ]) {
          c.beginPath();
          c.arc(nx, ny, 6, 0, Math.PI * 2);
          c.fill();
        }
      }

      // Pilot: a body with a flame while thrusting.
      const px = 110;
      if (g.held && g.state === "flying") {
        c.fillStyle = p.accent;
        c.beginPath();
        c.moveTo(px - 12, g.y + 8);
        c.lineTo(px - 6, g.y + 22 + Math.random() * 8);
        c.lineTo(px, g.y + 8);
        c.fill();
      }
      c.fillStyle = p.fg;
      c.fillRect(px - 14, g.y - 10, 10, 18); // pack
      c.beginPath();
      c.roundRect(px - 4, g.y - 14, 16, 26, 6); // body
      c.fill();
      c.fillStyle = p.accent;
      c.fillRect(px + 4, g.y - 8, 8, 5); // visor
    };


    const crash = () => {
      g.state = "crashed";
      cancelAnimationFrame(g.raf);
      const total = Math.floor(g.dist / 10) + g.coins * 10;
      setScore(total);
      setState("crashed");
      // Side effects stay out of the setState updater (StrictMode runs those twice).
      if (total > bestSoFar) {
        bestSoFar = total;
        setBest(total);
        try {
          window.localStorage.setItem(BEST_KEY, String(total));
        } catch {
          /* storage blocked, best just is not kept */
        }
      }
    };


    const tick = (now: number) => {
            if (g.state !== "flying") return;
        const dt = Math.min(0.033, (now - g.last) / 1000 || 0);
        g.last = now;

        g.speed = Math.min(520, g.speed + dt * 9);
        const dx = g.speed * dt;
        g.dist += dx;

        g.vy = Math.max(-MAX_VY, Math.min(MAX_VY, g.vy + (g.held ? THRUST : GRAVITY) * dt));
        g.y += g.vy * dt;
        if (g.y < 24) {
          g.y = 24;
          g.vy = 0;
        }
        if (g.y > H - 24) {
          g.y = H - 24;
          g.vy = 0;
        }

        for (const z of g.zappers) z.x -= dx;
        for (const coin of g.pickups) coin.x -= dx;
        g.zappers = g.zappers.filter((z) => z.x + (z.vertical ? 0 : z.len) > -20);
        g.pickups = g.pickups.filter((coin) => coin.x > -20);

        g.nextSpawn -= dx;
        if (g.nextSpawn <= 0) {
          const vertical = Math.random() < 0.55;
          const len = vertical ? 70 + Math.random() * 60 : 90 + Math.random() * 70;
          const y = vertical ? 20 + Math.random() * (H - 40 - len) : 30 + Math.random() * (H - 60);
          g.zappers.push({ x: W + 20, y, len, vertical });
          // A short coin arc in the gap after each zapper.
          const cy = 40 + Math.random() * (H - 80);
          for (let i = 0; i < 4; i++)
            g.pickups.push({ x: W + 150 + i * 24, y: cy + Math.sin(i) * 14, taken: false });
          g.nextSpawn = 230 + Math.random() * 140 - Math.min(80, g.dist / 200);
        }

        // Collisions. Pilot is a box, zappers are thick segments.
        const px = 110;
        const box = { l: px - 14, r: px + 12, t: g.y - 14, b: g.y + 12 };
        for (const z of g.zappers) {
          const l = z.x - 6;
          const r = (z.vertical ? z.x : z.x + z.len) + 6;
          const t = z.y - 6;
          const b = (z.vertical ? z.y + z.len : z.y) + 6;
          if (box.r > l && box.l < r && box.b > t && box.t < b) {
            draw();
            crash();
            return;
          }
        }
        for (const coin of g.pickups) {
          if (!coin.taken && Math.abs(coin.x - px) < 18 && Math.abs(coin.y - g.y) < 20) {
            coin.taken = true;
            g.coins += 1;
          }
        }

        if (now - g.shownAt > 100) {
          g.shownAt = now;
          setScore(Math.floor(g.dist / 10) + g.coins * 10);
        }
        draw();
        g.raf = requestAnimationFrame(tick);
    };


    const start = () => {
        cancelAnimationFrame(g.raf);
      Object.assign(g, {
        y: H / 2,
        vy: 0,
        speed: 260,
        dist: 0,
        coins: 0,
        zappers: [],
        pickups: [],
        nextSpawn: 200,
        last: performance.now(),
        shownAt: 0,
        state: "flying" as State,
      });
      setScore(0);
      setState("flying");
      g.raf = requestAnimationFrame(tick);
    };


    startRef.current = start;
    try {
      bestSoFar = Number(window.localStorage.getItem(BEST_KEY)) || 0;
      setBest(bestSoFar);
    } catch {
      /* ignore */
    }
    draw();
    // Redraw the idle frame when the theme flips.
    const redraw = () => g.state !== "flying" && draw();
    window.addEventListener("sohan-theme-change", redraw);
    return () => {
      cancelAnimationFrame(g.raf);
      window.removeEventListener("sohan-theme-change", redraw);
    };
  }, []);

  const press = (down: boolean) => {
    const g = heldRef.current;
    if (!g) return;
    g.held = down;
    if (down && g.state !== "flying") startRef.current();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Playable</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-tight text-fg">Jetpack Max</h3>
        </div>
        <div className="flex items-center gap-2">
          <Stat label="Score" value={score} />
          <Stat label="Best" value={best} />
        </div>
      </div>

      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
        Hold to fire the jetpack, let go to drop. Slip past the zappers and grab
        coins for ten points each. It gets faster.
      </p>

      <div
        role="application"
        aria-label="Jetpack Max. Hold Space, or press and hold the board, to fly."
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          press(true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* stale or synthetic pointer id, capture is only a nicety */
          }
        }}
        onPointerUp={() => press(false)}
        onPointerCancel={() => press(false)}
        onBlur={() => press(false)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
            e.preventDefault();
            if (!e.repeat) press(true);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "ArrowUp" || e.key === "w") press(false);
        }}
        className="relative mt-6 w-full cursor-pointer touch-none select-none overflow-hidden rounded-xl bg-ink ring-1 ring-line focus-visible:ring-accent"
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          width={W}
          height={H}
          className="block aspect-[64/30] w-full"
        />
        {state !== "flying" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70 backdrop-blur-[2px]">
            <p className="text-lg text-fg">
              {state === "ready" ? "Ready for take-off" : `Crashed at ${score}`}
            </p>
            <span className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink">
              {state === "ready" ? "Hold to fly" : "Hold to fly again"}
            </span>
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {state === "crashed" ? `Crashed. Score ${score}.` : ""}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] tracking-wide text-faint">
          Hold Space, W, or the board
        </p>
        <button
          type="button"
          onClick={() => {
            if (heldRef.current) heldRef.current.held = false;
            startRef.current();
          }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <ArrowClockwiseIcon size={15} aria-hidden />
          Restart
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line-soft px-3 py-2 text-right">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="font-mono text-sm tabular-nums text-fg">{value}</p>
    </div>
  );
}
