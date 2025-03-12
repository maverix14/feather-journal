
import React from "react";
import { MoodType } from "./MoodSelector";

interface EntryCardMoodProps {
  mood: MoodType | undefined;
}

export const getMoodEmoji = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "😊";
    case "content":
      return "😌";
    case "neutral":
      return "😐";
    case "sad":
      return "😔";
    case "stressed":
      return "😰";
    default:
      return null;
  }
};

export const getMoodColor = (mood: MoodType | undefined) => {
  switch (mood) {
    case "happy":
      return "#FEF7CD";
    case "content":
      return "#F2FCE2";
    case "neutral":
      return "#F1F0FB";
    case "sad":
      return "#D3E4FD";
    case "stressed":
      return "#FFDEE2";
    default:
      return "transparent";
  }
};

const EntryCardMood: React.FC<EntryCardMoodProps> = ({ mood }) => {
  if (!mood) return null;
  
  return (
    <span 
      className="flex items-center justify-center w-5 h-5 rounded-full"
      style={{ backgroundColor: getMoodColor(mood) }}
    >
      {getMoodEmoji(mood)}
    </span>
  );
};

export default EntryCardMood;
