"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  source: string;
}

interface CollectionContextType {
  collection: Artwork[];
  addToCollection: (artwork: Artwork) => void;
  removeFromCollection: (artwork: Artwork) => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(
  undefined
);

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
};

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [collection, setCollection] = useState<Artwork[]>([]);

  const addToCollection = (artwork: Artwork) => {
    setCollection((prev) => {
      if (prev.some((a) => a.id === artwork.id)) return prev;
      return [...prev, artwork];
    });
  };

  const removeFromCollection = (artwork: Artwork) => {
    setCollection((prev) => prev.filter((a) => a.id !== artwork.id));
  };

  return (
    <CollectionContext.Provider
      value={{ collection, addToCollection, removeFromCollection }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
