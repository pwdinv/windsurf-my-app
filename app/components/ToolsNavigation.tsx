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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-[#c4a484] bg-white px-3 py-1.5 text-sm text-[#3d2914] transition hover:border-[#8b6f47] hover:bg-[#faf8f3] shadow-md"
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
          <div className="absolute left-1/2 top-full transform -translate-x-1/2 z-[200] mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[#c4a484] bg-white py-2 shadow-lg">
            <div className="border-b border-[#c4a484] px-4 py-2">
              <p className="text-xs font-medium text-[#8b6f47]">
                Hack&apos;s Toolkit
              </p>
            </div>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 transition hover:bg-[#f5f0e8] ${
                  tool.id === currentToolId
                    ? "shadow-md"
                    : ""
                }`}
                style={{
                  backgroundColor: tool.id === currentToolId ? (tool.color || '#fef9c3') : 'transparent',
                }}
              >
                <span className="text-xl">{tool.icon}</span>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      tool.id === currentToolId
                        ? "text-[#3d2914]"
                        : "text-[#3d2914]"
                    }`}
                  >
                    {tool.name}
                    {tool.id === currentToolId && (
                      <span className="ml-2 text-xs text-[#8b6f47]">
                        (current)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8b6f47]">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
            <div className="border-t border-[#c4a484] px-4 py-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-xs text-[#8b6f47] transition hover:text-[#3d2914] handwritten"
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
