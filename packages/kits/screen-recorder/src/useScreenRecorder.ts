import { useState, useCallback, useRef, useEffect } from "react";
import type {
  RecordingState,
  RecordingResult,
  ScreenRecorderError,
  UseScreenRecorderOptions,
  UseScreenRecorderReturn,
} from "./types";
import { DEFAULT_OPTIONS } from "./constants";
import { useBrowserSupport } from "./hooks/useBrowserSupport";
import { useDisplayMedia } from "./hooks/useDisplayMedia";
import { useMediaRecorder } from "./hooks/useMediaRecorder";
import { useTimer, formatTime } from "./hooks/useTimer";
import { useCountdown } from "./hooks/useCountdown";

/**
 * Main hook for screen recording functionality
 *
 * Combines display media capture, media recording, timer, and countdown
 * into a unified state machine for screen recording.
 *
 * @param options - Configuration options
 * @returns Screen recorder state and controls
 *
 * @example
 * ```tsx
 * function CustomRecorder() {
 *   const {
 *     state,
 *     isRecording,
 *     elapsed,
 *     elapsedFormatted,
 *     result,
 *     start,
 *     stop,
 *     pause,
 *     resume,
 *     download,
 *     reset,
 *     isSupported,
 *     error,
 *   } = useScreenRecorder({
 *     maxDuration: 120,
 *     audio: true,
 *     countdown: 3,
 *   });
 *
 *   if (!isSupported) {
 *     return <p>Screen recording is not supported.</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>State: {state}</p>
 *       <p>Time: {elapsedFormatted}</p>
 *       {state === 'idle' && <button onClick={start}>Start</button>}
 *       {isRecording && <button onClick={stop}>Stop</button>}
 *       {result && <video src={result.url} controls />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useScreenRecorder(
  options: UseScreenRecorderOptions = {}
): UseScreenRecorderReturn {
  const {
    maxDuration = DEFAULT_OPTIONS.maxDuration,
    countdown: countdownSeconds = DEFAULT_OPTIONS.countdown,
    audio = DEFAULT_OPTIONS.audio,
    quality = DEFAULT_OPTIONS.quality,
    mimeType = DEFAULT_OPTIONS.mimeType,
    onError,
  } = options;

  // State
  const [state, setState] = useState<RecordingState>("idle");
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [error, setError] = useState<ScreenRecorderError | null>(null);

  // Blob URL management
  const blobUrlRef = useRef<string | null>(null);

  // Recording start time (for duration calculation)
  const recordingStartTimeRef = useRef<number | null>(null);

  // Track if we need to start recording immediately (countdown=false)
  const pendingImmediateStartRef = useRef<boolean>(false);

  // Browser support
  const browserSupport = useBrowserSupport();

  // Display media (screen capture)
  const displayMedia = useDisplayMedia({
    audio,
    onError: (err) => {
      setState("error");
      setError(err);
      onError?.(err);
    },
    onStreamEnded: () => {
      // User stopped sharing via browser UI
      if (state === "recording" || state === "paused") {
        handleStop();
      }
    },
  });

  // Media recorder
  const mediaRecorder = useMediaRecorder(displayMedia.stream, {
    quality,
    mimeType,
    onStart: () => {
      recordingStartTimeRef.current = Date.now();
    },
    onStop: (blob) => {
      // Calculate duration
      const duration = recordingStartTimeRef.current
        ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
        : timer.elapsed;

      // Revoke previous blob URL if exists
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      // Create new blob URL
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      // Create result
      const recordingResult: RecordingResult = {
        blob,
        url,
        duration,
        size: blob.size,
        mimeType: blob.type || mimeType,
        timestamp: new Date(),
        hasAudio: displayMedia.hasAudio,
      };

      setResult(recordingResult);
      setState("stopped");
      timer.stop();
    },
    onError: (err) => {
      setState("error");
      setError(err);
      onError?.(err);
    },
  });

  // Timer
  const timer = useTimer({
    maxDuration,
    onTick: (elapsed, remaining) => {
      // Auto-stop when max duration reached
      if (remaining !== null && remaining <= 0) {
        handleStop();
      }
    },
  });

  // Countdown
  const countdown = useCountdown({
    initialValue: typeof countdownSeconds === "number" ? countdownSeconds : 3,
    onComplete: () => {
      // Start actual recording after countdown
      mediaRecorder.start();
      timer.start();
      setState("recording");
    },
  });

  // Handle stop (internal)
  const handleStop = useCallback(() => {
    mediaRecorder.stop();
    displayMedia.stopStream();
    timer.stop();
  }, [mediaRecorder, displayMedia, timer]);

  // Effect to start recording when MediaRecorder becomes ready (for countdown=false case)
  useEffect(() => {
    if (
      pendingImmediateStartRef.current &&
      mediaRecorder.recorder &&
      displayMedia.stream
    ) {
      pendingImmediateStartRef.current = false;
      mediaRecorder.start();
      timer.start();
      setState("recording");
    }
  }, [mediaRecorder.recorder, mediaRecorder, displayMedia.stream, timer]);

  // Start recording
  const start = useCallback(async () => {
    // Clear previous error
    setError(null);
    setResult(null);

    // Clear previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setState("requesting");

    // Request screen capture
    const stream = await displayMedia.requestStream();

    if (!stream) {
      // Error already set by displayMedia hook
      setState("error");
      return;
    }

    // Start countdown or recording immediately
    if (countdownSeconds !== false && countdownSeconds > 0) {
      setState("countdown");
      countdown.start();
    } else {
      // No countdown - mark as pending and wait for MediaRecorder to be ready
      // MediaRecorder is created in useEffect when stream changes, so it may not be ready yet
      pendingImmediateStartRef.current = true;
      // Trigger a state that indicates we're waiting
      setState("countdown"); // Temporarily use countdown state, will transition to recording
    }
  }, [displayMedia, countdownSeconds, countdown]);

  // Stop recording
  const stop = useCallback(() => {
    // Cancel pending start if any
    pendingImmediateStartRef.current = false;

    if (state === "countdown") {
      // Cancel countdown and stop
      countdown.cancel();
      displayMedia.stopStream();
      setState("idle");
      return;
    }

    if (state === "recording" || state === "paused") {
      handleStop();
    }
  }, [state, countdown, displayMedia, handleStop]);

  // Pause recording
  const pause = useCallback(() => {
    if (state !== "recording") return;

    mediaRecorder.pause();
    timer.pause();
    setState("paused");
  }, [state, mediaRecorder, timer]);

  // Resume recording
  const resume = useCallback(() => {
    if (state !== "paused") return;

    mediaRecorder.resume();
    timer.resume();
    setState("recording");
  }, [state, mediaRecorder, timer]);

  // Toggle pause/resume
  const togglePause = useCallback(() => {
    if (state === "recording") {
      pause();
    } else if (state === "paused") {
      resume();
    }
  }, [state, pause, resume]);

  // Download recording
  const download = useCallback(
    (filename?: string) => {
      if (!result) return;

      const downloadFilename =
        filename || `screen-recording-${Date.now()}.webm`;

      const link = document.createElement("a");
      link.href = result.url;
      link.download = downloadFilename.endsWith(".webm")
        ? downloadFilename
        : `${downloadFilename}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [result]
  );

  // Reset state for new recording
  const reset = useCallback(() => {
    // Cancel pending start if any
    pendingImmediateStartRef.current = false;

    // Stop everything
    if (state === "recording" || state === "paused") {
      mediaRecorder.stop();
    }
    displayMedia.stopStream();
    timer.reset();
    countdown.cancel();

    // Clear blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    // Reset state
    setState("idle");
    setResult(null);
    setError(null);
  }, [state, mediaRecorder, displayMedia, timer, countdown]);

  // Get preview URL
  const getPreviewUrl = useCallback(() => {
    return blobUrlRef.current;
  }, []);

  // Revoke preview URL (cleanup)
  const revokePreviewUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  // Computed values
  const isRecording = state === "recording";
  const isPaused = state === "paused";
  // For countdown=false, we briefly show countdown state while waiting for MediaRecorder
  // But countdownValue should be null in this case
  const isCountingDown =
    state === "countdown" && !pendingImmediateStartRef.current;
  const remaining =
    maxDuration != null && isFinite(maxDuration)
      ? Math.max(0, maxDuration - timer.elapsed)
      : null;

  return {
    // State
    state,
    isRecording,
    isPaused,
    isCountingDown,
    countdownValue: pendingImmediateStartRef.current ? null : countdown.value,
    elapsed: timer.elapsed,
    remaining,
    elapsedFormatted: timer.elapsedFormatted,
    result,
    error: error || displayMedia.error || mediaRecorder.error,
    isSupported: browserSupport.isSupported,

    // Actions
    start,
    stop,
    pause,
    resume,
    togglePause,
    download,
    reset,
    getPreviewUrl,
    revokePreviewUrl,
  };
}
