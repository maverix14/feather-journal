
import React from "react";
import { UserPlus } from "lucide-react";

interface NameInputProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const NameInput: React.FC<NameInputProps> = ({ name, setName }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        Your Name
      </label>
      <div className="relative">
        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
          required
        />
      </div>
    </div>
  );
};

export default NameInput;
