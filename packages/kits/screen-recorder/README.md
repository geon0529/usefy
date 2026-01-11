<p align="center">
  <img src="https://raw.githubusercontent.com/mirunamu00/usefy/master/assets/logo.png" alt="usefy logo" width="120" />
</p>

<h1 align="center">@usefy/screen-recorder</h1>

<p align="center">
  <strong>React component for screen recording with preview and download</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@usefy/screen-recorder">
    <img src="https://img.shields.io/npm/v/@usefy/screen-recorder.svg?style=flat-square&color=007acc" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@usefy/screen-recorder">
    <img src="https://img.shields.io/npm/dm/@usefy/screen-recorder.svg?style=flat-square&color=007acc" alt="npm downloads" />
  </a>
  <a href="https://bundlephobia.com/package/@usefy/screen-recorder">
    <img src="https://img.shields.io/bundlephobia/minzip/@usefy/screen-recorder?style=flat-square&color=007acc" alt="bundle size" />
  </a>
  <a href="https://github.com/mirunamu00/usefy/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@usefy/screen-recorder.svg?style=flat-square&color=007acc" alt="license" />
  </a>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#examples">Examples</a> •
  <a href="#browser-support">Browser Support</a>
</p>

<p align="center">
  <a href="https://mirunamu00.github.io/usefy/?path=/story/kits-screenrecorder--overview" target="_blank" rel="noopener noreferrer">
    <strong>View Storybook Demo</strong>
  </a>
</p>

---

## Overview

`@usefy/screen-recorder` is a React component for capturing screen recordings directly in the browser. It provides a complete UI solution with floating trigger, recording controls, countdown, preview modal, and download functionality.

