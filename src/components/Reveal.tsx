"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger index. Each step delays the reveal by 60ms. */
  index?: number;
  className?: string;
};

/**
 * Scroll reveal. Motivation: content arrives as the reader reaches it, which
 * keeps the eye moving down the page instead of landing on a wall of text.
 *
 * `initial` is deliberately NOT branched on useReducedMotion. That hook
 * resolves to null on the server and to the real value on the client, so
 * branching it produces a hydration mismatch that React refuses to patch,
 * which can strand a whole section at opacity 0. Only the transition is
 * branched, and transitions never reach the server-rendered markup.
 */
export function Reveal({ children, index = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`reveal ${className ?? ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: 0.55,
              delay: Math.min(index * 0.06, 0.4),
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      {children}
    </motion.div>
  );
}
