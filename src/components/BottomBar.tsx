
import React from "react";
import { Feather, Heart, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BottomBarProps {
  className?: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ className }) => {
  const location = useLocation();
  
  return (
    <div className={cn("fixed bottom-6 left-0 right-0 max-w-sm mx-auto px-8 animate-slide-up", className)}>
      <nav className="h-16 rounded-full neo-shadow flex items-center justify-between px-8 relative">
        <Link to="/favorites" className="bottom-bar-icon">
          <Heart className={cn("w-6 h-6", location.pathname === "/favorites" ? "fill-primary stroke-primary" : "")} />
        </Link>
        
        <Link 
          to="/new" 
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground feather-button absolute left-1/2 -translate-x-1/2 -top-4 z-10"
        >
          <Feather className="w-6 h-6" />
        </Link>
        
        <Link to="/shared" className="bottom-bar-icon">
          <Users className={cn("w-6 h-6", location.pathname === "/shared" ? "fill-primary stroke-primary" : "")} />
        </Link>
      </nav>
    </div>
  );
};

export default BottomBar;
