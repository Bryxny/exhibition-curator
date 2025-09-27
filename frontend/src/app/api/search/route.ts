import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "painting";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

  try {
    const searchRes = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(query)}`
    );
    if (!searchRes.ok)
      throw new Error(`Search API failed: ${searchRes.status}`);

    const data = await searchRes.json();
    const objectIDs: number[] = Array.isArray(data.objectIDs)
      ? data.objectIDs
      : [];
    if (!objectIDs.length) return NextResponse.json([]);

    const results: any[] = [];

    for (const id of objectIDs) {
      if (results.length >= limit) break;

      const objRes = await fetch(`${API_BASE}/objects/${id}`);
      if (!objRes.ok) continue;

      const obj = await objRes.json();
      if (!obj.primaryImageSmall && !obj.primaryImage) continue;

      results.push({
        objectID: obj.objectID,
        title: obj.title,
        artistDisplayName: obj.artistDisplayName || "Unknown Artist",
        primaryImage: obj.primaryImageSmall || obj.primaryImage,
      });
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
