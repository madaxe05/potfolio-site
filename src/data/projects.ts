export type Category = "apps" | "games" | "web" | "academic";

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  status: string;
  category: Category;
  stack: string[];
  /** Public link. Play Store for shipped apps, GitHub for source-available work. */
  href?: string;
  hrefLabel?: "Play Store" | "GitHub";
  studio?: string;
  /** Play Store icon, stored locally under /public/apps. */
  icon?: string;
  /** Real store screenshots. These feed the lightbox. */
  shots?: string[];
};

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "apps", label: "Mobile apps" },
  { id: "games", label: "Games" },
  { id: "web", label: "Web" },
  { id: "academic", label: "Academic and ML" },
];

const play = (id: string) => `https://play.google.com/store/apps/details?id=${id}`;
const gh = (repo: string) => `https://github.com/madaxe05/${repo}`;
const shots = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/apps/${slug}-${i + 1}.jpg`);

export const projects: Project[] = [
  // ---------------------------------------------------------------- apps
  {
    slug: "veritas-guard",
    title: "Veritas Subscription Guard",
    blurb:
      "Tracks every recurring payment and warns you before a renewal charges. Offline-first local database, biometric lock, spend analytics and optional cloud backup.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Riverpod", "Drift", "Firebase", "fl_chart"],
    href: play("com.madxero.subscription"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/veritas-guard-icon.png",
    shots: shots("veritas-guard", 4),
  },
  {
    slug: "veritas-pdf",
    title: "Veritas PDF",
    blurb:
      "PDF reader and document toolkit. Read, organise, merge, compress and extract pages without sending a single file to a server.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Android"],
    href: play("com.madxero.veritaspdf"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/veritas-pdf-icon.png",
    shots: shots("veritas-pdf", 2),
  },
  {
    slug: "grocressy",
    title: "Grocressy",
    blurb:
      "A shopping list that remembers what you paid. Build a list in seconds, tick items off in the aisle, and watch how grocery prices move over time.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Riverpod", "SQLite", "Firestore", "Gemini"],
    href: play("com.dhungels.grocery"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/grocressy-icon.png",
    shots: shots("grocressy", 4),
  },
  {
    slug: "colorjoy",
    title: "ColorJoy",
    blurb:
      "A colouring and drawing app for young kids. 827 pages and 12 games, with no ads, no purchases, no sign-up and no internet needed.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Android", "Offline-first"],
    href: play("com.dhungels.colorjoy"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/colorjoy-icon.png",
    shots: shots("colorjoy", 4),
  },
  {
    slug: "huepilot",
    title: "HuePilot",
    blurb:
      "Colour palette generator for designers and developers. Build palettes, pull colours out of an image, generate gradients and export straight to code.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Firebase"],
    href: play("com.sohan.huepilot"),
    hrefLabel: "Play Store",
    studio: "S&S Coders 2",
    icon: "/apps/huepilot-icon.png",
    shots: shots("huepilot", 4),
  },
  {
    slug: "displayy",
    title: "Displayy",
    blurb:
      "Turns the screen into a calm solid colour surface. Custom colour wheel, brightness control, countdown timer, wallpaper setting and high-res export.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Android"],
    href: play("com.displayy.displayy"),
    hrefLabel: "Play Store",
    studio: "S&S Coders 2",
    icon: "/apps/displayy-icon.png",
    shots: shots("displayy", 3),
  },
  {
    slug: "gta-cheats",
    title: "GTA Cheats: All Codes",
    blurb:
      "Every Grand Theft Auto cheat code from GTA 3 to GTA 6, across console, PC and mobile, with search that actually finds what you typed.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Android", "AdMob"],
    href: play("com.sohan.gtacheats"),
    hrefLabel: "Play Store",
    studio: "Mad Axe",
    icon: "/apps/gta-cheats-icon.png",
    shots: shots("gta-cheats", 4),
  },
  {
    slug: "gta6-cheats",
    title: "GTA 6 Cheat Codes",
    blurb:
      "A second take on the cheat-code reference, rebuilt around fast search and a complete per-platform listing for the whole GTA series.",
    status: "Live on Google Play",
    category: "apps",
    stack: ["Flutter", "Android"],
    href: play("com.sohan.cheatcodegta"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/gta6-cheats-icon.png",
    shots: shots("gta6-cheats", 4),
  },

  // --------------------------------------------------------------- games
  {
    slug: "merge-1024",
    title: "Merge 1024",
    blurb:
      "Swipe, merge, and push 2 all the way past 1024. Ten seconds to learn, genuinely hard to master.",
    status: "Live on Google Play",
    category: "games",
    stack: ["Flutter", "Android"],
    href: play("com.suman.merge1024"),
    hrefLabel: "Play Store",
    studio: "Suso Studios",
    icon: "/apps/merge-1024-icon.png",
    shots: shots("merge-1024", 4),
  },
  {
    slug: "realm-guard",
    title: "Realm Guard",
    blurb:
      "Tower defence for Android. 35 hand-tuned levels, with a balance simulator that plays every wave headlessly before a build is allowed to ship.",
    status: "Coming soon on Play Store and App Store",
    category: "games",
    stack: ["Godot 4", "GDScript", "gdUnit4"],
  },
  {
    slug: "arrow-escape",
    title: "Arrow Escape",
    blurb:
      "Tap-to-escape puzzle game. Difficulty is measured by simulating a real playthrough rather than guessed from board size.",
    status: "Coming soon on Play Store and App Store",
    category: "games",
    stack: ["Godot 4", "GDScript"],
  },
  {
    slug: "aetheria",
    title: "Kingdom of Aetheria",
    blurb:
      "2D action RPG with parry and block combat, checkpointed chapters, and an event-bus driven game state.",
    status: "Coming soon on Play Store and App Store",
    category: "games",
    stack: ["Godot 4", "GDScript"],
  },

  // ----------------------------------------------------------------- web
  {
    slug: "anna-chain",
    title: "Anna Chain",
    blurb:
      "Circular-economy platform connecting restaurants with farmers to redistribute surplus food. Built at Protobytes Hackathon 2.0 with Team Berserkers.",
    status: "Hackathon build",
    category: "web",
    stack: ["React", "TypeScript", "Firebase Functions", "Firestore", "Python"],
    href: gh("protobytes-2.0-team-Team-Berserkers"),
    hrefLabel: "GitHub",
  },

  // ------------------------------------------------------------ academic
  {
    slug: "docchain",
    title: "Blockchain Document Verification",
    blurb:
      "Decentralised, tamper-proof document verification on Ethereum. Solidity contracts hold immutable hashes, so a forged copy fails the check.",
    status: "Academic project",
    category: "academic",
    stack: ["Solidity", "Web3.js", "React", "Node.js", "AES-256"],
    href: gh("blockchain-document-verification"),
    hrefLabel: "GitHub",
  },
  {
    slug: "gold-lstm",
    title: "Gold Price Prediction",
    blurb:
      "LSTM forecasting model over historical gold time-series, with a full preprocessing, training and evaluation pipeline.",
    status: "Academic project",
    category: "academic",
    stack: ["TensorFlow", "Keras", "Pandas", "Matplotlib"],
    href: gh("Gold-Price-Prediction"),
    hrefLabel: "GitHub",
  },
];

/** Everything with a live Play Store listing. Counts in copy derive from this. */
export const shipped = projects.filter((p) => p.hrefLabel === "Play Store");

/** The two Play Store developer accounts Sohan links out to. */
export const studios = [
  {
    name: "Suso Studios",
    href: "https://play.google.com/store/apps/developer?id=Suso+Studios",
    blurb: "Utilities, kids apps and puzzle games.",
    apps: projects.filter((p) => p.studio === "Suso Studios"),
  },
  {
    name: "Mad Axe",
    href: "https://play.google.com/store/apps/developer?id=Mad+Axe",
    blurb: "Reference and companion apps for players.",
    apps: projects.filter((p) => p.studio === "Mad Axe"),
  },
];
