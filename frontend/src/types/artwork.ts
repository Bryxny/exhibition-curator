export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  source: string;
  period?: string | null;
  medium?: string | null;
  objectDate?: string | null;
  dimensions?: string | null;
  culture?: string | null;
  department?: string | null;
  classification?: string | null;
  rightsAndReproduction?: string | null;
}
