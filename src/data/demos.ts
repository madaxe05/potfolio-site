export type Demo = {
  title: string;
  /** What kind of site this is. Two or three words. */
  kind: string;
  /** Optional. Entries without a link render as text, not a dead anchor. */
  href?: string;
};

/**
 * Demo sites for the "Want a website" section.
 *
 * TODO Sohan: paste the rest of your demo links here, one object per site.
 * Nothing else needs to change, the section renders whatever is in this array.
 */
export const demos: Demo[] = [
 
  {
    title: "Ember and Olive",
    kind: "Restaurant site",
    href: "https://ember-olive-studio.vercel.app",
  },
  {
    title: "Himalayan Brew",
    kind: "Cafe site",
    href: "https://himalayan-brew-cafe.vercel.app",
  },
  {
    title: "Furniture demo",
    kind: "Furniture site",
    href: "https://furniture-demo-lovat.vercel.app",
  },
  {
    title: "Vercel Clothing brand",
    kind: "Clothing brand site",
    href: "https://vortex-clothing-brand.vercel.app",
  },
  {
    title: "Clothing brand",
    kind: "Clothing brand site",
    href: "https://clothing-brand-ten-nu.vercel.app",
  },
  {
    title: "GYM",
    kind: "Fitness site",
    href: "https://fitness-hub-two.vercel.app",
  },
];

export const servicePitch = {
  heading: "Want a website of your own?",
  body:
    "I build websites, web apps and Android apps for people and small businesses, and automate the repetitive parts around them. Tell me what you need and I will send back a scope and a timeline.",
  bullets: [
    "Personal and business websites",
    "Web apps with real data behind them",
    "Android apps, built and published for you",
    "App and workflow automation",
    "An existing site rebuilt, faster and current",
  ],
};
