import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl: string;
  transcript: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, transcript, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          
          // Update circle progress
          if (circleRef.current && audioRef.current.duration) {
            const progress = audioRef.current.currentTime / audioRef.current.duration;
            const circumference = 2 * Math.PI * 18; // Circle radius is 18
            const dashOffset = circumference * (1 - progress);
            circleRef.current.style.strokeDashoffset = `${dashOffset}`;
          }
        }
      };
      
      const interval = setInterval(updateTime, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const calculateCircleProgress = () => {
    if (duration === 0) return "0";
    const progress = currentTime / duration;
    const circumference = 2 * Math.PI * 18; // Circle radius is 18
    return `${circumference * (1 - progress)}`;
  };

  return (
    <div className={cn("flex items-start gap-3 p-3 bg-secondary/50 rounded-lg", className)}>
      <div className="relative">
        <button 
          onClick={togglePlayback}
          className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary" />
          )}
        </button>
        <svg 
          width="44" 
          height="44" 
          viewBox="0 0 44 44" 
          className="absolute top-0 left-0 -rotate-90"
        >
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="3"
          />
          <circle
            ref={circleRef}
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 18}`}
            strokeDashoffset={calculateCircleProgress()}
            className="text-primary"
          />
        </svg>
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm line-clamp-2">{transcript}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <span className="text-xs text-muted-foreground">{formatTime(duration || 30)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
