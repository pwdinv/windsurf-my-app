"use client";

import { useState } from "react";
import ToolsMenu from "../../components/ToolsMenu";

interface ProfileData {
  fileName: string;
  isOlpFile: boolean;
  mediaClipUID: string;
  mediaClipRandomOrder: string;
  infoName: string;
  infoStartTime: string;
  infoFinishTime: string;
  infoeDayOfWeek: string;
  infoIndate: string;
  infoOutdate: string;
  infoCreateDate: string;
  playMediaClipsUIDs: string[];
  totalPlayMediaClips: number;
  interProfileContent?: string;
}

export default function HpMusicProfilePage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const extractTagContent = (content: string, tag: string, attribute: string): string => {
    const regex = new RegExp(`<${tag}[^>]*?>[\\s\\S]*?<\\/${tag}>`, 'i');
    const tagContent = content.match(regex);
    if (!tagContent) return 'N/A';

    const attributeRegex = new RegExp(`${attribute}="([^"]+)"`, 'i');
    const attributeMatch = tagContent[0].match(attributeRegex);
    return attributeMatch ? attributeMatch[1] : 'N/A';
  };

  const extractInterProfileTags = (content: string): string => {
    const regex = /<INTER-PROFILE[^>]*>[\s\S]*?<\/INTER-PROFILE>/gi;
    const matches = content.match(regex);
    return matches ? matches.join('\n\n') : '';
  };

  const extractPlayMediaClipsUIDs = (content: string): string[] => {
    const regex = /<PLAY-MEDIA-CLIP[^>]*?UID="([^"]+)"/g;
    const uids: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      uids.push(match[1]);
    }
    return uids;
  };

  const formatTime = (timeString: string): string => {
    if (timeString.length === 4 && /^\d+$/.test(timeString)) {
      return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
    }
    return timeString;
  };

  const formatDateAndTime = (dateTimeString: string): { formattedDate: string; formattedTime: string; color: string } => {
    if (!/^\d{12}$/.test(dateTimeString)) {
      return { formattedDate: 'Invalid', formattedTime: '', color: 'black' };
    }

    const year = parseInt(dateTimeString.slice(0, 4));
    const month = parseInt(dateTimeString.slice(4, 6)) - 1;
    const day = parseInt(dateTimeString.slice(6, 8));
    const hour = parseInt(dateTimeString.slice(8, 10));
    const minute = parseInt(dateTimeString.slice(10, 12));

    const inputDate = new Date(year, month, day, hour, minute);
    const now = new Date();

    const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const formattedDate = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;

    let color = 'black';
    if (inputDate.getTime() < now.getTime()) {
      color = 'red';
    } else if (inputDate.getTime() > now.getTime()) {
      color = 'green';
    }

    return { formattedDate, formattedTime, color };
  };

  const getDayDisplay = (dayNumber: number): string => {
    if (dayNumber === 0) {
      return "(Everyday)";
    } else {
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const index = dayNumber - 1;
      if (index >= 0 && index < days.length) {
        return `(${days[index]})`;
      }
      return "Invalid";
    }
  };

  const parseFileContent = (content: string, fileName: string): ProfileData => {
    const data: ProfileData = {
      fileName,
      isOlpFile: fileName.toLowerCase().endsWith('.olp'),
      mediaClipUID: extractTagContent(content, 'MEDIA-CLIP', 'UID'),
      mediaClipRandomOrder: extractTagContent(content, 'MEDIA-CLIP', 'RANDOM-ORDER'),
      infoName: extractTagContent(content, 'INFO', 'NAME'),
      infoStartTime: formatTime(extractTagContent(content, 'INFO', 'START-TIME')),
      infoFinishTime: formatTime(extractTagContent(content, 'INFO', 'FINISH-TIME')),
      infoeDayOfWeek: extractTagContent(content, 'INFO', 'DAY'),
      infoIndate: extractTagContent(content, 'INFO', 'INDATE'),
      infoOutdate: extractTagContent(content, 'INFO', 'OUTDATE'),
      infoCreateDate: extractTagContent(content, 'INFO', 'CREATEDATE'),
      playMediaClipsUIDs: extractPlayMediaClipsUIDs(content),
      totalPlayMediaClips: 0,
    };

    data.totalPlayMediaClips = data.playMediaClipsUIDs.length;

    if (data.isOlpFile) {
      data.interProfileContent = extractInterProfileTags(content);
    }

    return data;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const parsedData = parseFileContent(content, file.name);
        setProfiles((prev) => [...prev, parsedData]);
      };
      reader.readAsText(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const normalProfiles = profiles.filter((p) => !p.isOlpFile);
  const olpProfiles = profiles.filter((p) => p.isOlpFile);

  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-music-profile" />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-[#3d2914] handwritten flex items-center gap-3">
              <span className="text-3xl">🎵</span> hp Music Profile Viewer
            </h1>
            <p className="text-sm text-[#8b6f47]">
              Upload .djv and .olp music profile files to view detailed information
            </p>
          </header>

          {/* Upload Area */}
          <div
            className={`cozy-card p-8 text-center mb-6 transition-all ${
              dragActive ? "border-[#c9a9a6] border-4" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".djv,.olp,.xml"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#f4e4bc] flex items-center justify-center text-3xl sketch-border">
                📁
              </div>
              <div>
                <p className="text-lg font-medium text-[#3d2914]">
                  Drop music profiles here or click to upload
                </p>
                <p className="text-sm text-[#8b6f47] mt-1">
                  Supports .djv, .olp files
                </p>
              </div>
              <span className="px-4 py-2 bg-[#e8dcc8] rounded-lg text-sm text-[#3d2914] sketch-border-sm mt-2 handwritten">
                Choose Files
              </span>
            </label>
          </div>

          {/* Clear Button */}
          {profiles.length > 0 && (
            <button
              onClick={() => setProfiles([])}
              className="mb-4 px-4 py-2 text-sm text-[#8b6f47] hover:text-[#3d2914] handwritten border-2 border-dashed border-[#c4a484] rounded-lg transition"
            >
              Clear all profiles 🗑️
            </button>
          )}

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Normal Profiles */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#3d2914] handwritten flex items-center gap-2">
                <span className="text-2xl">🎶</span> Normal Profiles
                {normalProfiles.length > 0 && (
                  <span className="text-sm bg-[#9caf88] text-white px-2 py-0.5 rounded-full">
                    {normalProfiles.length}
                  </span>
                )}
              </h2>
              {normalProfiles.length === 0 ? (
                <p className="text-[#8b6f47] text-sm italic">
                  No normal profiles uploaded yet...
                </p>
              ) : (
                normalProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="sticky-note-green p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 border-b border-[#9caf88] pb-2">
                      <span className="text-lg">📌</span>
                      <span className="font-medium text-[#3d2914]">
                        {profile.fileName}
                      </span>
                      <span className="text-xs bg-[#9caf88] text-white px-2 py-0.5 rounded-full">
                        🔀 {profile.mediaClipRandomOrder}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-[#5c4a3a]">
                        <span className="font-medium">⏰ {profile.infoStartTime} - {profile.infoFinishTime}</span>
                        <span className="ml-2 text-[#7a9eb8]">{getDayDisplay(parseInt(profile.infoeDayOfWeek) || 0)}</span>
                      </p>
                      <p className="text-lg text-[#7a9eb8] font-medium">
                        🎵 {profile.infoName}
                      </p>
                      <p className="text-[#5c4a3a]">
                        <strong>In-Out Dates:</strong>{" "}
                        <span className="font-medium text-[#3d2914]">
                          {profile.infoIndate} - {profile.infoOutdate}
                        </span>
                      </p>
                      <p className="text-[#5c4a3a]">
                        <strong>CreateDate:</strong> {profile.infoCreateDate}
                      </p>
                      <div className="pt-2 border-t border-dashed border-[#9caf88]">
                        <p className="text-[#5c4a3a] font-medium">
                          List of Tracks: {profile.playMediaClipsUIDs.slice(0, 5).join(', ')}
                          {profile.playMediaClipsUIDs.length > 5 && '...'}
                        </p>
                        <p className="text-lg text-[#7a9eb8]">
                          ♪♫~ {profile.totalPlayMediaClips} Tracks
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Overlays & Others */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#3d2914] handwritten flex items-center gap-2">
                <span className="text-2xl">🎼</span> Overlays & Others
                {olpProfiles.length > 0 && (
                  <span className="text-sm bg-[#c9a9a6] text-white px-2 py-0.5 rounded-full">
                    {olpProfiles.length}
                  </span>
                )}
              </h2>
              {olpProfiles.length === 0 ? (
                <p className="text-[#8b6f47] text-sm italic">
                  No overlay profiles uploaded yet...
                </p>
              ) : (
                olpProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="sticky-note-rose p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 border-b border-[#c9a9a6] pb-2">
                      <span className="text-lg">📌</span>
                      <span className="font-medium text-[#3d2914]">
                        {profile.fileName}
                      </span>
                      <span className="text-xs bg-[#c9a9a6] text-white px-2 py-0.5 rounded-full">
                        OLP
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-[#5c4a3a]">
                        <span className="font-medium">⏰ {profile.infoStartTime} - {profile.infoFinishTime}</span>
                        <span className="ml-2 text-[#c9a9a6]">{getDayDisplay(parseInt(profile.infoeDayOfWeek) || 0)}</span>
                      </p>
                      <p className="text-lg text-[#8b6f47] font-medium">
                        🎵 {profile.infoName}
                      </p>
                      <p className="text-[#5c4a3a]">
                        <strong>In-Out Dates:</strong>{" "}
                        <span className="font-medium text-[#3d2914]">
                          {profile.infoIndate} - {profile.infoOutdate}
                        </span>
                      </p>
                      <p className="text-[#5c4a3a]">
                        <strong>CreateDate:</strong> {profile.infoCreateDate}
                      </p>
                      {profile.interProfileContent && (
                        <div className="pt-2 border-t border-dashed border-[#c9a9a6]">
                          <p className="text-[#5c4a3a] font-medium mb-1">
                            INTER-PROFILE Tags:
                          </p>
                          <pre className="text-xs bg-white p-2 rounded border border-[#c9a9a6] overflow-x-auto">
                            {profile.interProfileContent.slice(0, 500)}
                            {profile.interProfileContent.length > 500 && '...'}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
