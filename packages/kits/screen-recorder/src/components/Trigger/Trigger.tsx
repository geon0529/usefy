import type { FC, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { TriggerIcon } from "./TriggerIcon";
import type { TriggerPosition } from "../../types";
import { POSITION_CLASSES, ARIA_LABELS } from "../../constants";

export interface TriggerProps {
  /**
   * Position of the trigger button
   */
  position?: TriggerPosition;
  /**
   * Custom content for the trigger button
   */
  children?: ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Whether the trigger is disabled
   */
  disabled?: boolean;
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
 * Floating trigger button to start screen recording
 */
export const Trigger: FC<TriggerProps> = ({
  position = "bottom-right",
  children,
  onClick,
  disabled = false,
  className,
  zIndex = 9999,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ARIA_LABELS.triggerButton}
      className={cn(
        // Base styles
        "fixed flex items-center gap-2 px-4 py-2.5 rounded-full",
        "font-medium text-sm shadow-lg",
        // Colors
        "bg-red-600 text-white",
        "hover:bg-red-700 active:bg-red-800",
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        // Disabled styles
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600",
        // Transitions
        "transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        // Position
        POSITION_CLASSES[position],
        className
      )}
      style={{ zIndex }}
    >
      {children ?? (
        <>
          <TriggerIcon className="w-5 h-5" />
          <span>Record</span>
        </>
      )}
    </button>
  );
};
