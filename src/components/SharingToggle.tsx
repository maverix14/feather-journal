
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Lock, Share2, Users, Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Define group type
export interface SharingGroup {
  id: string;
  name: string;
  memberCount: number;
}

interface SharingToggleProps {
  isShared: boolean;
  onShareChange: (shared: boolean, selectedGroups?: string[]) => void;
  className?: string;
  compact?: boolean;
}

const SharingToggle: React.FC<SharingToggleProps> = ({
  isShared,
  onShareChange,
  className,
  compact = false,
}) => {
  const { toast } = useToast();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<SharingGroup[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  
  // Load groups from localStorage
  useEffect(() => {
    const storedGroups = localStorage.getItem('innerCircleGroups');
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    } else {
      // Default groups if none exist
      const defaultGroups = [
        { id: "1", name: "Family", memberCount: 0 },
        { id: "2", name: "Friends", memberCount: 0 },
        { id: "3", name: "Partner", memberCount: 0 },
      ];
      setGroups(defaultGroups);
      localStorage.setItem('innerCircleGroups', JSON.stringify(defaultGroups));
    }
  }, []);

  // Save groups to localStorage when they change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('innerCircleGroups', JSON.stringify(groups));
    }
  }, [groups]);
  
  const handleToggleShare = () => {
    if (!isShared) {
      // If turning on sharing, open the popover
      // The actual share state change happens when groups are selected
    } else {
      // If turning off sharing, do it immediately
      onShareChange(false);
      setSelectedGroups([]);
    }
  };

  const handleGroupSelect = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };
  
  const handleShareConfirm = () => {
    if (selectedGroups.length === 0) {
      toast({
        title: "Select a group",
        description: "Please select at least one group to share with.",
        variant: "destructive",
      });
      return;
    }
    
    onShareChange(true, selectedGroups);
    
    toast({
      title: "Entry shared",
      description: `Your entry has been shared with ${selectedGroups.length} group(s).`,
    });
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (groups.length >= 4) {
      toast({
        title: "Maximum groups reached",
        description: "You can create up to 4 private groups",
        variant: "destructive",
      });
      return;
    }
    
    // Create new group
    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      memberCount: 0,
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setIsCreatingGroup(false);

    toast({
      title: "Group created",
      description: `Your "${newGroupName}" group has been created`,
    });
  };
  
  const removeGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    setSelectedGroups(selectedGroups.filter(groupId => groupId !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleToggleShare}
          className={cn(
            "flex items-center justify-between rounded-lg p-3 transition-all duration-300",
            className
          )}
          style={{
            backgroundColor: isShared ? "rgba(124, 58, 237, 0.1)" : "rgba(229, 231, 235, 0.8)",
          }}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isShared ? "bg-secondary/50" : "bg-background"
          )}>
            {isShared ? (
              <Share2 className="w-4 h-4 text-primary" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
          
          <span className="text-sm font-medium mr-3">
            {isShared ? "Shared" : "Private"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            Share with your groups
          </h4>
          
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center justify-between">
                <label className="flex items-center flex-1">
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={() => handleGroupSelect(group.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{group.name}</span>
                </label>
                <button 
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeGroup(group.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {groups.length < 4 && !isCreatingGroup ? (
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="w-full text-xs flex items-center justify-center py-1 px-2 border border-dashed border-muted-foreground/50 rounded-md text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-3 h-3 mr-1" /> Create new group
            </button>
          ) : null}
          
          {isCreatingGroup && (
            <div className="space-y-2">
              <Input
                placeholder="Group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateGroup} 
                  className="flex-1 h-7 text-xs"
                  size="sm"
                >
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingGroup(false);
                    setNewGroupName("");
                  }}
                  className="flex-1 h-7 text-xs"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleShareConfirm} 
            className="w-full"
            disabled={selectedGroups.length === 0}
          >
            {isShared ? "Update sharing" : "Share entry"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharingToggle;
