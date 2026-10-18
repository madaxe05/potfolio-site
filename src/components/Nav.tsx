"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRightIcon,
  ArrowDownIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { site } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Websites" },
  { href: "#playground", label: "Playground" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    for (const section of document.querySelectorAll("main > section[id]"))
      observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer"),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = matchMedia("(min-width: 1024px)");
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element, i) => {
        element.inert = previousInert[i];
      });
      removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);
  return (
    <header className="site-header">
      <nav aria-label="Primary" className="nav-inner">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="brand-monogram">
            sd<span>.</span>
          </span>
          <span>Sohan Dhungel</span>
        </a>
        <ul className="desktop-links">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "location" : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href="#contact" className="nav-contact">
            Let’s talk <ArrowUpRightIcon size={16} aria-hidden />
          </a>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="icon-button menu-toggle"
          >
            {open ? <XIcon size={21} /> : <ListIcon size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-nav" className="mobile-menu">
          <p className="section-eyebrow">Explore the portfolio</p>
          <ul>
            {[...links, { href: "#contact", label: "Contact" }].map((l, i) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  <span className="font-mono text-xs text-accent">
                    0{i + 1}
                  </span>
                  {l.label}
                  <ArrowUpRightIcon size={22} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.cv}
            download
            className="button-secondary"
            onClick={() => setOpen(false)}
          >
            <ArrowDownIcon size={16} aria-hidden />
            Download CV
          </a>
          <p className="mt-6 text-sm text-muted">Based in Kathmandu, Nepal.</p>
        </div>
      )}
    </header>
  );
}
