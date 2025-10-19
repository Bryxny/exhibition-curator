import { NextRequest, NextResponse } from "next/server";

const HARVARD_API_BASE = "https://api.harvardartmuseums.org";
const HARVARD_OBJECT_API = `${HARVARD_API_BASE}/object`;
const HARVARD_PERSON_API = `${HARVARD_API_BASE}/person`;
const MET_API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

async function fetchJson(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function matchesArtist(artistQuery: string, displayName: string) {
  if (!artistQuery || !displayName) return false;
  const queryParts = normalizeName(artistQuery).split(/\s+/);
  const name = normalizeName(displayName);
  return queryParts.every((part) => name.includes(part));
}

function mapArtwork(obj: any, source: "Met" | "Harvard") {
  let imageUrl: string | null = null;
  let title: string | null = null;
  let artist: string | null = null;

  if (source === "Met") {
    imageUrl = obj.primaryImageSmall || obj.primaryImage;
    title = obj.title;
    artist = obj.artistDisplayName || "Unknown Artist";
    if (!imageUrl) return null;
    return {
      id: `met-${obj.objectID}`,
      title,
      artist,
      image: imageUrl,
      source: "The Metropolitan Museum of Art",
      period: obj.period || null,
      medium: obj.medium || null,
      objectDate: obj.objectDate || null,
      dimensions: obj.dimensions || null,
      culture: obj.culture || null,
      department: obj.department || null,
      classification: obj.classification || null,
    };
  } else if (source === "Harvard") {
    if (!obj.primaryimageurl) return null;
    title = obj.title;
    artist = obj.people?.[0]?.name || "Unknown Artist";
    imageUrl = obj.primaryimageurl;
    return {
      id: `harvard-${obj.id}`,
      title,
      artist,
      image: imageUrl,
      source: "Harvard Art Museums",
      period: obj.period || null,
      medium: obj.technique || obj.medium || null,
      objectDate: obj.dated || null,
      dimensions: obj.dimensions || null,
      culture: obj.culture || null,
      department: obj.division || null,
      classification: obj.classification || null,
    };
  }
  return null;
}

async function fetchMetArtworks(
  title: string,
  artist: string,
  limit: number,
  quick = false,
  retries = 2,
  retryDelay = 500
) {
  const query = [title, artist].filter(Boolean).join(" ");
  const searchUrl =
    artist && !title
      ? `${MET_API_BASE}/search?artistOrCulture=true&q=${encodeURIComponent(
          artist
        )}`
      : `${MET_API_BASE}/search?q=${encodeURIComponent(query)}`;

  async function fetchWithRetry(url: string) {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (res.status >= 500 || res.status === 0) {
            if (attempt <= retries) {
              console.warn(
                `Fetch failed (attempt ${attempt}) for ${url}. Retrying in ${retryDelay}ms`
              );
              await new Promise((r) => setTimeout(r, retryDelay));
            } else throw new Error(`Fetch failed with status ${res.status}`);
          } else {
            console.warn(`Skipping ${url}, status: ${res.status}`);
            return null;
          }
        } else {
          return await res.json();
        }
      } catch (err) {
        if (attempt <= retries) {
          console.warn(
            `Fetch error (attempt ${attempt}) for ${url}. Retrying in ${retryDelay}ms`
          );
          await new Promise((r) => setTimeout(r, retryDelay));
        } else {
          console.error(
            `Failed to fetch ${url} after ${retries + 1} attempts`,
            err
          );
          return null;
        }
      }
    }
  }

  const searchData = await fetchWithRetry(searchUrl);
  let objectIDs: number[] = Array.isArray(searchData?.objectIDs)
    ? searchData.objectIDs
    : [];
  if (!objectIDs.length) return [];

  const maxObjectIDs = quick ? limit : 1000;
  objectIDs = objectIDs.slice(0, maxObjectIDs);

  const artworks: any[] = [];
  const chunkSize = 50;

  for (
    let i = 0;
    i < objectIDs.length && artworks.length < limit;
    i += chunkSize
  ) {
    const chunk = objectIDs.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(async (id) => {
        const obj = await fetchWithRetry(`${MET_API_BASE}/objects/${id}`);
        if (!obj) return null;
        if (artist && !matchesArtist(artist, obj.artistDisplayName))
          return null;
        return mapArtwork(obj, "Met");
      })
    );
    artworks.push(...results.filter(Boolean));
    if (quick && artworks.length >= limit) break;
  }

  return artworks.slice(0, limit);
}

async function fetchHarvardArtworks(
  title: string,
  artist: string,
  limit: number,
  apiKey?: string,
  quick = false
) {
  if (!apiKey) return [];

  let personId: string | null = null;
  if (artist) {
    const peopleData = await fetchJson(
      `${HARVARD_PERSON_API}?q=${encodeURIComponent(artist)}&apikey=${apiKey}`
    );
    if (peopleData?.records?.length)
      personId = String(peopleData.records[0].id);
  }

  const params = [
    `size=${limit * (quick ? 1 : 5)}`,
    `apikey=${apiKey}`,
    title ? `title=${encodeURIComponent(title)}` : "",
    personId ? `person=${personId}` : "",
  ].filter(Boolean);

  const data = await fetchJson(`${HARVARD_OBJECT_API}?${params.join("&")}`);
  return (data?.records || [])
    .map((rec) => mapArtwork(rec, "Harvard"))
    .filter(Boolean)
    .slice(0, limit);
}

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title")?.trim() || "";
  const artist = req.nextUrl.searchParams.get("artist")?.trim() || "";
  const mode = req.nextUrl.searchParams.get("mode") || "quick";
  const limit = mode === "quick" ? 20 : 300;
  const quick = mode === "quick";
  const harvardKey = process.env.HARVARD_API_KEY;

  try {
    const metArtworks = await fetchMetArtworks(title, artist, limit, quick);
    const remainingLimit = quick
      ? Math.max(0, limit - metArtworks.length)
      : limit;
    const harvardArtworks = await fetchHarvardArtworks(
      title,
      artist,
      remainingLimit,
      harvardKey,
      quick
    );

    const artworks = [...metArtworks, ...harvardArtworks];
    return NextResponse.json(artworks.slice(0, limit));
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
