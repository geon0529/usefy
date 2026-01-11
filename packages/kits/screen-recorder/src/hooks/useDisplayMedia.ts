import { useState, useCallback, useRef, useEffect } from "react";
import type { ScreenRecorderError, AudioOption, AudioConfig } from "../types";

export interface UseDisplayMediaOptions {
  /**
   * Audio configuration
   */
  audio?: AudioOption;
  /**
   * Called when an error occurs
   */
  onError?: (error: ScreenRecorderError) => void;
  /**
   * Called when the stream ends (user stops sharing via browser)
   */
  onStreamEnded?: () => void;
}

export interface UseDisplayMediaReturn {
  /** Current media stream (null if not capturing) */
  stream: MediaStream | null;
  /** Whether stream is active */
  isStreaming: boolean;
  /** Request screen capture from user */
  requestStream: () => Promise<MediaStream | null>;
  /** Stop the current stream */
  stopStream: () => void;
  /** Current error if any */
  error: ScreenRecorderError | null;
  /** Whether audio is being captured */
  hasAudio: boolean;
}

/**
 * Convert audio option to DisplayMediaStreamOptions
 */
function getAudioConstraints(audio?: AudioOption): boolean | MediaTrackConstraints {
  if (audio === false || audio === undefined) {
    return false;
  }

  if (audio === true) {
    return true;
  }

  // AudioConfig
  const config = audio as AudioConfig;
  if (config.system || config.microphone) {
    return true;
  }

  return false;
}

/**
 * Create error object from DOMException or Error
 */
function createError(error: unknown): ScreenRecorderError {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return {
        code: "PERMISSION_DENIED",
        message: "Screen recording permission was denied. Please allow screen sharing when prompted.",
        originalError: error,
      };
    }
    if (error.name === "NotSupportedError") {
      return {
        code: "NOT_SUPPORTED",
        message: "Screen recording is not supported in your browser.",
        originalError: error,
      };
    }
    if (error.name === "AbortError") {
      return {
        code: "PERMISSION_DENIED",
        message: "Screen selection was cancelled.",
        originalError: error,
      };
    }
  }

  const originalError = error instanceof Error ? error : new Error(String(error));
  return {
    code: "UNKNOWN",
    message: originalError.message || "An unknown error occurred.",
    originalError,
  };
}

/**
 * Hook to manage screen capture using getDisplayMedia API
 *
 * @param options - Configuration options
 * @returns Display media state and controls
 *
 * @example
 * ```tsx
 * function ScreenCapture() {
 *   const { stream, requestStream, stopStream, error } = useDisplayMedia({
 *     audio: true,
 *     onStreamEnded: () => console.log('User stopped sharing'),
 *   });
 *
 *   return (
 *     <button onClick={stream ? stopStream : requestStream}>
 *       {stream ? 'Stop' : 'Start'} Sharing
 *     </button>
 *   );
 * }
 * ```
 */
export function useDisplayMedia(
  options: UseDisplayMediaOptions = {}
): UseDisplayMediaReturn {
  const { audio, onError, onStreamEnded } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<ScreenRecorderError | null>(null);
  const [hasAudio, setHasAudio] = useState(false);

  // Use ref to track stream for cleanup
  const streamRef = useRef<MediaStream | null>(null);

  // Handle track ended event
  const handleTrackEnded = useCallback(() => {
    onStreamEnded?.();
    setStream(null);
    streamRef.current = null;
  }, [onStreamEnded]);

  // Stop current stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.removeEventListener("ended", handleTrackEnded);
        track.stop();
      });
      streamRef.current = null;
    }
    setStream(null);
    setHasAudio(false);
  }, [handleTrackEnded]);

  // Request screen capture
  const requestStream = useCallback(async (): Promise<MediaStream | null> => {
    // Check API availability
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getDisplayMedia
    ) {
      const error: ScreenRecorderError = {
        code: "NOT_SUPPORTED",
        message: "Screen recording is not supported in your browser.",
      };
      setError(error);
      onError?.(error);
      return null;
    }

    // Stop any existing stream
    stopStream();
    setError(null);

    try {
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: true,
        audio: getAudioConstraints(audio),
      };

      const mediaStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );

      // Add ended event listener to video track
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.addEventListener("ended", handleTrackEnded);
      }

      // Check if audio is captured
      const audioTracks = mediaStream.getAudioTracks();
      setHasAudio(audioTracks.length > 0);

      streamRef.current = mediaStream;
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const screenRecorderError = createError(err);
      setError(screenRecorderError);
      onError?.(screenRecorderError);
      return null;
    }
  }, [audio, stopStream, handleTrackEnded, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    stream,
    isStreaming: stream !== null,
    requestStream,
    stopStream,
    error,
    hasAudio,
  };
}
