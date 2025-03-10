
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard from "@/components/EntryCard";
import { getFavorites } from "@/lib/journalData";

const Favorites = () => {
  const [favorites] = useState(getFavorites());

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Favorites</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">YOUR FAVORITES</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((entry, index) => (
              <EntryCard 
                key={entry.id} 
                entry={entry} 
                className="transition-all"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                  animation: 'scale-in 0.3s ease-out forwards',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven't favorited any entries yet.</p>
          </div>
        )}
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Favorites;
