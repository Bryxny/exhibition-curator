"use client";

import { useCollection } from "../context/CollectionContext";

export default function Cart() {
  const { collection } = useCollection();

  return (
    <div className="fixed bottom-4 right-4 bg-black border border-white text-white shadow-lg rounded-full w-12 h-12 z-10 flex items-center justify-center cursor-pointer">
      <span className="font-bold text-lg">{collection.length}</span>
    </div>
  );
}
