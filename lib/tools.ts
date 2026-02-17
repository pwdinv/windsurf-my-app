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
  }
];
