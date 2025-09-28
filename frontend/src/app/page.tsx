"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ArtworkGrid from "../components/ArtworkGrid";

export default function ArtExhibition() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("van gogh");

  return (
    <div>
      <SearchBar setTitle={setTitle} setArtist={setArtist} />
      <ArtworkGrid title={title} artist={artist} />
    </div>
  );
}
