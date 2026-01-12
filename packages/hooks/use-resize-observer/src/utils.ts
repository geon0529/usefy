import type { ResizeEntry, ResizeObserverBoxOptions } from "./types";

/**
 * Check if ResizeObserver API is supported in the current environment
 */
export function isResizeObserverSupported(): boolean {
  return typeof window !== "undefined" && "ResizeObserver" in window;
}

/**
 * Convert native ResizeObserverEntry to ResizeEntry
 */
export function toResizeEntry(nativeEntry: ResizeObserverEntry): ResizeEntry {
  return {
    entry: nativeEntry,
    target: nativeEntry.target,
    contentRect: nativeEntry.contentRect,
    borderBoxSize: nativeEntry.borderBoxSize || [],
    contentBoxSize: nativeEntry.contentBoxSize || [],
    devicePixelContentBoxSize: nativeEntry.devicePixelContentBoxSize,
  };
}

/**
 * Extract width and height based on box option
 */
export function extractSize(
  entry: ResizeObserverEntry,
  box: ResizeObserverBoxOptions,
  round: (value: number) => number = Math.round
): { width: number; height: number } {
  let width = 0;
  let height = 0;

  switch (box) {
    case "border-box":
      if (entry.borderBoxSize?.[0]) {
        width = entry.borderBoxSize[0].inlineSize;
        height = entry.borderBoxSize[0].blockSize;
      } else {
        // Fallback to contentRect + estimate
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      break;

    case "device-pixel-content-box":
      if (entry.devicePixelContentBoxSize?.[0]) {
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
      } else {
        // Fallback to content-box with device pixel ratio
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        if (entry.contentBoxSize?.[0]) {
          width = entry.contentBoxSize[0].inlineSize * dpr;
          height = entry.contentBoxSize[0].blockSize * dpr;
        } else {
          width = entry.contentRect.width * dpr;
          height = entry.contentRect.height * dpr;
        }
      }
      break;

    case "content-box":
    default:
      if (entry.contentBoxSize?.[0]) {
        width = entry.contentBoxSize[0].inlineSize;
        height = entry.contentBoxSize[0].blockSize;
      } else {
        // Fallback to contentRect
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      break;
  }

  return {
    width: round(width),
    height: round(height),
  };
}

/**
 * Create initial ResizeEntry for SSR or initial state
 */
export function createInitialResizeEntry(
  width?: number,
  height?: number
): ResizeEntry | undefined {
  if (width === undefined && height === undefined) {
    return undefined;
  }

  const w = width ?? 0;
  const h = height ?? 0;

  const emptyRect: DOMRectReadOnly = {
    x: 0,
    y: 0,
    width: w,
    height: h,
    top: 0,
    right: w,
    bottom: h,
    left: 0,
    toJSON: () => ({
      x: 0,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: w,
      bottom: h,
      left: 0,
    }),
  };

  const emptySize: ResizeObserverSize = {
    inlineSize: w,
    blockSize: h,
  };

  // Create a mock entry for SSR
  const mockNativeEntry = {
    target: null as unknown as Element,
    contentRect: emptyRect,
    borderBoxSize: [emptySize],
    contentBoxSize: [emptySize],
    devicePixelContentBoxSize: [] as ResizeObserverSize[],
  } as unknown as ResizeObserverEntry;

  return {
    entry: mockNativeEntry,
    target: null as unknown as Element,
    contentRect: emptyRect,
    borderBoxSize: [emptySize],
    contentBoxSize: [emptySize],
    devicePixelContentBoxSize: undefined,
  };
}

/**
 * Create a no-op ref callback for SSR
 */
export function createNoopRef<T extends Element>(): (element: T | null) => void {
  return () => {
    // No-op for SSR
  };
}

/**
 * Check if device-pixel-content-box is supported
 */
export function isDevicePixelContentBoxSupported(): boolean {
  if (!isResizeObserverSupported()) {
    return false;
  }

  // This is a simplified check - actual support detection would require
  // creating an observer and checking the entry
  try {
    // Check if the option is accepted without throwing
    const testDiv = document.createElement("div");
    let supported = false;

    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.devicePixelContentBoxSize) {
        supported = true;
      }
    });

    observer.observe(testDiv, { box: "device-pixel-content-box" });
    observer.disconnect();

    return supported;
  } catch {
    return false;
  }
}

/**
 * Validate options - warn if both debounce and throttle are set
 */
export function validateOptions(
  debounce?: number,
  throttle?: number
): void {
  if (
    debounce !== undefined &&
    debounce > 0 &&
    throttle !== undefined &&
    throttle > 0
  ) {
    if (typeof window !== "undefined") {
      console.warn(
        "[useResizeObserver] debounce and throttle cannot be used together. Using debounce."
      );
    }
  }
}

/**
 * Check if size has changed
 */
export function hasSizeChanged(
  prevWidth: number | undefined,
  prevHeight: number | undefined,
  newWidth: number,
  newHeight: number
): boolean {
  return prevWidth !== newWidth || prevHeight !== newHeight;
}

/**
 * Create a debounced function
 */
export function debounceFunction<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): { debouncedFn: T; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debouncedFn, cancel };
}

/**
 * Create a throttled function
 */
export function throttleFunction<T extends (...args: unknown[]) => void>(
  fn: T,
  interval: number
): { throttledFn: T; cancel: () => void } {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] | null = null;

  const throttledFn = ((...args: unknown[]) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= interval) {
      lastCallTime = now;
      fn(...args);
    } else {
      // Schedule trailing call
      lastArgs = args;
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          if (lastArgs) {
            fn(...lastArgs);
          }
          timeoutId = null;
          lastArgs = null;
        }, interval - timeSinceLastCall);
      }
    }
  }) as T;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  return { throttledFn, cancel };
}
