import Link from "next/link";
import { tools } from "@/lib/tools";

interface ToolsMenuProps {
  currentToolId?: string;
}

export default function ToolsMenu({ currentToolId }: ToolsMenuProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="sticky top-0 p-6">
        {/* Logo/Header */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">Hack&apos;s Tools</span>
        </Link>

        {/* Tools List */}
        <nav className="space-y-1">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition ${
                tool.id === currentToolId
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{tool.icon}</span>
              <div className="flex-1">
                <p className={`font-medium ${
                  tool.id === currentToolId ? "text-blue-700" : "text-gray-900"
                }`}>
                  {tool.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Back to home */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to homepage
          </Link>
        </div>
      </div>
    </aside>
  );
}
