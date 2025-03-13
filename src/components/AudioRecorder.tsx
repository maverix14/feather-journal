
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
          className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-200"
        >
          <Mic className="w-5 h-5 text-primary" />
        </button>
        <div className="w-full h-px bg-border mt-3"></div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "w-full rounded-lg transition-all duration-300",
      isTranscribing ? "bg-primary/5" : "bg-secondary",
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
          
          <div className="h-14 bg-black/5 rounded-md flex items-center justify-center mb-3 overflow-hidden">
            <div className="flex space-x-1 items-center h-10 px-2 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "bg-primary h-full w-1 rounded-full",
                    isPaused ? "" : "animate-pulse",
                    i % 2 === 0 ? "h-8" : "h-4",
                    i % 3 === 0 ? "h-10" : ""
                  )}
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.7 + (i % 3) * 0.2}s` 
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5"
              >
                {isPaused ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
              </button>
              
              <button 
                onClick={stopRecording}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
