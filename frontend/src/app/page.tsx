"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ArtworkGrid from "../components/ArtworkGrid";
import Cart from "@/components/Cart";

export default function ArtExhibition() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("van gogh");

  return (
    <div>
      <SearchBar setTitle={setTitle} setArtist={setArtist} />
      <Cart />
      <ArtworkGrid title={title} artist={artist} />
    </div>
  );
}
