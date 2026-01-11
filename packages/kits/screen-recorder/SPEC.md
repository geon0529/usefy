# ScreenRecorder Component Specification

## Overview

**Package Name:** `@usefy/screen-recorder`
**Version:** `0.1.0`
**Status:** Draft
**Created:** 2026-01-11
**Author:** usefy team

---

## 1. Executive Summary

### 1.1 Purpose

`ScreenRecorder` is a React component for capturing screen recordings directly in the browser. It provides a complete solution for recording user screens, tabs, or windows with an intuitive UI, making it easy to create bug reports, tutorials, or documentation.

### 1.2 Target Users

- Frontend Developers (bug reporting)
- QA Engineers (issue reproduction)
- Product Teams (user feedback with context)
- Content Creators (tutorials, demos)
- Support Teams (customer assistance)

### 1.3 Key Value Propositions

1. **Zero Backend Required**: Pure browser-based recording using MediaRecorder API
2. **Complete UI Solution**: Ready-to-use floating controls with preview
3. **Flexible Output**: WebM video with optional GIF conversion
4. **Developer Friendly**: Both component and headless hook APIs
5. **Privacy First**: All processing happens client-side, no data leaves the browser

### 1.4 Use Cases

| Scenario | Example |
|----------|---------|
| Bug Reporting | User records steps to reproduce a bug |
| Customer Support | Agent records solution walkthrough |
| Documentation | Developer creates feature demo |
| User Feedback | User shows exactly what they're experiencing |
| QA Testing | Tester records test execution |
| Tutorials | Creator makes how-to content |

---

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Recording Capabilities

| Feature | Description | Priority |
|---------|-------------|----------|
| Screen Capture | Record entire screen, window, or browser tab | P0 |
| Start/Stop | Basic recording controls | P0 |
| Pause/Resume | Pause recording without stopping | P1 |
| Timer Display | Show elapsed recording time | P0 |
| Max Duration | Auto-stop at configured limit | P1 |
| Countdown | 3-2-1 countdown before recording starts | P1 |

#### 2.1.2 Audio Options

| Feature | Description | Priority |
|---------|-------------|----------|
| System Audio | Capture tab/system audio | P1 |
| Microphone | Capture microphone input | P2 |
| Audio Toggle | Enable/disable audio during setup | P1 |
| Audio Indicator | Visual feedback when audio is being captured | P2 |

#### 2.1.3 Output & Export

| Feature | Description | Priority |
|---------|-------------|----------|
| WebM Output | Native browser format, smallest size | P0 |
| Download | Save recording to local filesystem | P0 |
| Blob URL | Generate URL for preview/upload | P0 |
| GIF Conversion | Convert to GIF for sharing | P2 |
| Custom Filename | Configure download filename | P1 |
| Quality Settings | Adjust bitrate/resolution | P2 |

#### 2.1.4 Preview & Playback

| Feature | Description | Priority |
|---------|-------------|----------|
| Preview Modal | Review recording before saving | P0 |
| Video Player | Play/pause/seek recorded video | P0 |
| Re-record | Discard and start over | P0 |
| Thumbnail | Generate preview thumbnail | P2 |

#### 2.1.5 UI Components

| Feature | Description | Priority |
|---------|-------------|----------|
| Floating Trigger | Button to initiate recording | P0 |
| Recording Controls | Start/stop/pause buttons | P0 |
| Status Indicator | Recording state visual feedback | P0 |
| Timer | Elapsed time display | P0 |
| Preview Modal | Post-recording review | P0 |
| Position Options | Configurable UI placement | P1 |
| Dark/Light Theme | Theme support | P2 |

#### 2.1.6 Error Handling

| Feature | Description | Priority |
|---------|-------------|----------|
| Permission Denied | Handle user declining screen share | P0 |
| Browser Support | Detect and warn unsupported browsers | P0 |
| Recording Failed | Handle MediaRecorder errors | P0 |
| Stream Ended | Handle user stopping share via browser | P0 |

---

## 3. Technical Specifications

### 3.1 Component API

