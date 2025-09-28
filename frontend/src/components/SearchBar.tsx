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
    <form onSubmit={handleSubmit} className="p-6 mb-4 flex gap-2 flex-wrap">
      <input
        type="text"
        placeholder="Search by title..."
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        className="flex-1 border rounded p-2"
      />
      <input
        type="text"
        placeholder="Search by artist..."
        value={artistInput}
        onChange={(e) => setArtistInput(e.target.value)}
        className="flex-1 border rounded p-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded">
        Search
      </button>
    </form>
  );
}
