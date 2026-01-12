import type { FC } from "react";
import clsx from "clsx";
import { Timer } from "./Timer";
import { RecordingIcon, StopIcon, PauseIcon, PlayIcon } from "../Trigger/TriggerIcon";
import { ARIA_LABELS } from "../../constants";
import type { TriggerPosition } from "../../types";
import styles from "./RecordingControls.module.scss";

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

const POSITION_STYLES: Record<TriggerPosition, string> = {
  "top-left": styles.topLeft,
  "top-right": styles.topRight,
  "bottom-left": styles.bottomLeft,
  "bottom-right": styles.bottomRight,
};

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
      className={clsx(
        styles.controls,
        POSITION_STYLES[position],
        className
      )}
      style={{ zIndex }}
    >
      {/* Recording status indicator */}
      <div className={styles.statusSection}>
        <div
          className={clsx(
            styles.statusIndicator,
            isPaused ? styles.statusPaused : styles.statusRecording
          )}
        >
          {isPaused ? (
            <>
              <PauseIcon className={styles.pauseIconSmall} />
              <span className={styles.statusLabel}>Paused</span>
            </>
          ) : (
            <>
              <RecordingIcon className={styles.recordingIcon} />
              <span className={styles.statusLabel}>Rec</span>
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
      <div className={styles.buttonGroup}>
        {/* Pause/Resume button */}
        <button
          type="button"
          onClick={isPaused ? onResume : onPause}
          aria-label={isPaused ? ARIA_LABELS.resumeButton : ARIA_LABELS.pauseButton}
          className={styles.controlButton}
        >
          {isPaused ? (
            <PlayIcon className={styles.buttonIcon} />
          ) : (
            <PauseIcon className={styles.buttonIcon} />
          )}
        </button>

        {/* Stop button */}
        <button
          type="button"
          onClick={onStop}
          aria-label={ARIA_LABELS.stopButton}
          className={styles.stopButton}
        >
          <StopIcon className={styles.stopIcon} />
        </button>
      </div>
    </div>
  );
};
