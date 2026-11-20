"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowClockwiseIcon, LightbulbIcon, TrophyIcon } from "@phosphor-icons/react";

const LEN = 5;
const TRIES = 6;

/** Answer + clue. Any five letters are accepted as a guess. */
const WORDS: [string, string][] = [
  ["APPLE", "Keeps the doctor away"],
  ["BRAVE", "Facing fear anyway"],
  ["CLOUD", "Rain lives here, so do your files"],
  ["DREAM", "Happens with your eyes shut"],
  ["EARTH", "Third rock from the sun"],
  ["FLAME", "Hot, orange, flickers"],
  ["GHOST", "Says boo"],
  ["HONEY", "Made by bees"],
  ["JUICE", "Squeezed from fruit"],
  ["KNIFE", "Sharp kitchen tool"],
  ["LEMON", "Sour yellow fruit"],
  ["MANGO", "Summer fruit with a big seed"],
  ["NIGHT", "Dark hours, after dusk"],
  ["OCEAN", "Very large and salty"],
  ["PIXEL", "One dot on a screen"],
  ["QUEEN", "Wears a crown"],
  ["RIVER", "Flows to the sea"],
  ["SPACE", "Final frontier, or the big key"],
  ["TIGER", "Striped big cat"],
  ["UNITY", "Being one, or a game engine"],
  ["VIVID", "Very bright and clear"],
  ["WATER", "H2O"],
  ["YOUTH", "Being young"],
  ["ZEBRA", "Striped horse"],
  ["CHAIR", "You sit on it"],
  ["PLANT", "Needs sun and water"],
  ["SMILE", "Happy face"],
  ["STORM", "Thunder and lightning"],
  ["TRAIN", "Runs on rails"],
  ["HOUSE", "Where you live"],
  ["MUSIC", "Notes put together"],
  ["PAINT", "Colour on a brush"],
  ["BREAD", "Baked loaf"],
  ["CANDY", "Sweet treat"],
  ["SHINE", "What the sun does"],
  ["MAGIC", "Tricks and wands"],
  ["ROBOT", "Machine that acts like a person"],
  ["SNAKE", "Slithers"],
  ["STONE", "Small rock"],
  ["TOWER", "Tall building, defend it"],
];

type Mark = "hit" | "near" | "miss";

/** Standard two-pass scoring, so repeated letters are never over-counted. */
function score(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(LEN).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < LEN; i++) {
    if (guess[i] === answer[i]) marks[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < LEN; i++) {
    if (marks[i] === "hit") continue;
    if (left[guess[i]]) {
      marks[i] = "near";
      left[guess[i]] -= 1;
    }
  }
  return marks;
}

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const CELL: Record<Mark | "empty" | "typing", string> = {
  empty: "bg-ink ring-1 ring-line text-fg",
  typing: "bg-ink ring-2 ring-faint text-fg",
  hit: "bg-accent text-accent-ink ring-1 ring-accent",
  // Page text, not accent text: accent on its own wash dips under AA in light mode.
  near: "bg-accent-wash text-fg ring-2 ring-accent",
  miss: "bg-surface-2 text-faint ring-1 ring-line",
};

/**
 * Daily Word, in miniature. Guess the five-letter word in six tries, with a
 * clue on request, like the app's hint button.
 *
 * Colours are theme tokens only: a hit is the solid accent, a near miss is the
 * accent wash with an accent ring, a miss sinks into the surface. That keeps
 * the three states distinct in light and dark mode, and the near miss is
 * marked by a ring as well as colour so it does not rely on hue alone.
 */
