"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motivation: feedback. The button leans toward the cursor as you approach,
 * so the primary action feels physically reachable. Motion values only, so a
 * pointer move never re-renders React.
 *
 * The same element is always rendered, whatever the motion preference. Swapping
 * the element type on useReducedMotion would desync hydration, because the hook
 * is undefined on the server and a real boolean on the client's first render.
 * Reduced motion is handled by parking the handlers instead.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Measured on enter, not on every move. Reading it per move forces a layout.
  const rect = useRef<DOMRect | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 20, mass: 0.4 });

  return (
    <motion.span
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      className={className}
      onPointerEnter={() => {
        rect.current = ref.current?.getBoundingClientRect() ?? null;
      }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = rect.current ?? ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        rect.current = null;
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
