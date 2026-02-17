"use client";
import ToolsNavigation from "../../components/ToolsNavigation";

import { useState, useRef, useEffect } from "react";
import ToolsMenu from "../../components/ToolsMenu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  lines?: string[];
}

export default function HpMandarinPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      const lines = data.translation
        .split("\n")
        .filter((line: string) => line.trim() !== "");

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.translation,
        timestamp: getTimestamp(),
        lines,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Error: Translation failed. Please check your API key configuration.",
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = async (text: string, buttonId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(buttonId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-mandarin" />
      <ToolsNavigation currentToolId="hp-mandarin" />

      <main className="flex flex-1 flex-col pt-14 lg:pt-0">
        {/* Header */}
        <header className="border-b-2 border-dashed border-[#7a9eb8] bg-white px-3 sm:px-6 py-2 sm:py-4 m-1 sm:m-4 mb-0 sketch-border flex-shrink-0">
          <h1 className="text-base sm:text-lg font-semibold text-[#3d2914] handwritten flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🌐</span> hp Mandarin AI Translator
          </h1>
          <p className="text-xs sm:text-sm text-[#7a9eb8] truncate">
            Multilingual translation for Mandarin, English & Thai
          </p>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-2 sm:py-6 min-h-0">
          <div className="mx-auto max-w-3xl space-y-3 sm:space-y-6">
            {messages.length === 0 && (
              <div className="cozy-card p-4 sm:p-6 text-center coffee-ring">
                <p className="text-sm sm:text-lg font-medium text-[#3d2914] handwritten">
                  Welcome to hp Mandarin AI Translator
                </p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#5c4a3a]">
                  Enter text in Mandarin, English, or Thai to get translations
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] whitespace-pre-wrap rounded-2xl p-2 sm:p-4 shadow-sm text-sm sm:text-base ${
                    message.role === "user"
                      ? "bg-[#7a9eb8] text-white sketch-border"
                      : "bg-white text-[#3d2914] sticky-note-blue sketch-border"
                  }`}
                >
                  {message.content}
                </div>

                {/* Metadata */}
                <div className="mt-1 flex items-center gap-2 px-1">
                  <span className="text-xs text-[#7a9eb8] handwritten">
                    {message.role === "user" ? "You" : "AI"} • {message.timestamp}
                  </span>

                  {/* Copy buttons for AI messages */}
                  {message.role === "assistant" &&
                    message.lines &&
                    message.lines.map((line, index) => (
                      <button
                        key={`${message.id}-copy-${index}`}
                        onClick={() =>
                          copyToClipboard(
                            line.trim(),
                            `${message.id}-copy-${index}`
                          )
                        }
                        className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-[#7a9eb8] transition hover:bg-[#e0f2fe] sketch-border-sm bg-white"
                      >
                        {copiedId === `${message.id}-copy-${index}` ? (
                          <>
                            <svg
                              className="h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            OK
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-3 w-3"
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
                            Copy {index + 1}
                          </>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="rounded-2xl border-2 border-dashed border-[#c4a484] bg-[#f5f0e8] p-4 text-sm italic text-[#8b6f47]">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-dashed border-[#7a9eb8] bg-white px-3 sm:px-6 py-2 sm:py-4 m-1 sm:m-4 mt-0 sketch-border flex-shrink-0">
          <div className="mx-auto flex max-w-3xl gap-2 sm:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter text..."
              className="min-h-[44px] sm:min-h-[60px] flex-1 resize-y rounded-xl border-2 border-[#7a9eb8] bg-white px-3 sm:px-4 py-2 sm:py-3 text-sm text-[#3d2914] placeholder-[#7a9eb8] focus:border-[#7a9eb8] focus:outline-none sketch-input"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-[44px] sm:h-[60px] px-3 sm:px-6 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sketch-button bg-[#7a9eb8] border-[#3d2914]"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
          <p className="mx-auto mt-1 sm:mt-2 max-w-3xl text-center text-[10px] sm:text-xs text-[#7a9eb8] handwritten">
            Enter to send, Shift+Enter for new line
          </p>
        </div>
      </main>
    </div>
  );
}