export function PlayWord() {
  const reduce = useReducedMotion();
  const [answer, setAnswer] = useState<[string, string] | null>(null);
  const [rows, setRows] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState(false);
  const [shake, setShake] = useState(0);
  const [note, setNote] = useState("");

  const reset = useCallback(() => {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setRows([]);
    setDraft("");
    setHint(false);
    setNote("");
  }, []);

  // Client-only seed: a random answer rendered on the server would mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    reset();
  }, [reset]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const word = answer?.[0] ?? "";
  const won = rows.includes(word) && word !== "";
  const lost = !won && rows.length >= TRIES;
  const done = won || lost;

  const type = (key: string) => {
    if (done || !answer) return;
    if (key === "ENTER") {
      if (draft.length < LEN) {
        setShake((s) => s + 1);
        setNote("Five letters, please.");
        return;
      }
      const next = [...rows, draft];
      setRows(next);
      setDraft("");
      setShake(0); // so the next row does not replay the last shake
      setNote(
        draft === word
          ? `Solved in ${next.length}.`
          : next.length >= TRIES
            ? `Out of tries. It was ${word}.`
            : score(draft, word)
                .map((m, i) => `${draft[i]} ${m === "hit" ? "right spot" : m === "near" ? "wrong spot" : "not in word"}`)
                .join(", ")
      );
      return;
    }
    if (key === "BACK") {
      setDraft((d) => d.slice(0, -1));
      return;
    }
    if (/^[A-Z]$/.test(key) && draft.length < LEN) setDraft((d) => d + key);
  };

  // Best mark per letter for the keyboard.
  const keyMarks: Record<string, Mark> = {};
  for (const r of rows) {
    score(r, word).forEach((m, i) => {
      const prev = keyMarks[r[i]];
      if (m === "hit" || (m === "near" && prev !== "hit") || !prev) keyMarks[r[i]] = m;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Playable</p>
          <h3 className="mt-1.5 text-xl font-medium tracking-tight text-fg">Daily Word</h3>
        </div>
        <button
          type="button"
          onClick={() => setHint(true)}
          disabled={hint || done}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98] disabled:cursor-default disabled:opacity-50 disabled:hover:border-line disabled:hover:text-fg"
        >
          <LightbulbIcon size={15} aria-hidden />
          Clue
        </button>
      </div>

      <p className="mt-4 min-h-[1.5rem] text-[0.9rem] leading-relaxed text-muted">
        {hint && answer ? (
          <>
            Clue: <span className="text-fg">{answer[1]}</span>
          </>
        ) : (
          "Guess the five-letter word in six tries. Solid means right spot, ringed means wrong spot."
        )}
      </p>

      <div
        tabIndex={0}
        role="group"
        aria-label="Daily Word board. Type letters, Enter to guess, Backspace to delete."
        onKeyDown={(e) => {
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          const k = e.key === "Enter" ? "ENTER" : e.key === "Backspace" ? "BACK" : e.key.toUpperCase();
          if (k === "ENTER" || k === "BACK" || /^[A-Z]$/.test(k)) {
            e.preventDefault();
            type(k);
          }
        }}
        className="relative mx-auto mt-5 grid w-full max-w-[17rem] gap-1.5 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {Array.from({ length: TRIES }).map((_, r) => {
          const guess = rows[r];
          const isDraft = r === rows.length && !done;
          const marks = guess ? score(guess, word) : null;
          const letters = guess ?? (isDraft ? draft : "");
          return (
            <motion.div
              key={isDraft ? `draft-${shake}` : r}
              animate={isDraft && shake && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              className="grid grid-cols-5 gap-1.5"
            >
              {Array.from({ length: LEN }).map((__, c) => {
                const ch = letters[c] ?? "";
                const kind = marks ? marks[c] : ch ? "typing" : "empty";
                return (
                  <div
                    key={c}
                    className={`flex aspect-square items-center justify-center rounded-lg font-mono text-lg font-medium uppercase transition-colors duration-300 ${CELL[kind]}`}
                  >
                    {ch}
                  </div>
                );
              })}
            </motion.div>
          );
        })}

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-ink/85 p-4 text-center backdrop-blur-sm"
          >
            <p className="flex items-center gap-2 text-lg text-fg">
              {won && <TrophyIcon size={20} aria-hidden className="text-accent" />}
              {won ? `Got it in ${rows.length}` : `It was ${word}`}
            </p>
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform duration-200 hover:brightness-(--accent-hover) active:scale-[0.98]"
            >
              New word
            </button>
          </motion.div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {note}
      </p>

      <div className="mt-5 flex flex-col gap-1.5">
        {KEYS.map((row, i) => (
          <div key={row} className="flex justify-center gap-1">
            {i === 2 && <Key label="Enter" wide onClick={() => type("ENTER")} />}
            {row.split("").map((k) => (
              <Key key={k} label={k} mark={keyMarks[k]} onClick={() => type(k)} />
            ))}
            {i === 2 && <Key label="Del" aria="Delete letter" wide onClick={() => type("BACK")} />}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.68rem] tracking-wide text-faint">Type, or tap the keys</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          <ArrowClockwiseIcon size={15} aria-hidden />
          New word
        </button>
      </div>
    </div>
  );
}

function Key({
  label,
  mark,
  wide,
  aria,
  onClick,
}: {
  label: string;
  mark?: Mark;
  wide?: boolean;
  aria?: string;
  onClick: () => void;
}) {
  // A ruled-out key fades back, so it never looks like an untried one.
  const tone =
    mark === "miss"
      ? "bg-transparent text-muted ring-1 ring-line-soft opacity-60"
      : mark
        ? CELL[mark]
        : "bg-surface-2 text-fg ring-1 ring-line hover:ring-accent";
  return (
    <button
      type="button"
      onClick={onClick}
      // Keep focus on the board, so a physical keyboard still types after a tap.
      onMouseDown={(e) => e.preventDefault()}
      aria-label={aria ?? label}
      className={`flex h-10 cursor-pointer items-center justify-center rounded-md font-mono text-xs font-medium transition-all duration-150 active:scale-95 ${
        wide ? "min-w-[3.2rem] px-2" : "w-[clamp(1.45rem,7.4vw,2.1rem)]"
      } ${tone}`}
    >
      {label}
    </button>
  );
}
