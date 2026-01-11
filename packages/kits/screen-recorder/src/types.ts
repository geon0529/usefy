import type { ReactNode } from "react";

// ============================================================================
// Recording State Types
// ============================================================================

/**
 * Possible states of the screen recording process
 */
export type RecordingState =
  | "idle" // Ready to start recording
  | "requesting" // Waiting for user to select screen
  | "countdown" // Countdown in progress
  | "recording" // Actively recording
  | "paused" // Recording paused
  | "stopped" // Recording complete
  | "error"; // Error occurred

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error codes for screen recording errors
 */
export type ScreenRecorderErrorCode =
  | "PERMISSION_DENIED" // User denied screen share
  | "NOT_SUPPORTED" // Browser doesn't support API
  | "MEDIA_RECORDER_ERROR" // MediaRecorder failed
  | "STREAM_ENDED" // User stopped sharing via browser
  | "NO_STREAM" // No stream available
  | "ENCODING_ERROR" // Failed to encode video
  | "UNKNOWN"; // Unknown error

/**
 * Error object for screen recording errors
 */
export interface ScreenRecorderError {
  /** Error code for programmatic handling */
  code: ScreenRecorderErrorCode;
  /** Human-readable error message */
  message: string;
  /** Original error if available */
  originalError?: Error;
}

// ============================================================================
// Recording Result Types
// ============================================================================

/**
 * Result of a completed recording
 */
export interface RecordingResult {
  /** Recorded video blob */
  blob: Blob;
  /** Blob URL for preview/playback */
  url: string;
  /** Duration in seconds */
  duration: number;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Recording timestamp */
  timestamp: Date;
  /** Whether audio was included */
  hasAudio: boolean;
}

// ============================================================================
// Quality Types
// ============================================================================

/**
 * Quality preset configuration
 */
export interface QualityPreset {
  /** Video bitrate in bits per second */
  videoBitsPerSecond: number;
  /** Video width (optional, uses source resolution if not specified) */
  width?: number;
  /** Video height (optional, uses source resolution if not specified) */
  height?: number;
  /** Frame rate */
  frameRate?: number;
}

/**
 * Quality option - can be a preset name or custom configuration
 */
export type QualityOption = "low" | "medium" | "high" | QualityPreset;

// ============================================================================
// Audio Types
// ============================================================================

/**
 * Audio configuration options
 */
export interface AudioConfig {
  /** Capture system/tab audio */
  system?: boolean;
  /** Capture microphone input */
  microphone?: boolean;
}

/**
 * Audio option - can be boolean or detailed configuration
 */
export type AudioOption = boolean | AudioConfig;

// ============================================================================
// Position Types
// ============================================================================

/**
 * Position of the floating trigger button
 */
export type TriggerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

// ============================================================================
// Theme Types
// ============================================================================

/**
 * Theme setting for the component
 */
export type ThemeOption = "light" | "dark" | "system";

// ============================================================================
// Render Mode Types
// ============================================================================

/**
 * Render mode for floating UI elements
 */
export type RenderMode = "portal" | "inline";

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for the ScreenRecorder component
 */
export interface ScreenRecorderProps {
  // === Recording Options ===
  /**
   * Maximum recording duration in seconds
   * Set to Infinity for unlimited duration
   * @default 300 (5 minutes)
   */
  maxDuration?: number;

  /**
   * Countdown seconds before recording starts
   * Set to false to disable countdown
   * @default 3
   */
  countdown?: number | false;

  /**
   * Include audio in recording
   * @default false
   */
  audio?: AudioOption;

  /**
   * Video quality settings
   * @default 'medium'
   */
  quality?: QualityOption;

  /**
   * Output format
   * @default 'webm'
   */
  format?: "webm" | "mp4";

  /**
   * MIME type for MediaRecorder
   * @default 'video/webm;codecs=vp9'
   */
  mimeType?: string;

  // === UI Options ===
  /**
   * Position of the floating trigger button
   * @default 'bottom-right'
   */
  position?: TriggerPosition;

  /**
   * Custom trigger button content
   */
  triggerContent?: ReactNode;

  /**
   * Show preview modal after recording
   * @default true
   */
  showPreview?: boolean;

  /**
   * Show timer during recording
   * @default true
   */
  showTimer?: boolean;

  /**
   * Z-index for floating elements
   * @default 9999
   */
  zIndex?: number;

