
import React, { useState, useCallback } from "react";
import { Camera, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AudioRecorder from "@/components/AudioRecorder";
import AudioPlayer from "@/components/AudioPlayer";

export type AttachmentType = "photo" | "gallery" | "audio" | "video";

interface AttachmentHandlerProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  onAttachmentsChange: (attachments: { type: AttachmentType; url: string }[]) => void;
  className?: string;
}

const AttachmentHandler: React.FC<AttachmentHandlerProps> = ({
  content,
  setContent,
  onAttachmentsChange,
  className,
}) => {
  const [attachments, setAttachments] = useState<{ type: AttachmentType; url: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleAttachment = (type: AttachmentType, url: string) => {
    const newAttachment = { type, url };
    const updatedAttachments = [...attachments, newAttachment];
    setAttachments(updatedAttachments);
    onAttachmentsChange(updatedAttachments);
  };

  const handleAudioComplete = (audioUrl: string, transcript: string) => {
    setIsRecording(false);
    handleAttachment("audio", audioUrl);
    setContent(prev => {
      if (prev.trim() === "") return transcript;
      return `${prev}\n\n${transcript}`;
    });
  };

  const cancelAudioRecording = () => {
    setIsRecording(false);
  };

  const removeAttachment = (indexToRemove: number) => {
    const updatedAttachments = attachments.filter((_, index) => index !== indexToRemove);
    setAttachments(updatedAttachments);
    onAttachmentsChange(updatedAttachments);
  };

  const renderAttachmentPreviews = useCallback(() => {
    return attachments.map((attachment, index) => {
      if (attachment.type === "photo" || attachment.type === "gallery") {
        return (
          <div key={index} className="relative mt-4 rounded-lg overflow-hidden">
            <img src={attachment.url} alt="Attachment preview" className="w-full h-48 object-cover" />
            <button 
              onClick={() => removeAttachment(index)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full glass-morphism flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
      
      if (attachment.type === "audio") {
        return (
          <div key={index} className="relative mt-4">
            <AudioPlayer 
              audioUrl={attachment.url} 
              transcript="Simulated transcript"
            />
            <button 
              onClick={() => removeAttachment(index)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full glass-morphism flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
      return null;
    });
  }, [attachments]);
  
  const handlePhotoUpload = () => {
    // Simulate photo upload
    const imageUrl = "/placeholder.svg";
    handleAttachment("photo", imageUrl);
  };

  const handleGalleryUpload = () => {
    // Simulate gallery upload
    const galleryUrl = "/placeholder.svg";
    handleAttachment("gallery", galleryUrl);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="w-full h-px bg-border mb-2"></div>
        <textarea
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground pr-2"
        />
        {!isRecording && (
          <div>
            <AudioRecorder 
              onRecordingComplete={handleAudioComplete}
              onCancel={cancelAudioRecording}
            />
          </div>
        )}
      </div>

      {renderAttachmentPreviews()}

      <div className="attachments-bar pt-4 border-t border-border">
        <div className="flex justify-center gap-8">
          <button 
            type="button" 
            onClick={handlePhotoUpload}
            className={cn(
              "attachment-button"
            )}
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs mt-1">
              Camera
            </span>
          </button>
          
          <button 
            type="button" 
            onClick={handleGalleryUpload}
            className={cn(
              "attachment-button"
            )}
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs mt-1">
              Gallery
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentHandler;
