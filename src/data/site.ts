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
