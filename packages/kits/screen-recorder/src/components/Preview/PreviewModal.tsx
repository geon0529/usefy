import type { FC } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
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
import styles from "./PreviewModal.module.scss";

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
      className={clsx(
        styles.overlay,
        isDark && "dark",
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
        className={styles.modal}
        tabIndex={-1}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="preview-title" className={styles.title}>
            Recording Complete
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={ARIA_LABELS.closePreview}
            className={styles.closeButton}
          >
            <CloseIcon className={styles.closeIcon} />
          </button>
        </div>

        {/* Video preview */}
        <div className={styles.content}>
          <VideoPlayer
            src={result.url}
            className={styles.videoWrapper}
            showControls
            knownDuration={result.duration}
          />

          {/* Recording info */}
          <p id="preview-description" className={styles.recordingInfo}>
            Duration: {formatDuration(result.duration)} • Size:{" "}
            {formatBytes(result.size)} • {getFormatLabel(result.mimeType)}
            {result.hasAudio && " • With audio"}
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Download button */}
          <button
            type="button"
            onClick={onDownload}
            aria-label={ARIA_LABELS.downloadButton}
            className={styles.downloadButton}
          >
            <DownloadIcon className={styles.buttonIcon} />
            Download
          </button>

          {/* Re-record button */}
          <button
            type="button"
            onClick={onReRecord}
            aria-label={ARIA_LABELS.reRecordButton}
            className={styles.reRecordButton}
          >
            <RefreshIcon className={styles.buttonIcon} />
            Re-record
          </button>

          {/* Done button */}
          <button
            type="button"
            onClick={onClose}
            className={styles.doneButton}
          >
            <CheckIcon className={styles.buttonIcon} />
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
