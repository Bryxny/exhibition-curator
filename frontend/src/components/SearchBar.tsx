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
    setTitle(titleInput.trim());
    setArtist(artistInput.trim());
    setTitleInput("");
    setArtistInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 p-2 mb-5 bg-zinc-800 rounded text-white">
      <input
        type="text"
        placeholder="Search by title..."
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        className="flex-1 border border-zinc-400 rounded p-2 text-white focus:outline-none"
      />
      <input
        type="text"
        placeholder="Search by artist..."
        value={artistInput}
        onChange={(e) => setArtistInput(e.target.value)}
        className="flex-1 border border-zinc-400 rounded p-2 text-white focus:outline-none"
      />
      <button
        type="submit"
        className="border border-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-600 sm:px-8">
        Search
      </button>
    </form>
  );
}
