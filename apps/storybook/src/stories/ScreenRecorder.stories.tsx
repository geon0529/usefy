import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScreenRecorder, useScreenRecorder } from "@usefy/screen-recorder";
import type { RecordingResult, ScreenRecorderError } from "@usefy/screen-recorder";

/**
 * ScreenRecorder is a React component for browser-based screen recording
 * with an intuitive UI.
 *
 * ## Features
 * - Screen/tab/window capture via getDisplayMedia API
 * - Start, stop, pause, and resume recording
 * - Customizable countdown before recording
 * - Real-time timer display
 * - Preview modal with video playback
 * - Download recorded video (WebM format)
 * - Optional system audio capture
 * - Maximum duration limit
 * - Quality presets (low/medium/high)
 *
 * ## Browser Support
 * - Chrome/Edge: Full support
 * - Firefox: Full support
 * - Safari: Limited support (no audio capture)
 *
 * ## Usage
 * Add the component anywhere in your app. It renders a floating trigger
 * button that starts the recording flow when clicked.
 */
const meta: Meta<typeof ScreenRecorder> = {
  title: "Components/ScreenRecorder",
  component: ScreenRecorder,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "React component for browser-based screen recording with a complete UI.\n\n" +
          "**Key Features:**\n" +
          "- Screen/tab/window capture\n" +
          "- Pause and resume recording\n" +
          "- Countdown before recording\n" +
          "- Real-time duration timer\n" +
          "- Preview and download recordings\n" +
          "- System audio capture (optional)\n" +
          "- Quality presets\n" +
          "- SSR compatible",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      description: "Position of the floating trigger button",
      table: {
        type: { summary: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'" },
        defaultValue: { summary: "'bottom-right'" },
      },
    },
    countdown: {
      control: { type: "number", min: 0, max: 10 },
      description: "Countdown seconds before recording starts (0 or false to disable)",
      table: {
        type: { summary: "number | false" },
        defaultValue: { summary: "3" },
      },
    },
    maxDuration: {
      control: { type: "number", min: 10, max: 600, step: 10 },
      description: "Maximum recording duration in seconds",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "300" },
      },
    },
    audio: {
      control: "boolean",
      description: "Enable system audio capture",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    quality: {
      control: "select",
      options: ["low", "medium", "high"],
      description: "Video quality preset",
      table: {
        type: { summary: "'low' | 'medium' | 'high'" },
        defaultValue: { summary: "'medium'" },
      },
    },
    showPreview: {
      control: "boolean",
      description: "Show preview modal after recording",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showTimer: {
      control: "boolean",
      description: "Show timer during recording",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    autoDownload: {
      control: "boolean",
      description: "Automatically download after recording stops",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disable the component",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenRecorder>;

/**
 * Interactive overview of the ScreenRecorder component.
 *
 * **How to use:**
 * 1. Click the floating record button (bottom-right)
 * 2. Select a screen, window, or tab to record
 * 3. Wait for the countdown (3-2-1)
 * 4. Recording starts automatically
 * 5. Use controls to pause/resume or stop
 * 6. Preview and download your recording
 */
export const Overview: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 60,
    audio: false,
    quality: "medium",
    showPreview: true,
    showTimer: true,
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      {/* Demo content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          ScreenRecorder Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Click the record button in the bottom-right corner to start recording
          your screen.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Quick Start
          </h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`import { ScreenRecorder } from "@usefy/screen-recorder";

function App() {
  return (
    <div>
      <YourApp />
      {/* Add anywhere in your app */}
      <ScreenRecorder />
    </div>
  );
}`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
              Recording Flow
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <strong>1. Click:</strong> Press the record button
              </li>
              <li>
                <strong>2. Select:</strong> Choose screen/window/tab
              </li>
              <li>
                <strong>3. Countdown:</strong> 3-2-1 countdown
              </li>
              <li>
                <strong>4. Record:</strong> Recording with timer
              </li>
              <li>
                <strong>5. Preview:</strong> Watch and download
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
              Controls
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>
                <span className="inline-block w-8 h-8 bg-red-500 rounded-full mr-2 align-middle" />{" "}
                Start recording
              </li>
              <li>
                <span className="inline-block w-8 h-8 bg-amber-500 rounded mr-2 align-middle" />{" "}
                Pause recording
              </li>
              <li>
                <span className="inline-block w-8 h-8 bg-slate-700 rounded mr-2 align-middle" />{" "}
                Stop recording
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The component */}
      <ScreenRecorder {...args} />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { ScreenRecorder } from "@usefy/screen-recorder";

// Basic usage
<ScreenRecorder />

// With custom options
<ScreenRecorder
  position="bottom-right"  // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  countdown={3}            // Countdown seconds (0 or false to disable)
  maxDuration={60}         // Max recording time in seconds
  audio={false}            // Enable system audio capture
  quality="medium"         // 'low' | 'medium' | 'high'
  showPreview={true}       // Show preview modal after recording
  onRecordingStart={() => console.log('Recording started')}
  onRecordingStop={(result) => console.log('Recording stopped', result)}
  onError={(error) => console.error('Error:', error)}
/>`,
        language: "tsx",
        type: "code",
      },
    },
  },
};

