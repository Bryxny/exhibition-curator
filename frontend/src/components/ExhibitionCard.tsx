"use client";

import { useState, useEffect } from "react";
import { Artwork } from "../types/artwork";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ExhibitionCard(art: Artwork) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = -parseInt(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

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

        <div className="bg-neutral-100 transition-all duration-300 mt-2 text-center shadow-sm py-1 px-2 max-w-[160px] w-full flex flex-col items-center break-words">
          <h2 className="font-semibold leading-tight text-black text-[9px] opacity-70">
            {art.title}
          </h2>
          <p className="text-black text-[8px] opacity-50 break-words">
            {art.artist}
          </p>
        </div>
      </div>

      {modalOpen && art && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 select-none"
          style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
          onClick={() => setModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row border border-zinc-700 max-h-[90vh] overflow-auto">
            <button
              className="absolute top-3 right-3 z-40 text-zinc-400 hover:text-yellow transition-colors"
              onClick={() => setModalOpen(false)}>
              <XMarkIcon className="w-7 h-7" />
            </button>

            <div className="flex flex-col md:flex-row w-full">
              {/* Image */}
              <div className="md:w-1/2 flex items-center justify-center p-4 md:p-6">
                <img
                  src={art.image}
                  alt={art.title}
                  className="max-h-[50vh] md:max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              {/* Info */}
              <div className="md:w-1/2 p-4 md:p-6 flex flex-col text-zinc-100 space-y-2 overflow-auto">
                <h2 className="text-2xl sm:text-3xl font-semibold text-yellow mb-1 truncate">
                  {art.title || "Untitled"}
                </h2>
                <h3 className="text-base sm:text-lg italic mb-2 text-zinc-400 truncate">
                  {art.artist || "Unknown artist"}
                </h3>

                <div className="space-y-1 text-sm flex flex-col">
                  {art.objectDate && (
                    <p className="break-words">
                      <span className="text-zinc-500">Date:</span>{" "}
                      {art.objectDate}
                    </p>
                  )}
                  {art.period && (
                    <p className="break-words">
                      <span className="text-zinc-500">Period:</span>{" "}
                      {art.period}
                    </p>
                  )}
                  {art.culture && (
                    <p className="break-words">
                      <span className="text-zinc-500">Culture:</span>{" "}
                      {art.culture}
                    </p>
                  )}
                  {art.medium && (
                    <p className="break-words">
                      <span className="text-zinc-500">Medium:</span>{" "}
                      {art.medium}
                    </p>
                  )}
                  {art.dimensions && (
                    <p className="break-words">
                      <span className="text-zinc-500">Dimensions:</span>{" "}
                      {art.dimensions}
                    </p>
                  )}
                  {art.department && (
                    <p className="break-words">
                      <span className="text-zinc-500">Department:</span>{" "}
                      {art.department}
                    </p>
                  )}
                  {art.classification && (
                    <p className="break-words">
                      <span className="text-zinc-500">Classification:</span>{" "}
                      {art.classification}
                    </p>
                  )}
                  {art.rightsAndReproduction && (
                    <p className="break-words">
                      <span className="text-zinc-500">Rights:</span>{" "}
                      {art.rightsAndReproduction}
                    </p>
                  )}
                  {art.source && (
                    <p className="break-words">
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
