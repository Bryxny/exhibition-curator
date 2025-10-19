"use client";

import { useState } from "react";
import { Artwork } from "../types/artwork";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ExhibitionCard(art: Artwork) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        key={art.id}
        className="break-inside-avoid mb-6 cursor-pointer group transition-transform duration-300 hover:scale-[1.02] flex flex-col items-center">
        <div
          className="p-2 inline-block bg-gradient-to-tr from-gold via-shine to-gold"
          onClick={() => setModalOpen(true)}>
          <div className="bg-neutral-100 p-2 border-4 border-gold-shad shadow-md">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-auto object-cover pointer-events-none"
            />
          </div>
        </div>

        <div className="bg-neutral-100 transition-all duration-300 mt-2 text-center shadow-sm max-h-8 py-1 max-w-40 px-2 scale-100">
          <h2 className="font-semibold leading-tight transition-all duration-300 text-black text-[9px] opacity-70">
            {art.title}
          </h2>
          <p className="transition-all duration-300 text-black text-[8px] opacity-50">
            {art.artist}
          </p>
        </div>
      </div>

      {modalOpen && art && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row border border-zinc-700">
            <button
              className="absolute top-3 right-3 z-40 text-zinc-400 hover:text-yellow transition-colors"
              onClick={() => setModalOpen(false)}>
              <XMarkIcon className="w-7 h-7" />
            </button>

            <div className="modal-content flex flex-col md:flex-row mt-10">
              <div className="md:w-1/2 flex items-center justify-center bg-zinc-950 m-6 border-r border-zinc-800">
                <img
                  src={art.image}
                  alt={art.title}
                  className="max-h-[75vh] object-contain rounded-lg"
                />
              </div>

              <div className="md:w-1/2 p-6 flex flex-col text-zinc-100 max-h-[75vh] space-y-2">
                <h2 className="text-3xl font-semibold text-yellow mb-1">
                  {art.title || "Untitled"}
                </h2>
                <h3 className="text-lg italic mb-4 text-zinc-400">
                  {art.artist || "Unknown artist"}
                </h3>

                <div className="space-y-1.5 text-sm">
                  {art.objectDate && (
                    <p>
                      <span className="text-zinc-500">Date:</span>{" "}
                      {art.objectDate}
                    </p>
                  )}
                  {art.period && (
                    <p>
                      <span className="text-zinc-500">Period:</span>{" "}
                      {art.period}
                    </p>
                  )}
                  {art.culture && (
                    <p>
                      <span className="text-zinc-500">Culture:</span>{" "}
                      {art.culture}
                    </p>
                  )}
                  {art.medium && (
                    <p>
                      <span className="text-zinc-500">Medium:</span>{" "}
                      {art.medium}
                    </p>
                  )}
                  {art.dimensions && (
                    <p>
                      <span className="text-zinc-500">Dimensions:</span>{" "}
                      {art.dimensions}
                    </p>
                  )}
                  {art.department && (
                    <p>
                      <span className="text-zinc-500">Department:</span>{" "}
                      {art.department}
                    </p>
                  )}
                  {art.classification && (
                    <p>
                      <span className="text-zinc-500">Classification:</span>{" "}
                      {art.classification}
                    </p>
                  )}
                  {art.rightsAndReproduction && (
                    <p>
                      <span className="text-zinc-500">Rights:</span>{" "}
                      {art.rightsAndReproduction}
                    </p>
                  )}
                  {art.source && (
                    <p>
                      <span className="text-zinc-500">Source:</span>{" "}
                      {art.source}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
