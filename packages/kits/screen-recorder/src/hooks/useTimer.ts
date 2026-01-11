import { useState, useCallback, useRef, useEffect } from "react";
import { TIMER_INTERVAL } from "../constants";

export interface UseTimerOptions {
  /**
   * Maximum duration in seconds (timer will auto-stop at this limit)
   */
  maxDuration?: number;
  /**
   * Callback fired every second with elapsed time
   */
  onTick?: (elapsed: number, remaining: number | null) => void;
  /**
   * Callback fired when max duration is reached
   */
  onComplete?: () => void;
}

export interface UseTimerReturn {
  /** Elapsed time in seconds */
  elapsed: number;
  /** Formatted elapsed time (MM:SS) */
  elapsedFormatted: string;
  /** Remaining time if maxDuration set (null if no limit) */
  remaining: number | null;
  /** Whether timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Stop the timer */
  stop: () => void;
  /** Pause the timer (keeps elapsed time) */
  pause: () => void;
  /** Resume a paused timer */
  resume: () => void;
  /** Reset the timer to zero */
  reset: () => void;
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Hook to manage a timer for recording duration
 *
 * @param options - Configuration options
 * @returns Timer state and controls
 *
 * @example
 * ```tsx
 * function RecordingTimer() {
 *   const { elapsed, elapsedFormatted, remaining, start, stop, reset, isRunning } = useTimer({
 *     maxDuration: 60,
 *     onTick: (elapsed) => console.log(`Recording: ${elapsed}s`),
 *     onComplete: () => console.log('Max duration reached'),
 *   });
 *
 *   return (
 *     <div>
 *       <p>{elapsedFormatted}</p>
 *       <button onClick={isRunning ? stop : start}>
 *         {isRunning ? 'Stop' : 'Start'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { maxDuration, onTick, onComplete } = options;

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs to track actual elapsed time (more accurate than state updates)
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate remaining time (null if unlimited)
  const remaining =
    maxDuration != null && isFinite(maxDuration)
      ? Math.max(0, maxDuration - elapsed)
      : null;

  // Format elapsed time
  const elapsedFormatted = formatTime(elapsed);

  // Clear interval helper
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start the timer
  const start = useCallback(() => {
    if (isRunning && !isPaused) return;

    const now = Date.now();

    if (isPaused) {
      // Resume from paused state
      const pauseDuration = now - pausedAtRef.current;
      if (startTimeRef.current) {
        startTimeRef.current += pauseDuration;
      }
      setIsPaused(false);
    } else {
      // Fresh start
      startTimeRef.current = now;
      setElapsed(0);
    }

    setIsRunning(true);

    // Start interval
    clearTimerInterval();
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(currentElapsed);

      const currentRemaining =
        maxDuration != null && isFinite(maxDuration)
          ? maxDuration - currentElapsed
          : null;
      onTick?.(currentElapsed, currentRemaining);

      // Check if max duration reached (skip for Infinity)
      if (maxDuration != null && isFinite(maxDuration) && currentElapsed >= maxDuration) {
        clearTimerInterval();
        setIsRunning(false);
        onComplete?.();
      }
    }, TIMER_INTERVAL);
  }, [isRunning, isPaused, maxDuration, clearTimerInterval, onTick, onComplete]);

  // Stop the timer completely
  const stop = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimerInterval]);

  // Pause the timer (keeps elapsed time)
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    clearTimerInterval();
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  }, [isRunning, isPaused, clearTimerInterval]);

  // Resume a paused timer
  const resume = useCallback(() => {
    if (!isPaused) return;
    start();
  }, [isPaused, start]);

  // Reset the timer to zero
  const reset = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setIsPaused(false);
    setElapsed(0);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
  }, [clearTimerInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  return {
    elapsed,
    elapsedFormatted,
    remaining,
    isRunning,
    start,
    stop,
    pause,
    resume,
    reset,
  };
}
