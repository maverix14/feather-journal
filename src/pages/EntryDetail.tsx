
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import EntryHeading from "@/components/EntryHeading";
import EntryActions from "@/components/EntryActions";
import EntryContent from "@/components/EntryContent";
import HeaderNav from "@/components/HeaderNav";
import { journalService, JournalEntry } from "@/services/journalService";
import { MoodType } from "@/components/MoodSelector";

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;
      
      try {
        const data = await journalService.getEntry(id);
        if (data) {
          setEntry(data);
          setIsFavorited(data.favorite);
        } else {
          toast({
            title: "Entry not found",
            description: "The journal entry you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
        toast({
          title: "Error loading entry",
          description: "There was a problem loading this journal entry",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    
    try {
      const updatedEntry = await journalService.toggleFavorite(id);
      if (updatedEntry) {
        setIsFavorited(updatedEntry.favorite);
        toast({
          title: updatedEntry.favorite ? "Added to favorites" : "Removed from favorites",
          description: updatedEntry.favorite 
            ? "This entry has been added to your favorites" 
            : "This entry has been removed from your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Action failed",
        description: "There was a problem updating this entry",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async () => {
    if (!id) return;
    
    try {
      const success = await journalService.deleteEntry(id);
      if (success) {
        toast({
          title: "Entry deleted",
          description: "Your journal entry has been deleted",
        });
        navigate("/");
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Delete failed",
        description: "There was a problem deleting this entry",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 pb-24 animate-pulse">
        <div className="h-8 w-40 bg-muted-foreground/30 rounded mb-6 mt-4"></div>
        <div className="h-4 w-full bg-muted-foreground/30 rounded mb-2"></div>
        <div className="h-4 w-3/4 bg-muted-foreground/30 rounded mb-4"></div>
        <div className="h-24 w-full bg-muted-foreground/20 rounded mb-6"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container max-w-md mx-auto px-4 pb-24 text-center">
        <p className="text-muted-foreground">Entry not found</p>
        <Link to="/" className="text-primary underline mt-2 block">
          Return to your journal
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pb-24">
      <HeaderNav>
        <EntryActions
          id={entry.id}
          isFavorited={isFavorited}
          onToggleFavorite={handleToggleFavorite}
          onDeleteEntry={handleDeleteEntry}
        />
      </HeaderNav>

      <div className="mt-6">
        <EntryHeading
          title={entry.title}
          date={new Date(entry.date)}
          mood={entry.mood as MoodType}
          kickCount={entry.kick_count}
        />
        
        <EntryContent 
          content={entry.content}
          media={entry.media}
        />
      </div>
    </div>
  );
};

export default EntryDetail;
