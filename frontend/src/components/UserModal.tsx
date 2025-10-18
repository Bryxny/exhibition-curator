"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useCollection } from "@/context/CollectionContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SavedCollection } from "@/types/collection";

export default function UserModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { userCollections, setUserCollections, setCollection } =
    useCollection();

  const deleteButtonClass =
    "ml-auto text-gray-500 hover:text-gray-300 flex-shrink-0";

  const collectionCardClass =
    "flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:shadow-md cursor-pointer transition-all";

  const buttonClass =
    "py-2 bg-zinc-900 text-neutral-200 border border-zinc-600 hover:border-yellow rounded-lg w-full";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadCollections(u.uid);
      else setUserCollections([]);
    });
    return () => unsubscribe();
  }, []);

  const loadCollections = async (uid: string) => {
    try {
      const colRef = collection(db, `users/${uid}/collections`);
      const snapshot = await getDocs(colRef);
      const saved: SavedCollection[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Partial<SavedCollection> & { name?: string };
        return {
          id: doc.id,
          title: data.title ?? data.name ?? "My Exhibition",
          artworks: data.artworks ?? [],
          thumbnail: data.thumbnail,
        };
      });
      setUserCollections(saved);
    } catch (err) {
      console.error("Error loading collections:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await loadCollections(result.user.uid);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserCollections([]);
    setIsModalOpen(false);
  };

  const handleLoad = (artworks: any[]) => {
    setCollection(artworks);
    setIsModalOpen(false);
  };

  const handleDelete = async (collectionId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this exhibition?")) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/collections/${collectionId}`));
      setUserCollections(userCollections.filter((c) => c.id !== collectionId));
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  return (
    <>
      <div
        className="ml-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-zinc-700 rounded transition"
        onClick={() => setIsModalOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-yellow"
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
          <div className="bg-zinc-900 w-full sm:w-[400px] h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <button
                className="absolute top-5 right-6 text-gray-500 hover:text-gray-300 z-50"
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              {!user ? (
                <div className="flex flex-col gap-10 relative z-10">
                  <p className="text-white text-xl font-bold pb-2 border-b border-yellow">
                    Profile
                  </p>

                  <p className="text-white text-lg mt-4">
                    Please log in to view your saved collections.
                  </p>

                  <button
                    onClick={handleLogin}
                    className={
                      buttonClass + " flex items-center justify-center gap-2"
                    }>
                    <img
                      src="/google-icon.svg"
                      alt="Google logo"
                      className="w-5 h-5"
                    />
                    Log In with Google
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 relative z-10">
                  <p className="text-white text-xl font-bold pb-4 border-b border-yellow">
                    Hello, {user.displayName ?? "User"}
                  </p>

                  <h3 className="text-neutral-200 font-medium mb-1 text-lg">
                    Saved Collections
                  </h3>

                  {userCollections.length ? (
                    <div className="flex flex-col gap-2">
                      {userCollections.map((col) => (
                        <div
                          key={col.id}
                          className={collectionCardClass}
                          onClick={() => handleLoad(col.artworks)}>
                          <img
                            src={col.artworks[0]?.image || "/placeholder1.png"}
                            alt={col.title}
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0 transition-transform duration-150 hover:scale-105"
                          />
                          <span className="text-white font-medium">
                            {col.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(col.id);
                            }}
                            className={deleteButtonClass}
                            aria-label={`Delete ${col.title}`}>
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No saved collections yet.</p>
                  )}
                </div>
              )}
            </div>

            {user && (
              <div className="sticky bottom-0 left-0 w-full bg-zinc-900/95 px-6 py-6 z-20 border-t border-zinc-700 shadow-inner">
                <button onClick={handleLogout} className={buttonClass}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
