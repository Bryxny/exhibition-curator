"use client";

import { useState, useEffect } from "react";
import {
  PencilIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { saveExhibition, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { SavedCollection } from "@/types/collection";
import { useCollection } from "@/context/CollectionContext";

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
  const { collectionTitle, setCollectionTitle } = useCollection();

  const [title, setTitle] = useState(collectionTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; link?: string } | null>(
    null
  );

  const buttonClasses =
    "flex items-center justify-center px-4 py-2.5 border border-yellow text-yellow rounded-md bg-zinc-700 hover:bg-yellow hover:text-black transition-all w-full sm:w-auto gap-2";

  useEffect(() => {
    setTitle(collectionTitle);
    setSavedId(null);
    setShareLink(null);
  }, [collectionTitle]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setCollectionTitle(newTitle);
  };

  const showToast = (message: string, link?: string) => {
    setToast({ message, link });
    setTimeout(() => setToast(null), 3000);
  };

  const saveIfNeeded = async () => {
    if (!userId) throw new Error("No userId");

    const thumbnail = artworks[0]?.image || "";

    if (savedId) {
      const docRef = doc(db, `users/${userId}/collections/${savedId}`);
      await setDoc(
        docRef,
        { title, artworks, thumbnail, updatedAt: serverTimestamp() },
        { merge: true }
      );
      return savedId;
    }

    const savedDoc = await saveExhibition(userId, title, artworks, thumbnail);
    setUserCollections((prev) => [
      ...prev,
      { id: savedDoc.id, title, artworks, thumbnail },
    ]);
    setSavedId(savedDoc.id);
    return savedDoc.id;
  };

  const handleSave = async () => {
    if (!userId) return showToast("Please log in to save");
    if (!artworks.length) return showToast("Add at least one artwork to save");
    try {
      await saveIfNeeded();
      showToast("Exhibition saved");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      showToast("Error saving exhibition");
    }
  };

  const handleShare = async () => {
    if (!userId) return showToast("Please log in to share!");
    if (!artworks.length)
      return showToast("Add at least one artwork to share!");

    try {
      const userDocId = await saveIfNeeded();

      const shareDocRef = doc(db, "share", crypto.randomUUID());
      await setDoc(shareDocRef, {
        title,
        artworks,
        thumbnail: artworks[0]?.image || "",
        createdAt: serverTimestamp(),
        originalUserDocId: userDocId,
      });

      const url = `${window.location.origin}/share/${shareDocRef.id}`;
      setShareLink(url);
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard", url);
    } catch (err) {
      console.error(err);
      showToast("Error sharing exhibition.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-12 bg-zinc-800 rounded-lg shadow-sm relative">
      <div className="relative w-full sm:flex-1">
        {!isEditing && (
          <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
        )}
        <input
          type="text"
          value={title}
          readOnly={!isEditing}
          onChange={(e) => handleTitleChange(e.target.value)}
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
        <button onClick={handleShare} className={buttonClasses}>
          <ShareIcon className="w-5 h-5" /> Share
        </button>
      </div>

      {toast && (
        <div className="absolute left-0 right-0 bottom-[-2.5rem] mx-auto bg-zinc-800 text-neutral-200 px-4 py-1 rounded-md shadow-lg text-sm flex justify-center items-center animate-fade-in-out">
          {toast.message}
          {toast.link && (
            <span className="font-semibold ml-1">{toast.link}</span>
          )}
        </div>
      )}
    </div>
  );
}