**Part of the [@usefy](https://www.npmjs.com/org/usefy) ecosystem.**

### Why screen-recorder?

- **Zero Backend Required** — Pure browser-based recording using native MediaRecorder API
- **Complete UI Solution** — Ready-to-use floating controls with preview modal
- **Flexible Output** — WebM video with configurable quality presets
- **Developer Friendly** — Both component and headless hook APIs
- **Privacy First** — All processing happens client-side, no data leaves the browser
- **TypeScript First** — Full type safety with comprehensive exported interfaces
- **SSR Compatible** — Safe to use with Next.js, Remix, and other SSR frameworks

---

## Installation

```bash
# npm
npm install @usefy/screen-recorder

# yarn
yarn add @usefy/screen-recorder

# pnpm
pnpm add @usefy/screen-recorder
```

### Peer Dependencies

This package requires React 18+:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

---

## Quick Start

```tsx
import { ScreenRecorder } from "@usefy/screen-recorder";

function App() {
  return (
    <div>
      <YourApp />
      {/* Add floating recorder button */}
      <ScreenRecorder
        onRecordingStop={(result) => {
          console.log("Recording complete:", result);
        }}
      />
    </div>
  );
}
```

> **Note:** Styles are automatically injected. No CSS import required!

A floating trigger button appears in the corner. Click to start recording, and the browser will prompt you to select a screen, window, or tab to record.

---

## Features

### Screen Capture

Record entire screen, specific windows, or browser tabs using the native Screen Capture API:

```tsx
<ScreenRecorder
  audio={true}  // Include system audio
  quality="high"
  maxDuration={300}  // 5 minutes max
/>
```

**Capture Options:**
- **Entire Screen** — Record everything on your display
- **Application Window** — Record a specific application
- **Browser Tab** — Record a single browser tab (with audio)

### Recording Controls

Full control over the recording process:

| Feature | Description |
|---------|-------------|
| **Start/Stop** | Basic recording controls |
| **Pause/Resume** | Pause recording without stopping |
| **Timer Display** | Shows elapsed and remaining time |
| **Max Duration** | Auto-stop at configured limit (or unlimited with `Infinity`) |
| **Countdown** | 3-2-1 countdown before recording starts |

```tsx
<ScreenRecorder
  countdown={3}           // 3-2-1 countdown
  maxDuration={60}        // 1 minute max
  showTimer={true}        // Display timer
  onPause={() => console.log("Paused")}
  onResume={() => console.log("Resumed")}
/>

// Unlimited recording (no auto-stop)
<ScreenRecorder maxDuration={Infinity} />
```

### Preview & Download

Review your recording before saving:

```tsx
<ScreenRecorder
  showPreview={true}      // Show preview modal after recording
  autoDownload={false}    // Manual download
  filename="my-recording" // Custom filename
  onDownload={(result) => {
    console.log("Downloaded:", result.size, "bytes");
  }}
/>
```

**Preview Modal Features:**
- Video player with playback controls
- Recording info (duration, size, format)
- Download button
- Re-record option
- Done/Close button

### Quality Presets

Configure video quality with built-in presets:

| Preset | Bitrate | Frame Rate | Use Case |
|--------|---------|------------|----------|
| `low` | 1 Mbps | 15 fps | Smaller files, basic quality |
| `medium` | 2.5 Mbps | 30 fps | Balanced quality/size (default) |
| `high` | 5 Mbps | 60 fps | Best quality, larger files |

```tsx
<ScreenRecorder quality="high" />

// Or custom configuration
<ScreenRecorder
  quality={{
    videoBitsPerSecond: 4_000_000,
    frameRate: 30,
  }}
/>
```

### Audio Recording

Capture system audio along with video:

```tsx
<ScreenRecorder
  audio={true}  // Include system/tab audio
/>

// Or detailed configuration
<ScreenRecorder
  audio={{
    system: true,      // System audio
    microphone: true,  // Microphone (future)
  }}
/>
```

> **Note:** System audio capture works best when recording browser tabs. Some browsers may require user permission.

### Position Options

Place the trigger button anywhere:

```tsx
<ScreenRecorder position="bottom-right" />  // Default
<ScreenRecorder position="bottom-left" />
<ScreenRecorder position="top-right" />
<ScreenRecorder position="top-left" />
```

### Custom Trigger

Customize the trigger button appearance:

```tsx
<ScreenRecorder
  triggerContent={
    <span className="flex items-center gap-2">
      <CameraIcon />
      Record Screen
    </span>
  }
/>
```

### Theme Support

The component supports light and dark themes:

```tsx
<ScreenRecorder theme="dark" />   // Force dark
<ScreenRecorder theme="light" />  // Force light
<ScreenRecorder theme="system" /> // Follow OS (default)
```

---

## API Reference

### ScreenRecorder Props

#### Recording Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxDuration` | `number` | `300` | Maximum recording duration in seconds (use `Infinity` for unlimited) |
| `countdown` | `number \| false` | `3` | Countdown before recording (false to disable) |
| `audio` | `boolean \| AudioConfig` | `false` | Include audio in recording |
| `quality` | `'low' \| 'medium' \| 'high' \| QualityPreset` | `'medium'` | Video quality preset |
| `format` | `'webm' \| 'mp4'` | `'webm'` | Output format |
| `mimeType` | `string` | `'video/webm;codecs=vp9'` | MIME type for MediaRecorder |

#### UI Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Trigger button position |
| `triggerContent` | `ReactNode` | - | Custom trigger button content |
| `showPreview` | `boolean` | `true` | Show preview modal after recording |
| `showTimer` | `boolean` | `true` | Show timer during recording |
| `zIndex` | `number` | `9999` | Z-index for floating elements |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Theme setting |
| `className` | `string` | - | Additional CSS class |
| `filename` | `string \| ((timestamp: Date) => string)` | `'screen-recording'` | Download filename |

#### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onRecordingStart` | `() => void` | Called when recording starts |
| `onRecordingStop` | `(result: RecordingResult) => void` | Called when recording stops |
| `onPause` | `() => void` | Called when recording is paused |
| `onResume` | `() => void` | Called when recording is resumed |
| `onDownload` | `(result: RecordingResult) => void` | Called when user downloads |
| `onError` | `(error: ScreenRecorderError) => void` | Called on error |
| `onPermissionDenied` | `() => void` | Called when user denies permission |
| `onTick` | `(elapsed: number, remaining: number \| null) => void` | Called every second |

#### Advanced

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoDownload` | `boolean` | `false` | Auto-download after recording |
| `disabled` | `boolean` | `false` | Disable the component |
| `renderMode` | `'portal' \| 'inline'` | `'portal'` | Render mode for floating UI |

### useScreenRecorder Hook

For headless usage without the built-in UI:

```tsx
import { useScreenRecorder } from "@usefy/screen-recorder";

function CustomRecorder() {
  const {
    // State
    state,           // 'idle' | 'requesting' | 'countdown' | 'recording' | 'paused' | 'stopped' | 'error'
    isRecording,     // boolean
    isPaused,        // boolean
    isCountingDown,  // boolean
    countdownValue,  // number | null
    elapsed,         // number (seconds)
    remaining,       // number | null (seconds)
    elapsedFormatted,// string ('MM:SS')
    result,          // RecordingResult | null
    error,           // ScreenRecorderError | null
    isSupported,     // boolean

    // Actions
    start,           // () => Promise<void>
    stop,            // () => void
    pause,           // () => void
    resume,          // () => void
    togglePause,     // () => void
    download,        // (filename?: string) => void
    reset,           // () => void
    getPreviewUrl,   // () => string | null
    revokePreviewUrl,// () => void
  } = useScreenRecorder({
    maxDuration: 120,
    audio: true,
    countdown: 3,
  });

  // Build your own UI...
}
```

### Types

```typescript
// Recording state
type RecordingState =
  | 'idle'
  | 'requesting'
  | 'countdown'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'error';

// Recording result
interface RecordingResult {
  blob: Blob;
  url: string;
  duration: number;
  size: number;
  mimeType: string;
  timestamp: Date;
  hasAudio: boolean;
}

// Error
interface ScreenRecorderError {
  code: ScreenRecorderErrorCode;
  message: string;
  originalError?: Error;
}

type ScreenRecorderErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED'
  | 'MEDIA_RECORDER_ERROR'
  | 'STREAM_ENDED'
  | 'NO_STREAM'
  | 'ENCODING_ERROR'
  | 'UNKNOWN';

// Quality preset
interface QualityPreset {
  videoBitsPerSecond: number;
  width?: number;
  height?: number;
  frameRate?: number;
}
```

---

## Examples

### Basic Usage

```tsx
import { ScreenRecorder } from "@usefy/screen-recorder";

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <ScreenRecorder />
    </div>
  );
}
```

### Bug Report Integration

```tsx
import { ScreenRecorder, RecordingResult } from "@usefy/screen-recorder";
import { useState } from "react";

