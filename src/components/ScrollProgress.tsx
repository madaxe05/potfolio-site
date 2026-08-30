"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Motivation: state. A long single-page site gives no sense of position, so a
 * one-pixel rail reports how far through the page you are. useScroll keeps it
 * off the React render loop.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.2 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent"
    />
  );
}
