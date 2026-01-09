import React, { useCallback, useState } from "react";
import { cn } from "../../utils/cn";

export interface ActionButtonsProps {
  /** Request garbage collection callback */
  onRequestGC: () => void;
  /** Take snapshot callback */
  onTakeSnapshot?: () => void;
  /** Export data callback */
  onExport?: () => void;
  /** Reset history callback */
  onResetHistory?: () => void;
  /** Whether GC is supported */
  gcSupported?: boolean;
  /** Whether snapshot feature is enabled */
  snapshotEnabled?: boolean;
  /** Whether export feature is enabled */
  exportEnabled?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Trash/GC icon
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
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

/**
 * Camera/Snapshot icon
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
 * Download/Export icon
 */
function DownloadIcon({ className }: { className?: string }) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/**
 * Refresh/Reset icon
 */
function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

/**
 * Check icon for success state
 */
function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Action button component
 */
interface ActionButtonProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
  showSuccessState?: boolean;
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
  showSuccessState = false,
}: ActionButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = useCallback(() => {
    onClick();
    if (showSuccessState) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  }, [onClick, showSuccessState]);

  const variantClasses = {
    default: cn(
      "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
      "hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
      "text-slate-700 dark:text-slate-300"
    ),
    primary: cn(
      "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
      "hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700",
      "text-blue-700 dark:text-blue-300"
    ),
    danger: cn(
      "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
      "hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700",
      "text-red-700 dark:text-red-300"
    ),
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || showSuccess}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md",
        "text-xs font-medium",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "focus:ring-blue-500 dark:focus:ring-offset-slate-900",
        showSuccess
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
          : variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {showSuccess ? (
        <CheckIcon className="w-3.5 h-3.5" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      <span>{showSuccess ? "Done" : label}</span>
    </button>
  );
}

/**
 * Action buttons component for memory monitoring controls
 */
export function ActionButtons({
  onRequestGC,
  onTakeSnapshot,
  onExport,
  onResetHistory,
  gcSupported = true,
  snapshotEnabled = true,
  exportEnabled = true,
  className,
}: ActionButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {/* Request GC */}
      <ActionButton
        icon={TrashIcon}
        label="Request GC"
        onClick={onRequestGC}
        variant="primary"
        disabled={!gcSupported}
        showSuccessState
      />

      {/* Take Snapshot */}
      {snapshotEnabled && onTakeSnapshot && (
        <ActionButton
          icon={CameraIcon}
          label="Snapshot"
          onClick={onTakeSnapshot}
          showSuccessState
        />
      )}

      {/* Export Data */}
      {exportEnabled && onExport && (
        <ActionButton
          icon={DownloadIcon}
          label="Export"
          onClick={onExport}
          showSuccessState
        />
      )}

      {/* Reset History */}
      {onResetHistory && (
        <ActionButton
          icon={RefreshIcon}
          label="Reset"
          onClick={onResetHistory}
          variant="danger"
        />
      )}
    </div>
  );
}

ActionButtons.displayName = "ActionButtons";
