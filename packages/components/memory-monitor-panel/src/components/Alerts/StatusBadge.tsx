import React from "react";
import { cn } from "../../utils/cn";
import { SEVERITY_COLORS } from "../../constants";
import type { Severity } from "../../types";

export interface StatusBadgeProps {
  /** Current severity level */
  severity: Severity;
  /** Show pulse animation for warning/critical */
  pulse?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom class name */
  className?: string;
}

/**
 * Severity labels
 */
const severityLabels: Record<Severity, string> = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

/**
 * Size classes
 */
const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

/**
 * Dot size classes
 */
const dotSizeClasses = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

/**
 * Status badge component showing current memory severity
 */
export function StatusBadge({
  severity,
  pulse = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  const colors = SEVERITY_COLORS[severity];
  const label = severityLabels[severity];
  const shouldPulse = pulse && severity !== "normal";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        sizeClasses[size],
        colors.bg,
        colors.bgDark,
        colors.text,
        colors.textDark,
        className
      )}
    >
      {/* Status dot */}
      <span className="relative flex">
        <span
          className={cn(
            "rounded-full",
            dotSizeClasses[size]
          )}
          style={{ backgroundColor: colors.accent }}
        />
        {shouldPulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-75",
              dotSizeClasses[size]
            )}
            style={{ backgroundColor: colors.accent }}
          />
        )}
      </span>

      {/* Label */}
      <span>{label}</span>
    </div>
  );
}

StatusBadge.displayName = "StatusBadge";