```typescript
interface ScreenRecorderProps {
  // === Recording Options ===
  /**
   * Maximum recording duration in seconds
   * @default 300 (5 minutes)
   */
  maxDuration?: number;

  /**
   * Countdown seconds before recording starts
   * @default 3
   */
  countdown?: number | false;

  /**
   * Include system/tab audio in recording
   * @default false
   */
  audio?: boolean | {
    system?: boolean;
    microphone?: boolean;
  };

  /**
   * Video quality settings
   */
  quality?: 'low' | 'medium' | 'high' | {
    videoBitsPerSecond?: number;
    width?: number;
    height?: number;
    frameRate?: number;
  };

  /**
   * Output format
   * @default 'webm'
   */
  format?: 'webm' | 'mp4';

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
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Custom trigger button content
   */
  triggerContent?: React.ReactNode;

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
  theme?: 'light' | 'dark' | 'system';

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Default filename for download (without extension)
   * @default 'screen-recording'
   */
  filename?: string | ((timestamp: Date) => string);

  // === Callbacks ===
  /**
   * Called when recording starts
   */
  onRecordingStart?: () => void;

  /**
   * Called when recording stops
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
  renderMode?: 'portal' | 'inline';
}
```

### 3.2 Hook API

```typescript
interface UseScreenRecorderOptions {
  maxDuration?: number;
  countdown?: number | false;
  audio?: boolean | { system?: boolean; microphone?: boolean };
  quality?: QualityOption;
  mimeType?: string;
  onError?: (error: ScreenRecorderError) => void;
}

interface UseScreenRecorderReturn {
  // === State ===
  /** Current recording state */
  state: RecordingState;

  /** Whether currently recording */
  isRecording: boolean;

  /** Whether recording is paused */
  isPaused: boolean;

  /** Whether in countdown phase */
  isCountingDown: boolean;

  /** Current countdown value */
  countdownValue: number | null;

  /** Elapsed recording time in seconds */
  elapsed: number;

  /** Remaining time if maxDuration set */
  remaining: number | null;

  /** Formatted elapsed time (MM:SS) */
  elapsedFormatted: string;

  /** Recording result after stop */
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

function useScreenRecorder(options?: UseScreenRecorderOptions): UseScreenRecorderReturn;
```

### 3.3 Exported Types

```typescript
export type RecordingState =
  | 'idle'
  | 'requesting'    // Waiting for user to select screen
  | 'countdown'     // Countdown in progress
  | 'recording'     // Actively recording
  | 'paused'        // Recording paused
  | 'stopped'       // Recording complete
  | 'error';        // Error occurred

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

export interface ScreenRecorderError {
  code: ScreenRecorderErrorCode;
  message: string;
  originalError?: Error;
}

export type ScreenRecorderErrorCode =
  | 'PERMISSION_DENIED'      // User denied screen share
  | 'NOT_SUPPORTED'          // Browser doesn't support API
  | 'MEDIA_RECORDER_ERROR'   // MediaRecorder failed
  | 'STREAM_ENDED'           // User stopped sharing via browser
  | 'NO_STREAM'              // No stream available
  | 'ENCODING_ERROR'         // Failed to encode video
  | 'UNKNOWN';               // Unknown error

export interface QualityPreset {
  videoBitsPerSecond: number;
  width?: number;
  height?: number;
  frameRate?: number;
}

export const QUALITY_PRESETS: Record<'low' | 'medium' | 'high', QualityPreset> = {
  low: { videoBitsPerSecond: 1_000_000, frameRate: 15 },
  medium: { videoBitsPerSecond: 2_500_000, frameRate: 30 },
  high: { videoBitsPerSecond: 5_000_000, frameRate: 60 },
};
```

### 3.4 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 \|\| ^19.0.0 | Peer dependency |
| `react-dom` | ^18.0.0 \|\| ^19.0.0 | Portal rendering |

**No external dependencies** - uses native browser APIs:
- `navigator.mediaDevices.getDisplayMedia()` - Screen Capture API
- `MediaRecorder` - Recording API
- `Blob` / `URL.createObjectURL()` - File handling

### 3.5 Browser Support

