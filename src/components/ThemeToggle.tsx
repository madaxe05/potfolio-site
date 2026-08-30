"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

type Theme = "dark" | "light";

const EVENT = "sohan-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  // The boot script in layout.tsx stamps data-theme before paint, so the
  // server default (dark) only ever shows for the instant before hydration.
  return "dark";
}

/**
 * Theme lives on <html data-theme>, set before paint by the inline script in
 * layout.tsx and read here via useSyncExternalStore, the pattern for
 * synchronizing with state React does not own. This avoids both a hydration
 * mismatch and the setState-in-effect cascade a useState+useEffect version
 * would trigger.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode). The toggle still works
      // for the rest of this session, it just will not persist.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {theme === "light" ? (
        <MoonIcon size={17} aria-hidden />
      ) : (
        <SunIcon size={17} aria-hidden />
      )}
    </button>
  );
}
