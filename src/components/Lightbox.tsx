"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";

export type LightboxState = {
  title: string;
  shots: string[];
  index: number;
} | null;

/**
 * Full-screen screenshot viewer.
 *
 * Motivation: spatial continuity. Store screenshots are small in the grid, so
 * the reader gets a real look without leaving the page.
 *
 * Focus is moved into the dialog on open and restored to the thumbnail that
 * opened it on close, and Tab is cycled inside the overlay. role="dialog" and
 * aria-modal do not trap anything on their own, so this is done by hand.
 */
export function Lightbox({
  state,
  onClose,
  onMove,
}: {
  state: LightboxState;
  onClose: () => void;
  onMove: (delta: number) => void;
}) {
  const reduce = useReducedMotion();
  const open = state !== null;
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key !== "Tab") return;

      // Manual focus cycle. Nothing outside the overlay should be reachable.
      const focusable = panel.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, onMove]
  );

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement as HTMLElement | null;
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus in, so the next Tab lands inside the overlay rather than on
    // the now-covered thumbnail behind it.
    const id = window.setTimeout(
      () => panel.current?.querySelector<HTMLElement>("button")?.focus(),
      0
    );

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener.current?.focus?.();
    };
  }, [open, onKey]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${state.title} screenshots`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={(e) => {
            // Only a click on the backdrop itself closes. Clicking the title,
            // the counter or the hint used to dismiss the viewer.
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-ink/95 p-4 backdrop-blur-md sm:p-8"
        >
          <div ref={panel} className="contents">
          <div className="flex w-full max-w-5xl items-center justify-between">
            <p className="text-sm text-fg">{state.title}</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-faint">
                {state.index + 1} / {state.shots.length}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close screenshots"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <XIcon size={18} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex w-full max-w-5xl items-center justify-center gap-3 sm:gap-6">
            <NavButton
              dir="prev"
              disabled={state.shots.length < 2}
              onClick={() => onMove(-1)}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={state.shots[state.index]}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-[60vh] w-full max-w-[min(90vw,20rem)] overflow-hidden rounded-2xl border border-line bg-surface sm:h-[72vh] sm:max-w-[22rem]"
              >
                <Image
                  src={state.shots[state.index]}
                  alt={`${state.title} screenshot ${state.index + 1}`}
                  fill
                  sizes="360px"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
            <NavButton
              dir="next"
              disabled={state.shots.length < 2}
              onClick={() => onMove(1)}
            />
          </div>

          <p className="font-mono text-[0.7rem] tracking-wide text-faint">
            Arrow keys to move, Esc to close
          </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = dir === "prev" ? CaretLeftIcon : CaretRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous screenshot" : "Next screenshot"}
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
