import { expect, afterEach, vi, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================================
// MediaStream Mock
// ============================================================================

export function createMockMediaStreamTrack(
  kind: "video" | "audio" = "video"
): MediaStreamTrack {
  const track = {
    kind,
    id: `mock-${kind}-track-${Math.random().toString(36).substr(2, 9)}`,
    label: `Mock ${kind} track`,
    enabled: true,
    muted: false,
    readyState: "live" as MediaStreamTrackState,
    contentHint: "",
    onended: null as ((this: MediaStreamTrack, ev: Event) => void) | null,
    onmute: null as ((this: MediaStreamTrack, ev: Event) => void) | null,
    onunmute: null as ((this: MediaStreamTrack, ev: Event) => void) | null,
    stop: vi.fn(function (this: MediaStreamTrack) {
      (this as { readyState: MediaStreamTrackState }).readyState = "ended";
      if (this.onended) {
        this.onended.call(this, new Event("ended"));
      }
    }),
    clone: vi.fn(function (this: MediaStreamTrack) {
      return createMockMediaStreamTrack(kind);
    }),
    getCapabilities: vi.fn(() => ({})),
    getConstraints: vi.fn(() => ({})),
    getSettings: vi.fn(() => ({
      width: 1920,
      height: 1080,
      frameRate: 30,
      deviceId: "mock-device",
    })),
    applyConstraints: vi.fn(() => Promise.resolve()),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  };
  return track as unknown as MediaStreamTrack;
}

export function createMockMediaStream(
  options: { video?: boolean; audio?: boolean } = { video: true }
): MediaStream {
  const tracks: MediaStreamTrack[] = [];

  if (options.video !== false) {
    tracks.push(createMockMediaStreamTrack("video"));
  }
  if (options.audio) {
    tracks.push(createMockMediaStreamTrack("audio"));
  }

  const stream = {
    id: `mock-stream-${Math.random().toString(36).substr(2, 9)}`,
    active: true,
    onaddtrack: null,
    onremovetrack: null,
    getTracks: vi.fn(() => tracks),
    getVideoTracks: vi.fn(() => tracks.filter((t) => t.kind === "video")),
    getAudioTracks: vi.fn(() => tracks.filter((t) => t.kind === "audio")),
    getTrackById: vi.fn((id: string) => tracks.find((t) => t.id === id) || null),
    addTrack: vi.fn((track: MediaStreamTrack) => tracks.push(track)),
    removeTrack: vi.fn((track: MediaStreamTrack) => {
      const index = tracks.indexOf(track);
      if (index > -1) tracks.splice(index, 1);
    }),
    clone: vi.fn(() => createMockMediaStream(options)),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  };

  return stream as unknown as MediaStream;
}

// ============================================================================
// MediaRecorder Mock
// ============================================================================

export class MockMediaRecorder {
  static isTypeSupported = vi.fn((mimeType: string) => {
    const supportedTypes = [
      "video/webm",
      "video/webm;codecs=vp8",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=vp9,opus",
    ];
    return supportedTypes.some((t) =>
      mimeType.toLowerCase().startsWith(t.split(";")[0])
    );
  });

  stream: MediaStream;
  mimeType: string;
  state: RecordingState = "inactive";
  videoBitsPerSecond: number;
  audioBitsPerSecond: number;

  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onstart: ((event: Event) => void) | null = null;
  onstop: ((event: Event) => void) | null = null;
  onpause: ((event: Event) => void) | null = null;
  onresume: ((event: Event) => void) | null = null;

  private chunks: Blob[] = [];
  private timeslice?: number;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    this.stream = stream;
    this.mimeType = options?.mimeType || "video/webm";
    this.videoBitsPerSecond = options?.videoBitsPerSecond || 2500000;
    this.audioBitsPerSecond = options?.audioBitsPerSecond || 128000;
  }

  start = vi.fn((timeslice?: number) => {
    if (this.state !== "inactive") {
      throw new DOMException("InvalidStateError");
    }
    this.state = "recording";
    this.timeslice = timeslice;
    this.chunks = [];

    if (this.onstart) {
      this.onstart(new Event("start"));
    }

    // If timeslice is provided, emit data periodically
    if (timeslice && timeslice > 0) {
      this.intervalId = setInterval(() => {
        this.emitData();
      }, timeslice);
    }
  });

  stop = vi.fn(() => {
    if (this.state === "inactive") {
      throw new DOMException("InvalidStateError");
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.state = "inactive";
    this.emitData();

    if (this.onstop) {
      this.onstop(new Event("stop"));
    }
  });

  pause = vi.fn(() => {
    if (this.state !== "recording") {
      throw new DOMException("InvalidStateError");
    }
    this.state = "paused";

    if (this.onpause) {
      this.onpause(new Event("pause"));
    }
  });

  resume = vi.fn(() => {
    if (this.state !== "paused") {
      throw new DOMException("InvalidStateError");
    }
    this.state = "recording";

    if (this.onresume) {
      this.onresume(new Event("resume"));
    }
  });

  requestData = vi.fn(() => {
    if (this.state === "inactive") {
      throw new DOMException("InvalidStateError");
    }
    this.emitData();
  });

  private emitData() {
    // Create a mock blob with some data
    const mockData = new Blob([new ArrayBuffer(1024)], {
      type: this.mimeType,
    });

    if (this.ondataavailable) {
      const event = new Event("dataavailable") as BlobEvent;
      Object.defineProperty(event, "data", { value: mockData });
      this.ondataavailable(event);
    }
  }

  addEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject) => {
      const handler = typeof listener === "function" ? listener : listener.handleEvent;
      switch (type) {
        case "dataavailable":
          this.ondataavailable = handler as (event: BlobEvent) => void;
          break;
        case "error":
          this.onerror = handler as (event: Event) => void;
          break;
        case "start":
          this.onstart = handler as (event: Event) => void;
          break;
        case "stop":
          this.onstop = handler as (event: Event) => void;
          break;
        case "pause":
          this.onpause = handler as (event: Event) => void;
          break;
        case "resume":
          this.onresume = handler as (event: Event) => void;
          break;
      }
    }
  );

  removeEventListener = vi.fn() as ReturnType<typeof vi.fn>;
  dispatchEvent = vi.fn(() => true) as ReturnType<typeof vi.fn>;
}

