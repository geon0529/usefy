import React, { useCallback, useId } from "react";
import { cn } from "../../utils/cn";

export interface ThresholdSliderProps {
  /** Slider label */
  label: string;
  /** Current value (0-100) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Accent color */
  color?: string;
  /** Show value badge */
  showValue?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Helper text */
  helperText?: string;
  /** Custom class name */
  className?: string;
}

/**
 * Threshold slider component for adjusting memory thresholds
 */
export function ThresholdSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = "#3b82f6",
  showValue = true,
  disabled = false,
  helperText,
  className,
}: ThresholdSliderProps) {
  const id = useId();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label and value */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-slate-700 dark:text-slate-300",
            disabled && "opacity-50"
          )}
        >
          {label}
        </label>
        {showValue && (
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-semibold",
              "bg-slate-100 dark:bg-slate-700",
              "text-slate-700 dark:text-slate-300",
              disabled && "opacity-50"
            )}
          >
            {value}%
          </span>
        )}
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full h-2 rounded-full appearance-none cursor-pointer",
            "bg-slate-200 dark:bg-slate-700",
            disabled && "cursor-not-allowed opacity-50",
            // Webkit browsers
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:shadow-md",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb]:transition-transform",
            "[&::-webkit-slider-thumb]:hover:scale-110",
            disabled && "[&::-webkit-slider-thumb]:cursor-not-allowed",
            // Firefox
            "[&::-moz-range-thumb]:w-4",
            "[&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:border-0",
            "[&::-moz-range-thumb]:shadow-md",
            "[&::-moz-range-thumb]:cursor-pointer",
            disabled && "[&::-moz-range-thumb]:cursor-not-allowed"
          )}
          style={{
            background: disabled
              ? undefined
              : `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, transparent ${percentage}%, transparent 100%)`,
            // @ts-expect-error CSS custom property
            "--thumb-color": color,
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            background-color: var(--thumb-color, #3b82f6);
          }
          input[type="range"]::-moz-range-thumb {
            background-color: var(--thumb-color, #3b82f6);
          }
        `}</style>
      </div>

      {/* Helper text */}
      {helperText && (
        <p
          className={cn(
            "text-xs text-slate-500 dark:text-slate-400",
            disabled && "opacity-50"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

ThresholdSlider.displayName = "ThresholdSlider";
