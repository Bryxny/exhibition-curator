"use client";

import { useState } from "react";

const mockSavedCollections = [
  { id: "1", title: "Collection A", image: "/placeholder1.png" },
  { id: "2", title: "Collection B", image: "/placeholder2.png" },
];

export default function ProfileModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <div
        className="ml-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-zinc-700 rounded transition"
        onClick={() => setIsModalOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/80 z-40 flex justify-start">
          <div className="bg-zinc-900 w-100 h-full relative flex flex-col m-2">
            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
              <button
                className="absolute top-4 right-6 text-gray-500 hover:text-gray-300 z-50"
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>

              <h2 className="text-xl mb-2 ml-2 text-neutral-200 relative z-10">
                Profile
              </h2>

              {!isLoggedIn ? (
                <div className="flex flex-col gap-3 relative z-10">
                  <p className="text-white">
                    Please log in to see your saved collections.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="py-2 bg-yellow-600 text-black border border-yellow-600 rounded-lg w-full">
                    Log In
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  <p className="text-white">User logged in.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
