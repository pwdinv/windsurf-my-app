"use client";

import { useState } from "react";
import ToolsNavigation from "../../components/ToolsNavigation";

const tones = [
  "Professional & polite",
  "Friendly & warm",
  "Apologetic & reassuring",
  "Spoken language (for chatting)",
  "Concise & direct",
];

const languages = [
  "Mandarin (Simplified Chinese)",
  "Thai",
  "Japanese",
  "Korean",
  "Vietnamese",
  "Arabic",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Mexican",
  "English (American)",
  "English (British)",
];

const lengths = ["Very short", "Short", "Medium", "Long", "Very long"];

export default function HpEmailDrafterPage() {
  const [mode, setMode] = useState<"reply" | "new">("reply");
  const [clientEmail, setClientEmail] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState("Concise & direct");
  const [language, setLanguage] = useState("English (British)");
  const [length, setLength] = useState("Short");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDraft = async () => {
    if (mode === "reply" && !clientEmail.trim()) {
      alert("Please paste the client message.");
      return;
    }
    if (!instructions.trim()) {
      alert("Please add instructions.");
      return;
    }

    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          clientEmail,
          instructions,
          tone,
          language,
          length,
        }),
      });

      if (!response.ok) {
        throw new Error("Drafting failed");
      }

      const data = await response.json();
      setOutput(data.draft);
    } catch (error) {
      setOutput("Error generating email. Please check your API key configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output.trim()) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <ToolsNavigation currentToolId="hp-email-drafter" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                hp AI Email Drafter
              </h1>
              <p className="text-xs text-slate-400">
                Professional client email drafting using OpenRouter (GPT-4o)
              </p>
            </div>
          </div>
          <span className="text-sm text-slate-500">
            Powered by OpenRouter
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-xl shadow-cyan-500/10">
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-cyan-300">
              Email Type
            </label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as "reply" | "new");
                if (e.target.value === "new") setClientEmail("");
              }}
              className="w-full rounded-xl border border-cyan-500/30 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="reply">Draft a reply to client&apos;s message</option>
              <option value="new">Draft a new original email</option>
            </select>
          </div>

          {/* Two Column Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Client Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-purple-300">
                Client Message
              </label>
              <textarea
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                disabled={mode === "new"}
                placeholder={
                  mode === "new"
                    ? "Disabled for new email drafting"
                    : "Paste the client's email here..."
                }
                className="min-h-[200px] w-full rounded-xl border border-purple-500/30 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Instructions & Controls */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-cyan-300">
                  Your Notes / Instructions
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Context, actions taken, questions, updates..."
                  className="min-h-[120px] w-full rounded-xl border border-cyan-500/30 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Controls Grid */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-purple-500/30 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Output Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-cyan-500/30 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full rounded-xl border border-cyan-500/30 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    {lengths.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-cyan-500/20 pt-6">
            <span className="text-sm text-slate-500">+_+</span>
            <button
              onClick={handleDraft}
              disabled={isLoading}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-8 py-3 font-medium text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Drafting..." : "Draft Email"}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="mt-8 border-t border-cyan-500/20 pt-6">
              <label className="mb-2 block text-sm font-medium text-cyan-300">
                Drafted Email
              </label>
              <textarea
                value={output}
                readOnly
                className="min-h-[220px] w-full rounded-xl border border-cyan-500/30 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:outline-none"
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/50 px-6 py-2 text-sm text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied ✓
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
