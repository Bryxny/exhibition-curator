import { NextRequest, NextResponse } from "next/server";

const HARVARD_API = "https://api.harvardartmuseums.org/object";
const MET_API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title") || "";
  const artist = req.nextUrl.searchParams.get("artist") || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
  const harvardKey = process.env.HARVARD_API_KEY;

  try {
    const artworks: any[] = [];
    const seenIds = new Set<string>();

    // Met Museum

    const metRes = await fetch(`${MET_API_BASE}/search?q=${title || artist}`);
    const metData = await metRes.json();
    const objectIDs: number[] = Array.isArray(metData.objectIDs)
      ? metData.objectIDs
      : [];

    for (const id of objectIDs.slice(offset, offset + limit)) {
      const objRes = await fetch(`${MET_API_BASE}/objects/${id}`);
      if (!objRes.ok) continue;
      const obj = await objRes.json();
      const imageUrl = obj.primaryImageSmall || obj.primaryImage;
      if (!imageUrl) continue;
      artworks.push({
        id: `met-${obj.objectID}`,
        title: obj.title,
        artist: obj.artistDisplayName || "Unknown Artist",
        image: obj.primaryImageSmall || obj.primaryImage,
        source: "The Met",
      });
    }

    // Harvard fallback

    const remaining = limit - artworks.length;
    if (remaining > 0 && harvardKey) {
      const harvardPage = Math.floor(offset / remaining) + 1;

      const harvardRes = await fetch(
        `${HARVARD_API}?person=${encodeURIComponent(
          artist
        )}&size=${remaining}&page=${harvardPage}&apikey=${harvardKey}`
      );

      if (harvardRes.ok) {
        const harvardData = await harvardRes.json();
        for (const rec of harvardData.records) {
          if (!rec.primaryimageurl) continue;
          const id = `harvard-${rec.id}`;
          if (seenIds.has(id)) continue;
          seenIds.add(id);
          artworks.push({
            id,
            title: rec.title,
            artist: rec.people?.[0]?.name || "Unknown Artist",
            image: rec.primaryimageurl,
            source: "Harvard Art Museums",
          });
        }
      }
    }

    return NextResponse.json(artworks.slice(0, limit));
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Unable to fetch artworks" },
      { status: 500 }
    );
  }
}
