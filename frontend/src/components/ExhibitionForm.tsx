"use client";

import { useState } from "react";
import {
  PencilIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { saveExhibition } from "@/lib/firebase";
import { SavedCollection } from "@/types/collection";

interface ExhibitionFormProps {
  userId?: string;
  artworks?: any[];
  setUserCollections: React.Dispatch<React.SetStateAction<SavedCollection[]>>;
}

export default function ExhibitionForm({
  userId,
  artworks = [],
  setUserCollections,
}: ExhibitionFormProps) {
  const [title, setTitle] = useState("My Exhibition");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!userId) return alert("Please log in to save!");
    if (!artworks.length) return alert("Add at least one artwork to save!");

    try {
      const thumbnail = artworks[0].image || "";
      const savedDoc = await saveExhibition(userId, title, artworks, thumbnail);
      setUserCollections((prev) => [
        ...prev,
        { id: savedDoc.id, title, artworks, thumbnail },
      ]);
      setIsEditing(false);
      alert("Exhibition saved");
    } catch (err) {
      console.error(err);
      alert("Error saving exhibition.");
    }
  };

  const buttonClasses =
    "flex items-center justify-center px-4 py-2.5 border border-yellow text-yellow rounded-md bg-zinc-700 hover:bg-yellow hover:text-black transition-all w-full sm:w-auto gap-2";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-12 bg-zinc-800 rounded-lg shadow-sm">
      <div className="relative w-full sm:flex-1">
        {!isEditing && (
          <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
        )}
        <input
          type="text"
          value={title}
          readOnly={!isEditing}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => !isEditing && setIsEditing(true)}
          className={`w-full rounded-md text-lg sm:text-xl ${
            isEditing
              ? "bg-zinc-700 pl-3 py-2 text-white placeholder-zinc-400 focus:outline-none border border-zinc-600"
              : "bg-transparent pl-10 text-zinc-400 cursor-pointer"
          }`}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <button onClick={handleSave} className={buttonClasses}>
          <BookmarkIcon className="w-5 h-5" /> Save
        </button>
        <button className={buttonClasses}>
          <ShareIcon className="w-5 h-5" /> Share
        </button>
      </div>
    </div>
  );
}
