"use client";

import { useEffect, useState } from "react";

interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  primaryImage: string;
}

export default function ArtworkGrid({ query }: { query: string }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setArtworks([]);

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if ("error" in data) throw new Error(data.error);
        if (!Array.isArray(data)) throw new Error("Invalid API response");
        setArtworks(data);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <p className="p-6">Loading artworks...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!artworks.length) return <p className="p-6">No results found.</p>;

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {artworks.map((obj) => (
        <div key={obj.objectID} className="border rounded-lg p-2">
          <h1 className="text-xl font-bold">{obj.title}</h1>
          <p>{obj.artistDisplayName || "Unknown Artist"}</p>
          <img
            src={obj.primaryImage || "/placeholder.png"}
            alt={obj.title}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
}
