import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { TriggerPosition, Severity } from "../../types";
import {
  DEFAULT_TRIGGER_POSITION,
  Z_INDEX,
  SEVERITY_COLORS,
} from "../../constants";

export interface PanelTriggerProps {
  /** Click handler */
  onClick: () => void;
  /** Position of the trigger button */
  position?: TriggerPosition;
  /** Z-index for the trigger */
  zIndex?: number;
  /** Current severity level */
  severity?: Severity;
  /** Custom content */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Dark mode */
  isDark?: boolean;
  /** Accessible label */
  "aria-label"?: string;
}

/**
 * Memory icon SVG
 */
function MemoryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 14h3" />
      <path d="M1 9h3" />
      <path d="M1 14h3" />
    </svg>
  );
}

/**
 * Floating trigger button to open the panel
 */
export const PanelTrigger = forwardRef<HTMLButtonElement, PanelTriggerProps>(
  (
    {
      onClick,
      position = DEFAULT_TRIGGER_POSITION,
      zIndex = Z_INDEX.trigger,
      severity = "normal",
      children,
      className,
      isDark = false,
      "aria-label": ariaLabel = "Open Memory Monitor",
    },
    ref
  ) => {
    const severityColor = SEVERITY_COLORS[severity];

    // Build position style
    const positionStyle: React.CSSProperties = {
      zIndex,
    };
    if (position.top !== undefined) positionStyle.top = position.top;
    if (position.bottom !== undefined) positionStyle.bottom = position.bottom;
    if (position.left !== undefined) positionStyle.left = position.left;
    if (position.right !== undefined) positionStyle.right = position.right;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          "fixed",
          "flex items-center justify-center",
          "w-12 h-12 rounded-2xl",
          "shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30",
          "transition-all duration-300 ease-out",
          "hover:scale-110 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          // Default colors
          "bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white",
          "focus:ring-indigo-500",
          // Severity-based pulse animation for warning/critical
          severity !== "normal" && "animate-pulse",
          isDark && "dark",
          className
        )}
        style={{
          ...positionStyle,
          // Add severity-based glow
          boxShadow:
            severity !== "normal"
              ? `0 0 20px rgba(${severityColor.accentRgb}, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.1)`
              : undefined,
        }}
      >
        {children || <MemoryIcon className="w-6 h-6" />}
      </button>
    );
  }
);

PanelTrigger.displayName = "PanelTrigger";
