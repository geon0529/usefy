import type { FC } from "react";
import { cn } from "../../utils/cn";
import type { RecordingState } from "../../types";

export interface StatusBadgeProps {
  /**
   * Current recording state
   */
  state: RecordingState;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Status badge showing current recording state
 */
export const StatusBadge: FC<StatusBadgeProps> = ({ state, className }) => {
  const getStatusConfig = () => {
    switch (state) {
      case "recording":
        return {
          label: "REC",
          dotClass: "bg-red-500 animate-pulse-record",
          textClass: "text-red-600 dark:text-red-400",
          bgClass: "bg-red-50 dark:bg-red-900/20",
        };
      case "paused":
        return {
          label: "PAUSED",
          dotClass: "bg-amber-500",
          textClass: "text-amber-600 dark:text-amber-400",
          bgClass: "bg-amber-50 dark:bg-amber-900/20",
        };
      case "requesting":
        return {
          label: "REQUESTING",
          dotClass: "bg-blue-500 animate-pulse",
          textClass: "text-blue-600 dark:text-blue-400",
          bgClass: "bg-blue-50 dark:bg-blue-900/20",
        };
      case "countdown":
        return {
          label: "STARTING",
          dotClass: "bg-amber-500 animate-pulse",
          textClass: "text-amber-600 dark:text-amber-400",
          bgClass: "bg-amber-50 dark:bg-amber-900/20",
        };
      case "stopped":
        return {
          label: "STOPPED",
          dotClass: "bg-gray-500",
          textClass: "text-gray-600 dark:text-gray-400",
          bgClass: "bg-gray-50 dark:bg-gray-800",
        };
      case "error":
        return {
          label: "ERROR",
          dotClass: "bg-red-500",
          textClass: "text-red-600 dark:text-red-400",
          bgClass: "bg-red-50 dark:bg-red-900/20",
        };
      default:
        return {
          label: "IDLE",
          dotClass: "bg-gray-400",
          textClass: "text-gray-500 dark:text-gray-400",
          bgClass: "bg-gray-50 dark:bg-gray-800",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full",
        config.bgClass,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
      <span className={cn("text-xs font-semibold uppercase", config.textClass)}>
        {config.label}
      </span>
    </div>
  );
};
