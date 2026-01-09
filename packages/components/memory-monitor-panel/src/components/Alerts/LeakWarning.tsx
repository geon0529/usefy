import React from "react";
import { cn } from "../../utils/cn";
import type { Trend } from "../../types";

export interface LeakWarningProps {
  /** Whether a memory leak is detected */
  isLeaking: boolean;
  /** Leak probability percentage (0-100) */
  probability: number;
  /** Current memory trend */
  trend: Trend;
  /** Recommendation text */
  recommendation?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Compact display mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Warning icon component
 */
function WarningIcon({ className }: { className?: string }) {
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
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/**
 * Close icon component
 */
function CloseIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Get severity level based on probability
 */
function getSeverityLevel(probability: number): "low" | "medium" | "high" {
  if (probability >= 70) return "high";
  if (probability >= 40) return "medium";
  return "low";
}

/**
 * Severity color classes
 */
const severityColors = {
  low: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: "text-amber-500 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-200",
    text: "text-amber-700 dark:text-amber-300",
  },
  medium: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    icon: "text-orange-500 dark:text-orange-400",
    title: "text-orange-800 dark:text-orange-200",
    text: "text-orange-700 dark:text-orange-300",
  },
  high: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-500 dark:text-red-400",
    title: "text-red-800 dark:text-red-200",
    text: "text-red-700 dark:text-red-300",
  },
};

/**
 * Memory leak warning banner component
 */
export function LeakWarning({
  isLeaking,
  probability,
  trend,
  recommendation,
  dismissible = false,
  onDismiss,
  compact = false,
  className,
}: LeakWarningProps) {
  // Don't render if not leaking
  if (!isLeaking) return null;

  const severityLevel = getSeverityLevel(probability);
  const colors = severityColors[severityLevel];

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm",
          colors.bg,
          colors.border,
          className
        )}
      >
        <WarningIcon className={cn("w-4 h-4 flex-shrink-0", colors.icon)} />
        <span className={cn("text-sm font-medium", colors.title)}>
          Memory leak detected ({probability.toFixed(0)}% probability)
        </span>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "ml-auto p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10",
              colors.icon
            )}
            aria-label="Dismiss warning"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden shadow-sm",
        colors.bg,
        colors.border,
        className
      )}
      role="alert"
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div
          className={cn(
            "p-2 rounded-lg flex-shrink-0",
            severityLevel === "high"
              ? "bg-red-100 dark:bg-red-900/40"
              : severityLevel === "medium"
              ? "bg-orange-100 dark:bg-orange-900/40"
              : "bg-amber-100 dark:bg-amber-900/40"
          )}
        >
          <WarningIcon className={cn("w-5 h-5", colors.icon)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn("font-semibold", colors.title)}>
              Potential Memory Leak Detected
            </h4>
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className={cn(
                  "p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors",
                  colors.icon
                )}
                aria-label="Dismiss warning"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className={cn("text-sm mt-1", colors.text)}>
            Memory usage is consistently {trend} with a{" "}
            <strong>{probability.toFixed(0)}%</strong> probability of a memory
            leak.
          </p>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div
          className={cn(
            "px-4 py-3 border-t",
            colors.border,
            "bg-white/50 dark:bg-black/20"
          )}
        >
          <p className={cn("text-sm", colors.text)}>
            <strong>Recommendation:</strong> {recommendation}
          </p>
        </div>
      )}

      {/* Action hints */}
      <div
        className={cn(
          "px-4 py-3 border-t",
          colors.border,
          "bg-white/30 dark:bg-black/10"
        )}
      >
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
              "bg-white dark:bg-slate-800",
              colors.text
            )}
          >
            Check for unsubscribed subscriptions
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
              "bg-white dark:bg-slate-800",
              colors.text
            )}
          >
            Review event listeners
          </span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
              "bg-white dark:bg-slate-800",
              colors.text
            )}
          >
            Check for stale closures
          </span>
        </div>
      </div>
    </div>
  );
}

LeakWarning.displayName = "LeakWarning";
