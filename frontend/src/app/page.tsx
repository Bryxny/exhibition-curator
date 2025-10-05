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
      <SearchBar setTitle={setTitle} setArtist={setArtist} />
      <ArtworkGrid title={title} artist={artist} />
    </div>
  );
}
