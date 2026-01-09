import React, { useCallback, useId } from "react";
import { cn } from "../../utils/cn";
import {
  SNAPSHOT_SCHEDULE_OPTIONS,
  DEFAULT_MAX_SNAPSHOTS,
  MIN_SNAPSHOTS_LIMIT,
  MAX_SNAPSHOTS_LIMIT,
} from "../../constants";
import type { SnapshotSettings as SnapshotSettingsType, SnapshotScheduleInterval } from "../../types";

export interface SnapshotSettingsProps {
  /** Current snapshot settings */
  value: SnapshotSettingsType;
  /** Callback when settings change */
  onChange: (settings: SnapshotSettingsType) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Camera icon for snapshots
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/**
 * Clock icon for schedule
 */
function ScheduleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Snapshot settings component for configuring snapshot behavior
 */
export function SnapshotSettings({
  value,
  onChange,
  disabled = false,
  className,
}: SnapshotSettingsProps) {
  const maxSnapshotsId = useId();
  const scheduleId = useId();
  const autoDeleteId = useId();

  const handleMaxSnapshotsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Math.min(
        MAX_SNAPSHOTS_LIMIT,
        Math.max(MIN_SNAPSHOTS_LIMIT, Number(e.target.value) || DEFAULT_MAX_SNAPSHOTS)
      );
      onChange({ ...value, maxSnapshots: newValue });
    },
    [onChange, value]
  );

  const handleScheduleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...value, scheduleInterval: e.target.value as SnapshotScheduleInterval });
    },
    [onChange, value]
  );

  const handleAutoDeleteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, autoDeleteOldest: e.target.checked });
    },
    [onChange, value]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Section header */}
      <div className="flex items-center gap-2">
        <CameraIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Snapshot Settings
        </h4>
      </div>

      {/* Max snapshots input */}
      <div className="space-y-2">
        <label
          htmlFor={maxSnapshotsId}
          className={cn(
            "block text-sm font-medium",
            "text-slate-700 dark:text-slate-300",
            disabled && "opacity-50"
          )}
        >
          Maximum Snapshots
        </label>
        <div className="flex items-center gap-2">
          <input
            id={maxSnapshotsId}
            type="number"
            min={MIN_SNAPSHOTS_LIMIT}
            max={MAX_SNAPSHOTS_LIMIT}
            value={value.maxSnapshots}
            onChange={handleMaxSnapshotsChange}
            disabled={disabled}
            className={cn(
              "w-20 px-3 py-2 rounded-lg",
              "bg-white dark:bg-slate-800",
              "border border-slate-300 dark:border-slate-600",
              "text-slate-900 dark:text-slate-100",
              "text-sm text-center",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            (1-50)
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Maximum number of snapshots to store
        </p>
      </div>

      {/* Schedule selector */}
      <div className="space-y-2">
        <label
          htmlFor={scheduleId}
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            "text-slate-700 dark:text-slate-300",
            disabled && "opacity-50"
          )}
        >
          <ScheduleIcon className="w-4 h-4" />
          <span>Auto Snapshot Schedule</span>
        </label>
        <div className="relative">
          <select
            id={scheduleId}
            value={value.scheduleInterval}
            onChange={handleScheduleChange}
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 rounded-lg appearance-none",
              "bg-white dark:bg-slate-800",
              "border border-slate-300 dark:border-slate-600",
              "text-slate-900 dark:text-slate-100",
              "text-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "pr-10",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {SNAPSHOT_SCHEDULE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Automatically capture snapshots at regular intervals
        </p>
      </div>

      {/* Auto-delete toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label
            htmlFor={autoDeleteId}
            className={cn(
              "text-sm font-medium",
              "text-slate-700 dark:text-slate-300",
              disabled && "opacity-50"
            )}
          >
            Auto-delete oldest
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Delete oldest snapshot when max is reached
          </p>
        </div>
        <button
          id={autoDeleteId}
          type="button"
          role="switch"
          aria-checked={value.autoDeleteOldest}
          onClick={() => onChange({ ...value, autoDeleteOldest: !value.autoDeleteOldest })}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full",
            "border-2 border-transparent",
            "transition-colors duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            value.autoDeleteOldest
              ? "bg-blue-600"
              : "bg-slate-200 dark:bg-slate-700",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full",
              "bg-white shadow ring-0",
              "transition duration-200 ease-in-out",
              value.autoDeleteOldest ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}

SnapshotSettings.displayName = "SnapshotSettings";
