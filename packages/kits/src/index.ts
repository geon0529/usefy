/**
 * @usefy/kits
 *
 * A collection of production-ready React feature kits
 *
 * @example
 * ```tsx
 * import { MemoryMonitor } from "@usefy/kits";
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
