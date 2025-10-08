"use client";

import { useState } from "react";

export default function SearchBar({
  setTitle,
  setArtist,
}: {
  setTitle: (title: string) => void;
  setArtist: (artist: string) => void;
}) {
  const [titleInput, setTitleInput] = useState("");
  const [artistInput, setArtistInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTitleInput("");
    setArtistInput("");
    setTitle(titleInput.trim());
    setArtist(artistInput.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="py-3 px-4 mb-4 flex gap-6 flex-wrap bg-zinc-800 rounded text-white">
      <input
        type="text"
        placeholder="Search by title..."
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        className="flex-1 border border-zinc-400 rounded p-2 text-white"
      />
      <input
        type="text"
        placeholder="Search by artist..."
        value={artistInput}
        onChange={(e) => setArtistInput(e.target.value)}
        className="flex-1 border border-zinc-400 rounded p-2 text-white"
      />
      <button
        type="submit"
        className="border border-yellow-600 text-white px-8 rounded hover:bg-yellow-600">
        Search
      </button>
    </form>
  );
}
