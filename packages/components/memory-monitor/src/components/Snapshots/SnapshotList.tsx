import React, { useCallback } from "react";
import { cn } from "../../utils/cn";
import { SnapshotCard } from "./SnapshotCard";
import type { PanelSnapshot } from "../../types";

export interface SnapshotListProps {
  /** List of snapshots */
  snapshots: PanelSnapshot[];
  /** Currently selected snapshot ID (most recently selected = current) */
  selectedId?: string;
  /** Compare snapshot ID (first selected = baseline) */
  compareId?: string;
  /** Callback when a snapshot is selected */
  onSelect?: (snapshot: PanelSnapshot) => void;
  /** Callback when a snapshot is deleted */
  onDelete?: (id: string) => void;
  /** Maximum snapshots allowed */
  maxSnapshots?: number;
  /** Compact display mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Camera icon for empty state
 */
function CameraIcon({ className }: { className?: string }) {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

/**
 * Snapshot list component displaying all captured snapshots
 */
export function SnapshotList({
  snapshots,
  selectedId,
  compareId,
  onSelect,
  onDelete,
  maxSnapshots = 10,
  compact = false,
  className,
}: SnapshotListProps) {
  const handleSelect = useCallback(
    (snapshot: PanelSnapshot) => {
      onSelect?.(snapshot);
    },
    [onSelect]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(id);
    },
    [onDelete]
  );

  /**
   * Determine the role of a snapshot in comparison
   * - baseline: the compare snapshot (first selected, older reference)
   * - current: the selected snapshot (second selected, newer to compare against baseline)
   */
  const getSelectionRole = (snapshotId: string): "baseline" | "current" | null => {
    if (selectedId && compareId) {
      if (snapshotId === compareId) return "baseline";
      if (snapshotId === selectedId) return "current";
    }
    return null;
  };

  // Empty state
  if (snapshots.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 px-4",
          "text-center",
          className
        )}
      >
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
          <CameraIcon className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
          No Snapshots Yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-48">
          Take a snapshot to capture the current memory state for comparison
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header with count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Snapshots ({snapshots.length}/{maxSnapshots})
        </span>
        {snapshots.length >= maxSnapshots && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            Max reached
          </span>
        )}
      </div>

      {/* Snapshot list */}
      <div className={cn("space-y-2", compact && "space-y-1")}>
        {snapshots.map((snapshot) => (
          <SnapshotCard
            key={snapshot.id}
            snapshot={snapshot}
            selected={selectedId === snapshot.id || compareId === snapshot.id}
            selectionRole={getSelectionRole(snapshot.id)}
            onClick={() => handleSelect(snapshot)}
            onDelete={onDelete ? () => handleDelete(snapshot.id) : undefined}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

SnapshotList.displayName = "SnapshotList";