function BugReportForm() {
  const [recording, setRecording] = useState<RecordingResult | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('description', description);
    if (recording) {
      formData.append('video', recording.blob, 'bug-recording.webm');
    }
    await submitBugReport(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Describe the bug..." />

      <ScreenRecorder
        position="bottom-left"
        maxDuration={60}
        onRecordingStop={setRecording}
        triggerContent={
          recording ? "✓ Recording attached" : "📹 Record screen"
        }
      />

      {recording && (
        <div>
          <video src={recording.url} controls width={300} />
          <p>Duration: {recording.duration}s, Size: {(recording.size / 1024 / 1024).toFixed(2)} MB</p>
          <button type="button" onClick={() => setRecording(null)}>Remove</button>
        </div>
      )}

      <button type="submit">Submit Bug Report</button>
    </form>
  );
}
```

### Tutorial Recording

```tsx
<ScreenRecorder
  audio={true}              // Include audio for narration
  quality="high"            // Best quality for tutorials
  maxDuration={600}         // 10 minutes
  countdown={5}             // 5 second countdown
  filename={(timestamp) => `tutorial-${timestamp.toISOString().split('T')[0]}`}
  onRecordingStop={(result) => {
    // Upload to video hosting
    uploadToYouTube(result.blob);
  }}
/>
```

### Custom Hook Usage

```tsx
import { useScreenRecorder } from "@usefy/screen-recorder";

