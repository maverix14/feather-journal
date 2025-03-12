
import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, HeartHandshake, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";
import MediaPreview, { MediaItem } from "./MediaPreview";
import EntryCardMood, { getMoodColor } from "./EntryCardMood";

export interface EntryProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  favorite: boolean;
  media: MediaItem[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
}

interface EntryCardProps {
  entry: EntryProps;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  className,
  onFavoriteToggle,
}) => {
  const {
    id,
    title,
    content,
    date,
    favorite,
    media,
    mood,
    isShared,
  } = entry;

  const moodColor = getMoodColor(mood);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <Link
      to={`/entry/${id}`}
      className={cn(
        "block neo-shadow rounded-xl p-4 transition-all hover:neo-inset animate-fade-in",
        className,
        moodColor && "relative overflow-hidden"
      )}
    >
      {moodColor && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: moodColor, opacity: 0.95 }}
        />
      )}
      
      <MediaPreview media={media} />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          onClick={handleFavoriteClick}
          className="group p-1.5 -mt-1 -mr-1"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-primary stroke-primary" : "group-hover:fill-primary/20"
            )}
          />
        </button>
      </div>

      <p className="text-muted-foreground line-clamp-2 mb-3 text-sm relative z-10">
        {content}
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground relative z-10">
        <div className="flex items-center">
          <span className="px-2 py-1 rounded-full glass-morphism flex items-center">
            {isShared ? (
              <HeartHandshake className="w-3 h-3 text-primary mr-1" />
            ) : (
              <Lock className="w-3 h-3 mr-1" />
            )}
            {format(date, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <EntryCardMood mood={mood} />
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;
