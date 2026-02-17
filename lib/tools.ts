export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
}

export const tools: Tool[] = [
  {
    id: "hp-mandarin",
    name: "hp Mandarin AI Translator",
    description: "AI-powered translator for Mandarin, English, and Thai translations",
    href: "/tools/hp-mandarin",
    icon: "🌐",
    color: "#7a9eb8"
  },
  {
    id: "hp-email-drafter",
    name: "hp Email Drafter",
    description: "Professional client email drafting with customizable tone and language",
    href: "/tools/hp-email-drafter",
    icon: "✉️",
    color: "#9caf88"
  },
  {
    id: "hp-music-profile",
    name: "hp Music Profile Viewer",
    description: "Upload and view music profile files with detailed track information",
    href: "/tools/hp-music-profile",
    icon: "🎵",
    color: "#c9a9a6"
  },
  {
    id: "hp-replacement-form",
    name: "hp Replacement Request Form",
    description: "Submit system replacement requests with required details",
    href: "/tools/hp-replacement-form",
    icon: "🔄",
    color: "#f97316"
  },
  {
    id: "hp-track-extractor",
    name: "hp Track Data Extractor",
    description: "Extract track information from DVJ log files",
    href: "/tools/hp-track-extractor",
    icon: "🎧",
    color: "#9caf88"
  }
];
