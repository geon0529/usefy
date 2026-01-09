import type {
  LeakSensitivity,
  Severity,
  Trend,
  UseMemoryMonitorOptions,
  FormattedMemory,
  MemoryStoreState,
} from "./types";

/**
 * Default monitoring interval in milliseconds
 */
export const DEFAULT_INTERVAL = 5000;

/**
 * Default history buffer size
 */
export const DEFAULT_HISTORY_SIZE = 50;

/**
 * Default warning threshold percentage
 */
export const DEFAULT_WARNING_THRESHOLD = 70;

/**
 * Default critical threshold percentage
 */
export const DEFAULT_CRITICAL_THRESHOLD = 90;

/**
 * Default leak detection window size
 * Increased to ensure sufficient samples for reliable analysis
 */
export const DEFAULT_LEAK_WINDOW_SIZE = 20;

/**
 * Minimum samples required for leak detection
 */
export const MIN_LEAK_DETECTION_SAMPLES = 10;

/**
 * Minimum observation time for reliable leak detection (ms)
 * Leak detection requires at least 30 seconds of data
 */
export const MIN_OBSERVATION_TIME_MS = 30000;

/**
 * GC detection threshold - memory drop percentage to consider as GC event
 * If memory drops by more than 10%, consider it a GC event
 */
export const GC_DETECTION_THRESHOLD = 0.10;

/**
 * Minimum number of GC cycles to observe before making leak determination
 */
export const MIN_GC_CYCLES_FOR_ANALYSIS = 2;

/**
 * Baseline growth threshold - percentage growth from baseline to consider significant
 */
export const BASELINE_GROWTH_THRESHOLD = 0.20;

/**
 * Leak probability threshold - minimum probability to report as leak
 */
export const LEAK_PROBABILITY_THRESHOLD = 70;

/**
 * Sensitivity configuration for leak detection
 * - minSlope: Minimum slope (bytes/sample) to consider a leak
 * - minR2: Minimum R-squared value for regression fit quality
 */
export const LEAK_SENSITIVITY_CONFIG: Record<
  LeakSensitivity,
  {
    minSlope: number;
    minR2: number;
    probabilityMultiplier: number;
    minGCCycles: number;
    minObservationTime: number;
  }
> = {
  low: {
    minSlope: 100000, // 100KB/sample
    minR2: 0.8,
    probabilityMultiplier: 0.7,
    minGCCycles: 3,
    minObservationTime: 60000, // 60 seconds
  },
  medium: {
    minSlope: 50000, // 50KB/sample
    minR2: 0.7,
    probabilityMultiplier: 1.0,
    minGCCycles: 2,
    minObservationTime: 30000, // 30 seconds
  },
  high: {
    minSlope: 10000, // 10KB/sample
    minR2: 0.6,
    probabilityMultiplier: 1.2,
    minGCCycles: 1,
    minObservationTime: 15000, // 15 seconds
  },
};

/**
 * Trend thresholds (slope values)
 */
export const TREND_THRESHOLDS = {
  increasing: 0.01, // Slope > 0.01 = increasing
  decreasing: -0.01, // Slope < -0.01 = decreasing
};

/**
 * Default options for useMemoryMonitor
 */
export const DEFAULT_OPTIONS: Required<
  Omit<
    UseMemoryMonitorOptions,
    | "onUpdate"
    | "onWarning"
    | "onCritical"
    | "onLeakDetected"
    | "onUnsupported"
  >
> = {
  interval: DEFAULT_INTERVAL,
  autoStart: true,
  enabled: true,
  enableHistory: false,
  historySize: DEFAULT_HISTORY_SIZE,
  thresholds: {
    warning: DEFAULT_WARNING_THRESHOLD,
    critical: DEFAULT_CRITICAL_THRESHOLD,
  },
  leakDetection: {
    enabled: false,
    sensitivity: "medium",
    windowSize: DEFAULT_LEAK_WINDOW_SIZE,
    threshold: undefined,
  },
  devMode: false,
  trackDOMNodes: false,
  trackEventListeners: false,
  logToConsole: false,
  disableInProduction: false,
  fallbackStrategy: "dom-only",
};

/**
 * Default severity
 */
export const DEFAULT_SEVERITY: Severity = "normal";

/**
 * Default trend
 */
export const DEFAULT_TREND: Trend = "stable";

/**
 * SSR-safe initial store state
 */
export const SSR_INITIAL_STATE: MemoryStoreState = {
  memory: null,
  domNodes: null,
  eventListeners: null,
  isMonitoring: false,
  severity: DEFAULT_SEVERITY,
  lastUpdated: 0,
};

/**
 * SSR-safe formatted memory values
 */
export const SSR_FORMATTED_MEMORY: FormattedMemory = {
  heapUsed: "N/A",
  heapTotal: "N/A",
  heapLimit: "N/A",
  domNodes: undefined,
  eventListeners: undefined,
};

/**
 * Byte units for formatting
 */
export const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Bytes per unit (1024)
 */
export const BYTES_PER_UNIT = 1024;
