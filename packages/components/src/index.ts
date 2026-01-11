/**
 * @usefy/components
 *
 * A collection of production-ready React components
 *
 * @example
 * ```tsx
 * import { MemoryMonitor } from "@usefy/components";
 * ```
 */

// Memory Monitor
export {
  MemoryMonitor,
  MemoryMonitorPanel, // Backwards compatibility alias
  useMemoryMonitorHeadless,
  type MemoryMonitorProps,
  type MemoryMonitorPanelProps, // Backwards compatibility alias
  type PanelSettings,
  type PanelSnapshot,
  type AutoGCEventData,
  type MemoryWarningData,
  type MemoryCriticalData,
} from "@usefy/memory-monitor";
