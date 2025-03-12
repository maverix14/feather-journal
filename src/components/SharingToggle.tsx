
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SharingToggleProps {
  isShared: boolean;
  onShareChange: (shared: boolean) => void;
  className?: string;
  compact?: boolean;
}

const SharingToggle: React.FC<SharingToggleProps> = ({
  isShared,
  onShareChange,
  className,
  compact = false,
}) => {
  const handleClick = () => {
    onShareChange(!isShared);
  };

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleGroupSelect = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const sharingOptions = ["Partner", "Family", "Friends", "Guest"];

  const cn2 = (...inputs: any[]) => twMerge(clsx(inputs));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className={cn2(
            "flex items-center justify-between rounded-lg p-3 transition-all duration-300",
            className
          )}
          style={{
            backgroundColor: isShared ? "rgba(124, 58, 237, 0.1)" : "rgba(229, 231, 235, 0.8)",
          }}
        >
          <div className={cn2(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isShared ? "bg-secondary/50" : "bg-background"
          )}>
            {isShared ? (
              <Share2 className="w-4 h-4 text-primary" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </div>
          
          <span className="text-sm font-medium mr-3">
            {isShared ? "Shared" : "Private"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            Sharing Options
          </h4>
          <div className="space-y-1">
            {sharingOptions.map((group) => (
              <label key={group} className="flex items-center">
                <Checkbox
                  checked={selectedGroups.includes(group)}
                  onCheckedChange={() => handleGroupSelect(group)}
                  className="mr-2"
                />
                <span className="text-sm">{group}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharingToggle;
