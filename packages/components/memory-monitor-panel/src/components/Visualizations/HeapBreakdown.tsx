import React, { useMemo } from "react";
import { cn } from "../../utils/cn";
import {
  CHART_COLORS,
  SEVERITY_COLORS,
  formatBytes,
  formatPercentage,
} from "../../constants";
import type { Severity } from "../../types";

export interface HeapBreakdownProps {
  /** Heap used in bytes */
  heapUsed: number | null;
  /** Heap total in bytes */
  heapTotal: number | null;
  /** Heap limit in bytes */
  heapLimit: number | null;
  /** Current severity level */
  severity?: Severity;
  /** Warning threshold percentage */
  warningThreshold?: number;
  /** Critical threshold percentage */
  criticalThreshold?: number;
  /** Custom class name */
  className?: string;
}

interface BreakdownSegment {
  label: string;
  value: number;
  percentage: number;
  color: string;
  textColor: string;
}

/**
 * Visual breakdown of heap memory distribution
 */
export function HeapBreakdown({
  heapUsed,
  heapTotal,
  heapLimit,
  severity = "normal",
  warningThreshold = 70,
  criticalThreshold = 90,
  className,
}: HeapBreakdownProps) {
  // Calculate segments
  const segments = useMemo((): BreakdownSegment[] => {
    if (heapLimit === null || heapLimit === 0) return [];

    const used = heapUsed ?? 0;
    const total = heapTotal ?? 0;
    const available = Math.max(0, total - used);
    const reserved = Math.max(0, heapLimit - total);

    return [
      {
        label: "Used",
        value: used,
        percentage: (used / heapLimit) * 100,
        color: SEVERITY_COLORS[severity].accent,
        textColor: SEVERITY_COLORS[severity].text,
      },
      {
        label: "Available",
        value: available,
        percentage: (available / heapLimit) * 100,
        color: CHART_COLORS.secondary,
        textColor: "text-purple-600 dark:text-purple-400",
      },
      {
        label: "Reserved",
        value: reserved,
        percentage: (reserved / heapLimit) * 100,
        color: CHART_COLORS.grayLight,
        textColor: "text-slate-500 dark:text-slate-400",
      },
    ];
  }, [heapUsed, heapTotal, heapLimit, severity]);

  // Calculate utilization percentage (used / total)
  const utilizationPercent = useMemo(() => {
    if (!heapUsed || !heapTotal || heapTotal === 0) return 0;
    return (heapUsed / heapTotal) * 100;
  }, [heapUsed, heapTotal]);

  // Calculate limit usage percentage (used / limit)
  const limitUsagePercent = useMemo(() => {
    if (!heapUsed || !heapLimit || heapLimit === 0) return 0;
    return (heapUsed / heapLimit) * 100;
  }, [heapUsed, heapLimit]);

  if (segments.length === 0) {
    return (
      <div
        className={cn("text-sm text-slate-400 dark:text-slate-500", className)}
      >
        No memory data available
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {/* Heap Utilization Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Heap Utilization
          </span>
          <span
            className={cn("text-lg font-bold", SEVERITY_COLORS[severity].text)}
          >
            {formatPercentage(utilizationPercent)}
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(utilizationPercent, 100)}%`,
              backgroundColor: SEVERITY_COLORS[severity].accent,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
          <span>{formatBytes(heapUsed)} used</span>
          <span>{formatBytes(heapTotal)} allocated</span>
        </div>
      </div>

      {/* Limit Usage Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Limit Usage
          </span>
          <span
            className={cn("text-lg font-bold", SEVERITY_COLORS[severity].text)}
          >
            {formatPercentage(limitUsagePercent)}
          </span>
        </div>
        <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400/50 z-10"
            style={{ left: `${warningThreshold}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-400/50 z-10"
            style={{ left: `${criticalThreshold}%` }}
          />
          {/* Progress bar */}
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.max(Math.min(limitUsagePercent, 100), 1)}%`,
              backgroundColor: SEVERITY_COLORS[severity].accent,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
          <span>{formatBytes(heapUsed)} used</span>
          <span>{formatBytes(heapLimit)} limit</span>
        </div>
      </div>

      {/* Memory Values Grid */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50"
          >
            <div
              className="w-2 h-2 rounded-full mx-auto mb-2"
              style={{ backgroundColor: segment.color }}
            />
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-wide">
              {segment.label}
            </div>
            <div className={cn("text-sm font-bold", segment.textColor)}>
              {formatBytes(segment.value)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {formatPercentage(segment.percentage)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

HeapBreakdown.displayName = "HeapBreakdown";
