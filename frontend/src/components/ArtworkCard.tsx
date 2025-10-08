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
      onClick={onClick}
      className={`
        relative rounded-lg p-2 cursor-pointer transition-all duration-300
        transform hover:scale-[1.02] hover:shadow-lg
  shadow-lg
        ${isSelected ? "ring-2 ring-yellow-600 border-transparent" : ""}
      `}>
      <img
        src={art.image || "/placeholder.png"}
        alt={art.title}
        className="w-full h-auto object-cover rounded-md mb-2 transition-transform duration-300 group-hover:scale-[1.02]"
      />

      <div className="text-center">
        <h1 className="text-sm font-semibold text-gray-900 truncate">
          {art.title || "Untitled"}
        </h1>
        <p className="text-xs text-gray-600">
          {art.artist || "Unknown Artist"}
        </p>
        <p className="text-[10px] text-gray-500 mt-1 italic">{art.source}</p>
      </div>
    </div>
  );
}
