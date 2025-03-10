
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export interface EntryProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  favorite?: boolean;
}

interface EntryCardProps {
  entry: EntryProps;
  className?: string;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, className }) => {
  const { id, title, content, date, favorite } = entry;

  return (
    <Link to={`/entry/${id}`}>
      <article 
        className={cn(
          "p-5 rounded-xl neo-shadow hover:neo-inset transition-all duration-300 mb-5 animate-scale-in",
          className
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg tracking-tight text-balance">{title}</h3>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content}
        </p>
      </article>
    </Link>
  );
};

export default EntryCard;
