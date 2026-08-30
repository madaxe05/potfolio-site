"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwiseIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";

/** Site accent, as authored in globals.css. Reset restores exactly this. */
const DEFAULT_HUE = 12;

/** WCAG relative luminance. */
function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

function hslToHex(h: number, s: number, l: number) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l / 100 - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const INK = "#0a0a0b";
const PAPER = "#f4f4f3";
const MIN_RATIO = 4.5;

/**
 * Lifts lightness until the colour clears WCAG AA against the page ground.
 *
 * A fixed lightness is NOT a contrast clamp. At l=58 the blues land far darker
 * than the oranges: hue 240 gives #4141e6 at 2.94:1, which would drag the
 * site-wide focus ring and every accent button below AA the moment it was
 * applied. This raises l in one-point steps until the ratio actually passes.
 */
function accessibleHex(hue: number, sat: number, lightness: number) {
  let l = lightness;
  let hex = hslToHex(hue, sat, l);
  while (l < 92 && contrast(hex, INK) < MIN_RATIO) {
    l += 1;
    hex = hslToHex(hue, sat, l);
  }
  return hex;
}

/**
 * Five-step harmony. The Accent step is guaranteed to clear AA against the page
 * ground, because it is the one the page actually adopts.
 */
function palette(hue: number) {
  const steps = [
    { d: -32, s: 52, l: 74, role: "Tint", guard: false },
    { d: -16, s: 62, l: 66, role: "Light", guard: false },
    { d: 0, s: 77, l: 58, role: "Accent", guard: true },
    { d: 18, s: 64, l: 44, role: "Deep", guard: false },
    { d: 38, s: 46, l: 30, role: "Shade", guard: false },
  ];
  return steps.map((st) => {
    const h = (hue + st.d + 360) % 360;
    return {
      role: st.role,
      hex: st.guard ? accessibleHex(h, st.s, st.l) : hslToHex(h, st.s, st.l),
    };
  });
}

/**
 * Palette lab. The one page element that changes the page itself.
 *
 * Motion weighting: Jakub. Swatch changes are a continuous drag, so they are
 * near-instant colour transitions rather than animated moves. The only real
 * motion is the confirmation tick, which is feedback for a discrete action.
 */
export function PaletteLab() {
  const reduce = useReducedMotion();
  const [hue, setHue] = useState(DEFAULT_HUE);
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const swatches = useMemo(() => palette(hue), [hue]);
  const accent = swatches[2].hex;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  // Never leave the page retinted after this component goes away.
  useEffect(() => {
    return () => {
      const root = document.documentElement.style;
      root.removeProperty("--color-accent");
      root.removeProperty("--color-accent-wash");
      root.removeProperty("--color-accent-ink");
    };
  }, []);

  /**
   * Three tokens move together. --color-accent-wash and --color-accent-ink are
   * both used *with* the accent (`bg-accent-wash text-accent`, `bg-accent
   * text-accent-ink`), so overriding only the accent leaves blue text on a
   * dark-orange tile. Ink flips to paper if that reads better on the new hue.
   */
  const applyTokens = (hex: string, h: number) => {
    const root = document.documentElement.style;
    root.setProperty("--color-accent", hex);
    root.setProperty("--color-accent-wash", hslToHex(h, 60, 9));
    root.setProperty(
      "--color-accent-ink",
      contrast(INK, hex) >= contrast(PAPER, hex) ? INK : PAPER
    );
  };

  const clearTokens = () => {
    const root = document.documentElement.style;
    root.removeProperty("--color-accent");
    root.removeProperty("--color-accent-wash");
    root.removeProperty("--color-accent-ink");
  };

  const apply = () => {
    applyTokens(accent, hue);
    setApplied(true);
  };

  const restore = () => {
    clearTokens();
    setHue(DEFAULT_HUE);
    setApplied(false);
  };

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Try it</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-tight text-fg">
            Palette lab
          </h3>
        </div>
        <span
          aria-hidden
          className="size-11 shrink-0 rounded-xl ring-1 ring-line transition-colors duration-200"
          style={{ backgroundColor: accent }}
        />
      </div>

      <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">
        The idea behind HuePilot, in miniature. Drag the hue, take the hex, or
        push the accent onto this whole page and see how it holds up.
      </p>

      <div className="mt-7">
        <label
          htmlFor="hue"
          className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-faint"
        >
          Hue
          <span className="tabular-nums text-muted">{hue}&deg;</span>
        </label>
        <input
          id="hue"
          type="range"
          min={0}
          max={359}
          value={hue}
          onChange={(e) => {
            const next = Number(e.target.value);
            setHue(next);
            // If the page is already recoloured, follow the slider. Otherwise
            // the swatches and readout describe a hue the page is not using.
            if (applied) applyTokens(palette(next)[2].hex, next);
          }}
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fg [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-ink [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-fg"
          style={{
            background:
              "linear-gradient(90deg,hsl(0 77% 58%),hsl(60 77% 58%),hsl(120 77% 58%),hsl(180 77% 58%),hsl(240 77% 58%),hsl(300 77% 58%),hsl(360 77% 58%))",
          }}
        />
      </div>

      <ul className="mt-7 grid grid-cols-5 gap-2">
        {swatches.map((s) => (
          <li key={s.role}>
            <button
              type="button"
              onClick={() => copy(s.hex)}
              aria-label={`Copy ${s.role} ${s.hex}`}
              className="group flex w-full cursor-pointer flex-col gap-2 text-left"
            >
              <span
                className="relative flex h-16 items-center justify-center rounded-lg ring-1 ring-line transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 sm:h-20"
                style={{ backgroundColor: s.hex }}
              >
                {copied === s.hex ? (
                  <motion.span
                    initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="text-ink"
                  >
                    <CheckIcon size={18} weight="bold" aria-hidden />
                  </motion.span>
                ) : (
                  <CopyIcon
                    size={16}
                    aria-hidden
                    className="text-ink/0 transition-colors duration-200 group-hover:text-ink/70"
                  />
                )}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
                {s.role}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? `${copied} copied` : ""}
      </p>

      {/* Live contrast readout. The reason this is a tool and not a swatch grid. */}
      <div className="mt-7 rounded-xl border border-line-soft p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: accent, color: "#0a0a0b" }}
          >
            Button
          </span>
          <span className="text-sm" style={{ color: accent }}>
            Link text
          </span>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          {/* Two genuinely different pairs. Comparing the accent to the page
              ink twice would print the same number under two labels, since
              contrast is symmetric. */}
          <ContrastRow label="Accent on page" ratio={contrast(accent, "#0a0a0b")} />
          <ContrastRow label="White on accent" ratio={contrast("#f4f4f3", accent)} />
        </dl>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <button
          type="button"
          onClick={apply}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
        >
          {applied ? "Applied to the page" : "Recolour this page"}
        </button>
        <button
          type="button"
          onClick={restore}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <ArrowCounterClockwiseIcon size={15} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  );
}

function ContrastRow({ label, ratio }: { label: string; ratio: number }) {
  const pass = ratio >= 4.5;
  return (
    <div>
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
        {label}
      </dt>
      <dd className="mt-1.5 flex items-baseline gap-2">
        <span className="font-mono text-base tabular-nums text-fg">
          {ratio.toFixed(2)}:1
        </span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] tracking-wide ${
            pass ? "bg-accent-wash text-accent" : "bg-surface-2 text-faint"
          }`}
        >
          {pass ? "AA" : "low"}
        </span>
      </dd>
    </div>
  );
}
