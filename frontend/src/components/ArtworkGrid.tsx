"use client";

import { useCollection } from "../context/CollectionContext";
import { useArtworks } from "@/hooks/useArtworks";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "@/types/artwork";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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
    return (
      <div className="flex flex-col justify-center items-center p-16 min-h-[300px]">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-zinc-300 border-t-zinc-800 mb-6"></div>
        <p className="text-lg font-semibold text-zinc-800">
          Loading artworks...
        </p>
        <p className="text-sm text-zinc-500 mt-1">
          Please wait while we fetch the best results for you.
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center p-20 text-red-600">
        <p className="text-lg font-semibold">Error</p>
        <p className="text-sm opacity-80 mt-1">{error}</p>
      </div>
    );

  if (!loading && !artworks.length)
    return (
      <div className="flex flex-col items-center justify-center py-30 px-14 text-zinc-600">
        <MagnifyingGlassIcon className="w-20 h-12 mb-3 opacity-60" />
        <p className="text-lg text-center font-medium">No results found</p>
        <p className="text-sm text-center opacity-70 mt-1">
          Try adjusting your search terms or artist name.
        </p>
      </div>
    );

  return (
    <div className="p-4">
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
        <div className="flex justify-center my-20">
          <button
            onClick={loadMore}
            disabled={!artworks.length || loadingMore}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
            {loadingMore && (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            )}
            <span>{loadingMore ? "Loading more..." : "Load More"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
