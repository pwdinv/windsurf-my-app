"use client";

import { useState } from "react";
import Link from "next/link";
import { tools, Tool } from "@/lib/tools";

interface ToolsNavigationProps {
  currentToolId?: string;
}

export default function ToolsNavigation({ currentToolId }: ToolsNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentTool = tools.find((t) => t.id === currentToolId);

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700"
      >
        <span>Tools</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[150]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-[200] mt-2 w-72 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                Hack&apos;s Tools
              </p>
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                  tool.id === currentToolId
                    ? "bg-indigo-50 dark:bg-indigo-950/30"
                    : ""
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      tool.id === currentToolId
                        ? "text-indigo-700 dark:text-indigo-400"
                        : "text-zinc-900 dark:text-zinc-200"
                    }`}
                  >
                    {tool.name}
                    {tool.id === currentToolId && (
                      <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                        (current)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
            <div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-xs text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to homepage
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
