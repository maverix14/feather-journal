
import React from "react";
import AudioPlayer from "@/components/AudioPlayer";
import { MediaItem } from "./MediaPreview";

interface EntryContentProps {
  content: string;
  media?: MediaItem[];
}

const EntryContent: React.FC<EntryContentProps> = ({ content, media }) => {
  return (
    <article className="space-y-6">
      {media && media.length > 0 && (
        <div className="space-y-4">
          {media.map((mediaItem, index) => {
            if (mediaItem.type === "photo" || mediaItem.type === "gallery") {
              return (
                <div key={index} className="mt-4 rounded-lg overflow-hidden">
                  <img 
                    src={mediaItem.url} 
                    alt={`Attachment ${index + 1}`}
                    className="w-full object-cover" 
                  />
                </div>
              );
            }
            
            if (mediaItem.type === "audio") {
              return (
                <AudioPlayer 
                  key={index}
                  audioUrl={mediaItem.url} 
                  transcript="Audio recording" 
                />
              );
            }
            
            return null;
          })}
        </div>
      )}
      
      <div className="mt-6 whitespace-pre-wrap">
        {content.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};

export default EntryContent;
