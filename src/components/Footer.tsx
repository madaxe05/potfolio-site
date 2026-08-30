import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      {/* No year here on purpose: this page is statically prerendered, so a
          build-time year would silently go stale after the next new year. */}
      <p className="font-mono text-xs text-faint">{site.name}</p>
      <a
        href="#top"
        className="cursor-pointer font-mono text-xs text-faint transition-colors hover:text-accent"
      >
        Back to top
      </a>
    </footer>
  );
}
