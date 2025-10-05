"use client";

import { useState } from "react";
import { useCollection } from "../context/CollectionContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { collection, removeFromCollection } = useCollection();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-black shadow-md">
      <h1
        className="text-2xl font-bold cursor-pointer text-white"
        onClick={() => (window.location.href = "/")}
      >
        Exhibition Curator
      </h1>

      <div className="relative">
        <button
          className="flex items-center px-4 py-2 bg-black border border-gray-100 text-white rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Collection
          <span className="ml-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {collection.length}
          </span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-black border w-80 h-full p-4 overflow-y-auto relative z-50 flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">
              Your Collection
            </h2>
            {collection.length === 0 ? (
              <p className="text-white">No artworks selected.</p>
            ) : (
              <div className="columns-2 gap-2 space-y-2 relative">
                {collection.map((art) => (
                  <div
                    key={art.id}
                    className="break-inside-avoid relative group cursor-pointer mb-2"
                    onClick={() => removeFromCollection(art)}
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-auto object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold">
                      Remove
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="sticky bottom-0 px-0 pt-10 relative bg-black">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
                onClick={() => router.push("/exhibition")}
              >
                Go to Exhibition
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
