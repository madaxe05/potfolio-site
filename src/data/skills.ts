export type SkillGroup = { title: string; items: string[] };

/** Grouped, not one long list. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["Dart", "TypeScript", "JavaScript", "Java", "Python", "C / C++", "SQL", "Solidity", "GDScript"],
  },
  {
    title: "Mobile",
    items: ["Flutter", "Firebase", "Riverpod", "Drift / SQLite", "Hive", "REST APIs", "AdMob", "Play Store releases"],
  },
  {
    title: "Web",
    items: ["React", "Next.js", "Tailwind CSS", "Motion", "Node.js", "Express", "TanStack Start", "Vercel"],
  },
  {
    title: "Data and ML",
    items: ["TensorFlow", "Keras", "Pandas", "NumPy", "Matplotlib", "LSTM models", "MySQL", "Firestore"],
  },
  {
    title: "Blockchain",
    items: ["Solidity", "Ethereum", "Web3.js", "Smart contracts", "SHA-256", "AES-256"],
  },
  {
    title: "Games and tools",
    items: ["Godot 4", "gdUnit4", "Git", "GitHub", "Figma", "VS Code", "Google Colab", "LaTeX"],
  },
];
