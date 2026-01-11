import type { FC } from "react";
import { cn } from "../../utils/cn";
import { ARIA_LABELS } from "../../constants";

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
      className={cn(
        // Fullscreen overlay
        "fixed inset-0 flex flex-col items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        "animate-fade-in",
        className
      )}
      style={{ zIndex }}
      role="alert"
      aria-live="assertive"
      aria-label={`${ARIA_LABELS.countdown} ${value}`}
    >
      {/* Countdown number */}
      <div
        key={value}
        className={cn(
          "flex items-center justify-center",
          "w-32 h-32 rounded-full",
          "bg-white/10 border-4 border-white/30",
          "text-white text-7xl font-bold",
          "animate-countdown-scale"
        )}
      >
        {value}
      </div>

      {/* Message */}
      <p className="mt-6 text-white/80 text-lg font-medium">
        Recording starts in...
      </p>

      {/* Cancel button */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "mt-8 px-6 py-2 rounded-full",
            "bg-white/10 hover:bg-white/20",
            "text-white text-sm font-medium",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
