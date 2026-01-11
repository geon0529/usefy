import type { QualityPreset, ScreenRecorderErrorCode } from "./types";

// ============================================================================
// Quality Presets
// ============================================================================

/**
 * Predefined quality presets for recording
 */
export const QUALITY_PRESETS: Record<"low" | "medium" | "high", QualityPreset> =
  {
    low: {
      videoBitsPerSecond: 1_000_000, // 1 Mbps
      frameRate: 15,
    },
    medium: {
      videoBitsPerSecond: 2_500_000, // 2.5 Mbps
      frameRate: 30,
    },
    high: {
      videoBitsPerSecond: 5_000_000, // 5 Mbps
      frameRate: 60,
    },
  };

// ============================================================================
// Default Options
// ============================================================================

/**
 * Default values for screen recorder options
 */
export const DEFAULT_OPTIONS = {
  /** Default maximum recording duration (5 minutes) */
  maxDuration: 300,
  /** Default countdown duration (3 seconds) */
  countdown: 3,
  /** Default audio setting */
  audio: false,
  /** Default quality preset */
  quality: "medium" as const,
  /** Default output format */
  format: "webm" as const,
  /** Default MIME type for recording */
  mimeType: "video/webm;codecs=vp9",
  /** Default filename */
  filename: "screen-recording",
  /** Default position */
  position: "bottom-right" as const,
  /** Default z-index */
  zIndex: 9999,
  /** Default theme */
  theme: "system" as const,
  /** Default render mode */
  renderMode: "portal" as const,
  /** Default show preview */
  showPreview: true,
  /** Default show timer */
  showTimer: true,
  /** Default auto download */
  autoDownload: false,
} as const;

// ============================================================================
// Supported MIME Types
// ============================================================================

/**
 * MIME types to check for browser support, in order of preference
 */
export const SUPPORTED_MIME_TYPES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8,opus",
  "video/webm;codecs=vp8",
  "video/webm",
  "video/mp4",
] as const;

/**
 * Fallback MIME type if none of the preferred types are supported
 */
export const FALLBACK_MIME_TYPE = "video/webm";

// ============================================================================
// Error Messages
// ============================================================================

/**
 * Human-readable error messages for each error code
 */
export const ERROR_MESSAGES: Record<ScreenRecorderErrorCode, string> = {
  PERMISSION_DENIED:
    "Screen recording permission was denied. Please allow screen sharing when prompted.",
  NOT_SUPPORTED:
    "Screen recording is not supported in your browser. Please use Chrome, Edge, or Firefox on desktop.",
  MEDIA_RECORDER_ERROR:
    "An error occurred while recording. Please try again.",
  STREAM_ENDED:
    "Screen sharing was stopped. The recording has been saved.",
  NO_STREAM: "No screen stream is available. Please try starting a new recording.",
  ENCODING_ERROR: "Failed to encode the video. Please try again.",
  UNKNOWN: "An unknown error occurred. Please try again.",
};

// ============================================================================
// Timer Constants
// ============================================================================

/**
 * Timer warning threshold (30 seconds remaining)
 */
export const TIMER_WARNING_THRESHOLD = 30;

/**
 * Timer critical threshold (10 seconds remaining)
 */
export const TIMER_CRITICAL_THRESHOLD = 10;

/**
 * Timer update interval in milliseconds
 */
export const TIMER_INTERVAL = 1000;

// ============================================================================
// Animation Durations (in ms)
// ============================================================================

export const ANIMATION_DURATIONS = {
  /** Trigger button appear/disappear */
  triggerAppear: 200,
  /** Controls slide in/out */
  controlsSlide: 300,
  /** Each countdown number display */
  countdownNumber: 1000,
  /** Recording pulse animation cycle */
  recordingPulse: 1500,
  /** Modal open animation */
  modalOpen: 200,
  /** Modal close animation */
  modalClose: 150,
} as const;

// ============================================================================
// MediaRecorder Constants
// ============================================================================

/**
 * Time slice for MediaRecorder (emit data every 1 second)
 * This helps with memory management for long recordings
 */
export const MEDIA_RECORDER_TIMESLICE = 1000;

// ============================================================================
// Storage Keys
// ============================================================================

/**
 * LocalStorage key prefix for screen recorder settings
 */
export const STORAGE_KEY_PREFIX = "usefy_screen_recorder_";

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  theme: `${STORAGE_KEY_PREFIX}theme`,
  quality: `${STORAGE_KEY_PREFIX}quality`,
  countdown: `${STORAGE_KEY_PREFIX}countdown`,
} as const;

// ============================================================================
// Accessibility
// ============================================================================

/**
 * ARIA labels for screen recorder elements
 */
export const ARIA_LABELS = {
  triggerButton: "Start screen recording",
  stopButton: "Stop recording",
  pauseButton: "Pause recording",
  resumeButton: "Resume recording",
  downloadButton: "Download recording",
  reRecordButton: "Discard and record again",
  closePreview: "Close preview",
  timer: "Recording duration",
  countdown: "Recording starts in",
  previewModal: "Recording preview",
  videoPlayer: "Recorded video preview",
} as const;

// ============================================================================
// CSS Class Names
// ============================================================================

/**
 * Base CSS class name for the component
 */
export const BASE_CLASS = "usefy-screen-recorder";

/**
 * CSS class names for component parts
 */
export const CSS_CLASSES = {
  root: BASE_CLASS,
  trigger: `${BASE_CLASS}__trigger`,
  controls: `${BASE_CLASS}__controls`,
  timer: `${BASE_CLASS}__timer`,
  countdown: `${BASE_CLASS}__countdown`,
  preview: `${BASE_CLASS}__preview`,
  status: `${BASE_CLASS}__status`,
  error: `${BASE_CLASS}__error`,
} as const;

// ============================================================================
// Position Styles
// ============================================================================

/**
 * Tailwind classes for each trigger position
 */
export const POSITION_CLASSES = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
} as const;