/**
 * Recording without countdown - starts immediately after screen selection.
 */
export const NoCountdown: Story = {
  args: {
    position: "bottom-right",
    countdown: false,
    maxDuration: 60,
    audio: false,
    quality: "medium",
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          No Countdown Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Recording starts immediately after you select a screen - no countdown.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder countdown={false} />`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Different trigger button positions.
 */
export const PositionOptions: Story = {
  args: {
    position: "top-left",
    countdown: 3,
    maxDuration: 60,
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Position Options
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          The trigger button is positioned in the top-left corner.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
            <code className="text-indigo-600 dark:text-indigo-400">position="top-left"</code>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
            <code className="text-indigo-600 dark:text-indigo-400">position="top-right"</code>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
            <code className="text-indigo-600 dark:text-indigo-400">position="bottom-left"</code>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
            <code className="text-indigo-600 dark:text-indigo-400">position="bottom-right"</code> (default)
          </div>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Quality presets for different use cases.
 *
 * - **low**: 1 Mbps, 15 FPS - good for longer recordings
 * - **medium**: 2.5 Mbps, 30 FPS - balanced quality (default)
 * - **high**: 5 Mbps, 60 FPS - best quality for short clips
 */
export const QualityPresets: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 60,
    quality: "high",
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Quality Presets
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Choose quality based on your needs - file size vs. visual fidelity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
              Low Quality
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">
              1 Mbps, 15 FPS
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              Best for long recordings, smaller file sizes
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
              Medium Quality
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
              2.5 Mbps, 30 FPS
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Balanced quality and file size (default)
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">
              High Quality
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
              5 Mbps, 60 FPS
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              Best visual quality, larger files
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder quality="low" />    // 1 Mbps, 15 FPS
<ScreenRecorder quality="medium" /> // 2.5 Mbps, 30 FPS (default)
<ScreenRecorder quality="high" />   // 5 Mbps, 60 FPS`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Enable system audio capture along with screen recording.
 *
 * **Note:** Audio capture support varies by browser:
 * - Chrome/Edge: Full support (system audio when sharing tab)
 * - Firefox: Full support
 * - Safari: No audio capture support
 */
export const WithAudio: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 60,
    audio: true,
    quality: "medium",
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Screen Recording with Audio
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Capture system audio along with your screen recording.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Tip:</strong> When sharing a tab in Chrome/Edge, check "Share audio"
            to capture tab audio. System audio capture works best when sharing entire screen or window.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder audio={true} />`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

// ============================================================================
// Headless Mode Demo
// ============================================================================

function HeadlessModeDemo() {
  const [events, setEvents] = useState<Array<{ type: string; time: string; data: string }>>([]);
  const [lastResult, setLastResult] = useState<RecordingResult | null>(null);

  const addEvent = (type: string, data: string) => {
    setEvents((prev) => [
      { type, time: new Date().toLocaleTimeString(), data },
      ...prev.slice(0, 9),
    ]);
  };

  const screenRecorder = useScreenRecorder({
    countdown: 3,
    maxDuration: 60,
    audio: false,
    quality: "medium",
    onError: (error: ScreenRecorderError) => addEvent("error", error.message),
  });

  // Track state changes for event log
  const handleStart = async () => {
    addEvent("start", "Starting recording...");
    await screenRecorder.start();
    addEvent("recording", "Recording started");
  };

  const handleStop = () => {
    addEvent("stop", "Stopping recording...");
    screenRecorder.stop();
    if (screenRecorder.result) {
      setLastResult(screenRecorder.result);
      addEvent("complete", `Duration: ${screenRecorder.result.duration}s`);
    }
  };

  const handlePause = () => {
    if (screenRecorder.isPaused) {
      addEvent("resume", "Resuming recording");
      screenRecorder.resume();
    } else {
      addEvent("pause", "Pausing recording");
      screenRecorder.pause();
    }
  };

  const eventColors: Record<string, string> = {
    start: "bg-green-100 text-green-700",
    recording: "bg-green-100 text-green-700",
    stop: "bg-red-100 text-red-700",
    complete: "bg-blue-100 text-blue-700",
    pause: "bg-amber-100 text-amber-700",
    resume: "bg-blue-100 text-blue-700",
    countdown: "bg-purple-100 text-purple-700",
    error: "bg-red-100 text-red-700",
  };

  const stateColors: Record<string, string> = {
    idle: "bg-slate-100 text-slate-700",
    requesting: "bg-blue-100 text-blue-700",
    countdown: "bg-purple-100 text-purple-700",
    recording: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    stopped: "bg-red-100 text-red-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Headless Mode Demo
        </h1>
        <p className="text-slate-600 mb-8">
          Use the useScreenRecorder hook for full control without UI components.
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-xl p-4 shadow-sm border ${stateColors[screenRecorder.state]}`}>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">State</p>
            <p className="text-xl font-bold capitalize">{screenRecorder.state}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Elapsed</p>
            <p className="text-xl font-bold text-slate-800">
              {screenRecorder.elapsedFormatted}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Countdown</p>
            <p className="text-xl font-bold text-slate-800">
              {screenRecorder.countdownValue ?? "-"}
            </p>
          </div>
          <div className={`rounded-xl p-4 shadow-sm border ${screenRecorder.isSupported ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <p className="text-xs uppercase tracking-wider mb-1 opacity-70">Support</p>
            <p className="text-xl font-bold">{screenRecorder.isSupported ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleStart}
              disabled={screenRecorder.state !== "idle"}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              Start
            </button>
            <button
              onClick={handleStop}
              disabled={!screenRecorder.isRecording && !screenRecorder.isPaused}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              Stop
            </button>
            <button
              onClick={handlePause}
              disabled={!screenRecorder.isRecording && !screenRecorder.isPaused}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              {screenRecorder.isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => screenRecorder.reset()}
              disabled={screenRecorder.state === "idle"}
              className="px-4 py-2 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            {lastResult && (
              <button
                onClick={() => screenRecorder.download()}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                Download
              </button>
            )}
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-800 mb-4">Event Log (Last 10)</h2>
          <div className="space-y-2">
            {events.length === 0 ? (
              <p className="text-slate-400 text-sm">Start recording to see events...</p>
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
      </div>
    </div>
  );
}

/**
 * Headless mode using the useScreenRecorder hook directly.
 *
 * Use `useScreenRecorder` when you need full control over the recording
 * flow and want to build your own UI components.
 */
export const HeadlessMode: Story = {
  render: () => <HeadlessModeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Use the `useScreenRecorder` hook for complete control over screen recording " +
          "without any pre-built UI components. Perfect for custom interfaces.",
      },
      source: {
        code: `import { useScreenRecorder } from "@usefy/screen-recorder";

function CustomRecorder() {
  const {
    state,
    isRecording,
    isPaused,
    isCountingDown,
    countdownValue,
    elapsed,
    elapsedFormatted,
    result,
    error,
    isSupported,
    start,
    stop,
    pause,
    resume,
    togglePause,
    reset,
    download,
  } = useScreenRecorder({
    countdown: 3,
    maxDuration: 60,
    audio: false,
    quality: "medium",
    onError: (error) => console.error("Error:", error),
  });

  return (
    <div>
      <p>State: {state}</p>
      <p>Time: {elapsedFormatted}</p>

      <button onClick={start} disabled={state !== "idle"}>
        Start
      </button>
      <button onClick={stop} disabled={!isRecording}>
        Stop
      </button>
      <button onClick={togglePause} disabled={!isRecording && !isPaused}>
        {isPaused ? "Resume" : "Pause"}
      </button>

      {result && (
        <button onClick={download}>Download</button>
      )}
    </div>
  );
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
    start: "bg-green-100 text-green-700",
    stop: "bg-red-100 text-red-700",
    pause: "bg-amber-100 text-amber-700",
    resume: "bg-blue-100 text-blue-700",
    tick: "bg-slate-100 text-slate-600",
    error: "bg-red-100 text-red-700",
    download: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Callback Events Demo
        </h1>
        <p className="text-slate-600 mb-8">
          Click the record button and interact to see events logged below.
        </p>

        {/* Event Log */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">Event Stream</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-slate-400 text-sm">Start a recording to see events...</p>
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
              <code className="text-indigo-600 text-sm">onRecordingStart</code>
              <p className="text-xs text-slate-500 mt-1">Recording has started</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onRecordingStop</code>
              <p className="text-xs text-slate-500 mt-1">Recording completed with result</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onPause</code>
              <p className="text-xs text-slate-500 mt-1">Recording paused</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onResume</code>
              <p className="text-xs text-slate-500 mt-1">Recording resumed</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onError</code>
              <p className="text-xs text-slate-500 mt-1">Error occurred</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onTick</code>
              <p className="text-xs text-slate-500 mt-1">Called every second with elapsed/remaining</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onDownload</code>
              <p className="text-xs text-slate-500 mt-1">User downloaded the recording</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <code className="text-indigo-600 text-sm">onPermissionDenied</code>
              <p className="text-xs text-slate-500 mt-1">User denied screen share</p>
            </div>
          </div>
        </div>
      </div>

      <ScreenRecorder
        position="bottom-right"
        countdown={3}
        maxDuration={60}
        theme="light"
        onRecordingStart={() => addEvent("start", "Recording started")}
        onRecordingStop={(result: RecordingResult) => addEvent("stop", `Duration: ${result.duration}s, Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`)}
        onPause={() => addEvent("pause", "Recording paused")}
        onResume={() => addEvent("resume", "Recording resumed")}
        onError={(error: ScreenRecorderError) => addEvent("error", error.message)}
        onTick={(elapsed: number, remaining: number | null) => addEvent("tick", `Elapsed: ${elapsed}s, Remaining: ${remaining ?? "unlimited"}`)}
        onDownload={(result: RecordingResult) => addEvent("download", `Downloaded: ${(result.size / 1024 / 1024).toFixed(2)} MB`)}
      />
    </div>
  );
}

/**
 * Demonstrates all callback events available in ScreenRecorder.
 *
 * **Available Callbacks:**
 * - `onRecordingStart`: Recording started
 * - `onRecordingStop`: Recording stopped with result
 * - `onPause`: Recording paused
 * - `onResume`: Recording resumed
 * - `onError`: Error occurred
 * - `onTick`: Called every second with elapsed/remaining time
 * - `onDownload`: User downloaded the recording
 * - `onPermissionDenied`: User denied screen share
 */
export const CallbackEvents: Story = {
  render: () => <CallbackEventsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "ScreenRecorder provides various callback events for integrating with your application's " +
          "state management and analytics.",
      },
      source: {
        code: `import { ScreenRecorder } from "@usefy/screen-recorder";

<ScreenRecorder
  onRecordingStart={() => {
    console.log("Recording started");
    analytics.track("recording_started");
  }}
  onRecordingStop={(result) => {
    console.log("Recording completed:", result);
    analytics.track("recording_completed", {
      duration: result.duration,
      size: result.size,
    });
  }}
  onPause={() => {
    console.log("Recording paused");
  }}
  onResume={() => {
    console.log("Recording resumed");
  }}
  onError={(error) => {
    console.error("Recording error:", error);
    Sentry.captureException(error.originalError);
  }}
  onTick={(elapsed, remaining) => {
    console.log(\`Elapsed: \${elapsed}s, Remaining: \${remaining}s\`);
  }}
  onDownload={(result) => {
    console.log("Downloaded:", result.size, "bytes");
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
 * Use `triggerContent` prop to provide a custom trigger element.
 */
export const CustomTrigger: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 60,
    theme: "light",
    triggerContent: (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
        <span className="text-lg">🎬</span>
        <span className="font-medium">Record</span>
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
          Click the custom "Record" button in the bottom-right corner to start recording.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Customization Options
          </h2>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`// Custom trigger content
<ScreenRecorder
  triggerContent={
    <MyCustomButton>
      🎬 Record
    </MyCustomButton>
  }
/>

// Or use the hook for full control
const recorder = useScreenRecorder();

<button onClick={() => recorder.start()}>
  Start Recording
</button>`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Auto-download mode - automatically downloads the recording when stopped.
 */
export const AutoDownload: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 30,
    autoDownload: true,
    showPreview: false,
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Auto-Download Mode
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          When you stop recording, the file will be automatically downloaded
          without showing the preview modal.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Note:</strong> Preview modal is disabled. Recording will be saved
            as <code>screen-recording-[timestamp].webm</code>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder
  autoDownload={true}
  showPreview={false}
/>`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Maximum duration limit - recording stops automatically after the limit.
 */
export const MaxDurationLimit: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 10,
    quality: "medium",
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Max Duration Limit
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Recording will automatically stop after 10 seconds. Watch the timer
          count down to zero.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-6">
          <p className="text-indigo-800 dark:text-indigo-200 text-sm">
            <strong>Max Duration:</strong> 10 seconds
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder
  maxDuration={10}  // Auto-stop after 10 seconds

  onRecordingStop={(result) => {
    console.log("Recording stopped", result.duration);
  }}
/>`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Unlimited duration - no automatic time limit on recordings.
 *
 * Set `maxDuration={Infinity}` to allow unlimited recording time.
 * The timer will count up without any limit.
 */
export const UnlimitedDuration: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: Infinity,
    quality: "medium",
    theme: "light",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Unlimited Duration
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          No time limit on recordings. Record as long as you need - the timer
          will count up indefinitely until you manually stop.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <p className="text-green-800 dark:text-green-200 text-sm">
            <strong>Unlimited Mode:</strong> Recording will continue until you
            press Stop. Be mindful of file sizes for very long recordings.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
            Duration Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <code className="text-indigo-600 dark:text-indigo-400 text-sm">maxDuration={"{60}"}</code>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">1 minute limit</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
              <code className="text-indigo-600 dark:text-indigo-400 text-sm">maxDuration={"{300}"}</code>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">5 minutes (default)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-800/30 p-3 rounded-lg border-2 border-green-300 dark:border-green-600">
              <code className="text-green-600 dark:text-green-400 text-sm">maxDuration={"{Infinity}"}</code>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Unlimited!</p>
            </div>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`// Unlimited recording (use Infinity)
<ScreenRecorder maxDuration={Infinity} />

// Default: 5 minutes (300 seconds)
<ScreenRecorder />

// Custom limit
<ScreenRecorder maxDuration={600} /> // 10 minutes`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};

/**
 * Dark mode demonstration.
 *
 * ScreenRecorder automatically adapts to your app's dark mode.
 */
export const DarkMode: Story = {
  args: {
    position: "bottom-right",
    countdown: 3,
    maxDuration: 60,
    theme: "dark",
  },
  render: (args) => (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">
          Dark Mode Demo
        </h1>
        <p className="text-slate-300 mb-8">
          ScreenRecorder UI components support dark mode styling.
        </p>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Dark Theme Support
          </h2>
          <p className="text-slate-300 mb-4">
            The component uses Tailwind's dark mode classes to automatically
            adapt to your app's theme. The countdown, controls, and preview
            modal all support dark mode.
          </p>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`<ScreenRecorder theme="dark" />
<ScreenRecorder theme="light" />
<ScreenRecorder theme="system" /> // Default`}
          </pre>
        </div>
      </div>
      <ScreenRecorder {...args} />
    </div>
  ),
};
