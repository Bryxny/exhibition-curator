"use client";

import { useState, useEffect } from "react";
import { useCollection } from "../../context/CollectionContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import ExhibitionCard from "@/components/ExhibitionCard";
import Header from "@/components/Header";
import ExhibitionForm from "@/components/ExhibitionForm";

export default function ExhibitionPage() {
  const { collection, setUserCollections } = useCollection();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#292524";
    return () => {
      document.body.style.backgroundColor = original;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!collection.length) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-center text-zinc-300">
        <p className="text-lg mb-6">
          Your exhibition is empty. Add artworks from the main page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-yellow text-zinc-900 rounded-md font-medium hover:bg-yellow-hover">
          Back to Curator
        </button>
      </main>
    );
  }
  return (
    <main className="min-h-screen w-full bg-zinc-900 overflow-y-auto">
      <Header />
      <section className="max-w-7xl mx-auto p-10 pb-32">
        <ExhibitionForm
          userId={user?.uid}
          artworks={collection}
          setUserCollections={setUserCollections}
        />
        <div className="mt-12 columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-8">
          {collection.map((art) => (
            <ExhibitionCard key={art.id} {...art} />
          ))}
        </div>
      </section>
    </main>
  );
}
