"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Artwork } from "../types/artwork";
import { SavedCollection } from "../types/collection";

interface CollectionContextType {
  collection: Artwork[];
  userCollections: SavedCollection[];
  setCollection: React.Dispatch<React.SetStateAction<Artwork[]>>;
  setUserCollections: React.Dispatch<React.SetStateAction<SavedCollection[]>>;
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
  const [userCollections, setUserCollections] = useState<SavedCollection[]>([]);

  const addToCollection = (artwork: Artwork) => {
    setCollection((prev) =>
      prev.some((a) => a.id === artwork.id) ? prev : [...prev, artwork]
    );
  };

  const removeFromCollection = (artwork: Artwork) => {
    setCollection((prev) => prev.filter((a) => a.id !== artwork.id));
  };

  return (
    <CollectionContext.Provider
      value={{
        collection,
        setCollection,
        userCollections,
        setUserCollections,
        addToCollection,
        removeFromCollection,
      }}>
      {children}
    </CollectionContext.Provider>
  );
};
