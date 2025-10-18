import { useState } from "react";
import { useCollection } from "../context/CollectionContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function CollectionModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { collection, removeFromCollection, setCollection } = useCollection();
  const [selected, setSelected] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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

  const buttonClass =
    "py-2 bg-zinc-900 text-neutral-200 border border-zinc-600 hover:border-yellow rounded-lg w-full";

  return (
    <>
      <div
        className="relative w-16 h-16 cursor-pointer mb-2 hover:scale-110 transition"
        onClick={() => setIsModalOpen(true)}>
        <img
          src="/Cart.png"
          alt="Collection"
          className="w-full h-full object-cover"
        />
        <span className="absolute inset-0 top-3 flex items-center justify-center text-white text-lg drop-shadow-md">
          {collection.length}
        </span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/80 z-40 flex justify-end">
          <div className="bg-zinc-900 border w-100 h-full w-full sm:w-[400px] relative flex flex-col overflow-hidden">
            <button
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-300 z-50"
              onClick={() => setIsModalOpen(false)}>
              ✕
            </button>

            <h2 className="text-xl m-2 pb-3 p-2 text-white font-bold border-b border-yellow relative z-10">
              Your Collection
            </h2>

            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 custom-scrollbar">
              {collection.length === 0 ? (
                <p className="text-neutral-200 relative z-10">
                  No artworks selected.
                </p>
              ) : (
                <div className="columns-2 gap-4 relative z-10">
                  {collection.map((art, index) => (
                    <div
                      key={art.id}
                      className={`break-inside-avoid relative group cursor-pointer mb-4 border-2 ${
                        selected === art.id
                          ? "border-yellow"
                          : "border-transparent"
                      }`}
                      onClick={() => handleReplace(art.id)}>
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-auto object-cover"
                      />

                      <div className="absolute top-1 left-1 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded opacity-50 z-50">
                        {index + 1}
                      </div>

                      {selected === art.id && (
                        <button
                          className="absolute top-1 right-1 bg-red-700/90 text-white text-xs font-bold px-1.5 py-0.5 rounded opacity-50 z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCollection(art);
                            setSelected(null);
                          }}>
                          ✕
                        </button>
                      )}

                      <div
                        className={`absolute inset-0 bg-black/25 flex items-center justify-center text-white font-bold transition-opacity duration-200 z-20 ${
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
            <div className="sticky bottom-0 left-0 w-full bg-zinc-900/90 px-4 py-4 z-20">
              {pathname === "/exhibition" ? (
                <button
                  className={buttonClass}
                  onClick={() => router.push("/")}>
                  Edit Collection
                </button>
              ) : (
                <button
                  className={buttonClass}
                  onClick={() => router.push("/exhibition")}>
                  Go to Exhibition
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
