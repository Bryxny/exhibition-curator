"use client";

import { useEffect, useState } from "react";
import { useCollection } from "../context/CollectionContext";
import { Artwork } from "../types/artwork";

import ArtworkCard from "./ArtworkCard";

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
  const limit = 12;

  const { collection, addToCollection, removeFromCollection } = useCollection();

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

  const toggleSelect = (art: Artwork) => {
    if (collection.some((a) => a.id === art.id)) removeFromCollection(art);
    else addToCollection(art);
  };

  if (loading && artworks.length === 0)
    return <p className="p-20">Loading artworks...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!artworks.length) return <p className="p-6">No results found.</p>;

  return (
    <div className="bg-neutral-200">
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-6 ">
        {artworks.map((art) => (
          <div key={art.id} className="break-inside-avoid mb-6">
            <ArtworkCard
              art={art}
              isSelected={collection.some((a) => a.id === art.id)}
              onClick={() => toggleSelect(art)}
            />
          </div>
        ))}
      </div>

      {!endOfResults && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg disabled:opacity-50">
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
