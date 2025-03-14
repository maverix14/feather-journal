
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featureFlags } from "@/config/features";
import { cn } from "@/lib/utils";
import { Plus, Users, Mail, Link, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Inner Circle (formerly Shared) component
const InnerCircle = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const { isAuthenticated, isGuestMode } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration purposes
  useEffect(() => {
    // In a real app, this would fetch from a database
    const mockGroups = [
      { id: "1", name: "Family", memberCount: 5, unreadCount: 2 },
      { id: "2", name: "Friends", memberCount: 8, unreadCount: 0 },
      { id: "3", name: "Partner", memberCount: 1, unreadCount: 1 },
    ];
    
    setGroups(mockGroups);
  }, []);

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

    // In a real app, this would save to a database
    const newGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      memberCount: 1,
      unreadCount: 0,
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setIsCreatingGroup(false);

    toast({
      title: "Group created",
      description: `Your "${newGroupName}" group has been created`,
    });
  };

  const renderGroupCreation = () => {
    if (!isCreatingGroup) {
      return (
        <Button 
          onClick={() => setIsCreatingGroup(true)} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      );
    }

    return (
      <div className="space-y-3">
        <Input
          placeholder="Group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateGroup} 
            className="flex-1"
          >
            Create
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreatingGroup(false);
              setNewGroupName("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  if (featureFlags.sharedEnabled && (isAuthenticated || isGuestMode)) {
    return (
      <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}>
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Inner Circle</h1>
          
          <div className="space-y-1 mb-8 animate-fade-in">
            <h2 className="text-sm text-muted-foreground font-medium">YOUR PRIVATE GROUPS</h2>
            <div className="h-px bg-border w-full"></div>
          </div>

          <div className="space-y-4">
            {groups.map(group => (
              <Card key={group.id} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {group.name}
                    {group.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {group.unreadCount} new
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Users className="w-3 h-3 mr-1" /> 
                    {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Invite
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Link className="w-3 h-3" />
                      Share Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {groups.length < 4 && (
              <Card className="animate-fade-in shadow-md">
                <CardContent className="p-4">
                  {renderGroupCreation()}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-8">
            <AdCard variant="medium" />
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}>
      <Header />

      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Inner Circle</h1>

        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">COMING SOON</h2>
          <div className="h-px bg-border w-full"></div>
        </div>

        <div className="rounded-xl neo-shadow p-8 text-center animate-fade-in">
          <h3 className="text-xl font-medium mb-4">Private Groups</h3>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! You'll be able to share selected journal entries with friends and family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Group Management</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Create private groups</li>
                <li>• Invite friends and family</li>
                <li>• Manage member permissions</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Sharing Options</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Share specific entries</li>
                <li>• Control privacy settings</li>
                <li>• Receive comments and reactions</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <AdCard variant="medium" />
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default InnerCircle;