| Browser | Version | Support Level | Notes |
|---------|---------|---------------|-------|
| Chrome | 72+ | Full | All features supported |
| Edge | 79+ | Full | Chromium-based, full support |
| Firefox | 66+ | Full | System audio may require flag |
| Safari | 16.4+ | Partial | No system audio, limited codec |
| Opera | 60+ | Full | Chromium-based |
| iOS Safari | - | None | getDisplayMedia not supported |
| Android Chrome | - | None | getDisplayMedia not supported |

**Note**: Screen recording is a desktop-only feature due to browser API limitations.

---

## 4. Architecture

### 4.1 Package Structure

```
screen-recorder/
├── src/
│   ├── index.ts                    # Public exports
│   ├── ScreenRecorder.tsx          # Main component
│   ├── useScreenRecorder.ts        # Core hook
│   ├── types.ts                    # Type definitions
│   ├── constants.ts                # Defaults, presets
│   │
│   ├── components/
│   │   ├── Trigger/
│   │   │   ├── Trigger.tsx         # Floating trigger button
│   │   │   └── TriggerIcon.tsx     # Record icon
│   │   │
│   │   ├── Controls/
│   │   │   ├── RecordingControls.tsx   # Recording control bar
│   │   │   ├── Timer.tsx               # Elapsed time display
│   │   │   ├── PauseButton.tsx         # Pause/resume button
│   │   │   └── StopButton.tsx          # Stop button
│   │   │
│   │   ├── Countdown/
│   │   │   └── Countdown.tsx       # 3-2-1 countdown overlay
│   │   │
│   │   ├── Preview/
│   │   │   ├── PreviewModal.tsx    # Post-recording preview
│   │   │   ├── VideoPlayer.tsx     # Video playback controls
│   │   │   └── ActionButtons.tsx   # Download/re-record/confirm
│   │   │
│   │   └── Status/
│   │       ├── StatusBadge.tsx     # Recording state indicator
│   │       └── ErrorMessage.tsx    # Error display
│   │
│   ├── hooks/
│   │   ├── useMediaRecorder.ts     # MediaRecorder wrapper
│   │   ├── useDisplayMedia.ts      # Screen capture wrapper
│   │   ├── useTimer.ts             # Recording timer
│   │   ├── useCountdown.ts         # Countdown logic
│   │   └── useBrowserSupport.ts    # Feature detection
│   │
│   ├── utils/
│   │   ├── cn.ts                   # Class name utility
│   │   ├── formatTime.ts           # Time formatting (MM:SS)
│   │   ├── downloadBlob.ts         # File download helper
│   │   ├── detectBrowser.ts        # Browser detection
│   │   └── mimeTypes.ts            # MIME type helpers
│   │
│   └── styles/
│       └── screen-recorder.css     # Component styles
│
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── SPEC.md
└── README.md
```

### 4.2 State Machine

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
                    ▼                                         │
              ┌──────────┐                                    │
              │   IDLE   │◄────────────────────────────────┐  │
              └────┬─────┘                                 │  │
                   │                                       │  │
                   │ start()                               │  │
                   ▼                                       │  │
            ┌─────────────┐                                │  │
            │ REQUESTING  │ (waiting for user selection)   │  │
            └──────┬──────┘                                │  │
                   │                                       │  │
        ┌──────────┼──────────┐                            │  │
        │          │          │                            │  │
        ▼          ▼          ▼                            │  │
   ┌────────┐ ┌─────────┐ ┌───────┐                        │  │
   │ ERROR  │ │COUNTDOWN│ │       │ (if countdown=false)   │  │
   └────┬───┘ └────┬────┘ │       │                        │  │
        │          │      │       │                        │  │
        │          ▼      │       │                        │  │
        │    ┌───────────┐│       │                        │  │
        │    │ RECORDING │◄───────┘                        │  │
        │    └─────┬─────┘                                 │  │
        │          │                                       │  │
        │    ┌─────┴─────┐                                 │  │
        │    │           │                                 │  │
        │    ▼           ▼                                 │  │
        │ ┌──────┐  ┌─────────┐                            │  │
        │ │PAUSED│  │ STOPPED │                            │  │
        │ └───┬──┘  └────┬────┘                            │  │
        │     │          │                                 │  │
        │     │ resume() │ reset()                         │  │
        │     │          │                                 │  │
        │     └──────────┼─────────────────────────────────┘  │
        │                │                                    │
        └────────────────┴────────────────────────────────────┘
                              reset()
