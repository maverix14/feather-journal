
import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { featureFlags } from "@/config/features";
import { cn } from "@/lib/utils";

const Shared = () => {
  if (featureFlags.sharedEnabled) {
    // Render actual Shared component here
    return (
      <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}> {/* Apply Turquoise-grey hue */}
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Shared</h1>
          <div>{/* Actual Shared Content */}</div>
          <div className="mt-8">
            <AdCard variant="medium" />
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}> {/* Apply Turquoise-grey hue */}
      <Header />

      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Shared</h1>

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

export default Shared;
