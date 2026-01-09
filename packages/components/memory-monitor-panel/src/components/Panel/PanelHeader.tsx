import React from "react";
import { cn } from "../../utils/cn";
import type { Severity } from "../../types";
import { SEVERITY_COLORS } from "../../constants";

export interface PanelHeaderProps {
  /** Panel title */
  title?: string;
  /** Current severity level */
  severity?: Severity;
  /** Whether monitoring is active */
  isMonitoring?: boolean;
  /** Close button handler */
  onClose: () => void;
  /** Minimize button handler */
  onMinimize?: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Close icon SVG
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
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

/**
 * Minimize icon SVG
 */
function MinimizeIcon({ className }: { className?: string }) {
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
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/**
 * Panel header component with title and controls
 */
export function PanelHeader({
  title = "Memory Monitor",
  severity = "normal",
  isMonitoring = false,
  onClose,
  onMinimize,
  className,
}: PanelHeaderProps) {
  const severityColor = SEVERITY_COLORS[severity];

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "px-5 py-4",
        "border-b border-slate-100 dark:border-slate-800",
        "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Title and status */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          {title}
        </h2>

        {/* Monitoring status indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <span
            className={cn(
              "w-2 h-2 rounded-full shadow-sm",
              isMonitoring ? "animate-pulse" : "bg-slate-300 dark:bg-slate-600"
            )}
            style={{
              backgroundColor: isMonitoring ? severityColor.accent : undefined,
            }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isMonitoring ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize panel"
            className={cn(
              "p-2 rounded-lg",
              "text-slate-400 hover:text-slate-600",
              "dark:text-slate-500 dark:hover:text-slate-300",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
              "transition-all duration-200"
            )}
          >
            <MinimizeIcon className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className={cn(
            "p-2 rounded-lg",
            "text-slate-400 hover:text-slate-600",
            "dark:text-slate-500 dark:hover:text-slate-300",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "transition-all duration-200"
          )}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

PanelHeader.displayName = "PanelHeader";
