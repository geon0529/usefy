import React from "react";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../constants";

export interface DOMMetricsProps {
  /** Number of DOM nodes */
  domNodes: number | null;
  /** Estimated number of event listeners */
  eventListeners: number | null;
  /** Custom class name */
  className?: string;
}

/**
 * DOM tree icon
 */
function DOMIcon({ className }: { className?: string }) {
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
      <path d="M12 3v6" />
      <circle cx="12" cy="10" r="1" />
      <path d="M12 11v3" />
      <path d="M8 14h8" />
      <path d="M8 14v4" />
      <path d="M16 14v4" />
      <circle cx="8" cy="19" r="1" />
      <circle cx="16" cy="19" r="1" />
    </svg>
  );
}

/**
 * Event listener icon (lightning bolt)
 */
function ListenerIcon({ className }: { className?: string }) {
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
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/**
 * Display component for DOM metrics (nodes and event listeners)
 */
export function DOMMetrics({
  domNodes,
  eventListeners,
  className,
}: DOMMetricsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* DOM Nodes */}
      <div
        className={cn(
          "flex items-center gap-3 p-4",
          "bg-white dark:bg-slate-800/50",
          "border border-slate-100 dark:border-slate-700",
          "rounded-xl shadow-sm",
          "transition-colors hover:border-slate-200 dark:hover:border-slate-600"
        )}
      >
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <DOMIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
            DOM Nodes
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(domNodes)}
          </div>
        </div>
      </div>

      {/* Event Listeners */}
      <div
        className={cn(
          "flex items-center gap-3 p-4",
          "bg-white dark:bg-slate-800/50",
          "border border-slate-100 dark:border-slate-700",
          "rounded-xl shadow-sm",
          "transition-colors hover:border-slate-200 dark:hover:border-slate-600"
        )}
      >
        <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <ListenerIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
            Listeners
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {formatNumber(eventListeners)}
          </div>
        </div>
      </div>
    </div>
  );
}

DOMMetrics.displayName = "DOMMetrics";
