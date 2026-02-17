"use client";
import ToolsNavigation from "../../components/ToolsNavigation";

import { useState } from "react";
import ToolsMenu from "../../components/ToolsMenu";

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
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-email-drafter" />
      <ToolsNavigation currentToolId="hp-email-drafter" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-[#3d2914] handwritten flex items-center gap-2">
              <span className="text-3xl">✉️</span> hp AI Email Drafter
            </h1>
            <p className="text-sm text-[#9caf88]">
              Professional client email drafting using OpenRouter
            </p>
          </header>

          {/* Main Card */}
          <div className="cozy-card p-6 coffee-ring">
            {/* Mode Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#3d2914]">
                Email Type
              </label>
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value as "reply" | "new");
                  if (e.target.value === "new") setClientEmail("");
                }}
                className="w-full rounded-lg border-2 border-[#c4a484] bg-white px-4 py-2 text-sm text-[#3d2914] transition focus:border-[#7a9eb8] focus:outline-none sketch-input"
              >
                <option value="reply">Draft a reply to client&apos;s message</option>
                <option value="new">Draft a new original email</option>
              </select>
            </div>

            {/* Two Column Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Client Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#3d2914]">
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
                  className="min-h-[200px] w-full rounded-lg border-2 border-[#c4a484] bg-white px-4 py-3 text-sm text-[#3d2914] placeholder-[#8b6f47] transition focus:border-[#7a9eb8] focus:outline-none sketch-input disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Instructions & Controls */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#3d2914]">
                    Your Notes / Instructions
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Context, actions taken, questions, updates..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-[#c4a484] bg-white px-4 py-3 text-sm text-[#3d2914] placeholder-[#8b6f47] transition focus:border-[#7a9eb8] focus:outline-none sketch-input"
                  />
                </div>

                {/* Controls Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5c4a3a]">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full rounded-lg border-2 border-[#c4a484] bg-white px-3 py-2 text-sm text-[#3d2914] transition focus:border-[#7a9eb8] focus:outline-none sketch-input"
                    >
                      {tones.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5c4a3a]">
                      Output Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border-2 border-[#c4a484] bg-white px-3 py-2 text-sm text-[#3d2914] transition focus:border-[#7a9eb8] focus:outline-none sketch-input"
                    >
                      {languages.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5c4a3a]">
                      Length
                    </label>
                    <select
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full rounded-lg border-2 border-[#c4a484] bg-white px-3 py-2 text-sm text-[#3d2914] transition focus:border-[#7a9eb8] focus:outline-none sketch-input"
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
            <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-[#9caf88] pt-6">
              <span className="text-sm text-[#9caf88] handwritten">+_+</span>
              <button
                onClick={handleDraft}
                disabled={isLoading}
                className="px-6 py-3 font-medium text-[#3d2914] disabled:cursor-not-allowed disabled:opacity-50 sketch-button bg-[#9caf88]"
              >
                {isLoading ? "Drafting..." : "Draft Email"}
              </button>
            </div>

            {/* Output */}
            {output && (
              <div className="mt-6 border-t-2 border-dashed border-[#9caf88] pt-6">
                <label className="mb-2 block text-sm font-medium text-[#3d2914]">
                  Drafted Email
                </label>
                <textarea
                  value={output}
                  readOnly
                  className="min-h-[220px] w-full rounded-lg border-2 border-[#9caf88] bg-[#dcfce7] px-4 py-3 text-sm text-[#3d2914]"
                />
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-lg border-2 border-[#c4a484] bg-white px-4 py-2 text-sm text-[#5c4a3a] transition hover:bg-[#f5f0e8]"
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
        </div>
      </main>
    </div>
  );
}
