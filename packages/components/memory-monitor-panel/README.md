# @usefy/memory-monitor-panel

Enterprise-grade React component for real-time browser memory monitoring with a slide-in panel UI.

## Features

- Real-time memory usage visualization with gauges and charts
- Slide-in panel UI (left or right position)
- Keyboard shortcuts (Ctrl+Shift+M to toggle)
- Auto-GC trigger when thresholds are exceeded
- Memory leak detection and warnings
- Snapshot comparison for debugging
- Settings persistence via LocalStorage
- Dark mode support
- SSR compatible
- Environment-aware: renders only in development by default

## Installation

```bash
pnpm add @usefy/memory-monitor-panel
```

### Peer Dependencies

```bash
pnpm add react react-dom recharts
```

## Quick Start

```tsx
import { MemoryMonitorPanel } from "@usefy/memory-monitor-panel";

function App() {
  return (
    <div>
      <YourApp />
      {/* Add at the root of your app */}
      <MemoryMonitorPanel />
    </div>
  );
}
```

The panel will only render in development mode by default. A floating trigger button appears in the corner, and pressing `Ctrl+Shift+M` toggles the panel.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'development' \| 'production' \| 'always' \| 'never'` | `'development'` | When to render the panel |
| `position` | `'left' \| 'right'` | `'right'` | Panel slide-in position |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `defaultTab` | `'overview' \| 'history' \| 'snapshots' \| 'settings'` | `'overview'` | Initial active tab |
| `showTrigger` | `boolean` | `true` | Show floating trigger button |
| `shortcut` | `string` | `'ctrl+shift+m'` | Keyboard shortcut to toggle |
| `zIndex` | `number` | `9999` | Panel z-index |
| `width` | `number` | `400` | Panel width in pixels |
| `storageKey` | `string` | `'memory-monitor-settings'` | LocalStorage key for settings |
| `enableLeakDetection` | `boolean` | `true` | Enable memory leak detection |
| `leakSensitivity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Leak detection sensitivity |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when panel opens/closes |
| `onThresholdExceeded` | `(event) => void` | - | Callback when threshold exceeded |
| `onAutoGC` | `(event) => void` | - | Callback when auto-GC triggers |
| `triggerContent` | `ReactNode` | - | Custom trigger button content |
| `className` | `string` | - | Additional CSS class |

## Panel Tabs

### Overview
- Memory gauge showing current heap usage percentage
- Heap breakdown (used vs total)
- DOM metrics (nodes, event listeners)
- Memory status indicator
- Quick action buttons

### History
- Time-series chart of memory usage
- Visual threshold markers
- Trend indicators

### Snapshots
- Capture memory snapshots at specific moments
- Compare two snapshots to see differences
- Export snapshot data

### Settings
- Warning threshold configuration (default: 70%)
- Critical threshold configuration (default: 85%)
- Auto-GC threshold and toggle
- Polling interval selection

## Headless Mode (Production)

For production use without the UI, use the headless hook:

```tsx
import { useMemoryMonitorHeadless } from "@usefy/memory-monitor-panel";

function ProductionMonitor() {
  const { monitor, requestGC, takeSnapshot } = useMemoryMonitorHeadless({
    interval: 5000,
    enableLeakDetection: true,
    onThresholdExceeded: ({ level, usage }) => {
      // Send to analytics or logging service
      console.log(`Memory ${level}: ${usage}%`);
    },
    onAutoGC: ({ threshold, usage }) => {
      console.log(`Auto-GC triggered at ${usage}%`);
    },
  });

  // Access memory data
  console.log(monitor.usagePercentage, monitor.formatted.heapUsed);
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+M` | Toggle panel (customizable via `shortcut` prop) |
| `Escape` | Close panel |

## Browser Support

Memory monitoring uses the `performance.memory` API which is available in Chromium-based browsers (Chrome, Edge, Brave, etc.). In unsupported browsers, the component will render but show "unsupported" status.

## CSS Requirements

This component uses Tailwind CSS classes. Ensure your project has Tailwind CSS configured, or the component may not display correctly.

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  MemoryMonitorPanelProps,
  PanelSettings,
  PanelSnapshot,
  AutoGCEventData,
  MemoryWarningData,
  MemoryCriticalData,
} from "@usefy/memory-monitor-panel";
```

## License

MIT
