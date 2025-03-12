
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, MoreVertical, Share, Trash2, Edit, BookmarkPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AudioPlayer from "@/components/AudioPlayer";
import EntryHeading from "@/components/EntryHeading";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { journalService, JournalEntry } from "@/services/journalService";

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      <div className="sticky top-0 z-10 flex items-center justify-between py-4 bg-background">
        <Link to="/" className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center"
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors", 
                isFavorited ? "fill-primary text-primary" : ""
              )} 
            />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center">
                <MoreVertical className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism border-none">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/edit/${entry.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BookmarkPlus className="mr-2 h-4 w-4" />
                <span>Save to wallet</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive" 
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <article className="mt-6 space-y-6">
        <EntryHeading
          title={entry.title}
          date={new Date(entry.date)}
          mood={entry.mood}
          kickCount={entry.kick_count}
        />
        
        {entry.media && entry.media.length > 0 && (
          <div className="space-y-4">
            {entry.media.map((media, index) => {
              if (media.type === "photo" || media.type === "gallery") {
                return (
                  <div key={index} className="mt-4 rounded-lg overflow-hidden">
                    <img 
                      src={media.url} 
                      alt={`Attachment ${index + 1}`}
                      className="w-full object-cover" 
                    />
                  </div>
                );
              }
              
              if (media.type === "audio") {
                return (
                  <AudioPlayer 
                    key={index}
                    audioUrl={media.url} 
                    transcript="Audio recording" 
                  />
                );
              }
              
              return null;
            })}
          </div>
        )}
        
        <div className="mt-6 whitespace-pre-wrap">
          {entry.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass-morphism border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEntry}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EntryDetail;
