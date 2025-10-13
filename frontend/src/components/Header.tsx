"use client";

import CollectionModal from "./CollectionModal";

export default function Header() {
  return (
    <header className="relative flex items-center py-2 px-3 bg-zinc-800 shadow-md">
      {/* Left side */}
      <div className="flex-1 flex items-center"></div>

      {/* Center */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/Logo.png"
          alt="Logo"
          className="w-40 h-auto cursor-pointer"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      {/* Right side */}
      <div className="flex-1 flex justify-end items-center">
        <CollectionModal />
      </div>
    </header>
  );
}
