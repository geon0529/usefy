import type { FC } from "react";
import clsx from "clsx";
import { ARIA_LABELS } from "../../constants";
import styles from "./Countdown.module.scss";

export interface CountdownProps {
  /**
   * Current countdown value
   */
  value: number;
  /**
   * Cancel handler
   */
  onCancel?: () => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Z-index for overlay
   */
  zIndex?: number;
}

/**
 * Fullscreen countdown overlay (3-2-1 before recording)
 */
export const Countdown: FC<CountdownProps> = ({
  value,
  onCancel,
  className,
  zIndex = 10000,
}) => {
  return (
    <div
      className={clsx(styles.overlay, className)}
      style={{ zIndex }}
      role="alert"
      aria-live="assertive"
      aria-label={`${ARIA_LABELS.countdown} ${value}`}
    >
      {/* Countdown number */}
      <div key={value} className={styles.countdownCircle}>
        {value}
      </div>

      {/* Message */}
      <p className={styles.message}>Recording starts in...</p>

      {/* Cancel button */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
