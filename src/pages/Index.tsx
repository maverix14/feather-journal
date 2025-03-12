
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import Header from "@/components/Header";
import EntryCard, { EntryProps } from "@/components/EntryCard";
import EntryCardSkeleton from "@/components/EntryCardSkeleton";
import { journalService, JournalEntry } from "@/services/journalService";
import { MoodType } from "@/components/MoodSelector";

const Index = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await journalService.getEntries();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to convert journal entry to EntryProps
  const mapEntryToProps = (entry: JournalEntry): EntryProps => {
    // Ensure mood is of type MoodType or null
    const typedMood: MoodType = entry.mood as MoodType;
    
    // Ensure media has the correct type
    const typedMedia = entry.media.map(m => ({
      type: m.type as "photo" | "video" | "audio" | "gallery",
      url: m.url
    }));

    return {
      id: entry.id,
      title: entry.title,
      date: new Date(entry.date),
      content: entry.content,
      mood: typedMood,
      favorite: entry.favorite,
      media: typedMedia,
      kickCount: entry.kick_count,
      isShared: entry.is_shared
    };
  };

  return (
    <div className="container mx-auto max-w-md px-4 pb-24">
      <Header />

      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism"
        />
      </div>

      <div className="space-y-4 mt-6">
        {loading ? (
          // Skeleton loaders while fetching
          Array.from({ length: 3 }).map((_, index) => (
            <EntryCardSkeleton key={index} />
          ))
        ) : filteredEntries.length > 0 ? (
          // Render entries
          filteredEntries.map((entry) => (
            <Link to={`/entry/${entry.id}`} key={entry.id}>
              <EntryCard entry={mapEntryToProps(entry)} />
            </Link>
          ))
        ) : (
          // No entries found
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm.length > 0
                ? "No entries match your search"
                : "Start your journaling journey by adding your first entry"}
            </p>
            
            {searchTerm.length === 0 && (
              <Link 
                to="/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-morphism"
              >
                <PlusCircle className="w-5 h-5" />
                Add your first entry
              </Link>
            )}
          </div>
        )}
      </div>

      <Link
        to="/new"
        className="fixed right-4 bottom-20 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
      >
        <PlusCircle className="w-6 h-6 text-primary-foreground" />
      </Link>
    </div>
  );
};

export default Index;