// Set up MockMediaRecorder globally
Object.defineProperty(window, "MediaRecorder", {
  writable: true,
  configurable: true,
  value: MockMediaRecorder,
});

// ============================================================================
// getDisplayMedia Mock
// ============================================================================

export function mockGetDisplayMedia(
  options: { shouldReject?: boolean; rejectReason?: string } = {}
) {
  const mock = vi.fn(
    (constraints?: DisplayMediaStreamOptions): Promise<MediaStream> => {
      if (options.shouldReject) {
        return Promise.reject(
          new DOMException(
            options.rejectReason || "Permission denied",
            "NotAllowedError"
          )
        );
      }

      const hasAudio = constraints?.audio === true;
      return Promise.resolve(
        createMockMediaStream({ video: true, audio: hasAudio })
      );
    }
  );

  if (!navigator.mediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", {
      writable: true,
      configurable: true,
      value: {},
    });
  }

  Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
    writable: true,
    configurable: true,
    value: mock,
  });

  return mock;
}

// ============================================================================
// URL Mock
// ============================================================================

const mockURLs = new Map<string, Blob>();

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  configurable: true,
  value: vi.fn((blob: Blob) => {
    const url = `blob:mock-${Math.random().toString(36).substr(2, 9)}`;
    mockURLs.set(url, blob);
    return url;
  }),
});

Object.defineProperty(URL, "revokeObjectURL", {
  writable: true,
  configurable: true,
  value: vi.fn((url: string) => {
    mockURLs.delete(url);
  }),
});

// ============================================================================
// localStorage Mock
// ============================================================================

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// ============================================================================
// matchMedia Mock
// ============================================================================

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ============================================================================
// ResizeObserver Mock
// ============================================================================

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

// ============================================================================
// requestAnimationFrame Mock
// ============================================================================

Object.defineProperty(window, "requestAnimationFrame", {
  writable: true,
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
});

Object.defineProperty(window, "cancelAnimationFrame", {
  writable: true,
  value: (id: number) => clearTimeout(id),
});

// ============================================================================
// Default Setup
// ============================================================================

beforeEach(() => {
  // Reset localStorage
  localStorageMock.clear();

  // Set up getDisplayMedia mock by default
  mockGetDisplayMedia();
});
