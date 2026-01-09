import React, { useCallback, useId } from "react";
import { cn } from "../../utils/cn";
import { INTERVAL_OPTIONS } from "../../constants";

export interface IntervalSelectorProps {
  /** Current interval in milliseconds */
  value: number;
  /** Callback when interval changes */
  onChange: (interval: number) => void;
  /** Custom interval options */
  options?: readonly { readonly value: number; readonly label: string }[];
  /** Disabled state */
  disabled?: boolean;
  /** Show label */
  showLabel?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Clock icon
 */
function ClockIcon({ className }: { className?: string }) {
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
 * Interval selector component for polling interval configuration
 */
export function IntervalSelector({
  value,
  onChange,
  options = INTERVAL_OPTIONS,
  disabled = false,
  showLabel = true,
  className,
}: IntervalSelectorProps) {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <label
          htmlFor={id}
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            "text-slate-700 dark:text-slate-300",
            disabled && "opacity-50"
          )}
        >
          <ClockIcon className="w-4 h-4" />
          <span>Polling Interval</span>
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={handleChange}
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
          {options.map((option) => (
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
        How often to poll for memory updates
      </p>
    </div>
  );
}

IntervalSelector.displayName = "IntervalSelector";
