import { NextRequest, NextResponse } from "next/server";

const HARVARD_API_BASE = "https://api.harvardartmuseums.org";
const HARVARD_OBJECT_API = `${HARVARD_API_BASE}/object`;
const HARVARD_PERSON_API = `${HARVARD_API_BASE}/person`;
const MET_API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

async function fetchMetArtworks(
  title: string,
  artist: string,
  limit: number,
  offset: number
) {
  const artworks: any[] = [];

  let url;
  if (artist && !title) {
    url = `${MET_API_BASE}/search?artistOrCulture=true&q=${artist}`;
  } else {
    const query = [title, artist].filter(Boolean).join(" ");
    url = `${MET_API_BASE}/search?q=${query}`;
  }

  console.log(`fetching ${artist} ${title} from the met using ${url}`);

  const res = await fetch(url);
  if (!res.ok) return artworks;

  const data = await res.json();
  const objectIDs: number[] = Array.isArray(data.objectIDs)
    ? data.objectIDs
    : [];

  let index = offset;

  while (artworks.length < limit && index < objectIDs.length) {
    const id = objectIDs[index++];
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
      });
    } catch {
      continue;
    }
  }

  return artworks;
}

function matchesArtist(artistQuery: string, displayName: string) {
  const queryParts = artistQuery.toLowerCase().split(/\s+/);
  const name = displayName.toLowerCase();
  return queryParts.every((part) => name.includes(part));
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
        `${HARVARD_PERSON_API}?q=${artist}&apikey=${apiKey}`
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
    title ? `title=${title}` : "",
    personId ? `person=${personId}` : "",
  ].filter(Boolean);

  console.log(`fetching ${title} ${personId} from harvard`);

  const res = await fetch(`${HARVARD_OBJECT_API}?${params.join("&")}`);
  if (!res.ok) return artworks;

  const data = await res.json();
  for (const rec of data.records || []) {
    if (!rec.primaryimageurl) continue;

    artworks.push({
      id: `harvard-${rec.id}`,
      title: rec.title,
      artist: rec.people?.[0]?.name || "Unknown Artist",
      image: rec.primaryimageurl,
      source: "Harvard Art Museums",
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

    return NextResponse.json(artworks.slice(0, limit));
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Unable to fetch artworks" },
      { status: 500 }
    );
  }
}
