"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ArtworkGrid from "../components/ArtworkGrid";
import Header from "@/components/Header";

export default function Home() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("van gogh");

  return (
    <div>
      <Header />
      <div className="m-10">
        <section className="text-center mt-18 mb-14 px-6">
          <h2 className="text-3xl font-semibold mb-2 text-zinc-600">
            Curate Your Own Exhibition
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Search artworks from our selection of museums. Click any piece to
            add it to your personal collection.
          </p>
        </section>
        <SearchBar setTitle={setTitle} setArtist={setArtist} />
        <ArtworkGrid title={title} artist={artist} />
      </div>
    </div>
  );
}
