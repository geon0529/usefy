import { useState, useCallback, useRef, useEffect } from "react";
import type { ScreenRecorderError, QualityOption, QualityPreset } from "../types";
import {
  QUALITY_PRESETS,
  DEFAULT_OPTIONS,
  MEDIA_RECORDER_TIMESLICE,
} from "../constants";
import { getBestMimeType } from "./useBrowserSupport";

export interface UseMediaRecorderOptions {
  /**
   * Quality preset or custom configuration
   */
  quality?: QualityOption;
  /**
   * MIME type for recording
   */
  mimeType?: string;
  /**
   * Time slice for data events (ms)
   * @default 1000
   */
  timeslice?: number;
  /**
   * Called when recording data is available
   */
  onDataAvailable?: (data: Blob) => void;
  /**
   * Called when recording starts
   */
  onStart?: () => void;
  /**
   * Called when recording stops
   */
  onStop?: (blob: Blob) => void;
  /**
   * Called when an error occurs
   */
  onError?: (error: ScreenRecorderError) => void;
}

export interface UseMediaRecorderReturn {
  /** MediaRecorder instance */
  recorder: MediaRecorder | null;
  /** Current recording state */
  state: RecordingState;
  /** Start recording */
  start: () => void;
  /** Stop recording */
  stop: () => void;
  /** Pause recording */
  pause: () => void;
  /** Resume recording */
  resume: () => void;
  /** Recorded blob (available after stop) */
  blob: Blob | null;
  /** MIME type being used */
  mimeType: string;
  /** Current error if any */
  error: ScreenRecorderError | null;
}

/**
 * Get quality configuration from option
 */
function getQualityConfig(quality?: QualityOption): QualityPreset {
  if (!quality) {
    return QUALITY_PRESETS[DEFAULT_OPTIONS.quality];
  }

  if (typeof quality === "string") {
    return QUALITY_PRESETS[quality] || QUALITY_PRESETS.medium;
  }

  return quality;
}

/**
 * Hook to manage MediaRecorder for video recording
 *
 * @param stream - MediaStream to record
 * @param options - Configuration options
 * @returns MediaRecorder state and controls
 *
 * @example
 * ```tsx
 * function Recorder({ stream }) {
 *   const { state, start, stop, pause, resume, blob } = useMediaRecorder(stream, {
 *     quality: 'high',
 *     onStop: (blob) => console.log('Recording complete:', blob),
 *   });
 *
 *   return (
 *     <div>
 *       <p>State: {state}</p>
 *       <button onClick={start}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaRecorder(
  stream: MediaStream | null,
  options: UseMediaRecorderOptions = {}
): UseMediaRecorderReturn {
  const {
    quality,
    mimeType: preferredMimeType,
    timeslice = MEDIA_RECORDER_TIMESLICE,
    onDataAvailable,
    onStart,
    onStop,
    onError,
  } = options;

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [state, setState] = useState<RecordingState>("inactive");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<ScreenRecorderError | null>(null);

  // Track collected chunks
  const chunksRef = useRef<Blob[]>([]);

  // Determine MIME type
  const actualMimeType = preferredMimeType || getBestMimeType() || DEFAULT_OPTIONS.mimeType;

  // Create recorder when stream changes
  useEffect(() => {
    if (!stream) {
      setRecorder(null);
      setState("inactive");
      return;
    }

    // Check MediaRecorder availability
    if (typeof MediaRecorder === "undefined") {
      const err: ScreenRecorderError = {
        code: "NOT_SUPPORTED",
        message: "MediaRecorder is not supported in your browser.",
      };
      setError(err);
      onError?.(err);
      return;
    }

    // Check MIME type support
    let mimeToUse = actualMimeType;
    if (!MediaRecorder.isTypeSupported(mimeToUse)) {
      const bestMime = getBestMimeType();
      if (bestMime) {
        mimeToUse = bestMime;
      } else {
        const err: ScreenRecorderError = {
          code: "ENCODING_ERROR",
          message: `The MIME type ${actualMimeType} is not supported.`,
        };
        setError(err);
        onError?.(err);
        return;
      }
    }

    const qualityConfig = getQualityConfig(quality);

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeToUse,
        videoBitsPerSecond: qualityConfig.videoBitsPerSecond,
      });

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          onDataAvailable?.(event.data);
        }
      };

      // Handle start
      mediaRecorder.onstart = () => {
        setState("recording");
        chunksRef.current = [];
        setBlob(null);
        setError(null);
        onStart?.();
      };

      // Handle stop
      mediaRecorder.onstop = () => {
        setState("inactive");
        const recordedBlob = new Blob(chunksRef.current, { type: mimeToUse });
        setBlob(recordedBlob);
        onStop?.(recordedBlob);
      };

      // Handle pause
      mediaRecorder.onpause = () => {
        setState("paused");
      };

      // Handle resume
      mediaRecorder.onresume = () => {
        setState("recording");
      };

      // Handle error
      mediaRecorder.onerror = (event) => {
        const err: ScreenRecorderError = {
          code: "MEDIA_RECORDER_ERROR",
          message: "An error occurred during recording.",
          originalError:
            event instanceof ErrorEvent ? event.error : new Error("MediaRecorder error"),
        };
        setError(err);
        setState("inactive");
        onError?.(err);
      };

      setRecorder(mediaRecorder);
      setError(null);
    } catch (err) {
      const screenRecorderError: ScreenRecorderError = {
        code: "MEDIA_RECORDER_ERROR",
        message: err instanceof Error ? err.message : "Failed to create MediaRecorder.",
        originalError: err instanceof Error ? err : undefined,
      };
      setError(screenRecorderError);
      onError?.(screenRecorderError);
    }

    return () => {
      // Cleanup: stop recorder if active
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [stream, actualMimeType, quality]);

  // Start recording
  const start = useCallback(() => {
    if (!recorder) {
      const err: ScreenRecorderError = {
        code: "NO_STREAM",
        message: "No stream available. Please start screen capture first.",
      };
      setError(err);
      onError?.(err);
      return;
    }

    if (recorder.state !== "inactive") {
      return; // Already recording
    }

    chunksRef.current = [];
    recorder.start(timeslice);
  }, [recorder, timeslice, onError]);

  // Stop recording
  const stop = useCallback(() => {
    if (!recorder || recorder.state === "inactive") {
      return;
    }
    recorder.stop();
  }, [recorder]);

  // Pause recording
  const pause = useCallback(() => {
    if (!recorder || recorder.state !== "recording") {
      return;
    }
    recorder.pause();
  }, [recorder]);

  // Resume recording
  const resume = useCallback(() => {
    if (!recorder || recorder.state !== "paused") {
      return;
    }
    recorder.resume();
  }, [recorder]);

  return {
    recorder,
    state,
    start,
    stop,
    pause,
    resume,
    blob,
    mimeType: actualMimeType,
    error,
  };
}
