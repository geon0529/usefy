import { forwardRef, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import type { ScreenRecorderProps } from "./types";
import { DEFAULT_OPTIONS } from "./constants";
import { useScreenRecorder } from "./useScreenRecorder";
import { Trigger } from "./components/Trigger";
import { RecordingControls } from "./components/Controls";
import { Countdown } from "./components/Countdown";
import { PreviewModal } from "./components/Preview";
import { ErrorMessage } from "./components/Status";
import { generateFilename } from "./utils/downloadBlob";
import styles from "./ScreenRecorder.module.scss";

/**
 * ScreenRecorder component for capturing screen recordings
 *
 * A complete UI solution for screen recording with floating trigger,
 * recording controls, countdown, and preview modal.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <div>
 *       <h1>My Application</h1>
 *       <ScreenRecorder
 *         onRecordingStop={(result) => {
 *           console.log('Recording complete:', result);
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Bug report integration
 * function BugReportForm() {
 *   const [recording, setRecording] = useState<RecordingResult | null>(null);
 *
 *   return (
 *     <form>
 *       <textarea placeholder="Describe the bug..." />
 *       <ScreenRecorder
 *         position="bottom-left"
 *         maxDuration={60}
 *         onRecordingStop={setRecording}
 *         triggerContent={
 *           recording ? "✓ Recording attached" : "📹 Record screen"
 *         }
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 * ```
 */
export const ScreenRecorder = forwardRef<HTMLDivElement, ScreenRecorderProps>(
  (props, ref) => {
    const {
      // Recording options
      maxDuration = DEFAULT_OPTIONS.maxDuration,
      countdown = DEFAULT_OPTIONS.countdown,
      audio = DEFAULT_OPTIONS.audio,
      quality = DEFAULT_OPTIONS.quality,
      mimeType = DEFAULT_OPTIONS.mimeType,

      // UI options
      position = DEFAULT_OPTIONS.position,
      triggerContent,
      showPreview = DEFAULT_OPTIONS.showPreview,
      showTimer = DEFAULT_OPTIONS.showTimer,
      zIndex = DEFAULT_OPTIONS.zIndex,
      theme = DEFAULT_OPTIONS.theme,
      className,
      filename = DEFAULT_OPTIONS.filename,

      // Callbacks
      onRecordingStart,
      onRecordingStop,
      onPause,
      onResume,
      onDownload,
      onError,
      onPermissionDenied,
      onTick,

      // Advanced
      autoDownload = DEFAULT_OPTIONS.autoDownload,
      disabled = false,
      renderMode = DEFAULT_OPTIONS.renderMode,
    } = props;

    // Track previous state for detecting transitions
    const prevStateRef = useRef<string>("idle");
    const prevElapsedRef = useRef<number>(0);
    const autoDownloadTriggeredRef = useRef<boolean>(false);

    // Use the main hook
    const recorder = useScreenRecorder({
      maxDuration,
      countdown,
      audio,
      quality,
      mimeType,
      onError: (error) => {
        if (error.code === "PERMISSION_DENIED") {
          onPermissionDenied?.();
        }
        onError?.(error);
      },
    });

    // Call onRecordingStart when recording actually starts
    useEffect(() => {
      if (
        recorder.state === "recording" &&
        prevStateRef.current !== "recording" &&
        prevStateRef.current !== "paused"
      ) {
        onRecordingStart?.();
      }
      prevStateRef.current = recorder.state;
    }, [recorder.state, onRecordingStart]);

    // Call onTick when elapsed changes during recording
    useEffect(() => {
      if (
        (recorder.isRecording || recorder.isPaused) &&
        recorder.elapsed !== prevElapsedRef.current
      ) {
        onTick?.(recorder.elapsed, recorder.remaining);
        prevElapsedRef.current = recorder.elapsed;
      }
    }, [
      recorder.elapsed,
      recorder.remaining,
      recorder.isRecording,
      recorder.isPaused,
      onTick,
    ]);

    // Handle auto-download and onRecordingStop when showPreview is false
    useEffect(() => {
      if (
        recorder.state === "stopped" &&
        recorder.result &&
        !showPreview &&
        !autoDownloadTriggeredRef.current
      ) {
        // Mark as triggered to prevent multiple calls
        autoDownloadTriggeredRef.current = true;

        // Call onRecordingStop callback
        onRecordingStop?.(recorder.result);

        // Auto-download if enabled
        if (autoDownload) {
          const downloadFilename =
            typeof filename === "function"
              ? filename(recorder.result.timestamp)
              : generateFilename(recorder.result.timestamp);

          recorder.download(downloadFilename);
          onDownload?.(recorder.result);
        }

        // Reset to idle state after a short delay
        setTimeout(() => {
          recorder.reset();
          autoDownloadTriggeredRef.current = false;
        }, 100);
      }
    }, [
      recorder.state,
      recorder.result,
      showPreview,
      autoDownload,
      filename,
      recorder,
      onRecordingStop,
      onDownload,
    ]);

    // Reset auto-download trigger when state changes to idle
    useEffect(() => {
      if (recorder.state === "idle") {
        autoDownloadTriggeredRef.current = false;
      }
    }, [recorder.state]);

    // Handle recording start
    const handleStart = useCallback(async () => {
      await recorder.start();
    }, [recorder]);

    // Handle recording stop
    const handleStop = useCallback(() => {
      recorder.stop();
    }, [recorder]);

    // Handle pause
    const handlePause = useCallback(() => {
      recorder.pause();
      onPause?.();
    }, [recorder, onPause]);

    // Handle resume
    const handleResume = useCallback(() => {
      recorder.resume();
      onResume?.();
    }, [recorder, onResume]);

    // Handle download
    const handleDownload = useCallback(() => {
      if (!recorder.result) return;

      const downloadFilename =
        typeof filename === "function"
          ? filename(recorder.result.timestamp)
          : generateFilename(recorder.result.timestamp);

      recorder.download(downloadFilename);
      onDownload?.(recorder.result);
    }, [recorder, filename, onDownload]);

    // Handle re-record
    const handleReRecord = useCallback(async () => {
      recorder.reset();
      // Start new recording immediately
      await recorder.start();
    }, [recorder]);

    // Handle preview close
    const handlePreviewClose = useCallback(() => {
      if (recorder.result) {
        onRecordingStop?.(recorder.result);
      }
      recorder.reset();
    }, [recorder, onRecordingStop]);

    // Handle countdown cancel
    const handleCountdownCancel = useCallback(() => {
      recorder.stop();
    }, [recorder]);

    // Handle error dismiss
    const handleErrorDismiss = useCallback(() => {
      recorder.reset();
    }, [recorder]);

    // Handle error retry
    const handleErrorRetry = useCallback(() => {
      recorder.reset();
      handleStart();
    }, [recorder, handleStart]);

    // Determine what to render based on state
    const renderContent = () => {
      // Browser not supported
      if (!recorder.isSupported) {
        return (
          <ErrorMessage
            error={{
              code: "NOT_SUPPORTED",
              message:
                "Screen recording is not supported in your browser. Please use Chrome, Edge, or Firefox on desktop.",
            }}
            position={position}
            zIndex={zIndex}
          />
        );
      }

      // Error state
      if (recorder.error && recorder.state === "error") {
        return (
          <ErrorMessage
            error={recorder.error}
            onRetry={handleErrorRetry}
            onDismiss={handleErrorDismiss}
            position={position}
            zIndex={zIndex}
          />
        );
      }

      // Countdown state
      if (recorder.isCountingDown && recorder.countdownValue != null) {
        return (
          <Countdown
            value={recorder.countdownValue}
            onCancel={handleCountdownCancel}
            zIndex={zIndex + 1}
          />
        );
      }

      // Recording or paused state
      if (recorder.isRecording || recorder.isPaused) {
        return (
          <RecordingControls
            elapsed={recorder.elapsed}
            elapsedFormatted={recorder.elapsedFormatted}
            remaining={recorder.remaining}
            maxDuration={maxDuration}
            isPaused={recorder.isPaused}
            isRecording={recorder.isRecording}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            position={position}
            zIndex={zIndex}
          />
        );
      }

      // Stopped state with preview
      if (recorder.state === "stopped" && recorder.result && showPreview) {
        return (
          <PreviewModal
            result={recorder.result}
            isOpen={true}
            onDownload={handleDownload}
            onReRecord={handleReRecord}
            onClose={handlePreviewClose}
            zIndex={zIndex + 1}
            usePortal={renderMode === "portal"}
            theme={theme}
          />
        );
      }

      // Requesting state - show loading trigger
      if (recorder.state === "requesting") {
        return (
          <Trigger
            position={position}
            disabled={true}
            zIndex={zIndex}
            className={clsx(styles.opacityReduced, className)}
          >
            <span className={styles.requestingContent}>
              <svg
                className={styles.spinner}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className={styles.spinnerTrack}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className={styles.spinnerHead}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Selecting...</span>
            </span>
          </Trigger>
        );
      }

      // Idle state - show trigger
      return (
        <Trigger
          position={position}
          onClick={handleStart}
          disabled={disabled}
          zIndex={zIndex}
          className={className}
        >
          {triggerContent}
        </Trigger>
      );
    };

    const content = renderContent();

    // Wrap in container div for ref
    const containerContent = (
      <div
        ref={ref}
        className={clsx(styles.root, "usefy-screen-recorder", theme === "dark" && "dark")}
        data-state={recorder.state}
      >
        {content}
      </div>
    );

    // Use portal for floating UI if specified
    if (
      renderMode === "portal" &&
      typeof document !== "undefined" &&
      recorder.state !== "stopped" // Preview modal handles its own portal
    ) {
      return createPortal(containerContent, document.body);
    }

    return containerContent;
  }
);

ScreenRecorder.displayName = "ScreenRecorder";
