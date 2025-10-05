"use client";

import { useState } from "react";
import { Artwork } from "../types/artwork";

export default function ExhibitionCard(art: Artwork) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        key={art.id}
        className="break-inside-avoid mb-6 cursor-pointer group transition-transform duration-300 hover:scale-[1.02] flex flex-col items-center">
        <div
          className="p-4 inline-block  bg-gradient-to-tr from-yellow-700 via-yellow-600 to-yellow-700"
          onClick={() => setModalOpen(true)}>
          <div className="bg-neutral-100 p-2 border-4 border-yellow-900 shadow-md">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-auto object-cover pointer-events-none"
            />
          </div>
        </div>

        <div
          className={`bg-neutral-100 transition-all duration-300 mt-2 text-center shadow-sm max-h-8 py-1 max-w-40 px-2 scale-100`}>
          <h2
            className={`font-semibold leading-tight transition-all duration-300 text-black text-[9px] opacity-70`}>
            {art.title}
          </h2>

          <p
            className={`transition-all duration-300 text-black text-[8px] opacity-50`}>
            {art.artist}
          </p>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}>
          <div className="relative">
            <img
              src={art.image}
              alt={art.title}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setModalOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
