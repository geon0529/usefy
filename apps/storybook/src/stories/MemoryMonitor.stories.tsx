import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryMonitor, useMemoryMonitorHeadless } from "@usefy/memory-monitor";

/**
 * MemoryMonitor is a React component for real-time
 * browser memory monitoring with a slide-in panel UI.
 *
 * ## Features
 * - Real-time memory usage visualization with gauges and charts
 * - Slide-in panel UI (left or right position)
 * - Keyboard shortcuts (Ctrl+Shift+M to toggle)
 * - Auto-GC trigger when thresholds are exceeded
 * - Memory leak detection and warnings
 * - Snapshot comparison for debugging
 * - **Configurable snapshot limits** (1-50 snapshots)
 * - **Scheduled auto-snapshots** (1min to 24hour intervals)
 * - Settings persistence via LocalStorage
 * - Dark mode support
 *
 * ## Browser Support
 * - Chrome/Edge: Full support with `performance.memory` API
 * - Firefox/Safari: Limited support (DOM-only metrics)
 *
 * ## Usage
 * Add the component at the root of your app. It renders a floating trigger
 * button that opens the panel when clicked.
 */
const meta: Meta<typeof MemoryMonitor> = {
  title: "Components/MemoryMonitor",
  component: MemoryMonitor,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "React component for real-time browser memory monitoring with a slide-in panel UI.\n\n" +
          "**Key Features:**\n" +
          "- Real-time memory gauges and time-series charts\n" +
          "- Keyboard shortcuts (Ctrl+Shift+M)\n" +
          "- Auto-GC trigger with configurable thresholds\n" +
          "- Memory leak detection\n" +
          "- Snapshot comparison\n" +
          "- Settings persistence via LocalStorage\n" +
          "- Dark mode support\n" +
          "- SSR compatible",
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["development", "production", "always", "never"],
      description: "When to render the panel",
      table: {
        type: { summary: "'development' | 'production' | 'always' | 'never'" },
        defaultValue: { summary: "'development'" },
      },
    },
    position: {
      control: "select",
      options: ["left", "right"],
      description: "Panel slide-in position",
      table: {
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" },
      },
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    showTrigger: {
      control: "boolean",
      description: "Show floating trigger button",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    defaultWidth: {
      control: { type: "number", min: 320, max: 600, step: 50 },
      description: "Initial panel width in pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "420" },
      },
    },
    zIndex: {
      control: { type: "number", min: 1000, max: 99999 },
      description: "Panel z-index",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "9999" },
      },
    },
    shortcut: {
      control: "text",
      description: "Keyboard shortcut to toggle panel",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "'ctrl+shift+m'" },
      },
    },
    enableLeakDetection: {
      control: "boolean",
      description: "Enable memory leak detection",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MemoryMonitor>;

/**
 * Interactive overview of the MemoryMonitor component.
 *
 * **How to use:**
 * 1. Click the floating trigger button (bottom-right) or press `Ctrl+Shift+M` to open the panel
 * 2. Explore the tabs:
 *    - **Overview**: Real-time memory gauge, heap breakdown, DOM metrics
 *    - **History**: Time-series chart of memory usage
 *    - **Snapshots**: Capture and compare memory snapshots
 *    - **Settings**: Configure thresholds, auto-GC, polling interval
 * 3. Try the keyboard shortcuts:
 *    - `Ctrl+Shift+M`: Toggle panel
 *    - `Escape`: Close panel
 */
export const Overview: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: true,
    showTrigger: true,
    defaultWidth: 420,
    enableLeakDetection: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      {/* Demo content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          MemoryMonitor Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          This is a demo page showing the MemoryMonitor component. The
          panel is open by default for demonstration purposes.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Quick Start
          </h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`import { MemoryMonitor } from "@usefy/memory-monitor";

function App() {
  return (
    <div>
      <YourApp />
      {/* Add at the root of your app */}
      <MemoryMonitor />
    </div>
  );
}`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
              Panel Tabs
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Overview:</strong> Real-time memory gauge and metrics
              </li>
              <li>
                <strong>History:</strong> Time-series chart of memory usage
              </li>
              <li>
                <strong>Snapshots:</strong> Capture and compare memory states
              </li>
              <li>
                <strong>Settings:</strong> Configure thresholds and auto-GC
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
              Keyboard Shortcuts
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">
                  Ctrl+Shift+M
                </kbd>{" "}
                Toggle panel
              </li>
              <li>
                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">
                  Escape
                </kbd>{" "}
                Close panel
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The panel component */}
      <MemoryMonitor {...args} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { MemoryMonitor } from "@usefy/memory-monitor";

// Basic usage - renders in development mode only
<MemoryMonitor />

// With custom options
<MemoryMonitor
  mode="always"           // 'development' | 'production' | 'always' | 'never'
  position="right"        // 'left' | 'right'
  defaultOpen={false}     // Initial open state
  defaultWidth={420}      // Panel width in pixels
  shortcut="ctrl+shift+m" // Keyboard shortcut
  enableLeakDetection     // Enable memory leak detection
  onOpenChange={(open) => console.log('Panel:', open)}
  onWarning={(data) => console.log('Warning:', data)}
  onAutoGC={(data) => console.log('Auto-GC:', data)}
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

/**
 * Demonstrates the snapshot configuration features.
 *
 * **Snapshot Settings (in Settings tab):**
 * - **Maximum Snapshots**: Set the max number of snapshots to store (1-50)
 * - **Auto Snapshot Schedule**: Automatically capture snapshots at intervals
 *   - Off (default)
 *   - Every 1 minute
 *   - Every 5 minutes
 *   - Every 10 minutes
 *   - Every 30 minutes
 *   - Every 1 hour
 *   - Every 6 hours
 *   - Every 24 hours
 * - **Auto-delete oldest**: When enabled, oldest snapshot is deleted when max is reached
 *
 * **Try it:**
 * 1. Open the panel and go to "Settings" tab
 * 2. Scroll down to "Snapshot Settings" section
 * 3. Adjust the maximum snapshots value
 * 4. Enable auto-snapshot schedule (e.g., "Every 1 min")
 * 5. Go to "Snapshots" tab to see auto-captured snapshots (marked with "Auto" badge)
 */
export const SnapshotSettings: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: true,
    showTrigger: true,
    defaultWidth: 420,
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Snapshot Settings Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Configure snapshot limits and automatic snapshot schedules in the Settings tab.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Snapshot Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                📸 Configurable Limits
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Set maximum snapshots from 1 to 50. When limit is reached,
                oldest snapshot is auto-deleted if enabled.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                ⏰ Scheduled Snapshots
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Automatically capture snapshots at intervals: 1min, 5min, 10min,
                30min, 1hour, 6hours, or 24hours.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Tip:</strong> Auto-captured snapshots are marked with a purple "Auto" badge
            in the Snapshots tab to distinguish them from manual snapshots.
          </p>
        </div>
      </div>

      <MemoryMonitor {...args} />
    </div>
  ),
};

/**
 * Panel positioned on the left side of the screen.
 */
export const LeftPosition: Story = {
  args: {
    mode: "always",
    position: "left",
    defaultOpen: true,
    showTrigger: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Left Position Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The panel slides in from the left side of the screen.
        </p>
      </div>
      <MemoryMonitor {...args} />
    </div>
  ),
};

// ============================================================================
// Headless Mode Demo
// ============================================================================

function HeadlessModeDemo() {
  const [events, setEvents] = useState<Array<{ type: string; time: string; data: string }>>([]);

  const addEvent = (type: string, data: string) => {
    setEvents((prev) => [
      { type, time: new Date().toLocaleTimeString(), data },
      ...prev.slice(0, 9),
    ]);
  };

  const {
    memory,
    severity,
    isLeakDetected,
    trend,
    requestGC,
    isSupported,
  } = useMemoryMonitorHeadless({
    interval: 1000,
    warningThreshold: 70,
    criticalThreshold: 90,
    enableAutoGC: true,
    autoGCThreshold: 85,
    enableLeakDetection: true,
    leakSensitivity: "medium",
    onWarning: (data) => {
      addEvent("warning", `Usage: ${data.usagePercentage.toFixed(1)}%`);
    },
    onCritical: (data) => {
      addEvent("critical", `Usage: ${data.usagePercentage.toFixed(1)}%`);
    },
    onLeakDetected: (analysis) => {
      addEvent("leak", `Probability: ${analysis.probability.toFixed(0)}%`);
    },
    onAutoGC: (data) => {
      addEvent("gc", `Triggered at ${data.usage.toFixed(1)}%`);
    },
  });

  // Add periodic update events
  useEffect(() => {
    if (memory) {
      addEvent("update", `${(memory.heapUsed / 1024 / 1024).toFixed(1)} MB`);
    }
  }, [memory?.heapUsed]);

  const severityColors = {
    normal: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  };

  const eventColors: Record<string, string> = {
    update: "bg-slate-100 text-slate-600",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
    leak: "bg-purple-100 text-purple-700",
    gc: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Headless Mode Demo
        </h1>
        <p className="text-slate-600 mb-8">
          No visible panel - just monitoring in background with callbacks.
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Memory</p>
            <p className="text-2xl font-bold text-slate-800">
              {memory ? `${(memory.heapUsed / 1024 / 1024).toFixed(1)} MB` : "N/A"}
            </p>
          </div>
          <div className={`rounded-xl p-4 shadow-sm border ${severityColors[severity]}`}>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Severity</p>
            <p className="text-2xl font-bold capitalize">{severity}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Trend</p>
            <p className="text-2xl font-bold text-slate-800 capitalize">{trend}</p>
          </div>
          <div className={`rounded-xl p-4 shadow-sm border ${isLeakDetected ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"}`}>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Leak</p>
            <p className="text-2xl font-bold">{isLeakDetected ? "Detected" : "None"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Manual Actions</h2>
              <p className="text-sm text-slate-500">Request garbage collection manually</p>
            </div>
            <button
              onClick={requestGC}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              Request GC
            </button>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-4">Event Log (Last 10)</h2>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-slate-400 text-sm">Waiting for events...</p>
            ) : (
              events.map((event, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${eventColors[event.type] || eventColors.update}`}>
                  <span className="font-mono text-xs opacity-60">{event.time}</span>
                  <span className="font-medium uppercase text-xs w-16">{event.type}</span>
                  <span>{event.data}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {!isSupported && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Full memory API not supported in this browser.
              Some metrics may be limited.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Headless mode for production monitoring without UI.
 *
 * Use `useMemoryMonitorHeadless` hook when you need memory monitoring
 * in production without showing any visible UI. Perfect for:
 * - Sending memory metrics to analytics
 * - Triggering alerts when thresholds are exceeded
 * - Auto-GC in background
 * - Memory leak detection with callbacks
 */
export const HeadlessMode: Story = {
  render: () => <HeadlessModeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Headless mode provides memory monitoring without UI. " +
          "Use `useMemoryMonitorHeadless` hook for production environments where you want to track memory " +
          "usage and trigger callbacks without showing a visible panel.",
      },
      source: {
        code: `import { useMemoryMonitorHeadless } from "@usefy/memory-monitor";

function App() {
  const {
    memory,
    usagePercentage,
    severity,
    isLeakDetected,
    leakProbability,
    trend,
    requestGC,
    isSupported,
  } = useMemoryMonitorHeadless({
    interval: 1000,
    warningThreshold: 70,
    criticalThreshold: 90,
    enableAutoGC: true,
    autoGCThreshold: 85,
    enableLeakDetection: true,
    leakSensitivity: "medium",
    onWarning: (data) => {
      console.warn("Memory warning:", data);
      analytics.track("memory_warning", data);
    },
    onCritical: (data) => {
      console.error("Critical memory:", data);
      analytics.track("memory_critical", data);
    },
    onLeakDetected: (analysis) => {
      console.warn("Leak detected:", analysis);
      Sentry.captureMessage("Memory leak detected", { extra: analysis });
    },
    onAutoGC: (data) => {
      console.log("Auto-GC triggered:", data);
    },
  });

  // No UI rendered - just monitoring in background
  return <YourApp />;
}`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

// ============================================================================
// Callback Events Demo
// ============================================================================

function CallbackEventsDemo() {
  const [events, setEvents] = useState<Array<{ type: string; time: string; data: string }>>([]);

  const addEvent = (type: string, data: string) => {
    setEvents((prev) => [
      { type, time: new Date().toLocaleTimeString(), data },
      ...prev.slice(0, 19),
    ]);
  };

  const eventColors: Record<string, string> = {
    open: "bg-blue-100 text-blue-700",
    close: "bg-slate-100 text-slate-600",
    warning: "bg-amber-100 text-amber-700",
    critical: "bg-red-100 text-red-700",
    leak: "bg-purple-100 text-purple-700",
    gc: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Callback Events Demo
        </h1>
        <p className="text-slate-600 mb-8">
          Open the panel and interact to see events logged below.
        </p>

        {/* Event Log */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">Event Stream</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-slate-400 text-sm">Interact with the panel to see events...</p>
            ) : (
              events.map((event, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${eventColors[event.type] || "bg-slate-100"}`}>
                  <span className="font-mono text-xs opacity-60">{event.time}</span>
                  <span className="font-medium uppercase text-xs w-16">{event.type}</span>
                  <span>{event.data}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Callback Reference */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-4">Available Callbacks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onOpenChange</code>
              <p className="text-xs text-slate-500 mt-1">Panel open/close state</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onWarning</code>
              <p className="text-xs text-slate-500 mt-1">Warning threshold exceeded</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onCritical</code>
              <p className="text-xs text-slate-500 mt-1">Critical threshold exceeded</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onLeakDetected</code>
              <p className="text-xs text-slate-500 mt-1">Memory leak detected</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onAutoGC</code>
              <p className="text-xs text-slate-500 mt-1">Auto-GC triggered</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onUpdate</code>
              <p className="text-xs text-slate-500 mt-1">Every measurement update</p>
            </div>
          </div>
        </div>
      </div>

      <MemoryMonitor
        mode="always"
        position="right"
        defaultOpen={false}
        onOpenChange={(isOpen) => {
          addEvent(isOpen ? "open" : "close", isOpen ? "Panel opened" : "Panel closed");
        }}
        onWarning={(data) => {
          addEvent("warning", `Usage: ${data.usagePercentage.toFixed(1)}% (threshold: ${data.threshold}%)`);
        }}
        onCritical={(data) => {
          addEvent("critical", `Usage: ${data.usagePercentage.toFixed(1)}% (threshold: ${data.threshold}%)`);
        }}
        onLeakDetected={(analysis) => {
          addEvent("leak", `Probability: ${analysis.probability.toFixed(0)}%, Trend: ${analysis.trend}`);
        }}
        onAutoGC={(data) => {
          addEvent("gc", `Triggered at ${data.usage.toFixed(1)}%`);
        }}
      />
    </div>
  );
}

/**
 * Demonstrates all callback events available in MemoryMonitor.
 *
 * **Available Callbacks:**
 * - `onOpenChange`: Panel open/close state changes
 * - `onWarning`: Memory usage exceeds warning threshold
 * - `onCritical`: Memory usage exceeds critical threshold
 * - `onLeakDetected`: Potential memory leak detected
 * - `onAutoGC`: Auto garbage collection triggered
 */
export const CallbackEvents: Story = {
  render: () => <CallbackEventsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "MemoryMonitor provides various callback events for integrating with your application's " +
          "logging, analytics, and alerting systems.",
      },
      source: {
        code: `import { MemoryMonitor } from "@usefy/memory-monitor";

<MemoryMonitor
  mode="always"
  onOpenChange={(isOpen) => {
    console.log("Panel:", isOpen ? "opened" : "closed");
  }}
  onWarning={(data) => {
    console.warn("Warning at", data.usagePercentage.toFixed(1) + "%");
  }}
  onCritical={(data) => {
    console.error("Critical at", data.usagePercentage.toFixed(1) + "%");
  }}
  onLeakDetected={(analysis) => {
    console.warn("Leak probability:", analysis.probability + "%");
  }}
  onAutoGC={(data) => {
    console.log("Auto-GC at", data.usage.toFixed(1) + "%");
  }}
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

/**
 * Custom trigger button with your own styling.
 *
 * Use `triggerContent` prop to provide a custom trigger element,
 * or set `showTrigger={false}` and control the panel programmatically.
 */
export const CustomTrigger: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: false,
    showTrigger: true,
    triggerContent: (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
        <span className="text-lg">📊</span>
        <span className="font-medium">Memory</span>
      </div>
    ),
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Custom Trigger Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Click the custom "Memory" button in the bottom-right corner to open the panel.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Customization Options
          </h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`// Custom trigger content
<MemoryMonitor
  triggerContent={
    <MyCustomButton>
      📊 Memory
    </MyCustomButton>
  }
/>

// Or hide trigger and control programmatically
<MemoryMonitor
  showTrigger={false}
  defaultOpen={true}
  onOpenChange={setIsOpen}
/>`}
          </pre>
        </div>
      </div>
      <MemoryMonitor {...args} />
    </div>
  ),
};

/**
 * Demonstrates threshold configuration for warnings and alerts.
 *
 * Configure when memory warnings and critical alerts are triggered
 * based on usage percentage.
 */
export const ThresholdConfiguration: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: true,
    warningThreshold: 60,
    criticalThreshold: 85,
    enableAutoGC: true,
    autoGCThreshold: 80,
    persistSettings: false, // Disable localStorage to ensure story args take effect
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Threshold Configuration
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Configure warning, critical, and auto-GC thresholds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
              Warning: 60%
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Yellow indicator when memory usage exceeds 60%
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">
              Critical: 85%
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              Red indicator when memory usage exceeds 85%
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">
              Auto-GC: 80%
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Request GC when memory usage exceeds 80%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<MemoryMonitor
  warningThreshold={60}
  criticalThreshold={85}
  enableAutoGC={true}
  autoGCThreshold={80}
  onWarning={(data) => console.warn("Warning:", data)}
  onCritical={(data) => console.error("Critical:", data)}
  onAutoGC={(data) => console.log("Auto-GC:", data)}
/>`}
          </pre>
        </div>
      </div>
      <MemoryMonitor {...args} />
    </div>
  ),
};

