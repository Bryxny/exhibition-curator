import { useState, useEffect, useCallback } from "react";
import { useArtworksContext } from "@/context/ArtworksContext";
import { Artwork } from "@/types/artwork";

interface UseArtworksOptions {
  title?: string;
  artist?: string;
  pageSize?: number;
}

export function useArtworks({
  title = "",
  artist = "",
  pageSize = 12,
}: UseArtworksOptions) {
  const { artworks, setArtworks } = useArtworksContext();
  const [allResults, setAllResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDeep, setLoadingDeep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const displayedArtworks = artworks;
  const hasMore = displayedArtworks.length < allResults.length || loadingDeep;

  const query = new URLSearchParams();
  if (title) query.append("title", title);
  if (artist) query.append("artist", artist);

  const loadQuickThenDeep = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const quickRes = await fetch(
        `/api/search?${query.toString()}&mode=quick`
      );
      if (!quickRes.ok)
        throw new Error(`Quick fetch failed (${quickRes.status})`);
      const quickData: Artwork[] = await quickRes.json();

      setAllResults(quickData);
      setArtworks(quickData.slice(0, pageSize));
      setLoading(false);

      setLoadingDeep(true);
      const deepRes = await fetch(`/api/search?${query.toString()}&mode=deep`);
      if (!deepRes.ok) throw new Error(`Deep fetch failed (${deepRes.status})`);
      const deepData: Artwork[] = await deepRes.json();

      setAllResults((prev) => {
        const seen = new Set(prev.map((a) => a.id));
        return [...prev, ...deepData.filter((a) => !seen.has(a.id))];
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load artworks");
      setLoading(false);
    } finally {
      setLoadingDeep(false);
    }
  }, [title, artist, pageSize, setArtworks]);

  const loadMore = useCallback(() => {
    const start = displayedArtworks.length;
    const nextBatch = allResults.slice(start, start + pageSize);
    if (nextBatch.length > 0) {
      setArtworks((prev) => [...prev, ...nextBatch]);
      setPage((p) => p + 1);
    }
  }, [allResults, displayedArtworks, pageSize, setArtworks]);

  useEffect(() => {
    if (!title && !artist) return;

    setArtworks([]);
    setAllResults([]);
    setPage(1);
    loadQuickThenDeep();
  }, [title, artist, loadQuickThenDeep, setArtworks]);

  return {
    artworks: displayedArtworks,
    loading,
    loadingMore: loadingDeep,
    error,
    loadMore,
    hasMore,
  };
}
