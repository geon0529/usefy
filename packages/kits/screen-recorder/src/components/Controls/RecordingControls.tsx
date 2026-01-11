import type { FC } from "react";
import { cn } from "../../utils/cn";
import { Timer } from "./Timer";
import { RecordingIcon, StopIcon, PauseIcon, PlayIcon } from "../Trigger/TriggerIcon";
import { ARIA_LABELS } from "../../constants";
import type { TriggerPosition } from "../../types";
import { POSITION_CLASSES } from "../../constants";

export interface RecordingControlsProps {
  /**
   * Elapsed time in seconds
   */
  elapsed: number;
  /**
   * Formatted elapsed time (MM:SS)
   */
  elapsedFormatted: string;
  /**
   * Remaining time if maxDuration set
   */
  remaining?: number | null;
  /**
   * Maximum duration
   */
  maxDuration?: number;
  /**
   * Whether recording is paused
   */
  isPaused?: boolean;
  /**
   * Whether recording is active (not paused)
   */
  isRecording?: boolean;
  /**
   * Pause handler
   */
  onPause?: () => void;
  /**
   * Resume handler
   */
  onResume?: () => void;
  /**
   * Stop handler
   */
  onStop?: () => void;
  /**
   * Position of controls
   */
  position?: TriggerPosition;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Z-index for positioning
   */
  zIndex?: number;
}

/**
 * Recording controls bar with timer, pause, and stop buttons
 */
export const RecordingControls: FC<RecordingControlsProps> = ({
  elapsed,
  elapsedFormatted,
  remaining,
  maxDuration,
  isPaused = false,
  isRecording = true,
  onPause,
  onResume,
  onStop,
  position = "bottom-right",
  className,
  zIndex = 9999,
}) => {
  return (
    <div
      className={cn(
        // Base styles
        "fixed flex items-center gap-3 px-4 py-2.5 rounded-full",
        "bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700",
        // Animation
        "animate-slide-up",
        // Position
        POSITION_CLASSES[position],
        className
      )}
      style={{ zIndex }}
    >
      {/* Recording status indicator */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5",
            isPaused ? "text-amber-500" : "text-red-500"
          )}
        >
          {isPaused ? (
            <>
              <PauseIcon className="w-3 h-3" />
              <span className="text-xs font-semibold uppercase">Paused</span>
            </>
          ) : (
            <>
              <RecordingIcon className="w-3 h-3 animate-pulse-record" />
              <span className="text-xs font-semibold uppercase">Rec</span>
            </>
          )}
        </div>
      </div>

      {/* Timer */}
      <Timer
        elapsed={elapsed}
        elapsedFormatted={elapsedFormatted}
        remaining={remaining}
        maxDuration={maxDuration}
        isPaused={isPaused}
      />

      {/* Control buttons */}
      <div className="flex items-center gap-1 ml-2">
        {/* Pause/Resume button */}
        <button
          type="button"
          onClick={isPaused ? onResume : onPause}
          aria-label={isPaused ? ARIA_LABELS.resumeButton : ARIA_LABELS.pauseButton}
          className={cn(
            "p-2 rounded-full transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          {isPaused ? (
            <PlayIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <PauseIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Stop button */}
        <button
          type="button"
          onClick={onStop}
          aria-label={ARIA_LABELS.stopButton}
          className={cn(
            "p-2 rounded-full transition-colors",
            "hover:bg-red-100 dark:hover:bg-red-900/30",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          )}
        >
          <StopIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
};
