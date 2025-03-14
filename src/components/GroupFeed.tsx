
import React, { useState, useEffect } from "react";
import GroupEntryCard, { GroupEntryProps } from "./GroupEntryCard";
import { Button } from "./ui/button";
import { UserPlus, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { getAllEntries } from "@/lib/journalStorage";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GroupFeedProps {
  group: {
    id: string;
    name: string;
    memberCount: number;
  };
  onBack: () => void;
}

const GroupFeed: React.FC<GroupFeedProps> = ({ group, onBack }) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<GroupEntryProps[]>([]);
  const [email, setEmail] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  
  useEffect(() => {
    // In a real app, this would fetch shared entries for this group from the database
    // For now, we'll use localStorage entries that are marked as shared
    const allEntries = getAllEntries();
    const sharedEntries = allEntries
      .filter(entry => entry.isShared)
      .map(entry => ({
        id: `group-${group.id}-entry-${entry.id}`,
        entryId: entry.id,
        title: entry.title,
        content: entry.content,
        date: new Date(entry.date),
        media: entry.media,
        mood: entry.mood,
        sharedBy: "You", // In a real app, this would be the user's name
        comments: [],
        likes: []
      }));
    
    setEntries(sharedEntries);
  }, [group.id]);
  
  const handleInvite = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send an invitation email
    toast({
      title: "Invitation sent",
      description: `Invitation has been sent to ${email}`
    });
    
    setEmail("");
    setInviteDialogOpen(false);
  };
  
  const handleGenerateLink = () => {
    // Generate a fake invite link
    const link = `https://app.example.com/join-group/${group.id}/${Date.now()}`;
    setInviteLink(link);
    
    // In a real app, this would generate a unique invite link
    toast({
      title: "Link generated",
      description: "Share this link to invite people to your group"
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copied",
      description: "Invite link copied to clipboard"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-medium">{group.name}</h2>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setInviteDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-xs">Invite</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => {
              setLinkDialogOpen(true);
              handleGenerateLink();
            }}
          >
            <LinkIcon className="w-4 h-4" />
            <span className="text-xs">Share Link</span>
          </Button>
        </div>
      </div>
      
      {entries.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No shared entries in this group yet.</p>
          <p className="text-sm mt-2">
            Go to your journal and share some memories with this group!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <GroupEntryCard 
              key={entry.id} 
              entry={entry}
              currentUser="You" // In a real app, this would be the user's ID
            />
          ))}
        </div>
      )}
      
      {/* Invite member dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite to {group.name}</DialogTitle>
            <DialogDescription>
              Send an email invitation to join your private group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share link dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Group Link</DialogTitle>
            <DialogDescription>
              Share this link to invite people to your {group.name} group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="text-xs"
                />
              </div>
              <Button type="button" size="sm" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link will give access to your private group. Only share with people you trust.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupFeed;