```

### 4.3 Data Flow

```
User clicks "Record"
        │
        ▼
┌──────────────────────┐
│ getDisplayMedia()    │ ← Browser shows screen picker
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ MediaStream obtained │
└──────────────────────┘
        │
        ▼ (if countdown enabled)
┌──────────────────────┐
│ Countdown: 3, 2, 1   │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ MediaRecorder.start()│
└──────────────────────┘
        │
        │ ondataavailable
        ▼
┌──────────────────────┐
│ Collect Blob chunks  │ ← Store in array
└──────────────────────┘
        │
        │ User clicks "Stop"
        ▼
┌──────────────────────┐
│ MediaRecorder.stop() │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Combine chunks → Blob│
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Generate Blob URL    │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Show Preview Modal   │
└──────────────────────┘
        │
        ├── Download → Save file
        ├── Re-record → Reset
        └── Confirm → onRecordingStop callback
```

---

## 5. UI/UX Specifications

### 5.1 Floating Trigger Button

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│                    [ Application ]                   │
│                                                      │
│                                                      │
│                                                      │
│                                         ┌─────────┐  │
│                                         │  ● REC  │  │
│                                         └─────────┘  │
└──────────────────────────────────────────────────────┘
```

### 5.2 Recording Controls

```
┌────────────────────────────────────────┐
│  ● REC   00:15   [⏸ Pause] [⏹ Stop]   │
└────────────────────────────────────────┘
```

Recording state variations:
```
IDLE:       [● Record Screen]
COUNTDOWN:  [    3...    ] (full screen overlay)
RECORDING:  [● REC  00:15  ⏸  ⏹]
PAUSED:     [⏸ PAUSED 00:15  ▶  ⏹]
```

### 5.3 Countdown Overlay

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│                                                      │
│                        ╭───╮                         │
│                        │ 3 │                         │
│                        ╰───╯                         │
│                                                      │
│                  Recording starts in...              │
│                                                      │
│                     [Cancel]                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.4 Preview Modal

```
┌──────────────────────────────────────────────────────┐
│  Recording Complete                              ✕   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                │  │
│  │                                                │  │
│  │              [ Video Preview ]                 │  │
│  │                                                │  │
│  │                                                │  │
│  │    ▶   ━━━━━━━━━━━━━●━━━━━━━━   00:15/00:23   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Duration: 23s  •  Size: 2.4 MB  •  WebM             │
│                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ ↓ Download   │ │ ↻ Re-record  │ │   ✓ Done     │  │
│  └──────────────┘ └──────────────┘ └──────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.5 Error States

```
Permission Denied:
┌────────────────────────────────────────┐
│ ⚠️ Screen recording permission denied  │
│                                        │
│ Please allow screen sharing when       │
│ prompted by your browser.              │
│                                        │
│            [Try Again]                 │
└────────────────────────────────────────┘

Browser Not Supported:
┌────────────────────────────────────────┐
│ ⚠️ Screen recording not supported      │
│                                        │
│ Your browser doesn't support screen    │
│ recording. Please use Chrome, Edge,    │
│ or Firefox on desktop.                 │
│                                        │
│              [OK]                      │
└────────────────────────────────────────┘
```

### 5.6 Color Scheme

```typescript
const colors = {
  recording: {
    badge: 'bg-red-500',      // Recording indicator
    pulse: 'animate-pulse',    // Pulsing animation
    text: 'text-red-600',
  },
  paused: {
    badge: 'bg-amber-500',
    text: 'text-amber-600',
  },
  controls: {
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    secondary: 'bg-gray-100 hover:bg-gray-200',
    danger: 'bg-red-600 hover:bg-red-700',
  },
  timer: {
    normal: 'text-gray-700',
    warning: 'text-amber-600',  // Last 30 seconds
    critical: 'text-red-600',   // Last 10 seconds
  },
};
```

### 5.7 Animation Specs

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Trigger appear | 200ms | ease-out | Scale + fade in |
| Controls slide | 300ms | ease-out | Slide from bottom |
| Countdown number | 1000ms | ease-in-out | Scale pulse per second |
| Recording pulse | 1500ms | ease-in-out | Infinite pulse on badge |
| Modal open | 200ms | ease-out | Fade + scale |
| Modal close | 150ms | ease-in | Fade out |

---

## 6. Usage Examples

### 6.1 Basic Usage

```tsx
import { ScreenRecorder } from '@usefy/screen-recorder';

