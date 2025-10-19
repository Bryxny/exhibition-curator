"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Artwork } from "@/types/artwork";

interface ArtworksContextType {
  artworks: Artwork[];
  cached: Artwork[];
  setArtworks: React.Dispatch<React.SetStateAction<Artwork[]>>;
  setCached: React.Dispatch<React.SetStateAction<Artwork[]>>;
  clearArtworks: () => void;
  lastQuery: { title: string; artist: string };
  setLastQuery: React.Dispatch<
    React.SetStateAction<{ title: string; artist: string }>
  >;
}

const ArtworksContext = createContext<ArtworksContextType | undefined>(
  undefined
);

export function ArtworksProvider({ children }: { children: ReactNode }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [cached, setCached] = useState<Artwork[]>([]);
  const [lastQuery, setLastQuery] = useState<{ title: string; artist: string }>(
    {
      title: "",
      artist: "",
    }
  );

  const clearArtworks = () => {
    setArtworks([]);
    setCached([]);
    setLastQuery({ title: "", artist: "" });
  };

  return (
    <ArtworksContext.Provider
      value={{
        artworks,
        cached,
        setArtworks,
        setCached,
        clearArtworks,
        lastQuery,
        setLastQuery,
      }}>
      {children}
    </ArtworksContext.Provider>
  );
}

export function useArtworksContext() {
  const context = useContext(ArtworksContext);
  if (!context) {
    throw new Error(
      "useArtworksContext must be used within an ArtworksProvider"
    );
  }
  return context;
}
