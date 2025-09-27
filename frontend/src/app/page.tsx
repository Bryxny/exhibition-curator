"use client";

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import ArtworkGrid from "../components/ArtworkGrid";

export default function Home() {
  const [query, setQuery] = useState("painting");

  return (
    <div>
      <SearchBar setQuery={setQuery} />
      <ArtworkGrid query={query} />
    </div>
  );
}
