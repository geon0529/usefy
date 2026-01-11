import type { FC } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { VideoPlayer } from "./VideoPlayer";
import {
  CloseIcon,
  DownloadIcon,
  RefreshIcon,
  CheckIcon,
} from "../Trigger/TriggerIcon";
import { ARIA_LABELS } from "../../constants";
import { formatBytes } from "../../utils/downloadBlob";
import type { RecordingResult, ThemeOption } from "../../types";

export interface PreviewModalProps {
  /**
   * Recording result to preview
   */
  result: RecordingResult;
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Download handler
   */
  onDownload?: () => void;
  /**
   * Re-record handler
   */
  onReRecord?: () => void;
  /**
   * Done/Close handler
   */
  onClose?: () => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Z-index for modal
   */
  zIndex?: number;
  /**
   * Use portal for rendering
   */
  usePortal?: boolean;
  /**
   * Theme for the modal
   */
  theme?: ThemeOption;
}

/**
 * Preview modal for recorded video
 */
export const PreviewModal: FC<PreviewModalProps> = ({
  result,
  isOpen,
  onDownload,
  onReRecord,
  onClose,
  className,
  zIndex = 10000,
  usePortal = true,
  theme = "system",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    modalRef.current.focus();

    return () => {
      previousActiveElement?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine if dark mode should be applied
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);

  const modalContent = (
    <div
      className={cn(
        // Dark mode wrapper for portal
        isDark && "dark",
        // Fullscreen overlay
        "fixed inset-0 flex items-center justify-center p-4",
        "bg-black/60 backdrop-blur-sm",
        "animate-fade-in",
        className
      )}
      style={{ zIndex }}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      aria-describedby="preview-description"
    >
      <div
        ref={modalRef}
        className={cn(
          // Modal container
          "relative w-full max-w-2xl",
          "bg-white dark:bg-gray-800 rounded-xl shadow-2xl",
          "animate-slide-up",
          "focus:outline-none"
        )}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="preview-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Recording Complete
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={ARIA_LABELS.closePreview}
            className={cn(
              "p-2 rounded-full",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          >
            <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Video preview */}
        <div className="p-6">
          <VideoPlayer
            src={result.url}
            className="w-full aspect-video"
            showControls
            knownDuration={result.duration}
          />

          {/* Recording info */}
          <p
            id="preview-description"
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center"
          >
            Duration: {formatDuration(result.duration)} • Size:{" "}
            {formatBytes(result.size)} • {getFormatLabel(result.mimeType)}
            {result.hasAudio && " • With audio"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            aria-label={ARIA_LABELS.downloadButton}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "font-medium text-sm",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "dark:focus:ring-offset-gray-800"
            )}
          >
            <DownloadIcon className="w-4 h-4" />
            Download
          </button>

          {/* Re-record button */}
          <button
            type="button"
            onClick={onReRecord}
            aria-label={ARIA_LABELS.reRecordButton}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600",
              "text-gray-700 dark:text-gray-300",
              "font-medium text-sm",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
              "dark:focus:ring-offset-gray-800"
            )}
          >
            <RefreshIcon className="w-4 h-4" />
            Re-record
          </button>

          {/* Done button */}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-green-600 hover:bg-green-700 text-white",
              "font-medium text-sm",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
              "dark:focus:ring-offset-gray-800"
            )}
          >
            <CheckIcon className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal for rendering outside component tree
  if (usePortal && typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

/**
 * Get human-readable format label from MIME type
 */
function getFormatLabel(mimeType: string): string {
  if (mimeType.includes("webm")) return "WebM";
  if (mimeType.includes("mp4")) return "MP4";
  return "Video";
}
