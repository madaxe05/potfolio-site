"use client";

import Image from "next/image";
import {
  ArrowUpRightIcon,
  ImagesIcon,
  GithubLogoIcon,
  GooglePlayLogoIcon,
} from "@phosphor-icons/react";
import type { Project } from "@/data/projects";

const previewIndices: Record<string, number[]> = {
  "veritas-guard": [1, 2],
  "ai-calendar": [1, 2],
  grocressy: [1, 2],
  colorjoy: [1, 2],
  "daily-word": [1, 2],
  "gta-cheats": [1, 2],
  "gta6-cheats": [3],
  "merge-1024": [2, 3],
};

export function ProjectCard({
  project,
  onOpenShots,
}: {
  project: Project;
  onOpenShots: (p: Project, index: number) => void;
}) {
  const shots = project.shots ?? [];
  const indices = previewIndices[project.slug] ?? [0, 1];
  const landscape = project.landscape === true;
  const LinkIcon =
    project.hrefLabel === "GitHub" ? GithubLogoIcon : GooglePlayLogoIcon;
  return (
    <article className="project-card">
      {shots.length > 0 ? (
        <button
          type="button"
          onClick={() => onOpenShots(project, indices[0])}
          className={`project-stage stage-${project.slug} ${landscape ? "landscape-stage" : ""}`}
          aria-label={`Preview ${project.title} screenshots`}
        >
          <span className="stage-grid" aria-hidden />
          <span className="stage-caption" aria-hidden>
            {project.category === "games"
              ? "Made to play"
              : "Designed for everyday"}
          </span>
          <span className="phone-composition" aria-hidden>
            {indices
              .filter((index) => index < shots.length)
              .map((index, i) => (
                <span className={`phone phone-${i}`} key={shots[index]}>
                  <Image
                    src={shots[index]}
                    alt=""
                    fill
                    sizes="140px"
                    className="object-cover object-top"
                  />
                </span>
              ))}
          </span>
          <span className="preview-affordance">
            <ImagesIcon size={16} aria-hidden /> Explore screens{" "}
            <ArrowUpRightIcon size={14} aria-hidden />
          </span>
        </button>
      ) : (
        <div
          className={`project-stage project-symbol stage-${project.slug}`}
          aria-hidden
        >
          <span className="stage-grid" />
          {project.icon ? (
            <Image
              src={project.icon}
              alt=""
              width={112}
              height={112}
              className="rounded-3xl"
            />
          ) : (
            <span>
              {project.category === "academic"
                ? "{ }"
                : project.title.charAt(0)}
            </span>
          )}
          <span className="stage-caption">
            {project.category === "academic"
              ? "Research & engineering"
              : "From idea to release"}
          </span>
        </div>
      )}
      <div className="project-info">
        <div className="flex items-center justify-between gap-3">
          <span className="project-kind">
            {project.category === "apps"
              ? "Mobile app"
              : project.category === "games"
                ? "Game"
                : project.category === "web"
                  ? "Web platform"
                  : "Academic / ML"}
          </span>
          <span
            className={`project-status ${project.hrefLabel === "Play Store" ? "is-live" : ""}`}
          >
            <span />
            {project.hrefLabel === "Play Store"
              ? "On Google Play"
              : project.hrefLabel === "GitHub"
                ? "Open source"
                : "In development"}
          </span>
        </div>
        <div className="project-heading">
          {project.icon && (
            <Image
              src={project.icon}
              alt=""
              width={34}
              height={34}
              className="size-[34px] rounded-xl"
            />
          )}
          <h3 className="project-title">{project.title}</h3>
        </div>
        <p className="project-blurb">{project.blurb}</p>
        <ul className="project-stack">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="project-actions">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              <LinkIcon size={18} aria-hidden />
              {project.hrefLabel === "GitHub"
                ? "View source"
                : "View on Google Play"}
              <ArrowUpRightIcon size={16} aria-hidden />
            </a>
          ) : (
            <span className="text-sm text-muted">Release in the works</span>
          )}
          {shots.length > 0 && (
            <button
              type="button"
              onClick={() => onOpenShots(project, 0)}
              className="icon-button"
              aria-label={`View all ${project.title} screenshots`}
            >
              <ImagesIcon size={20} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
