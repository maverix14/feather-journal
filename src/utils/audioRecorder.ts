
export interface RecordingResult {
  audioUrl: string;
  blob: Blob;
}

export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  // Start recording
  async startRecording(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  }

  // Pause recording
  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  // Resume recording
  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  // Stop recording and get result
  stopRecording(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No media recorder available'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop tracks to release microphone
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        
        resolve({ audioUrl, blob: audioBlob });
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      } else {
        reject(new Error('MediaRecorder is not recording'));
      }
    });
  }

  // Cancel recording
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    // Release microphone
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.audioChunks = [];
  }

  // Get current state
  getState(): string {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
  }
}

// Mock transcription service - we'll replace this later with a real one
export const mockTranscribeAudio = (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate delay for transcription
    setTimeout(() => {
      const transcriptions = [
        "I'm feeling much better today compared to yesterday. The morning sickness has finally subsided.",
        "Had a doctor's appointment this morning. Everything looks good, and the baby is growing well!",
        "Just felt the baby kick for the first time! It was such an amazing moment that I'll never forget.",
        "I've been thinking about names lately. I'm having trouble deciding between a few favorites.",
        "Today was a bit challenging with the back pain, but some gentle stretching helped a lot."
      ];
      
      // Return a random mock transcription
      const randomIndex = Math.floor(Math.random() * transcriptions.length);
      resolve(transcriptions[randomIndex]);
    }, 1500);
  });
};
