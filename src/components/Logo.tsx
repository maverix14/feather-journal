
import React from "react";
import { cn } from "@/lib/utils";
import { Feather } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-8 h-8 rounded-lg neo-shadow flex items-center justify-center">
        <Feather className="w-4 h-4" />
      </div>
      <span className="font-semibold tracking-tight">Feather Journal</span>
    </div>
  );
};

export default Logo;
