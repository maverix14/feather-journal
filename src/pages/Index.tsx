
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard from "@/components/EntryCard";
import { mockEntries } from "@/lib/journalData";

const Index = () => {
  const [entries] = useState(mockEntries);

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">My Journal</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">RECENT ENTRIES</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              className={`animate-scale-in transition-all delay-${index}`}
            />
          ))}
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Index;
