"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  CodeIcon,
  DeviceMobileIcon,
  GlobeIcon,
  ChartLineUpIcon,
  CubeIcon,
  GameControllerIcon,
} from "@phosphor-icons/react";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const icons = [
  CodeIcon,
  DeviceMobileIcon,
  GlobeIcon,
  ChartLineUpIcon,
  CubeIcon,
  GameControllerIcon,
];
const notes = [
  "The building blocks. From typed frontends to contracts and game logic.",
  "My daily toolkit for taking an app from a sketch to Google Play.",
  "Fast, responsive interfaces with real data and thoughtful interactions.",
  "Turning raw information into useful predictions and clear insights.",
  "Verifiable documents and logic that lives on-chain.",
  "Game worlds, tested systems, and the tools that help me ship.",
];

export function Toolkit() {
  const [selected, setSelected] = useState(1);
  const group = skillGroups[selected];
  const Icon = icons[selected];
  return (
    <section id="toolkit" className="section-shell toolkit-section">
      <div className="section-intro">
        <Reveal>
          <p className="section-eyebrow">
            <span>04 / The toolkit</span>
            <span>Right tool. Real purpose.</span>
          </p>
          <SectionHeading>Different ideas. Solid foundations.</SectionHeading>
        </Reveal>
        <Reveal index={1}>
          <p className="section-description">
            A practical mix of technologies, chosen for what the project needs.
            Explore a discipline to see what’s behind the work.
          </p>
        </Reveal>
      </div>
      <div className="toolkit-explorer">
        <div
          role="group"
          aria-label="Explore technology disciplines"
          className="toolkit-menu"
        >
          {skillGroups.map((g, i) => {
            const ItemIcon = icons[i];
            return (
              <button
                key={g.title}
                type="button"
                aria-pressed={selected === i}
                aria-controls="toolkit-detail"
                onClick={() => setSelected(i)}
              >
                <ItemIcon size={22} aria-hidden />
                <span>{g.title}</span>
                <span className="tool-count">{g.items.length}</span>
                <ArrowUpRightIcon size={17} aria-hidden />
              </button>
            );
          })}
        </div>
        <div className="toolkit-detail" id="toolkit-detail" key={group.title}>
          <span className="toolkit-emblem" aria-hidden>
            <Icon size={46} weight="light" />
          </span>
          <p className="section-eyebrow">
            Inside the toolkit / 0{selected + 1}
          </p>
          <h3>{group.title}</h3>
          <p className="toolkit-note">{notes[selected]}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a href="#work" className="text-link">
            See it in the work <ArrowUpRightIcon size={17} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
