import type { FC } from "react";
import { cn } from "../../utils/cn";
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD, ARIA_LABELS } from "../../constants";

export interface TimerProps {
  /**
   * Elapsed time in seconds
   */
  elapsed: number;
  /**
   * Formatted elapsed time (MM:SS)
   */
  elapsedFormatted: string;
  /**
   * Remaining time (null if no limit)
   */
  remaining?: number | null;
  /**
   * Maximum duration (for calculating remaining)
   */
  maxDuration?: number;
  /**
   * Whether recording is paused
   */
  isPaused?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Timer display component showing elapsed recording time
 */
export const Timer: FC<TimerProps> = ({
  elapsed,
  elapsedFormatted,
  remaining,
  maxDuration,
  isPaused = false,
  className,
}) => {
  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (isPaused) {
      return "text-amber-600 dark:text-amber-400";
    }

    if (remaining != null) {
      if (remaining <= TIMER_CRITICAL_THRESHOLD) {
        return "text-red-600 dark:text-red-400";
      }
      if (remaining <= TIMER_WARNING_THRESHOLD) {
        return "text-amber-600 dark:text-amber-400";
      }
    }

    return "text-gray-700 dark:text-gray-300";
  };

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`${ARIA_LABELS.timer}: ${elapsedFormatted}`}
      className={cn(
        "font-mono text-sm font-medium tabular-nums",
        getTimerColor(),
        className
      )}
    >
      {elapsedFormatted}
      {maxDuration != null && isFinite(maxDuration) && (
        <span className="text-gray-400 dark:text-gray-500">
          {" / "}
          {formatDuration(maxDuration)}
        </span>
      )}
    </div>
  );
};

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
