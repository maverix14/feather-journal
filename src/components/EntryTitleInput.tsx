
import React from "react";

interface EntryTitleInputProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const EntryTitleInput: React.FC<EntryTitleInputProps> = ({ 
  title, 
  setTitle,
  placeholder = "Entry Title",
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder={placeholder}
        value={title}
        onChange={handleChange}
        className="w-full text-2xl font-medium tracking-tight bg-transparent border-none outline-none placeholder:text-muted-foreground"
        autoFocus
      />
      <div className="h-px bg-border w-full"></div>
    </div>
  );
};

export default EntryTitleInput;
