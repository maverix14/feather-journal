
import React from "react";
import { Settings, User } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("py-4 px-4 mb-6 flex items-center justify-between animate-slide-down", className)}>
      <Logo />
      
      <div className="flex items-center space-x-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full neo-shadow hover:neo-inset transition-all duration-300">
          <Settings className="w-5 h-5" />
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full neo-shadow hover:neo-inset transition-all duration-300 overflow-hidden">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
