
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface HeaderNavProps {
  children?: React.ReactNode;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ children }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between py-4 bg-background">
      <Link to="/" className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center">
        <ChevronLeft className="w-5 h-5" />
      </Link>
      
      {children}
    </div>
  );
};

export default HeaderNav;
