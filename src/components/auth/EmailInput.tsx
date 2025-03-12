
import React from "react";
import { Mail } from "lucide-react";

interface EmailInputProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const EmailInput: React.FC<EmailInputProps> = ({ email, setEmail }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email Address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;
