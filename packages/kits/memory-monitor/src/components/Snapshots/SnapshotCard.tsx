import React from "react";
import { cn } from "../../utils/cn";
import { formatBytes, formatTime } from "../../constants";
import type { PanelSnapshot } from "../../types";

export interface SnapshotCardProps {
  /** Snapshot data */
  snapshot: PanelSnapshot;
  /** Whether this snapshot is selected */
  selected?: boolean;
  /** Selection role for comparison (baseline = older, current = newer) */
  selectionRole?: "baseline" | "current" | null;
  /** Click callback */
  onClick?: () => void;
  /** Delete callback */
  onDelete?: () => void;
  /** Compact display mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Trash icon
 */
function TrashIcon({ className }: { className?: string }) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

/**
 * Role badge styles
 */
const ROLE_STYLES = {
  baseline: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700",
    ring: "ring-amber-200 dark:ring-amber-800",
    label: "Baseline",
  },
  current: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700",
    ring: "ring-emerald-200 dark:ring-emerald-800",
    label: "Current",
  },
} as const;

/**
 * Snapshot card component displaying individual snapshot data
 */
export function SnapshotCard({
  snapshot,
  selected = false,
  selectionRole,
  onClick,
  onDelete,
  compact = false,
  className,
}: SnapshotCardProps) {
  const usagePercentage = (snapshot.heapUsed / snapshot.heapLimit) * 100;
  const roleStyle = selectionRole ? ROLE_STYLES[selectionRole] : null;

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center justify-between p-2.5 rounded-lg cursor-pointer",
          "border transition-all duration-200",
          roleStyle
            ? cn(roleStyle.bg, roleStyle.border, "ring-1", roleStyle.ring)
            : selected
            ? "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-1 ring-blue-200 dark:ring-blue-800"
            : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm",
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      >
        <div className="flex items-center gap-2 min-w-0">
          {roleStyle && (
            <span className={cn(
              "px-1.5 py-0.5 text-[10px] font-bold rounded",
              roleStyle.bg,
              roleStyle.text
            )}>
              {roleStyle.label}
            </span>
          )}
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {snapshot.label}
          </span>
          {snapshot.isAuto && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              Auto
            </span>
          )}
          <span className="text-xs text-slate-500">
            {formatTime(snapshot.timestamp)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            {formatBytes(snapshot.heapUsed)}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Delete snapshot"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden cursor-pointer transition-all duration-200",
        roleStyle
          ? cn(roleStyle.bg, roleStyle.border, "ring-1", roleStyle.ring, "shadow-sm")
          : selected
          ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 ring-1 ring-blue-200 dark:ring-blue-800 shadow-sm"
          : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700/50">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {roleStyle && (
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded",
                roleStyle.bg,
                roleStyle.text
              )}>
                {roleStyle.label}
              </span>
            )}
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
              {snapshot.label}
            </h4>
            {snapshot.isAuto && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                Auto
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {formatTime(snapshot.timestamp)}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Delete snapshot"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Memory stats */}
      <div className="p-3 space-y-3">
        {/* Usage bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Heap Usage
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercentage >= 90
                  ? "bg-red-500"
                  : usagePercentage >= 70
                  ? "bg-amber-500"
                  : "bg-green-500"
              )}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
              Used
            </span>
            <p className="font-mono font-semibold text-slate-700 dark:text-slate-200">
              {formatBytes(snapshot.heapUsed)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">
              Total
            </span>
            <p className="font-mono font-semibold text-slate-700 dark:text-slate-200">
              {formatBytes(snapshot.heapTotal)}
            </p>
          </div>
        </div>

        {/* Notes */}
        {snapshot.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-700/50 pt-2 mt-1">
            {snapshot.notes}
          </p>
        )}
      </div>
    </div>
  );
}

SnapshotCard.displayName = "SnapshotCard";
