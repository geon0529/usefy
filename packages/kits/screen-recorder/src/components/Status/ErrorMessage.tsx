import type { FC } from "react";
import clsx from "clsx";
import { WarningIcon, CloseIcon } from "../Trigger/TriggerIcon";
import type { ScreenRecorderError } from "../../types";
import type { TriggerPosition } from "../../types";
import styles from "./ErrorMessage.module.scss";

export interface ErrorMessageProps {
  /**
   * Error to display
   */
  error: ScreenRecorderError;
  /**
   * Retry handler
   */
  onRetry?: () => void;
  /**
   * Dismiss handler
   */
  onDismiss?: () => void;
  /**
   * Position of the error message
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
 * Error message component for screen recording errors
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  position = "bottom-right",
  className,
  zIndex = 9999,
}) => {
  return (
    <div
      className={clsx(
        styles.container,
        POSITION_STYLES[position],
        className
      )}
      style={{ zIndex }}
      role="alert"
      aria-live="assertive"
    >
      {/* Header with icon and close button */}
      <div className={styles.header}>
        <WarningIcon className={styles.warningIcon} />
        <div className={styles.content}>
          <h3 className={styles.title}>
            {getErrorTitle(error.code)}
          </h3>
          <p className={styles.message}>
            {error.message}
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={styles.dismissButton}
            aria-label="Dismiss error"
          >
            <CloseIcon className={styles.dismissIcon} />
          </button>
        )}
      </div>

      {/* Retry button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={styles.retryButton}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

/**
 * Get user-friendly error title based on error code
 */
function getErrorTitle(code: ScreenRecorderError["code"]): string {
  switch (code) {
    case "PERMISSION_DENIED":
      return "Permission Denied";
    case "NOT_SUPPORTED":
      return "Not Supported";
    case "MEDIA_RECORDER_ERROR":
      return "Recording Error";
    case "STREAM_ENDED":
      return "Screen Sharing Stopped";
    case "NO_STREAM":
      return "No Stream";
    case "ENCODING_ERROR":
      return "Encoding Error";
    default:
      return "Error";
  }
}
