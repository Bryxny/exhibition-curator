"use client";

import { useEffect, useState } from "react";

import ArtworkCard from "./ArtworkCard";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  source: string;
}

export default function ArtworkGrid({
  title,
  artist,
}: {
  title: string;
  artist: string;
}) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [endOfResults, setEndOfResults] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 12;

  const fetchArtworks = async (currentOffset: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?title=${encodeURIComponent(
          title
        )}&artist=${encodeURIComponent(
          artist
        )}&limit=${limit}&offset=${currentOffset}`
      );
      const data: Artwork[] = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      setArtworks((prev) => (reset ? data : [...prev, ...data]));
      setEndOfResults(data.length !== limit);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!title && !artist) return;
    setOffset(0);
    setArtworks([]);
    setEndOfResults(false);
    fetchArtworks(0, true);
  }, [title, artist]);

  const handleLoadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchArtworks(newOffset);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  if (loading && artworks.length === 0)
    return <p className="p-6">Loading artworks...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!artworks.length) return <p className="p-6">No results found.</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        {artworks.map((art) => (
          <ArtworkCard
            key={art.id}
            art={art}
            isSelected={selectedIds.has(art.id)}
            onClick={() => toggleSelect(art.id)}
          />
        ))}
      </div>

      {!endOfResults && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
