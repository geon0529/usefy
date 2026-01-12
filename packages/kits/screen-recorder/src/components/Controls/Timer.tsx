import type { FC } from "react";
import clsx from "clsx";
import { TIMER_WARNING_THRESHOLD, TIMER_CRITICAL_THRESHOLD, ARIA_LABELS } from "../../constants";
import styles from "./Timer.module.scss";

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
  const getTimerColorClass = () => {
    if (isPaused) {
      return styles.colorPaused;
    }

    if (remaining != null) {
      if (remaining <= TIMER_CRITICAL_THRESHOLD) {
        return styles.colorCritical;
      }
      if (remaining <= TIMER_WARNING_THRESHOLD) {
        return styles.colorWarning;
      }
    }

    return styles.colorDefault;
  };

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`${ARIA_LABELS.timer}: ${elapsedFormatted}`}
      className={clsx(
        styles.timer,
        getTimerColorClass(),
        className
      )}
    >
      {elapsedFormatted}
      {maxDuration != null && isFinite(maxDuration) && (
        <span className={styles.maxDuration}>
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
