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

  /**
   * Formspree endpoint for the contact form.
   * TODO Sohan: create a form at formspree.io, paste its id here (the bit after
   * /f/ in the endpoint, e.g. "xdkogqzy"). Until then the form shows a short
   * note instead of a submit button, so nothing silently swallows a message.
   */
  formspreeId: "",

  experience: [
    {
      role: "Software Developer",
      org: "Octacore Solutions",
      href: "https://octacore.com.np",
      period: "1 week",
      current: true,
      note: "Moved into the developer role after the internship. Building and shipping production software with the team.",
    },
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
    { year: "2026", title: "Software Engineering Intern", note: "Joined Octacore Solutions for a two-month internship.", current: false },
    { year: "2026", title: "Software Developer", note: "Moved into the developer role at Octacore Solutions.", current: true },
    { year: "2026", title: "Learning Godot", note: "Picking up game development alongside the day job.", current: true },
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
