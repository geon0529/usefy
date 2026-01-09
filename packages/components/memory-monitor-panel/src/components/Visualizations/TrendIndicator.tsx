import React from "react";
import { cn } from "../../utils/cn";
import { TREND_COLORS } from "../../constants";
import type { Trend } from "../../types";

export interface TrendIndicatorProps {
  /** Current trend direction */
  trend: Trend;
  /** Leak probability (0-100) */
  leakProbability?: number;
  /** Number of history samples */
  sampleCount?: number;
  /** Compact display mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Icon props with optional style
 */
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Trend arrow icons
 */
const TrendIcons: Record<Trend, React.FC<IconProps>> = {
  increasing: ({ className, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  decreasing: ({ className, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M7 7L17 17" />
      <path d="M17 7v10H7" />
    </svg>
  ),
  stable: ({ className, style }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  ),
};

/**
 * Trend labels
 */
const trendLabels: Record<Trend, string> = {
  increasing: "Increasing",
  decreasing: "Decreasing",
  stable: "Stable",
};

/**
 * Trend text colors
 */
const trendTextColors: Record<Trend, string> = {
  increasing: "text-red-500",
  decreasing: "text-green-500",
  stable: "text-slate-500 dark:text-slate-400",
};

/**
 * Trend indicator badge component
 */
export function TrendIndicator({
  trend,
  leakProbability,
  sampleCount,
  compact = false,
  className,
}: TrendIndicatorProps) {
  const Icon = TrendIcons[trend];
  const label = trendLabels[trend];
  const color = TREND_COLORS[trend];
  const textColor = trendTextColors[trend];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Icon
          className="w-4 h-4"
          style={{ color }}
        />
        <span className={cn("text-sm font-medium", textColor)}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-3 rounded-lg",
        "bg-slate-50 dark:bg-slate-800",
        "border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color }}
            />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Memory Trend
            </div>
            <div className={cn("text-sm font-semibold", textColor)}>
              {label}
            </div>
          </div>
        </div>

        {/* Leak probability badge */}
        {leakProbability !== undefined && leakProbability > 0 && (
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              leakProbability >= 70
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                : leakProbability >= 40
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
            )}
          >
            {leakProbability.toFixed(0)}% risk
          </div>
        )}
      </div>

      {/* Sample count */}
      {sampleCount !== undefined && (
        <div className="text-xs text-slate-400 mt-2">
          Based on {sampleCount} samples
        </div>
      )}
    </div>
  );
}

TrendIndicator.displayName = "TrendIndicator";
