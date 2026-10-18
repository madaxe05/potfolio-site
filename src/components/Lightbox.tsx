"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const src = state?.shots[state.index];
  const ratio = src ? ratios[src] : undefined;
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        onMove(e.key === "ArrowRight" ? 1 : -1);
      }
      if (e.key !== "Tab") return;

      // Manual focus cycle. Nothing outside the overlay should be reachable.
      const focusable = panel.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Clicking the screenshot, which is not focusable, drops focus onto
      // document.body. Without this the next Tab escapes into the nav behind
      // the overlay with no way back.
      if (!panel.current?.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, onMove],
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
      0,
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
            if (e.target === e.currentTarget) onClose();
          }}
          className="gallery-overlay"
        >
          <div ref={panel} className="gallery-panel">
            <div className="gallery-header">
              <div>
                <p className="section-eyebrow">A closer look</p>
                <h3>{state.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close screenshots"
                className="icon-button"
              >
                <XIcon size={20} aria-hidden />
              </button>
            </div>
            <div className="gallery-viewer">
              <NavButton
                dir="prev"
                disabled={state.shots.length < 2}
                onClick={() => onMove(-1)}
              />
              <div
                className={`gallery-stage ${(ratio ?? 0) > 1 ? "is-landscape" : ""}`}
                style={(ratio ?? 0) > 1 ? { aspectRatio: ratio } : undefined}
                onTouchStart={(e) => {
                  touch.current =
                    e.touches.length === 1
                      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                      : null;
                }}
                onTouchEnd={(e) => {
                  const start = touch.current;
                  touch.current = null;
                  if (!start || e.touches.length || !e.changedTouches.length)
                    return;
                  const dx = e.changedTouches[0].clientX - start.x;
                  const dy = e.changedTouches[0].clientY - start.y;
                  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
                    onMove(dx < 0 ? 1 : -1);
                }}
                onTouchCancel={() => {
                  touch.current = null;
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.shots[state.index]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.15 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={state.shots[state.index]}
                      alt={`${state.title} screenshot ${state.index + 1}`}
                      fill
                      sizes="(max-width: 767px) 90vw, 1024px"
                      className="object-contain"
                      onLoad={(event) => {
                        const image = event.currentTarget;
                        const measured =
                          image.naturalWidth / image.naturalHeight;
                        const imageSrc = state.shots[state.index];
                        setRatios((current) =>
                          current[imageSrc] === measured
                            ? current
                            : { ...current, [imageSrc]: measured },
                        );
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <NavButton
                dir="next"
                disabled={state.shots.length < 2}
                onClick={() => onMove(1)}
              />
            </div>
            <div
              className="gallery-thumbnails"
              role="group"
              aria-label="Choose a screenshot"
            >
              {state.shots.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show screenshot ${index + 1}`}
                  aria-pressed={state.index === index}
                  onClick={() => onMove(index - state.index)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="gallery-footer">
              <span aria-live="polite">
                {state.index + 1} / {state.shots.length}
              </span>
              <span className="gallery-desktop-hint">
                Arrow keys to browse · Esc to close
              </span>
              <span className="gallery-mobile-hint">Swipe to browse</span>
            </div>
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
      className="gallery-arrow icon-button disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
