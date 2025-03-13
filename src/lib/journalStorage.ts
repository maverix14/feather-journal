
import { v4 as uuidv4 } from 'uuid';
import { AttachmentType } from "@/components/AttachmentHandler";
import { MoodType } from "@/components/MoodSelector";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO string for localStorage compatibility
  favorite: boolean;
  media: {
    type: AttachmentType;
    url: string;
  }[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
}

// Key for localStorage
const JOURNAL_ENTRIES_KEY = 'pregnancyJournal_entries';

// Get all entries
export const getAllEntries = (): JournalEntry[] => {
  const entriesJson = localStorage.getItem(JOURNAL_ENTRIES_KEY);
  if (!entriesJson) return [];
  
  try {
    const entries = JSON.parse(entriesJson);
    // Sort by date, newest first
    return entries.sort((a: JournalEntry, b: JournalEntry) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error parsing journal entries:', error);
    return [];
  }
};

// Get a single entry by ID
export const getEntry = (id: string): JournalEntry | undefined => {
  const entries = getAllEntries();
  return entries.find(entry => entry.id === id);
};

// Save a new entry
export const saveEntry = (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
  const entries = getAllEntries();
  const newEntry: JournalEntry = {
    ...entry,
    id: uuidv4(),
    date: new Date().toISOString(), // Ensure date is stored as string
  };
  
  // Make sure we have default values for optional fields
  if (newEntry.mood === undefined) newEntry.mood = null;
  if (newEntry.kickCount === undefined) newEntry.kickCount = 0;
  if (newEntry.isShared === undefined) newEntry.isShared = false;
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify([newEntry, ...entries]));
  return newEntry;
};

// Update an existing entry
export const updateEntry = (updatedEntry: JournalEntry): JournalEntry => {
  const entries = getAllEntries();
  const updatedEntries = entries.map(entry => 
    entry.id === updatedEntry.id ? { ...updatedEntry } : entry
  );
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
  return updatedEntry;
};

// Delete an entry
export const deleteEntry = (id: string): boolean => {
  const entries = getAllEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(filteredEntries));
  return true;
};

// Toggle favorite status
export const toggleFavorite = (id: string): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    favorite: !entry.favorite 
  };
  
  updateEntry(updatedEntry);
  return updatedEntry.favorite;
};

// Get favorite entries
export const getFavorites = (): JournalEntry[] => {
  const entries = getAllEntries();
  return entries.filter(entry => entry.favorite);
};

// Update mood
export const updateMood = (id: string, mood: MoodType): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    mood 
  };
  
  updateEntry(updatedEntry);
  return true;
};

// Update sharing status
export const updateSharing = (id: string, isShared: boolean): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    isShared 
  };
  
  updateEntry(updatedEntry);
  return true;
};

// Update kick count
export const updateKickCount = (id: string, kickCount: number): boolean => {
  const entry = getEntry(id);
  if (!entry) return false;
  
  const updatedEntry = { 
    ...entry, 
    kickCount 
  };
  
  updateEntry(updatedEntry);
  return true;
};
