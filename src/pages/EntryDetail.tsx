
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getEntry } from "@/lib/journalData";
import { EntryProps } from "@/components/EntryCard";
import BottomBar from "@/components/BottomBar";

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEntry = getEntry(id);
      if (foundEntry) {
        setEntry(foundEntry);
        setIsFavorite(foundEntry.favorite || false);
      }
    }
  }, [id]);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">Loading entry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4">
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-primary stroke-primary' : ''}`} />
        </button>
      </header>
      
      <main className="animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-medium tracking-tight">{entry.title}</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(entry.date, { addSuffix: true })}
          </span>
        </div>
        
        <div className="prose max-w-none">
          <p className="whitespace-pre-line leading-relaxed">
            {entry.content}
          </p>
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default EntryDetail;
