import type { FC } from "react";
import { cn } from "../../utils/cn";
import { WarningIcon, CloseIcon } from "../Trigger/TriggerIcon";
import type { ScreenRecorderError } from "../../types";
import type { TriggerPosition } from "../../types";
import { POSITION_CLASSES } from "../../constants";

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
      className={cn(
        // Base styles
        "fixed flex flex-col gap-3 p-4 max-w-sm rounded-lg shadow-lg",
        "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800",
        "animate-slide-up",
        // Position
        POSITION_CLASSES[position],
        className
      )}
      style={{ zIndex }}
      role="alert"
      aria-live="assertive"
    >
      {/* Header with icon and close button */}
      <div className="flex items-start gap-3">
        <WarningIcon className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 dark:text-red-200">
            {getErrorTitle(error.code)}
          </h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {error.message}
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "p-1 rounded-full",
              "hover:bg-red-100 dark:hover:bg-red-800/50",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-red-500"
            )}
            aria-label="Dismiss error"
          >
            <CloseIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
          </button>
        )}
      </div>

      {/* Retry button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "w-full py-2 rounded-md",
            "bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-800",
            "text-red-700 dark:text-red-200 font-medium text-sm",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          )}
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
