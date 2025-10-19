"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ExhibitionCard from "@/components/ExhibitionCard";
import Header from "@/components/Header";
import { SavedCollection } from "@/types/collection";
import Head from "next/head";

interface ExhibitionPageProps {
  params: Promise<{ id: string }>;
}

export default function SharedExhibitionPage({ params }: ExhibitionPageProps) {
  const { id } = use(params);
  const [exhibition, setExhibition] = useState<SavedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const original = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#292524";
    return () => {
      document.body.style.backgroundColor = original;
    };
  }, []);

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const docRef = doc(db, "share", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Exhibition not found");
          return;
        }

        setExhibition(docSnap.data() as SavedCollection);
      } catch (err) {
        console.error("Error fetching exhibition:", err);
        setError("Failed to load exhibition");
      } finally {
        setLoading(false);
      }
    };

    fetchExhibition();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-center text-zinc-300">
        <p className="text-lg mb-6">Loading Exhibition...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-900 text-center text-red-400">
        <p className="text-lg mb-6">{error}</p>
        <button
          className="px-5 py-2.5 bg-yellow text-zinc-900 rounded-md font-medium hover:bg-yellow-hover"
          onClick={() => router.push("/")}>
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{exhibition?.title || "Shared Exhibition"}</title>
      </Head>
      <main className="min-h-screen w-full bg-zinc-900 overflow-y-auto">
        <Header />
        <section className="max-w-7xl mx-auto p-10 pb-32">
          <h1 className="text-2xl sm:text-3xl text-center text-yellow font-medium mb-10">
            {exhibition!.title}
          </h1>
          {exhibition!.artworks.length ? (
            <div className="mt-6 columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-8">
              {exhibition!.artworks.map((art) => (
                <ExhibitionCard key={art.id} {...art} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No artworks in this exhibition.</p>
          )}
        </section>
      </main>
    </>
  );
}
