import { Artwork } from "../types/artwork";

interface ArtworkCardProps {
  art: Artwork;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ArtworkCard({
  art,
  isSelected = false,
  onClick,
}: ArtworkCardProps) {
  return (
    <div
      className={`border rounded-lg p-2 relative cursor-pointer ${
        isSelected ? "border-blue-500 ring-2 ring-blue-400" : ""
      }`}
      onClick={onClick}
    >
      <h1 className="text-xl font-bold">{art.title}</h1>
      <p>{art.artist || "Unknown Artist"}</p>
      <img
        src={art.image || "/placeholder.png"}
        alt={art.title}
        className="w-full h-auto object-cover rounded"
      />
      <p>{art.source}</p>
    </div>
  );
}
