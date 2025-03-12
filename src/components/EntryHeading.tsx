
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";

interface EntryHeadingProps {
  handleSubmit?: (e: React.FormEvent) => void;
  title?: string;
  date?: Date;
  mood?: MoodType | string;
  kickCount?: number;
}

const EntryHeading: React.FC<EntryHeadingProps> = ({ 
  handleSubmit,
  title,
  date,
  mood,
  kickCount
}) => {
  const navigate = useNavigate();

  // Only render the save button if handleSubmit is provided
  const renderSaveButton = () => {
    if (!handleSubmit) return null;
    
    return (
      <button 
        onClick={handleSubmit}
        className={cn(
          "flex items-center justify-center rounded-lg p-3 transition-all duration-300",
          "bg-primary/10 glass-morphism hover:bg-primary/20"
        )}
      >
        <Save className="w-4 h-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Save</span>
      </button>
    );
  };

  return (
    <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
      <button 
        onClick={() => navigate(-1)} 
        className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      {title ? (
        <div className="flex-1 mx-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{format(date, "MMMM d, yyyy")}</span>
              {mood && <span className="ml-2">• Mood: {mood}</span>}
              {kickCount && kickCount > 0 && <span className="ml-2">• Kicks: {kickCount}</span>}
            </div>
          )}
        </div>
      ) : renderSaveButton()}
    </header>
  );
};

export default EntryHeading;
