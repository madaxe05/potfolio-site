"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;
  return (
    <a href="#top" className="back-to-top" aria-label="Back to top">
      <ArrowUpIcon size={19} aria-hidden />
      <span>Back to top</span>
    </a>
  );
}
