"use client";

import { useState } from "react";
import {
  PencilIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

// ✅ Add proper TypeScript types
interface ExhibitionFormProps {
  initialName: string;
  onSave: (name: string) => void;
  onShare: (name: string) => void;
}

export default function ExhibitionForm({
  initialName,
  onSave,
  onShare,
}: ExhibitionFormProps) {
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-zinc-800/80 border border-zinc-700 rounded-xl shadow-md backdrop-blur-sm">
      {!isEditing ? (
        <div
          className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-yellow transition-colors"
          onClick={() => setIsEditing(true)}>
          <PencilIcon className="w-5 h-5" />
          <span className="text-xl font-medium">
            {name || "Click to name your exhibition"}
          </span>
        </div>
      ) : (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Exhibition Name"
          className="w-full sm:w-auto flex-1 p-2 rounded-md bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow"
        />
      )}
      <div className="flex gap-3">
        <button
          onClick={() => {
            onSave(name);
            setIsEditing(false);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-yellow text-yellow rounded-md bg-zinc-700 hover:bg-yellow hover:text-zinc-900 transition-all"
          title="Save Exhibition">
          <BookmarkIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Save</span>
        </button>
        <button
          onClick={() => {
            onShare(name);
            setIsEditing(false);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-yellow text-yellow rounded-md bg-zinc-700 hover:bg-yellow hover:text-zinc-900 transition-all"
          title="Share Exhibition">
          <ShareIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}