/**
 * Dark mode demonstration.
 *
 * MemoryMonitor automatically adapts to dark mode based on:
 * 1. System preference (prefers-color-scheme)
 * 2. Manual theme setting in Settings tab
 */
export const DarkMode: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: true,
    theme: "dark",
    persistSettings: false, // Disable localStorage to ensure dark theme is applied
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">
          Dark Mode Demo
        </h1>
        <p className="text-slate-300 mb-8">
          MemoryMonitor supports dark mode with automatic system preference detection.
        </p>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Theme Options
          </h2>
          <ul className="space-y-2 text-slate-300">
            <li><code className="text-indigo-400">theme="system"</code> - Follow OS preference (default)</li>
            <li><code className="text-indigo-400">theme="light"</code> - Always light mode</li>
            <li><code className="text-indigo-400">theme="dark"</code> - Always dark mode</li>
          </ul>
        </div>
      </div>
      <MemoryMonitor {...args} />
    </div>
  ),
};

/**
 * Leak detection with sensitivity configuration.
 *
 * Configure how aggressively memory leaks are detected:
 * - **low**: More samples required, fewer false positives
 * - **medium**: Balanced detection (default)
 * - **high**: Quick detection, may have more false positives
 */
export const LeakDetection: Story = {
  args: {
    mode: "always",
    position: "right",
    defaultOpen: true,
    enableLeakDetection: true,
    leakSensitivity: "high",
    persistSettings: false, // Disable localStorage to ensure story settings take effect
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Memory Leak Detection
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Advanced leak detection using linear regression and GC analysis.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Detection Algorithm
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                5-Factor Weighted Scoring
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• Slope (Growth Rate): 30 points</li>
                <li>• R² (Consistency): 20 points</li>
                <li>• GC Ineffectiveness: 25 points</li>
                <li>• Observation Time: 15 points</li>
                <li>• Baseline Growth: 10 points</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                Sensitivity Levels
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <li>• <strong>Low:</strong> 100KB/sample, R² ≥ 0.8</li>
                <li>• <strong>Medium:</strong> 50KB/sample, R² ≥ 0.7</li>
                <li>• <strong>High:</strong> 10KB/sample, R² ≥ 0.6</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Tip:</strong> Leak detection requires at least 10 samples and 30 seconds
            of observation before providing accurate results.
          </p>
        </div>
      </div>
      <MemoryMonitor {...args} />
    </div>
  ),
};
