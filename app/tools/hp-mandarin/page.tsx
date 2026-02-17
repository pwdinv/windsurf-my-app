"use client";

import { useState, useRef, useEffect } from "react";
import ToolsNavigation from "../../components/ToolsNavigation";

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
    <div className="flex h-screen flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-amber-200/50 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-amber-900/30 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <ToolsNavigation currentToolId="hp-mandarin" />
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                hp Mandarin AI Translator
              </h1>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                Multilingual translation for Mandarin, English & Thai
              </p>
            </div>
          </div>
          <span className="text-sm text-amber-600/70 dark:text-amber-400/70">
            Powered by OpenRouter
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-amber-200/50 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm dark:border-amber-900/30 dark:bg-slate-900/80">
              <p className="mb-2 text-lg font-semibold text-amber-800 dark:text-amber-300">
                Welcome to hp Mandarin AI Translator
              </p>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/70">
                Enter text in Mandarin, English, or Thai to get translations in
                the other two languages.
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
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "border border-amber-200/50 bg-white text-amber-900 shadow-amber-100 dark:border-amber-900/30 dark:bg-slate-800 dark:text-amber-100"
                }`}
              >
                {message.content}
              </div>

              {/* Metadata */}
              <div className="mt-1 flex items-center gap-2 px-1">
                <span className="text-xs text-amber-600/70 dark:text-amber-400/60">
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
                      className="flex items-center gap-1 rounded border border-amber-300 bg-white px-2 py-0.5 text-[10px] text-amber-700 transition hover:bg-amber-50 dark:border-amber-700 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700"
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
              <div className="rounded-2xl border border-amber-200/50 bg-white/90 p-4 text-sm italic text-amber-600/70 shadow-sm backdrop-blur-sm dark:border-amber-900/30 dark:bg-slate-800/90 dark:text-amber-400/60">
                Thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-amber-200/50 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-amber-900/30 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-4xl gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text to translate..."
            className="min-h-[60px] flex-1 resize-y rounded-xl border border-amber-300/50 bg-white px-4 py-3 text-sm text-amber-900 placeholder-amber-400/70 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-700/50 dark:bg-slate-800 dark:text-amber-100 dark:placeholder-amber-500/50"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-[60px] rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-medium text-white shadow-md shadow-amber-500/20 transition hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-amber-600/60 dark:text-amber-400/50">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
