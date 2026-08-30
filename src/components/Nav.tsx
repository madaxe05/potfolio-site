"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowDownIcon, ArrowSquareOutIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#playground", label: "Play" },
  { href: "#studios", label: "Studios" },
  { href: "#services", label: "Services" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#journey", label: "Journey" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * Motivation: state transition. The hairline tells you that you have left
   * the top of the page. useMotionValueEvent keeps this off the render loop.
   */
  useMotionValueEvent(scrollY, "change", (v) => setLifted(v > 24));

  // Close on Escape, and close when the viewport crosses into desktop. The
  // panel is md:hidden, so resizing past md while it is open used to leave the
  // page permanently scroll-locked with no visible control to unlock it.
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
      // Restore what was there, rather than clobbering another lock.
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        lifted
          ? "border-b border-line-soft bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-fg transition-colors hover:text-accent"
        >
          {site.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            <ArrowSquareOutIcon size={15} aria-hidden />
            View CV
          </a>
          <a
            href={site.cv}
            download
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg transition-all duration-200 hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            <ArrowDownIcon size={15} aria-hidden />
            Download CV
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg"
          >
            {open ? <XIcon size={18} aria-hidden /> : <ListIcon size={18} aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-line-soft bg-ink px-5 pb-8 pt-4 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-2xl tracking-tight text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={site.cv}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-fg"
            >
              <ArrowSquareOutIcon size={15} aria-hidden />
              View CV
            </a>
            <a
              href={site.cv}
              download
              onClick={() => setOpen(false)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-3 text-sm text-fg"
            >
              <ArrowDownIcon size={15} aria-hidden />
              Download CV
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
