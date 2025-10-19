"use client";

import type { Metadata } from "next";
import "./globals.css";
import { CollectionProvider } from "../context/CollectionContext";
import { ArtworksProvider } from "@/context/ArtworksContext";

const metadata: Metadata = {
  title: "Frame & Curate",
  description: "Curate and display artworks from museums worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ArtworksProvider>
          <CollectionProvider>{children}</CollectionProvider>
        </ArtworksProvider>
      </body>
    </html>
  );
}
