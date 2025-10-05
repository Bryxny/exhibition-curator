"use client";

import CollectionModal from "./CollectionModal";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-4 bg-black shadow-md">
      <h1
        className="text-2xl font-bold cursor-pointer text-white"
        onClick={() => (window.location.href = "/")}>
        Exhibition Curator
      </h1>
      <CollectionModal />
    </header>
  );
}
