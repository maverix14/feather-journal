
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const AuthHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center mb-12 animate-slide-down">
      <Link
        to="/landing"
        className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>
      <Logo />
      <div className="w-10 h-10 opacity-0">
        {/* Empty div for alignment */}
      </div>
    </header>
  );
};

export default AuthHeader;
