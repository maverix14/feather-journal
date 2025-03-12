
import React from "react";

interface GuestModeOptionProps {
  onSkipLogin: () => void;
}

const GuestModeOption: React.FC<GuestModeOptionProps> = ({ onSkipLogin }) => {
  return (
    <div className="text-center pt-2">
      <button 
        onClick={onSkipLogin}
        className="px-4 py-2 text-sm rounded-xl glass-morphism hover:bg-black/5 transition-all"
      >
        Skip login & use guest mode
      </button>
      <p className="text-xs text-muted-foreground mt-2">
        Guest mode stores data locally on your device for privacy
      </p>
    </div>
  );
};

export default GuestModeOption;
