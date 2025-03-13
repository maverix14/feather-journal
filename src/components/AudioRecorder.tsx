
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mic, Pause, StopCircle, X, Music } from "lucide-react";
import { AudioRecorderService, mockTranscribeAudio } from "@/utils/audioRecorder";

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string, transcript: string) => void;
  onCancel: () => void;
  className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const recorderServiceRef = useRef<AudioRecorderService | null>(null);
  
  useEffect(() => {
    // Initialize recorder service
    recorderServiceRef.current = new AudioRecorderService();
    
    return () => {
      // Clean up on unmount
      if (recorderServiceRef.current) {
        recorderServiceRef.current.cancelRecording();
      }
    };
  }, []);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isPaused]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = async () => {
    try {
      if (recorderServiceRef.current) {
        await recorderServiceRef.current.startRecording();
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      // Show error message to user
    }
  };
  
  const pauseRecording = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.pauseRecording();
      setIsPaused(true);
    }
  };
  
  const resumeRecording = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.resumeRecording();
      setIsPaused(false);
    }
  };
  
  const stopRecording = async () => {
    if (!recorderServiceRef.current) return;
    
    try {
      setIsRecording(false);
      setIsPaused(false);
      setIsTranscribing(true);
      
      const { audioUrl, blob } = await recorderServiceRef.current.stopRecording();
      
      // Mock transcription for now
      const transcript = await mockTranscribeAudio(blob);
      
      setIsTranscribing(false);
      onRecordingComplete(audioUrl, transcript);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsTranscribing(false);
      onCancel();
    }
  };
  
  const handleCancel = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.cancelRecording();
    }
    setIsRecording(false);
    setIsPaused(false);
    setIsTranscribing(false);
    onCancel();
  };
  
  if (!isRecording && !isTranscribing) {
    return (
      <div className={cn("relative flex flex-col items-center", className)}>
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 transition-all hover:bg-primary/20"
        >
          <Mic className="w-4 h-4 text-primary" />
        </button>
        <div className="w-full h-px bg-border mt-3"></div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "w-full rounded-lg transition-all duration-300 neo-shadow",
      isTranscribing ? "bg-primary/5" : "bg-secondary/50",
      className
    )}>
      {isTranscribing ? (
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Transcribing...</p>
              <p className="text-xs text-muted-foreground">Converting your voice to text</p>
            </div>
          </div>
          <button onClick={handleCancel} className="p-1 hover:bg-secondary/80 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isPaused ? "Recording Paused" : "Recording..."}
            </span>
            <span className="text-sm font-medium">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "bg-primary h-6 w-0.5 rounded-full transition-all",
                  isPaused ? "" : "animate-sound-wave"
                )}
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  height: `${Math.sin(i * 0.4) * 16 + 8}px`
                }}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/70 glass-morphism"
              >
                {isPaused ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
              
              <button 
                onClick={stopRecording}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/20 hover:bg-primary/30 glass-morphism"
              >
                <StopCircle className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