function CustomRecorder() {
  const {
    state,
    isRecording,
    isPaused,
    elapsed,
    elapsedFormatted,
    result,
    start,
    stop,
    pause,
    resume,
    download,
    reset,
    isSupported,
    error,
  } = useScreenRecorder({
    maxDuration: 120,
    audio: true,
  });

  if (!isSupported) {
    return <p>Screen recording is not supported in your browser.</p>;
  }

  return (
    <div className="custom-recorder">
      <p>State: {state}</p>
      <p>Time: {elapsedFormatted}</p>

      {state === 'idle' && (
        <button onClick={start}>Start Recording</button>
      )}

      {isRecording && (
        <>
          <button onClick={pause}>Pause</button>
          <button onClick={stop}>Stop</button>
        </>
      )}

      {isPaused && (
        <>
          <button onClick={resume}>Resume</button>
          <button onClick={stop}>Stop</button>
        </>
      )}

      {result && (
        <div>
          <video src={result.url} controls />
          <button onClick={() => download('my-recording')}>Download</button>
          <button onClick={reset}>New Recording</button>
        </div>
      )}

      {error && <p className="error">Error: {error.message}</p>}
    </div>
  );
}
```

### With Callbacks

```tsx
<ScreenRecorder
  onRecordingStart={() => {
    console.log('Recording started');
    analytics.track('recording_started');
  }}
  onRecordingStop={(result) => {
    console.log('Recording stopped:', result.duration, 'seconds');
    analytics.track('recording_completed', {
      duration: result.duration,
      size: result.size,
      hasAudio: result.hasAudio,
    });
  }}
  onError={(error) => {
    console.error('Recording error:', error.code, error.message);
    errorReporting.capture(error.originalError);
  }}
  onPermissionDenied={() => {
    toast.error('Please allow screen sharing to record');
  }}
/>
```

---

## Browser Support

Screen recording uses the `getDisplayMedia` API which is a desktop-only feature:

| Browser | Version | Support Level | Notes |
|---------|---------|---------------|-------|
| **Chrome** | 72+ | Full | All features supported |
| **Edge** | 79+ | Full | Chromium-based, full support |
| **Firefox** | 66+ | Full | System audio may require flag |
| **Safari** | 16.4+ | Partial | No system audio, limited codec |
| **Opera** | 60+ | Full | Chromium-based |
| **iOS Safari** | - | None | getDisplayMedia not supported |
| **Android Chrome** | - | None | getDisplayMedia not supported |

> **Note:** Screen recording is a desktop-only feature due to browser API limitations. The component will show an error message on unsupported browsers.

---

## Error Handling

The component handles various error scenarios:

| Error Code | Description | User Action |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | User denied screen share | Click "Try Again" |
| `NOT_SUPPORTED` | Browser doesn't support API | Use Chrome/Edge/Firefox |
| `MEDIA_RECORDER_ERROR` | Recording failed | Try again |
| `STREAM_ENDED` | User stopped via browser | Recording saved if data available |
| `NO_STREAM` | No stream available | Start new recording |
| `ENCODING_ERROR` | Failed to encode video | Try different quality setting |

---

## Styling

**Styles are automatically injected** when you import the component. No additional CSS imports or Tailwind configuration required!

If you prefer to import styles manually (e.g., for SSR or custom loading), you can use:

```tsx
import "@usefy/screen-recorder/styles.css";
```

---

## License

MIT © [mirunamu](https://github.com/mirunamu00)

This package is part of the [usefy](https://github.com/mirunamu00/usefy) monorepo.

---

<p align="center">
  <sub>Built with care by the usefy team</sub>
</p>
