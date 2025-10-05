import { NextRequest, NextResponse } from "next/server";

const HARVARD_API_BASE = "https://api.harvardartmuseums.org";
const HARVARD_OBJECT_API = `${HARVARD_API_BASE}/object`;
const HARVARD_PERSON_API = `${HARVARD_API_BASE}/person`;
const MET_API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

function matchesArtist(artistQuery: string, displayName: string) {
  const queryParts = artistQuery.toLowerCase().split(/\s+/);
  const name = (displayName || "").toLowerCase();
  return queryParts.every((part) => name.includes(part));
}

async function fetchMetArtworks(
  title: string,
  artist: string,
  limit: number,
  offset: number
) {
  const artworks: any[] = [];

  const url =
    artist && !title
      ? `${MET_API_BASE}/search?artistOrCulture=true&q=${artist}`
      : `${MET_API_BASE}/search?q=${[title, artist].filter(Boolean).join(" ")}`;

  console.log(`[Met] Fetching objects: ${url}`);

  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("[Met] Search request failed");
      return artworks;
    }
    data = await res.json();
  } catch (err) {
    console.log("[Met] Search request error", err);
    return artworks;
  }

  const objectIDs: number[] = Array.isArray(data.objectIDs)
    ? data.objectIDs
    : [];
  const chunk = objectIDs.slice(offset, offset + limit * 3);

  for (const id of chunk) {
    try {
      const objRes = await fetch(`${MET_API_BASE}/objects/${id}`);
      if (!objRes.ok) continue;

      const obj = await objRes.json();
      const imageUrl = obj.primaryImageSmall || obj.primaryImage;
      if (!imageUrl) continue;

      if (artist && !matchesArtist(artist, obj.artistDisplayName)) continue;

      artworks.push({
        id: `met-${obj.objectID}`,
        title: obj.title,
        artist: obj.artistDisplayName || "Unknown Artist",
        image: imageUrl,
        source: "The Met",
        period: obj.period || null,
        medium: obj.medium || null,
        objectDate: obj.objectDate || null,
        dimensions: obj.dimensions || null,
        culture: obj.culture || null,
        department: obj.department || null,
        classification: obj.classification || null,
        rightsAndReproduction: obj.rightsAndReproduction || null,
      });

      if (artworks.length >= limit) break;
    } catch {
      continue;
    }
  }

  return artworks;
}

async function fetchHarvardArtworks(
  title: string,
  artist: string,
  limit: number,
  offset: number,
  apiKey?: string
) {
  const artworks: any[] = [];
  if (!apiKey) return artworks;

  const page = Math.floor(offset / limit) + 1;
  let personId: string | null = null;

  if (artist) {
    try {
      const peopleRes = await fetch(
        `${HARVARD_PERSON_API}?q=${encodeURIComponent(artist)}&apikey=${apiKey}`
      );
      if (peopleRes.ok) {
        const peopleData = await peopleRes.json();
        if (peopleData.records?.length > 0) {
          personId = String(peopleData.records[0].id);
        }
      }
    } catch {}
  }

  const params = [
    `size=${limit}`,
    `page=${page}`,
    `apikey=${apiKey}`,
    title ? `title=${encodeURIComponent(title)}` : "",
    personId ? `person=${personId}` : "",
  ].filter(Boolean);

  const url = `${HARVARD_OBJECT_API}?${params.join("&")}`;
  console.log(`[Harvard] Fetching objects: ${url}`);

  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("[Harvard] Request failed");
      return artworks;
    }
    data = await res.json();
  } catch (err) {
    console.log("[Harvard] Request error", err);
    return artworks;
  }

  for (const rec of data.records || []) {
    if (!rec.primaryimageurl) continue;

    artworks.push({
      id: `harvard-${rec.id}`,
      title: rec.title,
      artist: rec.people?.[0]?.name || "Unknown Artist",
      image: rec.primaryimageurl,
      source: "Harvard Art Museums",
      period: rec.period || null,
      medium: rec.technique || rec.medium || null,
      objectDate: rec.dated || null,
      dimensions: rec.dimensions || null,
      culture: rec.culture || null,
      department: rec.division || null,
      creditLine: rec.creditline || null,
      classification: rec.classification || null,
    });

    if (artworks.length >= limit) break;
  }

  return artworks;
}

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title")?.trim() || "";
  const artist = req.nextUrl.searchParams.get("artist")?.trim() || "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0");
  const harvardKey = process.env.HARVARD_API_KEY;

  console.log(`Starting search for title="${title}" artist="${artist}"`);

  try {
    let artworks: any[] = [];

    artworks = await fetchMetArtworks(title, artist, limit, offset);

    if (artworks.length < limit) {
      const remaining = limit - artworks.length;
      const harvard = await fetchHarvardArtworks(
        title,
        artist,
        remaining,
        offset,
        harvardKey
      );
      artworks.push(...harvard);
    }

    console.log(`Returning total ${artworks.length} artworks`);
    return NextResponse.json(artworks.slice(0, limit));
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Unable to fetch artworks" },
      { status: 500 }
    );
  }
}