function App() {
  return (
    <div>
      <h1>My Application</h1>

      <ScreenRecorder
        onRecordingStop={(result) => {
          console.log('Recording complete:', result);
          // Upload to server, attach to bug report, etc.
        }}
      />
    </div>
  );
}
```

### 6.2 Bug Report Integration

```tsx
import { ScreenRecorder } from '@usefy/screen-recorder';

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
          <button onClick={() => setRecording(null)}>Remove</button>
        </div>
      )}

      <button type="submit">Submit Bug Report</button>
    </form>
  );
}
```

### 6.3 Headless Hook Usage

```tsx
import { useScreenRecorder } from '@usefy/screen-recorder';

function CustomRecorder() {
  const {
    state,
    isRecording,
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
    <div>
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

      {state === 'paused' && (
        <>
          <button onClick={resume}>Resume</button>
          <button onClick={stop}>Stop</button>
        </>
      )}

      {result && (
        <>
          <video src={result.url} controls />
          <button onClick={() => download('my-recording')}>Download</button>
          <button onClick={reset}>New Recording</button>
        </>
      )}

      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### 6.4 With Audio

```tsx
<ScreenRecorder
  audio={{
    system: true,     // Capture tab/system audio
    microphone: true, // Also capture microphone
  }}
  onRecordingStop={(result) => {
    console.log('Has audio:', result.hasAudio);
  }}
/>
```

### 6.5 Custom Styling

```tsx
<ScreenRecorder
  className="my-recorder"
  theme="dark"
  position="top-right"
  triggerContent={
    <span className="custom-trigger">
      <CameraIcon /> Record
    </span>
  }
/>
```

---

## 7. Development Milestones

### Phase 1: Core Recording Engine

- [ ] Project setup (package.json, tsconfig, tsup, vitest)
- [ ] Type definitions
- [ ] `useDisplayMedia` hook (screen capture)
- [ ] `useMediaRecorder` hook (recording)
- [ ] `useTimer` hook (elapsed time)
- [ ] `useScreenRecorder` main hook
- [ ] Browser support detection

### Phase 2: Basic UI Components

- [ ] Trigger button component
- [ ] Recording controls component
- [ ] Timer display
- [ ] Status badge (recording indicator)
- [ ] Basic styling with Tailwind

### Phase 3: Preview & Export

- [ ] Preview modal component
- [ ] Video player controls
- [ ] Download functionality
- [ ] Blob URL management
- [ ] File naming

### Phase 4: Enhanced Features

- [ ] Countdown overlay
- [ ] Pause/resume functionality
- [ ] Audio options (system + microphone)
- [ ] Max duration with auto-stop
- [ ] Quality presets

### Phase 5: Polish & Testing

- [ ] Error handling UI
- [ ] Accessibility (keyboard nav, ARIA)
- [ ] Unit tests (90%+ coverage)
- [ ] Integration tests
- [ ] Storybook stories
- [ ] Documentation
- [ ] SSR safety

---

## 8. Testing Strategy

### 8.1 Unit Tests

```typescript
describe('useScreenRecorder', () => {
  describe('initialization', () => {
    it('should start in idle state');
    it('should detect browser support');
    it('should apply default options');
  });

  describe('recording flow', () => {
    it('should transition to requesting state on start');
    it('should handle permission denied');
    it('should start countdown after stream obtained');
    it('should start recording after countdown');
    it('should track elapsed time');
    it('should stop at max duration');
  });

  describe('pause/resume', () => {
    it('should pause recording');
    it('should resume from paused state');
    it('should maintain elapsed time when paused');
  });

  describe('output', () => {
    it('should generate blob on stop');
    it('should generate preview URL');
    it('should download with correct filename');
    it('should cleanup blob URL on reset');
  });
});

describe('ScreenRecorder component', () => {
  describe('trigger button', () => {
    it('should render trigger in correct position');
    it('should open recording on click');
    it('should show custom trigger content');
  });

  describe('recording UI', () => {
    it('should show controls during recording');
    it('should display elapsed time');
    it('should show pause button');
  });

  describe('preview modal', () => {
    it('should show preview after recording');
    it('should play video');
    it('should download on button click');
    it('should reset on re-record');
  });
});
```

### 8.2 Integration Tests

- Full recording flow (start → record → stop → preview → download)
- Permission handling
- Stream end detection (user stops via browser)
- Multiple recordings in sequence

### 8.3 Browser Testing

- Chrome (primary)
- Firefox
- Edge
- Safari (limited features)

---

## 9. Performance Considerations

### 9.1 Memory Management

- Use `timeslice` in MediaRecorder to avoid large memory buffers
- Clean up blob URLs when no longer needed
- Stop all tracks when recording ends
- Release MediaStream resources

### 9.2 File Size

- Default to VP9 codec for smaller files
- Provide quality presets
- Show file size in preview

### 9.3 Bundle Size Target

- **< 15KB gzipped** (no external dependencies)
- Tree-shakeable exports
- Lazy load preview modal

---

## 10. Accessibility

### 10.1 Keyboard Navigation

| Key | Action |
|-----|--------|
| Enter/Space | Activate focused button |
| Escape | Cancel recording / Close modal |
| Tab | Navigate between controls |

### 10.2 Screen Reader Support

```tsx
<button
  aria-label="Start screen recording"
  aria-pressed={isRecording}
>
  {isRecording ? 'Recording...' : 'Record Screen'}
</button>

<div
  role="timer"
  aria-live="polite"
  aria-label={`Recording time: ${elapsedFormatted}`}
>
  {elapsedFormatted}
</div>

<div
  role="alertdialog"
  aria-labelledby="preview-title"
  aria-describedby="preview-description"
>
  {/* Preview modal content */}
</div>
```

### 10.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .recording-pulse {
    animation: none;
  }
  .countdown-animation {
    animation: none;
  }
}
```

---

## 11. Security Considerations

- **No data transmission**: All processing is client-side
- **Permission-based**: Browser prompts user before capture
- **No persistent storage**: Recordings are held in memory only
- **Secure contexts**: Requires HTTPS in production
- **CSP compatible**: No inline styles or eval

---

## 12. Success Criteria

### 12.1 Functional

- [ ] Start/stop recording works in Chrome, Firefox, Edge
- [ ] Pause/resume maintains recording integrity
- [ ] Preview plays recorded video correctly
- [ ] Download saves valid WebM file
- [ ] Timer displays accurate elapsed time
- [ ] Max duration auto-stops recording
- [ ] Countdown displays and delays recording
- [ ] Error states display appropriate messages

### 12.2 Non-Functional

- [ ] 90%+ test coverage
- [ ] < 15KB bundle size (gzipped)
- [ ] 60fps UI during recording
- [ ] No memory leaks
- [ ] WCAG 2.1 AA compliant
- [ ] SSR compatible (no-op on server)
- [ ] TypeScript strict mode

---

## 13. Open Questions

1. **GIF conversion**: Include built-in GIF export or leave as future enhancement? (Would require gif.js or ffmpeg.wasm, significant bundle increase)

2. **Region selection**: Allow user to select a specific region of screen? (Complex, may be out of scope)

3. **Webcam overlay**: Option to show webcam in corner of recording? (Nice to have but increases complexity)

4. **Cloud upload**: Provide adapters for common storage providers? (Similar to cursor-party adapter pattern)

---

## 14. References

- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API)
- [getDisplayMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)

---

*Document Version: 1.0*
*Last Updated: 2026-01-11*
