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

      {modalOpen && art && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-y-auto"
          onClick={() => setModalOpen(false)}>
          <div
            className="min-h-screen flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-zinc-300 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
              <button
                className="absolute top-3 right-3 text-black text-3xl font-bold z-10 hover:scale-110 transition-transform"
                onClick={() => setModalOpen(false)}>
                ✕
              </button>
              <div className="md:w-1/2 flex items-center justify-center p-4">
                <img
                  src={art.image}
                  alt={art.title}
                  className="max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
                />
              </div>
              <div className="md:w-1/2 p-6 flex flex-col text-gray-800 overflow-y-auto max-h-[70vh] md:max-h-[80vh]">
                <h2 className="text-2xl font-semibold mb-1">
                  {art.title || "Untitled"}
                </h2>
                <h3 className="text-lg italic mb-4 text-gray-700">
                  {art.artist || "Unknown artist"}
                </h3>
                <div className="space-y-2 text-sm">
                  {art.objectDate && (
                    <p>
                      <span className="font-medium text-gray-600">Date:</span>{" "}
                      {art.objectDate}
                    </p>
                  )}
                  {art.period && (
                    <p>
                      <span className="font-medium text-gray-600">Period:</span>{" "}
                      {art.period}
                    </p>
                  )}
                  {art.culture && (
                    <p>
                      <span className="font-medium text-gray-600">
                        Culture:
                      </span>{" "}
                      {art.culture}
                    </p>
                  )}
                  {art.medium && (
                    <p>
                      <span className="font-medium text-gray-600">Medium:</span>{" "}
                      {art.medium}
                    </p>
                  )}
                  {art.dimensions && (
                    <p>
                      <span className="font-medium text-gray-600">
                        Dimensions:
                      </span>{" "}
                      {art.dimensions}
                    </p>
                  )}
                  {art.department && (
                    <p>
                      <span className="font-medium text-gray-600">
                        Department:
                      </span>{" "}
                      {art.department}
                    </p>
                  )}
                  {art.classification && (
                    <p>
                      <span className="font-medium text-gray-600">
                        Classification:
                      </span>{" "}
                      {art.classification}
                    </p>
                  )}
                  {art.rightsAndReproduction && (
                    <p>
                      <span className="font-medium text-gray-600">Rights:</span>{" "}
                      {art.rightsAndReproduction}
                    </p>
                  )}
                  {art.source && (
                    <p>
                      <span className="font-medium text-gray-600">Source:</span>{" "}
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
