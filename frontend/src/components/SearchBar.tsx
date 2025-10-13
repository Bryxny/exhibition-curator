"use client";

import { useState } from "react";

export default function SearchBar({
  setTitle,
  setArtist,
}: {
  setTitle: (title: string) => void;
  setArtist: (artist: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"title" | "artist">("title");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (searchType === "title") {
      setTitle(query.trim());
      setArtist("");
    } else {
      setTitle("");
      setArtist(query.trim());
    }
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 p-3 mb-5 bg-zinc-800 rounded-lg text-white shadow-sm">
      <input
        type="text"
        placeholder={`Search by ${searchType}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:flex-1 border border-zinc-600 rounded-md p-2 text-white bg-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
      />

      <div className="relative w-full sm:w-40">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as "title" | "artist")}
          className="appearance-none w-full border border-zinc-600 rounded-md p-2 pr-8 bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-600">
          <option value="title">Title</option>
          <option value="artist">Artist</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-white">
          ▼
        </div>
      </div>

      <button className="w-full sm:w-auto border border-yellow-600 bg-yellow-600 text-zinc-900 py-2  px-4 rounded-md font-medium hover:bg-yellow-500">
        Search
      </button>
    </form>
  );
}
