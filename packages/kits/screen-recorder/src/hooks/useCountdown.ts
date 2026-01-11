import { useState, useCallback, useRef, useEffect } from "react";

export interface UseCountdownOptions {
  /**
   * Initial countdown value in seconds
   * @default 3
   */
  initialValue?: number;
  /**
   * Called when countdown completes
   */
  onComplete?: () => void;
  /**
   * Called on each tick of the countdown
   */
  onTick?: (value: number) => void;
}

export interface UseCountdownReturn {
  /** Current countdown value (null when not counting) */
  value: number | null;
  /** Whether countdown is active */
  isActive: boolean;
  /** Start the countdown */
  start: (onComplete?: () => void) => void;
  /** Cancel the countdown */
  cancel: () => void;
}

/**
 * Hook to manage a countdown timer (e.g., 3-2-1 before recording)
 *
 * @param options - Configuration options
 * @returns Countdown state and controls
 *
 * @example
 * ```tsx
 * function RecordingCountdown() {
 *   const { value, isActive, start, cancel } = useCountdown({
 *     initialValue: 3,
 *     onComplete: () => console.log('Countdown finished!'),
 *   });
 *
 *   return (
 *     <div>
 *       {isActive && <div className="countdown">{value}</div>}
 *       <button onClick={() => start()}>Start Countdown</button>
 *       <button onClick={cancel}>Cancel</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCountdown(options: UseCountdownOptions = {}): UseCountdownReturn {
  const { initialValue = 3, onComplete, onTick } = options;

  const [value, setValue] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Store callback in ref to avoid stale closures
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);
  const runtimeOnCompleteRef = useRef<(() => void) | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Clear interval helper
  const clearCountdownInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start the countdown
  const start = useCallback(
    (runtimeOnComplete?: () => void) => {
      // Store runtime callback
      runtimeOnCompleteRef.current = runtimeOnComplete;

      // Reset and start
      clearCountdownInterval();
      setValue(initialValue);
      setIsActive(true);

      // Call initial tick
      onTick?.(initialValue);

      // Start countdown interval
      let currentValue = initialValue;

      intervalRef.current = setInterval(() => {
        currentValue -= 1;

        if (currentValue <= 0) {
          // Countdown complete
          clearCountdownInterval();
          setValue(null);
          setIsActive(false);

          // Call completion callbacks
          runtimeOnCompleteRef.current?.();
          onCompleteRef.current?.();
        } else {
          // Update value
          setValue(currentValue);
          onTick?.(currentValue);
        }
      }, 1000);
    },
    [initialValue, clearCountdownInterval, onTick]
  );

  // Cancel the countdown
  const cancel = useCallback(() => {
    clearCountdownInterval();
    setValue(null);
    setIsActive(false);
    runtimeOnCompleteRef.current = undefined;
  }, [clearCountdownInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCountdownInterval();
    };
  }, [clearCountdownInterval]);

  return {
    value,
    isActive,
    start,
    cancel,
  };
}
