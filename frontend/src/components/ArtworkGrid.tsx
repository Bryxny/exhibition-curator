"use client";

import { useEffect, useState } from "react";

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
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const fetchArtworks = async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?title=${title}&artist=${artist}&limit=${limit}&offset=${offset}`
      );
      const data: Artwork[] = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      const newArtworks = data.filter((art) => !seenIds.has(art.id));
      newArtworks.forEach((art) => seenIds.add(art.id));

      setArtworks((prev) => (reset ? newArtworks : [...prev, ...newArtworks]));
      setSeenIds(new Set(seenIds));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!title && !artist) return;
    setOffset(0);
    setSeenIds(new Set());
    fetchArtworks(true);
  }, [title, artist]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  useEffect(() => {
    if (offset === 0) return;
    fetchArtworks();
  }, [offset]);

  if (loading && artworks.length === 0)
    return <p className="p-6">Loading artworks...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!artworks.length) return <p className="p-6">No results found.</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded-lg p-2">
            <h1 className="text-xl font-bold">{art.title}</h1>
            <p>{art.artist || "Unknown Artist"}</p>
            <img
              src={art.image || "/placeholder.png"}
              alt={art.title}
              className="w-full h-auto object-cover rounded"
            />
            <p>{art.source}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
