"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Section headings resolve word by word as they enter.
 *
 * Motion weighting: Jakub. This fires once per section, so it can afford
 * expression, but it stays a short rise plus a blur lift rather than a
 * per-letter cascade, which reads as showing off at this size.
 *
 * The viewport is observed on the h2, and the words are variant children.
 * Observing each word individually does not work: every word sits inside an
 * `overflow-hidden` mask and starts translated fully outside it, so an
 * IntersectionObserver clipped by that ancestor reports a ratio of 0 forever.
 * The word can never enter view until it animates, and never animates until it
 * enters view, so the whole heading stays invisible.
 */
const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07 } },
};

const word: Variants = {
  hidden: { y: "105%", opacity: 0, filter: "blur(6px)" },
  shown: { y: "0%", opacity: 1, filter: "blur(0px)" },
};

export function SectionHeading({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");

  return (
    <motion.h2
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      variants={container}
      transition={reduce ? { duration: 0 } : undefined}
      className={`text-[clamp(2.25rem,5.5vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.035em] ${className}`}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className="reveal inline-block"
            variants={word}
            transition={
              reduce ? { duration: 0 } : { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.h2>
  );
}
