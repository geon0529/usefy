// ============================================================================
// Main Component
// ============================================================================

export { ScreenRecorder } from "./ScreenRecorder";

// ============================================================================
// Main Hook
// ============================================================================

export { useScreenRecorder } from "./useScreenRecorder";

// ============================================================================
// Types
// ============================================================================

export type {
  // State types
  RecordingState,
  RecordingResult,
  // Error types
  ScreenRecorderError,
  ScreenRecorderErrorCode,
  // Quality types
  QualityPreset,
  QualityOption,
  // Audio types
  AudioConfig,
  AudioOption,
  // UI types
  TriggerPosition,
  ThemeOption,
  RenderMode,
  // Props types
  ScreenRecorderProps,
  // Hook types
  UseScreenRecorderOptions,
  UseScreenRecorderReturn,
  // Browser support types
  BrowserSupport,
} from "./types";

// ============================================================================
// Constants
// ============================================================================

export {
  QUALITY_PRESETS,
  DEFAULT_OPTIONS,
  SUPPORTED_MIME_TYPES,
  ERROR_MESSAGES,
  TIMER_WARNING_THRESHOLD,
  TIMER_CRITICAL_THRESHOLD,
} from "./constants";

// ============================================================================
// Sub-hooks (for advanced usage)
// ============================================================================

export {
  useBrowserSupport,
  checkBrowserSupport,
  getBestMimeType,
  useDisplayMedia,
  useMediaRecorder,
  useTimer,
  useCountdown,
  formatTime,
} from "./hooks";

export type {
  UseDisplayMediaOptions,
  UseDisplayMediaReturn,
  UseMediaRecorderOptions,
  UseMediaRecorderReturn,
  UseTimerOptions,
  UseTimerReturn,
  UseCountdownOptions,
  UseCountdownReturn,
} from "./hooks";

// ============================================================================
// Utils
// ============================================================================

export { cn, downloadBlob, generateFilename, formatBytes } from "./utils";

// ============================================================================
// UI Components (for custom compositions)
// ============================================================================

export {
  // Trigger
  Trigger,
  TriggerIcon,
  RecordingIcon,
  StopIcon,
  PauseIcon,
  PlayIcon,
  DownloadIcon,
  CloseIcon,
  RefreshIcon,
  CheckIcon,
  WarningIcon,
  // Controls
  Timer,
  RecordingControls,
  // Countdown
  Countdown,
  // Preview
  VideoPlayer,
  PreviewModal,
  // Status
  StatusBadge,
  ErrorMessage,
} from "./components";

export type {
  TriggerProps,
  TimerProps,
  RecordingControlsProps,
  CountdownProps,
  VideoPlayerProps,
  VideoPlayerRef,
  PreviewModalProps,
  StatusBadgeProps,
  ErrorMessageProps,
} from "./components";
