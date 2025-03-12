
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MoreVertical, Share, Trash2, Edit, BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
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

interface EntryActionsProps {
  id: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onDeleteEntry: () => void;
}

const EntryActions: React.FC<EntryActionsProps> = ({
  id,
  isFavorited,
  onToggleFavorite,
  onDeleteEntry,
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFavorite}
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/edit/${id}`)}>
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
              onClick={onDeleteEntry}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EntryActions;
