"use client";
import ToolsNavigation from "../../components/ToolsNavigation";

import { useState } from "react";
import ToolsMenu from "../../components/ToolsMenu";

interface DateInfo {
  formatted: string;
  color: string;
}

interface ProfileData {
  fileName: string;
  isOlpFile: boolean;
  mediaClipUID: string;
  mediaClipRandomOrder: string;
  infoName: string;
  infoStartTime: string;
  infoFinishTime: string;
  infoeDayOfWeek: string;
  infoIndate: DateInfo;
  infoOutdate: DateInfo;
  infoCreateDate: DateInfo;
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

  const extractTagAttributes = (content: string, tag: string): Record<string, string> => {
    const regex = new RegExp(`<${tag}([^>]*)\\/?>`, 'i');
    const match = content.match(regex);
    if (!match) return {};

    const attributesString = match[1];
    const attributes: Record<string, string> = {};
    const attributeRegex = /(\w+)="([^"]+)"/g;
    let attrMatch;
    while ((attrMatch = attributeRegex.exec(attributesString)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    return attributes;
  };

  const extractInterProfileTags = (content: string): string => {
    const regex = /<INTER-PROFILE[^>]*>[\s\S]*?<\/INTER-PROFILE>/gi;
    const matches = content.match(regex);
    return matches ? matches.join('\n\n') : 'No <INTER-PROFILE> tags found';
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

  const formatDateAndTime = (dateTimeString: string): DateInfo => {
    if (!/^\d{12}$/.test(dateTimeString)) {
      return { formatted: 'N/A', color: 'black' };
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
      color = '#dc2626'; // red
    } else if (inputDate.getTime() > now.getTime()) {
      color = '#16a34a'; // green
    }

    return { formatted: `${formattedDate} (${formattedTime})`, color };
  };

  const getDayDisplay = (dayNumber: number): { text: string; color: string } => {
    if (dayNumber === 0) {
      return { text: "(Everyday)", color: "black" };
    } else {
      const days = [
        { text: "(SUN)", color: "#dc2626" },
        { text: "(MON)", color: "#ca8a04" },
        { text: "(TUE)", color: "#db2777" },
        { text: "(WED)", color: "#16a34a" },
        { text: "(THU)", color: "#ea580c" },
        { text: "(FRI)", color: "#0ea5e9" },
        { text: "(SAT)", color: "#7c3aed" },
      ];
      const index = dayNumber - 1;
      if (index >= 0 && index < days.length) {
        return days[index];
      }
      return { text: "Invalid", color: "black" };
    }
  };

  const parseFileContent = (content: string, fileName: string): ProfileData => {
    const data: ProfileData = {
      fileName,
      isOlpFile: fileName.toLowerCase().endsWith('.olp'),
      mediaClipUID: 'N/A',
      mediaClipRandomOrder: 'N/A',
      infoName: 'N/A',
      infoStartTime: 'N/A',
      infoFinishTime: 'N/A',
      infoeDayOfWeek: 'N/A',
      infoIndate: { formatted: 'N/A', color: 'black' },
      infoOutdate: { formatted: 'N/A', color: 'black' },
      infoCreateDate: { formatted: 'N/A', color: 'black' },
      playMediaClipsUIDs: [],
      totalPlayMediaClips: 0,
    };

    if (data.isOlpFile) {
      data.interProfileContent = extractInterProfileTags(content);
    }

    data.mediaClipUID = extractTagContent(content, 'MEDIA-CLIP', 'UID');
    data.mediaClipRandomOrder = extractTagContent(content, 'MEDIA-CLIP', 'RANDOM-ORDER');

    const infoAttributes = extractTagAttributes(content, 'INFO');
    data.infoName = infoAttributes['NAME'] || 'N/A';
    data.infoIndate = formatDateAndTime(infoAttributes['INDATE'] || '');
    data.infoOutdate = formatDateAndTime(infoAttributes['OUTDATE'] || '');
    data.infoStartTime = formatTime(infoAttributes['StartTime'] || '');
    data.infoFinishTime = formatTime(infoAttributes['FinishTime'] || '');
    data.infoCreateDate = formatDateAndTime(infoAttributes['CreateDate'] || '');
    
    const dayDisplay = getDayDisplay(Number(infoAttributes['DayOfWeek']) || 0);
    data.infoeDayOfWeek = dayDisplay.text;

    if (!data.isOlpFile) {
      data.playMediaClipsUIDs = extractPlayMediaClipsUIDs(content);
      data.totalPlayMediaClips = data.playMediaClipsUIDs.length;
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

  const isGreyTime = (start: string, finish: string) => start === "00:00" && finish === "00:00";

  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu currentToolId="hp-music-profile" />
      <ToolsNavigation currentToolId="hp-music-profile" />

      <main className="flex-1 p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#3d2914] handwritten flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl">😃</span> hpMusicProfileViewer <span className="text-2xl sm:text-3xl">😃</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8b6f47] mt-2">
              Upload Music Profiles to Display Information
            </p>
          </header>

          {/* Upload Area */}
          <div
            className={`cozy-card p-6 text-center mb-6 transition-all ${
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
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="px-4 py-2 bg-[#e8dcc8] rounded-lg text-sm text-[#3d2914] sketch-border-sm handwritten">
                Choose Files
              </span>
            </label>
          </div>

          <hr className="border-[#c4a484] mb-6" />

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
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Overlays & Others (OLP Files) */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#3d2914] handwritten">
                Overlays & Others
              </h2>
              {olpProfiles.length === 0 ? (
                <p className="text-[#8b6f47] text-sm italic">No overlay profiles uploaded yet...</p>
              ) : (
                olpProfiles.map((profile, index) => {
                  const grey = isGreyTime(profile.infoStartTime, profile.infoFinishTime);

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-[#ddd] space-y-2"
                      style={{ backgroundColor: grey ? '#fff' : '#ede7fd' }}
                    >
                      {/* Filename and Random Order */}
                      <div className="flex items-center gap-2 border-b border-[#c9a9a6] pb-2 overflow-hidden">
                        <span className="text-lg flex-shrink-0">{grey ? '❔' : '📌'}</span>
                        <span className="font-medium text-[#3d2914] text-sm truncate min-w-0 flex-1">{profile.fileName}</span>
                        <span className="text-xs bg-[#c9a9a6] text-white px-2 py-0.5 rounded-full flex-shrink-0">
                          🔀 {profile.mediaClipRandomOrder}
                        </span>
                      </div>

                      {/* Time and Day */}
                      <div className="text-base sm:text-lg">
                        {!grey && <span className="text-xl sm:text-2xl">⏰ </span>}
                        <span
                          className="font-bold text-xl sm:text-2xl"
                          style={{ color: grey ? '#9ca3af' : '#f97316' }}
                        >
                          {profile.infoStartTime} - {profile.infoFinishTime}
                        </span>{' '}
                        <span style={{ fontSize: '1rem' }}>{profile.infoeDayOfWeek}</span>
                      </div>

                      {/* Profile Name */}
                      <div className="text-xl sm:text-2xl">
                        {!grey && <span className="text-xl sm:text-2xl">🎶 </span>}
                        <span className="font-bold" style={{ color: grey ? '#9ca3af' : '#22c55e' }}>
                          {profile.infoName}
                        </span>
                      </div>

                      {/* In-Out Dates with color */}
                      <div className="text-sm">
                        <strong>In-Out Dates:</strong>{' '}
                        <span style={{ color: profile.infoIndate.color, fontSize: '1.1rem' }}>
                          {profile.infoIndate.formatted}
                        </span>
                        {' - '}
                        <span style={{ color: profile.infoOutdate.color, fontSize: '1.1rem' }}>
                          {profile.infoOutdate.formatted}
                        </span>
                      </div>

                      {/* CreateDate with color */}
                      <div className="text-sm">
                        <strong>CreateDate:</strong>{' '}
                        <span style={{ color: profile.infoCreateDate.color }}>
                          {profile.infoCreateDate.formatted}
                        </span>
                      </div>

                      {/* INTER-PROFILE Tags in Textarea */}
                      {profile.interProfileContent && (
                        <div className="pt-2 border-t border-dashed border-[#c9a9a6]">
                          <p className="text-[#5c4a3a] font-medium mb-1">
                            <strong>INTER-PROFILE Tags:</strong>
                          </p>
                          <textarea
                            value={profile.interProfileContent}
                            readOnly
                            rows={5}
                            className="w-full p-2 text-sm font-mono border border-[#c9a9a6] rounded resize-y min-h-[100px]"
                            style={{ color: '#9333ea' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Normal Profiles (DJV Files) */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#3d2914] handwritten">
                Normal Profiles
              </h2>
              {normalProfiles.length === 0 ? (
                <p className="text-[#8b6f47] text-sm italic">No normal profiles uploaded yet...</p>
              ) : (
                normalProfiles.map((profile, index) => {
                  const grey = isGreyTime(profile.infoStartTime, profile.infoFinishTime);

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-[#ddd] space-y-2"
                      style={{ backgroundColor: grey ? '#fff' : '#e7fded' }}
                    >
                      {/* Filename and Random Order - Same style as OLP */}
                      <div className="flex items-center gap-2 border-b border-[#9caf88] pb-2 overflow-hidden">
                        <span className="text-lg flex-shrink-0">{grey ? '❔' : '📌'}</span>
                        <span className="font-medium text-[#3d2914] text-sm truncate min-w-0 flex-1">{profile.fileName}</span>
                        <span className="text-xs bg-[#9caf88] text-white px-2 py-0.5 rounded-full flex-shrink-0">
                          🔀 {profile.mediaClipRandomOrder}
                        </span>
                      </div>

                      {/* Time and Day */}
                      <div className="text-base sm:text-lg">
                        {!grey && <span className="text-xl sm:text-2xl">⏰ </span>}
                        <span
                          className="font-bold text-xl sm:text-2xl"
                          style={{ color: grey ? '#9ca3af' : '#8b4513' }}
                        >
                          {profile.infoStartTime} - {profile.infoFinishTime}
                        </span>{' '}
                        <span style={{ fontSize: '1rem' }}>{profile.infoeDayOfWeek}</span>
                      </div>

                      {/* Profile Name */}
                      <div className="text-xl sm:text-2xl">
                        {!grey && <span className="text-xl sm:text-2xl">🎶 </span>}
                        <span className="font-bold" style={{ color: grey ? '#9ca3af' : '#3b82f6' }}>
                          {profile.infoName}
                        </span>
                      </div>

                      {/* In-Out Dates with color */}
                      <div className="text-sm">
                        <strong>In-Out Dates:</strong>{' '}
                        <span style={{ color: profile.infoIndate.color, fontSize: '1.1rem' }}>
                          {profile.infoIndate.formatted}
                        </span>
                        {' - '}
                        <span style={{ color: profile.infoOutdate.color, fontSize: '1.1rem' }}>
                          {profile.infoOutdate.formatted}
                        </span>
                      </div>

                      {/* CreateDate with color */}
                      <div className="text-sm">
                        <strong>CreateDate:</strong>{' '}
                        <span style={{ color: profile.infoCreateDate.color }}>
                          {profile.infoCreateDate.formatted}
                        </span>
                      </div>

                      {/* List of Tracks in Textarea */}
                      <div className="pt-2 border-t border-dashed border-[#9caf88]">
                        <p className="text-[#5c4a3a] font-medium mb-1">
                          <strong>List of Tracks:</strong>
                        </p>
                        <textarea
                          value={profile.playMediaClipsUIDs.join(', ')}
                          readOnly
                          rows={4}
                          className="w-full p-2 text-sm font-mono border border-[#9caf88] rounded resize-y min-h-[80px]"
                        />
                        <p className="text-xl mt-1" style={{ color: '#3b82f6' }}>
                          ♪♫~ {profile.totalPlayMediaClips} Tracks
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
