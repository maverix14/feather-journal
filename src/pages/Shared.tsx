
import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";

const Shared = () => {
  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Shared</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">SHARED WITH YOU</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="rounded-xl neo-shadow p-10 text-center animate-fade-in">
          <p className="text-muted-foreground mb-4">
            There are no shared entries yet.
          </p>
          <p className="text-sm">
            Shared entries from your friends will appear here.
          </p>
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Shared;
