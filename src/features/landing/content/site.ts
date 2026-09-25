/* [CONTENT] Centralized site copy and project data. */

export type NavigationItem = {
  label: string;
  href: string;
};

export type Project = {
  number: string;
  type: string;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  imageAlt?: string;
  url?: string;
};

export const navigation: NavigationItem[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Open space", href: "#space" },
  { label: "Selected work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const principles = [
  { value: "2024", label: "Writing code since", icon: "</>" },
  { value: "04", label: "Projects shipped", icon: "◆" },
  { value: "∞", label: "Curiosity left", icon: "○" },
];

export const projects: Project[] = [
  {
    number: "01",
    type: "WebGL experience",
    title: "THE WHITE REPO",
    description:
      "Premium automotive concept — an immersive, cinematic front-end with real-time 3D interaction and high-end UI.",
    tech: ["WebGL", "Three.js", "GSAP"],
    image: "/portfolio-preview.png",
    imageAlt: "THE WHITE REPO — interactive background preview",
    url: "https://the-white-repo.netlify.app"
  },
  {
    number: "02",
    type: "freelance project",
    title: "RAJ LAUNDRY",
    description:
      "Dr. Stone–inspired scroll storytelling with a cinematic AI-core reveal and a strong visual identity.",
    tech: ["React", "Framer Motion", "WebGL"],
    image: "/raj-laundry-preview.png",
    imageAlt: "RAJ LAUNDRY — interactive background preview",
    url: "https://raj-laundry.netlify.app"
  },
];

export const roadmapSteps = [
  {
    number: "01",
    title: "Find the feeling",
    description: "Start with the idea, mood, and purpose behind the work.",
  },
  {
    number: "02",
    title: "Build the rhythm",
    description: "Shape the interaction until every movement feels intentional.",
  },
  {
    number: "03",
    title: "Make it real",
    description: "Turn the atmosphere into a clear, dependable experience.",
  },
  {
    number: "04",
    title: "Leave room to grow",
    description: "Build a foundation that stays useful long after launch.",
  },
];

export const sectionIds = navigation.map(({ href }) => href.slice(1));
