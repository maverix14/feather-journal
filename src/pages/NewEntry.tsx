
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomBar from "@/components/BottomBar";

const NewEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and content for your entry",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would save the entry here
    toast({
      title: "Success",
      description: "Your journal entry has been saved",
    });
    
    // Navigate back to home
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <div className="min-h-screen pb-24 px-4">
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg neo-shadow hover:neo-inset transition-all duration-300 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </header>
      
      <main className="animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Entry Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-medium tracking-tight bg-transparent border-none outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="h-px bg-border w-full"></div>
          </div>
          
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[300px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground"
          />
        </form>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default NewEntry;
