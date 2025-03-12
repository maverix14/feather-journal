
import React from "react";
import { Image, Music, Video } from "lucide-react";

export interface MediaItem {
  type: "photo" | "video" | "audio" | "gallery";
  url: string;
}

interface MediaPreviewProps {
  media: MediaItem[];
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ media }) => {
  if (!media || media.length === 0) return null;

  const firstMedia = media[0];

  if (firstMedia.type === "photo") {
    return (
      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
        <img src={firstMedia.url} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
          <Image className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  if (firstMedia.type === "gallery" && media.length > 0) {
    return (
      <div className="grid grid-cols-3 gap-1 mb-3">
        {media.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="relative h-20 rounded-lg overflow-hidden"
          >
            <img src={item.url} alt="" className="w-full h-full object-cover" />
            {index === 2 && media.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                +{media.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (firstMedia.type === "audio" && firstMedia.url) {
    return (
      <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2 mb-3 relative z-10">
        <Music className="w-4 h-4" />
        <span className="text-xs">Audio recording</span>
      </div>
    );
  }

  if (firstMedia.type === "video" && firstMedia.url) {
    return (
      <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-black/10 flex items-center justify-center">
        <Video className="w-8 h-8" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default MediaPreview;