  /**
   * Theme override
   * @default 'system'
   */
  theme?: ThemeOption;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Default filename for download (without extension)
   * Can be a string or a function that receives the timestamp
   * @default 'screen-recording'
   */
  filename?: string | ((timestamp: Date) => string);

  // === Callbacks ===
  /**
   * Called when recording starts
   */
  onRecordingStart?: () => void;

  /**
   * Called when recording stops with the result
   */
  onRecordingStop?: (result: RecordingResult) => void;

  /**
   * Called when recording is paused
   */
  onPause?: () => void;

  /**
   * Called when recording is resumed
   */
  onResume?: () => void;

  /**
   * Called when user downloads the recording
   */
  onDownload?: (result: RecordingResult) => void;

  /**
   * Called when an error occurs
   */
  onError?: (error: ScreenRecorderError) => void;

  /**
   * Called when user denies screen share permission
   */
  onPermissionDenied?: () => void;

  /**
   * Called on each recording tick (every second)
   */
  onTick?: (elapsed: number, remaining: number | null) => void;

  // === Advanced ===
  /**
   * Auto-download after recording stops
   * @default false
   */
  autoDownload?: boolean;

  /**
   * Disable the component
   */
  disabled?: boolean;

  /**
   * Render mode for floating UI
   * @default 'portal'
   */
  renderMode?: RenderMode;
}

// ============================================================================
// Hook Options Types
// ============================================================================

/**
 * Options for the useScreenRecorder hook
 */
export interface UseScreenRecorderOptions {
  /**
   * Maximum recording duration in seconds
   * Set to Infinity for unlimited duration
   * @default 300 (5 minutes)
   */
  maxDuration?: number;

  /**
   * Countdown seconds before recording starts
   * Set to false to disable countdown
   * @default 3
   */
  countdown?: number | false;

  /**
   * Include audio in recording
   * @default false
   */
  audio?: AudioOption;

  /**
   * Video quality settings
   * @default 'medium'
   */
  quality?: QualityOption;

  /**
   * MIME type for MediaRecorder
   * @default 'video/webm;codecs=vp9'
   */
  mimeType?: string;

  /**
   * Called when an error occurs
   */
  onError?: (error: ScreenRecorderError) => void;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for the useScreenRecorder hook
 */
export interface UseScreenRecorderReturn {
  // === State ===
  /** Current recording state */
  state: RecordingState;

  /** Whether currently recording */
  isRecording: boolean;

  /** Whether recording is paused */
  isPaused: boolean;

  /** Whether in countdown phase */
  isCountingDown: boolean;

  /** Current countdown value (null when not counting) */
  countdownValue: number | null;

  /** Elapsed recording time in seconds */
  elapsed: number;

  /** Remaining time if maxDuration set (null if no limit) */
  remaining: number | null;

  /** Formatted elapsed time (MM:SS) */
  elapsedFormatted: string;

  /** Recording result after stop (null until recording completes) */
  result: RecordingResult | null;

  /** Current error if any */
  error: ScreenRecorderError | null;

  /** Whether browser supports screen recording */
  isSupported: boolean;

  // === Actions ===
  /** Start screen recording (opens browser picker) */
  start: () => Promise<void>;

  /** Stop recording */
  stop: () => void;

  /** Pause recording */
  pause: () => void;

  /** Resume paused recording */
  resume: () => void;

  /** Toggle pause/resume */
  togglePause: () => void;

  /** Download the recording */
  download: (filename?: string) => void;

  /** Reset state for new recording */
  reset: () => void;

  /** Get blob URL for preview */
  getPreviewUrl: () => string | null;

  /** Revoke blob URL (cleanup) */
  revokePreviewUrl: () => void;
}

// ============================================================================
// Browser Support Types
// ============================================================================

/**
 * Browser support detection result
 */
export interface BrowserSupport {
  /** Whether screen recording is fully supported */
  isSupported: boolean;
  /** Whether getDisplayMedia is available */
  hasDisplayMedia: boolean;
  /** Whether MediaRecorder is available */
  hasMediaRecorder: boolean;
  /** List of supported MIME types */
  supportedMimeTypes: string[];
}

// ============================================================================
// Internal Types
// ============================================================================

/**
 * Internal media stream configuration
 */
export interface MediaStreamConfig {
  video: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

/**
 * Internal MediaRecorder configuration
 */
export interface MediaRecorderConfig {
  mimeType: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
}
