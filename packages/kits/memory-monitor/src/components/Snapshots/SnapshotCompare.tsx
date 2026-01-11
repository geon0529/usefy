import React from "react";
import { cn } from "../../utils/cn";
import { formatBytes } from "../../constants";
import type { PanelSnapshot } from "../../types";

export interface SnapshotCompareProps {
  /** First snapshot (baseline) */
  baseline: PanelSnapshot;
  /** Second snapshot (current) */
  current: PanelSnapshot;
  /** Custom class name */
  className?: string;
}

/**
 * Arrow up icon
 */
function ArrowUpIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

/**
 * Arrow down icon
 */
function ArrowDownIcon({ className }: { className?: string }) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

/**
 * Check if a value is valid for comparison
 */
function isValidNumber(value: number | undefined | null): value is number {
  return value != null && !Number.isNaN(value) && Number.isFinite(value);
}

/**
 * Calculate difference between two values
 */
function calculateDiff(
  baseline: number | undefined | null,
  current: number | undefined | null
): { diff: number; percentage: number; direction: "up" | "down" | "same"; isValid: boolean } {
  // Handle invalid values
  if (!isValidNumber(baseline) || !isValidNumber(current)) {
    return { diff: 0, percentage: 0, direction: "same", isValid: false };
  }

  const diff = current - baseline;
  const percentage = baseline > 0 ? (diff / baseline) * 100 : 0;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "same";
  return { diff, percentage, direction, isValid: true };
}

/**
 * Diff badge component
 */
interface DiffBadgeProps {
  diff: number;
  percentage: number;
  direction: "up" | "down" | "same";
  format?: (value: number) => string;
  isValid?: boolean;
}

function DiffBadge({
  diff,
  percentage,
  direction,
  format = formatBytes,
  isValid = true,
}: DiffBadgeProps) {
  // Handle invalid/unavailable data
  if (!isValid) {
    return (
      <span className="text-xs text-slate-400 dark:text-slate-500 italic">
        N/A
      </span>
    );
  }

  if (direction === "same") {
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        No change
      </span>
    );
  }

  const isIncrease = direction === "up";
  const Icon = isIncrease ? ArrowUpIcon : ArrowDownIcon;

  // Use absolute value for formatting (formatBytes doesn't handle negative numbers)
  const formattedValue = format(Math.abs(diff));
  const formattedPercentage = Math.abs(percentage).toFixed(1);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        isIncrease
          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      )}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>
        {isIncrease ? "+" : "-"}
        {formattedValue} ({formattedPercentage}%)
      </span>
    </div>
  );
}

/**
 * Safely format a value, returning "N/A" for invalid values
 */
function safeFormat(
  value: number | undefined | null,
  format: (value: number) => string
): string {
  if (!isValidNumber(value)) {
    return "N/A";
  }
  return format(value);
}

/**
 * Comparison row component
 */
interface CompareRowProps {
  label: string;
  baseline: number | undefined | null;
  current: number | undefined | null;
  format?: (value: number) => string;
}

function CompareRow({
  label,
  baseline,
  current,
  format = formatBytes,
}: CompareRowProps) {
  const { diff, percentage, direction, isValid } = calculateDiff(baseline, current);

  return (
    <div className="grid grid-cols-4 gap-2 items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <span className="text-sm font-mono text-slate-600 dark:text-slate-400 text-center">
        {safeFormat(baseline, format)}
      </span>
      <span className="text-sm font-mono text-slate-900 dark:text-slate-100 text-center">
        {safeFormat(current, format)}
      </span>
      <div className="flex justify-end">
        <DiffBadge
          diff={diff}
          percentage={percentage}
          direction={direction}
          format={format}
          isValid={isValid}
        />
      </div>
    </div>
  );
}

/**
 * Snapshot comparison component
 */
export function SnapshotCompare({
  baseline,
  current,
  className,
}: SnapshotCompareProps) {
  const heapDiff = calculateDiff(baseline.heapUsed, current.heapUsed);
  const timeDiff = current.timestamp - baseline.timestamp;
  const timeDiffSeconds = Math.round(timeDiff / 1000);

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">
          Snapshot Comparison
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {baseline.label} → {current.label} ({timeDiffSeconds}s apart)
        </p>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Overall Memory Change
          </span>
          <DiffBadge
            diff={heapDiff.diff}
            percentage={heapDiff.percentage}
            direction={heapDiff.direction}
            isValid={heapDiff.isValid}
          />
        </div>
      </div>

      {/* Comparison table */}
      <div className="px-4 py-2 bg-white dark:bg-slate-900">
        {/* Column headers */}
        <div className="grid grid-cols-4 gap-2 text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
          <span>Metric</span>
          <span className="text-center">Baseline</span>
          <span className="text-center">Current</span>
          <span className="text-right">Change</span>
        </div>

        {/* Rows */}
        <CompareRow
          label="Heap Used"
          baseline={baseline.heapUsed}
          current={current.heapUsed}
        />
        <CompareRow
          label="Heap Total"
          baseline={baseline.heapTotal}
          current={current.heapTotal}
        />
        <CompareRow
          label="Heap Limit"
          baseline={baseline.heapLimit}
          current={current.heapLimit}
        />
        {baseline.domNodes !== undefined && current.domNodes !== undefined && (
          <CompareRow
            label="DOM Nodes"
            baseline={baseline.domNodes}
            current={current.domNodes}
            format={(v) => v.toLocaleString()}
          />
        )}
        {baseline.eventListeners !== undefined &&
          current.eventListeners !== undefined && (
            <CompareRow
              label="Listeners"
              baseline={baseline.eventListeners}
              current={current.eventListeners}
              format={(v) => v.toLocaleString()}
            />
          )}
      </div>

      {/* Analysis */}
      {heapDiff.isValid && heapDiff.direction !== "same" && (
        <div
          className={cn(
            "px-4 py-3 border-t",
            heapDiff.direction === "up"
              ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
              : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900"
          )}
        >
          <p
            className={cn(
              "text-xs",
              heapDiff.direction === "up"
                ? "text-red-700 dark:text-red-300"
                : "text-green-700 dark:text-green-300"
            )}
          >
            {heapDiff.direction === "up" ? (
              <>
                Memory increased by{" "}
                <strong>{formatBytes(heapDiff.diff)}</strong> (
                {heapDiff.percentage.toFixed(1)}%). Consider checking for memory
                leaks if this pattern continues.
              </>
            ) : (
              <>
                Memory decreased by{" "}
                <strong>{formatBytes(Math.abs(heapDiff.diff))}</strong> (
                {Math.abs(heapDiff.percentage).toFixed(1)}%). Memory is being
                released as expected.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

SnapshotCompare.displayName = "SnapshotCompare";
