"use client";

import { useState } from "react";
import ToolsMenu from "../../components/ToolsMenu";

interface FileResult {
  fileName: string;
  simpleOutput: string;
  datetimeOutput: string;
  trackCount: number;
}

export default function HpTrackExtractorPage() {
  const [results, setResults] = useState<FileResult[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newResults: FileResult[] = [];

    for (const file of Array.from(files)) {
      const text = await file.text();
      const lines = text.split("\n");
      const simpleTracks: string[] = [];
      const datetimeTracks: string[] = [];

      for (const line of lines) {
        if (line.includes("Start")) {
          // Pattern: "DateTime" - Start - "{UUID}" - "Title" - "Artist",...
          // Extract datetime (first quoted string) and title/artist
          const dateTimeMatch = line.match(/^"([^"]+)"\s+-\s+Start/);
          const trackMatch = line.match(/"\{[^}]+\}"\s+-\s+"([^"]+)"\s+-\s+"([^"]+)"/);
          
          if (trackMatch) {
            const title = trackMatch[1];
            const artist = trackMatch[2];
            const dateTime = dateTimeMatch ? dateTimeMatch[1] : "";
            
            simpleTracks.push(`${title} - ${artist}`);
            if (dateTime) {
              datetimeTracks.push(`${dateTime} - ${title} - ${artist}`);
            } else {
              datetimeTracks.push(`${title} - ${artist}`);
            }
          }
        }
      }

      if (simpleTracks.length > 0) {
        newResults.push({
          fileName: file.name,
          simpleOutput: simpleTracks.join("\n"),
          datetimeOutput: datetimeTracks.join("\n"),
          trackCount: simpleTracks.length,
        });
      }
    }

    setResults(newResults);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const clearAll = () => {
    setResults([]);
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-track-extractor" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-[#3d2914] handwritten flex items-center gap-2">
              <span className="text-3xl">🎧</span> Track Data Extractor
            </h1>
            <p className="mt-2 text-[#5c4a3a]">
              Extract track information from DVJ log files
            </p>
          </header>

          {/* File Upload */}
          <div className="cozy-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#3d2914] mb-4">
              Select Log Files
            </h2>
            <input
              type="file"
              multiple
              accept=".log,.txt"
              onChange={handleFileChange}
              className="w-full p-2 border-2 border-dashed border-[#c4a484] rounded-lg text-[#3d2914] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#7a9eb8] file:text-white"
            />
            <p className="mt-2 text-sm text-[#8b6f47]">
              Supports multiple .log or .txt files
            </p>
            {results.length > 0 && (
              <button
                onClick={clearAll}
                className="mt-4 sketch-button px-4 py-2 text-sm text-[#8b6f47]"
                style={{ background: "var(--paper-warm)" }}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results per file */}
          <div className="space-y-8">
            {results.map((result, idx) => (
              <div key={idx} className="cozy-card p-6">
                <h3 className="text-lg font-semibold text-[#3d2914] mb-4 pb-2 border-b border-[#c4a484]">
                  {result.fileName} ({result.trackCount} tracks)
                </h3>

                {/* Simple Output - No datetime */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#3d2914]">
                      Format 1: Title - Artist (No Date/Time)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(result.simpleOutput)}
                      className="sketch-button px-3 py-1 text-xs text-[#3d2914]"
                    >
                      Copy
                    </button>
                  </div>
                  <textarea
                    value={result.simpleOutput}
                    readOnly
                    rows={8}
                    className="w-full sketch-input px-3 py-2 text-[#3d2914] font-mono text-sm resize-y min-h-[120px]"
                  />
                </div>

                {/* Datetime Output - With datetime */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#3d2914]">
                      Format 2: Date/Time - Title - Artist
                    </h4>
                    <button
                      onClick={() => copyToClipboard(result.datetimeOutput)}
                      className="sketch-button px-3 py-1 text-xs text-[#3d2914]"
                    >
                      Copy
                    </button>
                  </div>
                  <textarea
                    value={result.datetimeOutput}
                    readOnly
                    rows={8}
                    className="w-full sketch-input px-3 py-2 text-[#3d2914] font-mono text-sm resize-y min-h-[120px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-[#f5f0e8] rounded-lg sketch-border-sm">
            <h3 className="font-semibold text-[#3d2914] mb-2">Expected Log Format:</h3>
            <p className="text-sm text-[#5c4a3a]">
              &quot;DD/MM/YYYY HH:MM:SS&quot; - Start - &quot;{'{UUID}'}&quot; - &quot;Title&quot; - &quot;Artist&quot;,...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
