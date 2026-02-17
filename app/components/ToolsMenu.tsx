import Link from "next/link";
import { tools } from "@/lib/tools";

interface ToolsMenuProps {
  currentToolId?: string;
}

export default function ToolsMenu({ currentToolId }: ToolsMenuProps) {
  return (
    <aside className="w-64 flex-shrink-0 sketch-border bg-white m-4 mr-0 p-6 sticky-note washi-tape">
      <div className="sticky top-0">
        {/* Logo/Header */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="handwritten text-2xl text-[#3d2914]">Hack&apos;s Tools</span>
        </Link>

        {/* Tools List */}
        <nav className="space-y-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition sketch-border-sm ${
                tool.id === currentToolId
                  ? "shadow-md"
                  : "hover:bg-[#f5f0e8]"
              }`}
              style={{
                backgroundColor: tool.id === currentToolId ? (tool.color || '#fef9c3') : 'transparent',
              }}
            >
              <span className="text-2xl">{tool.icon}</span>
              <div className="flex-1">
                <p className={`font-medium ${
                  tool.id === currentToolId ? "text-[#3d2914]" : "text-[#3d2914]"
                }`}>
                  {tool.name}
                </p>
                <p className="mt-0.5 text-xs text-[#8b6f47] line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Back to home */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-[#c4a484]">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#8b6f47] transition hover:text-[#3d2914] handwritten"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </aside>
  );
}
