"use client";

import { useCollection } from "../context/CollectionContext";
import { useArtworks } from "@/hooks/useArtworks";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "@/types/artwork";

interface ArtworkGridProps {
  title: string;
  artist: string;
}

export default function ArtworkGrid({ title, artist }: ArtworkGridProps) {
  const { collection, addToCollection, removeFromCollection } = useCollection();
  const { artworks, loading, loadingMore, error, loadMore, hasMore } =
    useArtworks({ title, artist, pageSize: 20 });

  const toggleSelect = (art: Artwork) => {
    if (collection.some((a) => a.id === art.id)) removeFromCollection(art);
    else addToCollection(art);
  };

  if (loading && artworks.length === 0)
    return <p className="p-20">Loading artworks...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!artworks.length) return <p className="p-6">No results found.</p>;

  return (
    <div className="bg-neutral-200 p-4">
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-6">
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

      {hasMore && (
        <div className="flex justify-center my-6">
          <button
            onClick={loadMore}
            disabled={!artworks.length || loadingMore}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg disabled:opacity-50">
            {loadingMore ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
