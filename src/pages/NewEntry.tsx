
import React, { useState, useEffect } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import EntryTitleInput from "@/components/EntryTitleInput";
import MoodSelector from "@/components/MoodSelector";
import AttachmentHandler, { AttachmentType } from "@/components/AttachmentHandler";
import BabyKickTracker from "@/components/BabyKickTracker";
import SharingToggle from "@/components/SharingToggle";
import { journalService } from "@/services/journalService";

const NewEntry = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [kickCount, setKickCount] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [attachments, setAttachments] = useState<{ type: AttachmentType; url: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please add a title for your journal entry",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newEntry = await journalService.createEntry({
        title,
        content,
        date: new Date().toISOString(),
        favorite: false,
        mood,
        kick_count: kickCount,
        is_shared: isShared,
        media: attachments,
      });

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully",
      });
      
      navigate(`/entry/${newEntry.id}`);
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKickCountChange = (count: number) => {
    setKickCount(count);
  };

  // Handle attachments
  const handleAttachmentsChange = (newAttachments: { type: AttachmentType; url: string }[]) => {
    setAttachments(newAttachments);
  };

  return (
    <div className="container max-w-md mx-auto px-4 pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between py-4 bg-background">
        <Link to="/" className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-morphism disabled:opacity-50"
        >
          {isSaving ? (
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </button>
      </div>

      <div className="space-y-6 mt-4">
        <EntryTitleInput
          value={title}
          onChange={setTitle}
          placeholder="What's on your mind today?"
        />

        <AttachmentHandler
          content={content}
          setContent={setContent}
          onAttachmentsChange={handleAttachmentsChange}
        />

        <div className="pt-4 space-y-6">
          <MoodSelector value={mood} onChange={setMood} />
          
          <BabyKickTracker 
            kickCount={kickCount} 
            onKickCountChange={handleKickCountChange} 
          />
          
          <div className="pt-4">
            <SharingToggle value={isShared} onChange={setIsShared} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
