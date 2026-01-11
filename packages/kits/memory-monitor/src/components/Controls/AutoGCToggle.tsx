import React, { useCallback, useId } from "react";
import { cn } from "../../utils/cn";

export interface AutoGCToggleProps {
  /** Whether auto-GC is enabled */
  enabled: boolean;
  /** Callback when toggle changes */
  onToggle: (enabled: boolean) => void;
  /** Current threshold value (0-100) */
  threshold: number | null;
  /** Callback when threshold changes */
  onThresholdChange: (threshold: number | null) => void;
  /** Whether the feature is supported */
  isSupported?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Recycle icon component
 */
function RecycleIcon({ className }: { className?: string }) {
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
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}

/**
 * Auto-GC toggle component with threshold configuration
 */
export function AutoGCToggle({
  enabled,
  onToggle,
  threshold,
  onThresholdChange,
  isSupported = true,
  disabled = false,
  className,
}: AutoGCToggleProps) {
  const toggleId = useId();
  const thresholdId = useId();

  const handleToggle = useCallback(() => {
    onToggle(!enabled);
  }, [enabled, onToggle]);

  const handleThresholdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onThresholdChange(value === "" ? null : Number(value));
    },
    [onThresholdChange]
  );

  const isDisabled = disabled || !isSupported;

  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        "bg-slate-50 dark:bg-slate-800",
        "border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              enabled
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-slate-200 dark:bg-slate-700"
            )}
          >
            <RecycleIcon
              className={cn(
                "w-5 h-5",
                enabled
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-500 dark:text-slate-400"
              )}
            />
          </div>
          <div>
            <label
              htmlFor={toggleId}
              className={cn(
                "font-medium text-slate-900 dark:text-slate-100",
                isDisabled && "opacity-50"
              )}
            >
              Auto Garbage Collection
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSupported
                ? "Automatically request GC when threshold is exceeded"
                : "GC hints not supported in this browser"}
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
          disabled={isDisabled}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full shrink-0",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
            "focus:ring-green-500 dark:focus:ring-offset-slate-900",
            enabled
              ? "bg-green-500 dark:bg-green-600"
              : "bg-slate-300 dark:bg-slate-600",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 rounded-full bg-white shadow-sm",
              "transform transition-transform",
              enabled ? "translate-x-[22px]" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {/* Threshold configuration (shown when enabled) */}
      {enabled && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <label
            htmlFor={thresholdId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Trigger Threshold
          </label>
          <div className="flex items-center gap-3">
            <input
              id={thresholdId}
              type="number"
              min={50}
              max={100}
              step={5}
              value={threshold ?? ""}
              onChange={handleThresholdChange}
              placeholder="85"
              disabled={isDisabled}
              className={cn(
                "w-24 px-3 py-2 rounded-lg",
                "bg-white dark:bg-slate-900",
                "border border-slate-300 dark:border-slate-600",
                "text-slate-900 dark:text-slate-100",
                "text-sm font-mono",
                "focus:outline-none focus:ring-2 focus:ring-green-500",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              % memory usage
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            GC will be requested when memory usage exceeds this threshold
            (with 10s cooldown)
          </p>
        </div>
      )}
    </div>
  );
}

AutoGCToggle.displayName = "AutoGCToggle";
