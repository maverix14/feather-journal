
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Define types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  favorite: boolean;
  mood?: string;
  kick_count?: number;
  is_shared: boolean;
  media: Array<{
    type: string;
    url: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

// Type for Supabase JSON conversion
type SupabaseEntry = Omit<JournalEntry, 'media'> & {
  media: any;
};

// Local storage key
const JOURNAL_ENTRIES_KEY = 'journal_entries';

// Get entries from local storage
const getEntriesFromLocalStorage = (): JournalEntry[] => {
  const entriesJson = localStorage.getItem(JOURNAL_ENTRIES_KEY);
  return entriesJson ? JSON.parse(entriesJson) : [];
};

// Save entries to local storage
const saveEntriesToLocalStorage = (entries: JournalEntry[]) => {
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));
};

// Convert Supabase entry to JournalEntry
const convertSupabaseEntry = (entry: any): JournalEntry => {
  return {
    ...entry,
    media: Array.isArray(entry.media) ? entry.media : []
  };
};

// Service functions
export const journalService = {
  // Get all entries (combines local and remote)
  getEntries: async (): Promise<JournalEntry[]> => {
    const { isAuthenticated, user } = useAuth();
    
    if (isAuthenticated && user) {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        return data ? data.map(convertSupabaseEntry) : [];
      } catch (error) {
        console.error('Error fetching entries from Supabase:', error);
        // Fallback to local storage if remote fetch fails
        return getEntriesFromLocalStorage();
      }
    } else {
      // Guest mode - use local storage
      return getEntriesFromLocalStorage();
    }
  },
  
  // Get a single entry by id
  getEntry: async (id: string): Promise<JournalEntry | null> => {
    const { isAuthenticated, user } = useAuth();
    
    if (isAuthenticated && user) {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        return data ? convertSupabaseEntry(data) : null;
      } catch (error) {
        console.error('Error fetching entry from Supabase:', error);
        
        // Fallback to local storage
        const entries = getEntriesFromLocalStorage();
        return entries.find(entry => entry.id === id) || null;
      }
    } else {
      // Guest mode - use local storage
      const entries = getEntriesFromLocalStorage();
      return entries.find(entry => entry.id === id) || null;
    }
  },
  
  // Create a new entry
  createEntry: async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry> => {
    const { isAuthenticated, user } = useAuth();
    const now = new Date().toISOString();
    
    // Create new entry with ID and timestamps
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      created_at: now,
      updated_at: now
    };
    
    if (isAuthenticated && user) {
      try {
        // Save to Supabase
        const { data, error } = await supabase
          .from('journal_entries')
          .insert({
            ...newEntry,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data ? convertSupabaseEntry(data) : newEntry;
      } catch (error) {
        console.error('Error creating entry in Supabase:', error);
        
        // Fallback to local storage
        const entries = getEntriesFromLocalStorage();
        entries.unshift(newEntry);
        saveEntriesToLocalStorage(entries);
        return newEntry;
      }
    } else {
      // Guest mode - use local storage
      const entries = getEntriesFromLocalStorage();
      entries.unshift(newEntry);
      saveEntriesToLocalStorage(entries);
      return newEntry;
    }
  },
  
  // Update an existing entry
  updateEntry: async (id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> => {
    const { isAuthenticated, user } = useAuth();
    
    // Add updated timestamp
    updates.updated_at = new Date().toISOString();
    
    if (isAuthenticated && user) {
      try {
        // Update in Supabase
        const { data, error } = await supabase
          .from('journal_entries')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data ? convertSupabaseEntry(data) : null;
      } catch (error) {
        console.error('Error updating entry in Supabase:', error);
        
        // Fallback to local storage
        const entries = getEntriesFromLocalStorage();
        const index = entries.findIndex(entry => entry.id === id);
        
        if (index !== -1) {
          entries[index] = { ...entries[index], ...updates };
          saveEntriesToLocalStorage(entries);
          return entries[index];
        }
        return null;
      }
    } else {
      // Guest mode - use local storage
      const entries = getEntriesFromLocalStorage();
      const index = entries.findIndex(entry => entry.id === id);
      
      if (index !== -1) {
        entries[index] = { ...entries[index], ...updates };
        saveEntriesToLocalStorage(entries);
        return entries[index];
      }
      return null;
    }
  },
  
  // Delete an entry
  deleteEntry: async (id: string): Promise<boolean> => {
    const { isAuthenticated, user } = useAuth();
    
    if (isAuthenticated && user) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error deleting entry from Supabase:', error);
        
        // Fallback to local storage
        const entries = getEntriesFromLocalStorage();
        const filteredEntries = entries.filter(entry => entry.id !== id);
        saveEntriesToLocalStorage(filteredEntries);
        return entries.length !== filteredEntries.length;
      }
    } else {
      // Guest mode - use local storage
      const entries = getEntriesFromLocalStorage();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      saveEntriesToLocalStorage(filteredEntries);
      return entries.length !== filteredEntries.length;
    }
  },
  
  // Toggle favorite status
  toggleFavorite: async (id: string): Promise<JournalEntry | null> => {
    const entry = await journalService.getEntry(id);
    if (!entry) return null;
    
    return journalService.updateEntry(id, { favorite: !entry.favorite });
  },
  
  // Sync local entries to Supabase (called on login)
  syncLocalEntriesToSupabase: async (userId: string): Promise<void> => {
    const localEntries = getEntriesFromLocalStorage();
    
    if (localEntries.length === 0) return;
    
    // Prepare entries for Supabase
    const entriesToSync = localEntries.map(entry => ({
      ...entry,
      user_id: userId
    }));
    
    try {
      // Upsert to Supabase (insert if not exists, update if exists)
      const { error } = await supabase
        .from('journal_entries')
        .upsert(entriesToSync, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Clear local storage after successful sync
      // We don't clear here to keep as backup - instead we'll use Supabase as primary source
      console.log('Successfully synced local entries to Supabase');
    } catch (error) {
      console.error('Error syncing local entries to Supabase:', error);
    }
  }
};
