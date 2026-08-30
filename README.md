# Sohan Dhungel, portfolio

Single-page portfolio. Next.js 16 App Router, TypeScript, Tailwind CSS 4, Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
npx tsc --noEmit # types
```

## Where the content lives

Everything on the page is driven from four typed files. Editing these is the
only thing you need to do to update the site.

| File | Holds |
| --- | --- |
| `src/data/site.ts` | Name, role, contact details, socials, experience, education |
| `src/data/projects.ts` | Every project, its category, links, icon and screenshots |
| `src/data/skills.ts` | The Toolkit section, grouped |
| `src/data/demos.ts` | Demo site links for the "Want a website" section, and the pitch copy |

## Things left for you

1. **Demo site links.** `src/data/demos.ts` has two entries. Paste the rest as
   `{ title, kind, href }`. An entry without `href` renders as text, not a dead link.
2. **The domain.** `src/app/layout.tsx` falls back to
   `https://sohandhungel.vercel.app`. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the
   real domain so the Open Graph image resolves.
3. **Godot game links.** Realm Guard, Arrow Escape and Kingdom of Aetheria have no
   `href` because they are not pushed anywhere public. Add one when they ship and
   the card gains a link automatically.
4. **HuePilot and Displayy** are published under a third developer account,
   `S&S Coders 2`, not under Suso Studios or Mad Axe. The Studios section links
   only the two accounts you named. Say the word if you want the third added.

## The CV

`public/sohan-dhungel-cv.pdf` is generated from `scripts/cv.html`, so edit the
HTML rather than the PDF. To re-render, print `scripts/cv.html` to PDF from
Chrome with background graphics on, A4, default margins. It is tuned to fit
exactly one page.

## Assets

`public/apps/` holds real Play Store icons and screenshots, pulled from the live
listings. `public/portrait.jpg` is the hero photo, resized to 1200x1600.

## Notes for whoever edits this next

- **Do not branch `initial`, `style`, or the element type on `useReducedMotion()`**
  in anything that is server-rendered. That hook is `null` on the server and a
  real boolean on the client's first render, so branching it desynchronises
  hydration and can strand a whole section at `opacity: 0`. Branch the
  `transition` instead. Several components carry a comment saying so.
- Elements that animate in from `opacity: 0` carry the `reveal` class. A
  `<noscript>` rule in `layout.tsx` forces them visible when JS is unavailable.
- One accent colour, defined once as `--color-accent` in `globals.css`. The
  palette lab overrides that single variable at runtime, which is why retinting
  the whole page works.
