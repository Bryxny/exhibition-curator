import { useState } from "react";
import { useCollection } from "../context/CollectionContext";
import { useRouter } from "next/navigation";

export default function CollectionModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { collection, removeFromCollection, setCollection } = useCollection();
  const [selected, setSelected] = useState<string | null>(null);

  const handleReplace = (id: string) => {
    if (!selected) {
      setSelected(id);
    } else if (selected === id) {
      setSelected(null);
    } else {
      setCollection((prev) => {
        const newCollection = [...prev];
        const firstIndex = newCollection.findIndex(
          (art) => art.id === selected
        );
        const secondIndex = newCollection.findIndex((art) => art.id === id);

        if (firstIndex === -1 || secondIndex === -1) return prev;

        [newCollection[firstIndex], newCollection[secondIndex]] = [
          newCollection[secondIndex],
          newCollection[firstIndex],
        ];

        return newCollection;
      });
      setSelected(null);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className="flex items-center px-4 py-2 bg-black border border-gray-100 text-white rounded-lg"
          onClick={() => setIsModalOpen(true)}>
          Collection
          <span className="ml-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {collection.length}
          </span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-black border w-80 h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
              <button
                className="absolute top-4 right-5 text-gray-500 hover:text-gray-300 z-50"
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-white relative z-10">
                Your Collection
              </h2>

              {collection.length === 0 ? (
                <p className="text-white relative z-10">
                  No artworks selected.
                </p>
              ) : (
                <div className="columns-2 gap-2 space-y-2 relative z-10">
                  {collection.map((art, index) => (
                    <div
                      key={art.id}
                      className={`break-inside-avoid relative group cursor-pointer mb-2 border-2 rounded ${
                        selected === art.id
                          ? "border-yellow-400 shadow-lg"
                          : "border-transparent"
                      }`}
                      onClick={() => handleReplace(art.id)}>
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-auto object-cover rounded"
                      />

                      <div className="absolute top-1 left-1 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded opacity-50 z-50">
                        {index + 1}
                      </div>

                      {selected === art.id && (
                        <button
                          className="absolute top-1 right-1 z-50 text-white bg-red-600 rounded-full p-1 transition"
                          onClick={(e) => {
                            removeFromCollection(art);
                            setSelected(null);
                          }}>
                          ✕
                        </button>
                      )}

                      <div
                        className={`absolute inset-0 bg-black/25 flex items-center justify-center text-white font-bold transition-opacity duration-200 z-20
                        ${
                          selected === art.id
                            ? ""
                            : selected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}>
                        {selected === art.id
                          ? ""
                          : selected
                          ? "Swap"
                          : "Select"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent px-4 py-4 pointer-events-none z-20 pt-10">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full pointer-events-auto"
                onClick={() => router.push("/exhibition")}>
                Go to Exhibition
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
