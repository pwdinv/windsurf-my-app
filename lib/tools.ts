export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
}

export const tools: Tool[] = [
  {
    id: "hp-mandarin",
    name: "hp Mandarin AI Translator",
    description: "AI-powered translator for Mandarin, English, and Thai translations",
    href: "/tools/hp-mandarin",
    icon: "🌐"
  },
  {
    id: "hp-email-drafter",
    name: "hp Email Drafter",
    description: "Professional client email drafting with customizable tone and language",
    href: "/tools/hp-email-drafter",
    icon: "✉️"
  }
];
