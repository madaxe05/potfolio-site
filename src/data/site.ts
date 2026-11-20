export const site = {
  name: "Sohan Dhungel",
  role: "Software Developer",
  location: "Kalanki, Kathmandu, Nepal",
  email: "sohandhungel05@gmail.com",
  phone: "+977 9814234358",
  github: "https://github.com/madaxe05",
  linkedin: "https://www.linkedin.com/in/sohan-dhungel-a9ab31329",
  instagram: "https://www.instagram.com/sohandhungel_/",
  cv: "/sohan-dhungel-cv.pdf",

  /** Formspree form id (the bit after /f/ in the endpoint). */
  formspreeId: "mljegban",

  experience: [
    {
      role: "Software Engineering Intern",
      org: "Octacore Solutions",
      href: "https://octacore.com.np",
      period: "2 months",
      current: false,
      note: "Worked across the delivery cycle, from feature development through testing and release.",
    },
  ],

  /** The road so far. Rendered as a vertical timeline before About. */
  journey: [
    { year: "2022", title: "Joined BE Computer Engineering", note: "Advanced College of Engineering and Management, Tribhuvan University.", current: false },
    { year: "2024", title: "Started learning Flutter", note: "Picked up mobile development two years into the degree.", current: false },
    { year: "2025", title: "Minor project: gold price prediction", note: "An LSTM model forecasting gold prices.", current: false },
    { year: "2025", title: "Major project: blockchain document verification", note: "Ethereum smart contracts built to catch forged documents.", current: false },
    { year: "2025", title: "First hackathon", note: "Joined the same year as the major project.", current: false },
    { year: "2026", title: "Finished BE Computer Engineering", note: "", current: false },
    { year: "2026", title: "Software Engineering Intern", note: "Completed a two-month software engineering internship at Octacore Solutions.", current: false },
    { year: "2026", title: "Learning Godot", note: "Learning game development and building independent projects.", current: false },
    { year: "2026", title: "Shipping games in Godot and Unity", note: "Mad Axe Studios games on Google Play, built in Godot and, for Scam with Friends, Unity.", current: true },
  ],

  education: [
    {
      degree: "BE Computer Engineering",
      school: "Advanced College of Engineering and Management, Tribhuvan University",
      place: "Kathmandu",
      years: "2022 - 2026",
    },
    {
      degree: "Higher Secondary, Science (PCM and Computer Science)",
      school: "Hetauda School of Management",
      place: "Hetauda",
      years: "2020 - 2022",
    },
  ],
} as const;
