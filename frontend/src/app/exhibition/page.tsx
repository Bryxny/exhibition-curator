"use client";

import { useRouter } from "next/navigation";
import { useCollection } from "../../context/CollectionContext";
import ExhibitionCard from "@/components/ExhibitionCard";

export default function ExhibitionPage() {
  const { collection } = useCollection();
  const router = useRouter();

  if (!collection.length) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-800 text-center">
        <p className="text-lg text-gray-700 mb-4">
          Your exhibition is empty. Add artworks from the main page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Curator
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-800 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Exhibition</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Edit Exhibition
        </button>
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-8">
        {collection.map((art) => (
          <ExhibitionCard key={art.id} {...art} />
        ))}
      </div>
    </main>
  );
}
