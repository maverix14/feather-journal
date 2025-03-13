
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Play, Pause, Mic } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getEntry, toggleFavorite, JournalEntry } from "@/lib/journalStorage";
import { EntryProps } from "@/components/EntryCard";
import BottomBar from "@/components/BottomBar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MoodType } from "@/components/MoodSelector";
import BabyKickTracker from "@/components/BabyKickTracker";
import SharingToggle from "@/components/SharingToggle";
import AudioPlayer from "@/components/AudioPlayer";

const getMoodColor = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "#FEF7CD";
    case "content":
      return "#F2FCE2";
    case "neutral":
      return "#F1F0FB";
    case "sad":
      return "#D3E4FD";
    case "stressed":
      return "#FFDEE2";
    default:
      return "#FAFAFA";
    }
  };

const getMoodEmoji = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "😊";
    case "content":
      return "😌";
    case "neutral":
      return "😐";
    case "sad":
      return "😔";
    case "stressed":
      return "😰";
    default:
      return null;
    }
  };

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayingIndex, setAudioPlayingIndex] = useState<number | null>(null);
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [kickCount, setKickCount] = useState(0);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEntry = getEntry(id);
      if (foundEntry) {
        // Convert to EntryProps format for component
        const formattedEntry: EntryProps = {
          ...foundEntry,
          date: new Date(foundEntry.date), // Convert ISO string to Date
        };
        
        setEntry(formattedEntry);
        setIsFavorite(formattedEntry.favorite || false);
        setMood(formattedEntry.mood);
        setKickCount(formattedEntry.kickCount || 0);
        setIsShared(formattedEntry.isShared || false);
      } else {
        // Entry not found
        toast({
          title: "Error",
          description: "Journal entry not found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

  const handleToggleFavorite = () => {
    if (!id) return;
    
    const newFavoriteStatus = toggleFavorite(id);
    setIsFavorite(newFavoriteStatus);
    
    toast({
      title: newFavoriteStatus ? "Added to bookmarks" : "Removed from bookmarks",
      description: newFavoriteStatus ? "Entry added to your bookmarks" : "Entry removed from your bookmarks",
    });
  };

  const toggleAudioPlayback = (index: number) => {
    setAudioPlayingIndex(prev => prev === index ? null : index);
    setIsPlaying(prev => {
      if (audioPlayingIndex === index) {
        return !prev;
      }
      return true;
    });
  };

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">Loading entry...</div>
      </div>
    );
  }

  const cycleMood = () => {
    const moods: MoodType[] = ["happy", "content", "neutral", "sad", "stressed"];
    const currentIndex = moods.indexOf(mood || "neutral");
    const nextIndex = (currentIndex + 1) % moods.length;
    setMood(moods[nextIndex]);
  };

  const renderMedia = () => {
    if (!entry.media || entry.media.length === 0) return null;

    return (
      <div className="mt-6 mb-6 space-y-4">
        {entry.media.map((item, index) => {
          if (item.type === "photo" || item.type === "gallery") {
            return (
              <div key={index} className="rounded-xl overflow-hidden">
                <img src={item.url} alt={`Attachment ${index + 1}`} className="w-full max-h-80 object-cover" />
              </div>
            );
          }
          if (item.type === "audio") {
            return (
              <AudioPlayer 
                key={index}
                audioUrl={item.url} 
                transcript="Voice recording"
              />
            );
          }
          if (item.type === "video") {
            return (
              <div key={index} className="rounded-xl overflow-hidden relative bg-muted/30 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 rounded-full glass-morphism flex items-center justify-center">
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
                <video poster="/placeholder.svg" className="w-full h-full object-cover opacity-80" />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const moodColor = getMoodColor(mood);

  return (
    <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: moodColor }}>
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            <Bookmark className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-primary stroke-primary' : ''}`} />
          </button>
          <button 
            onClick={cycleMood}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            {mood && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full relative z-20 text-foreground" 
                    style={{ backgroundColor: getMoodColor(mood) }}>
                {getMoodEmoji(mood)}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className="animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-medium tracking-tight">{entry.title}</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(entry.date, { addSuffix: true })}
          </span>
        </div>
        
        {renderMedia()}
        
        <div className="prose max-w-none">
          <p className="whitespace-pre-line leading-relaxed">
            {entry.content}
          </p>
        </div>

        <div className="flex items-stretch justify-between gap-3 my-4">
          <SharingToggle 
            isShared={isShared} 
            onShareChange={setIsShared} 
            className="flex-1 h-full"
          />
          
          <BabyKickTracker 
            kickCount={kickCount} 
            onKickCountChange={setKickCount} 
            className="flex-1 h-full"
          />
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default EntryDetail;
