import { expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// ============ ResizeObserver Mock Types ============

export interface MockResizeObserverInstance {
  callback: ResizeObserverCallback;
  observedElements: Map<Element, ResizeObserverOptions | undefined>;
  observe: (target: Element, options?: ResizeObserverOptions) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
}

// Store all observer instances for test access
export const mockObserverInstances: MockResizeObserverInstance[] = [];

// ============ Mock ResizeObserver Class ============

class MockResizeObserver implements ResizeObserver {
  private readonly _callback: ResizeObserverCallback;
  readonly observedElements: Map<Element, ResizeObserverOptions | undefined> =
    new Map();

  constructor(callback: ResizeObserverCallback) {
    this._callback = callback;
    mockObserverInstances.push(this as unknown as MockResizeObserverInstance);
  }

  get callback(): ResizeObserverCallback {
    return this._callback;
  }

  observe(target: Element, options?: ResizeObserverOptions): void {
    this.observedElements.set(target, options);
  }

  unobserve(target: Element): void {
    this.observedElements.delete(target);
  }

  disconnect(): void {
    this.observedElements.clear();
  }
}

// ============ Mock Entry Helpers ============

/**
 * Create a mock ResizeObserverEntry for testing
 */
export function createMockResizeEntry(
  target: Element,
  options: {
    width?: number;
    height?: number;
    borderBoxWidth?: number;
    borderBoxHeight?: number;
    devicePixelWidth?: number;
    devicePixelHeight?: number;
  } = {}
): ResizeObserverEntry {
  const {
    width = 100,
    height = 100,
    borderBoxWidth = width,
    borderBoxHeight = height,
    devicePixelWidth,
    devicePixelHeight,
  } = options;

  const contentRect: DOMRectReadOnly = {
    x: 0,
    y: 0,
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    toJSON: () => ({
      x: 0,
      y: 0,
      width,
      height,
      top: 0,
      right: width,
      bottom: height,
      left: 0,
    }),
  };

  const contentBoxSize: ResizeObserverSize[] = [
    {
      inlineSize: width,
      blockSize: height,
    },
  ];

  const borderBoxSize: ResizeObserverSize[] = [
    {
      inlineSize: borderBoxWidth,
      blockSize: borderBoxHeight,
    },
  ];

  const devicePixelContentBoxSize: ResizeObserverSize[] | undefined =
    devicePixelWidth !== undefined && devicePixelHeight !== undefined
      ? [{ inlineSize: devicePixelWidth, blockSize: devicePixelHeight }]
      : undefined;

  return {
    target,
    contentRect,
    contentBoxSize,
    borderBoxSize,
    devicePixelContentBoxSize,
  } as ResizeObserverEntry;
}

/**
 * Simulate a resize event on a target element
 */
export function simulateResize(
  target: Element,
  options: {
    width?: number;
    height?: number;
    borderBoxWidth?: number;
    borderBoxHeight?: number;
    devicePixelWidth?: number;
    devicePixelHeight?: number;
    observerIndex?: number;
  } = {}
): void {
  const observerIndex =
    options.observerIndex ?? mockObserverInstances.length - 1;
  const observer = mockObserverInstances[observerIndex];

  if (!observer) {
    throw new Error(`No observer found at index ${observerIndex}`);
  }

  const entry = createMockResizeEntry(target, options);
  observer.callback([entry], observer as unknown as ResizeObserver);
}

/**
 * Simulate multiple resize events at once
 */
export function simulateMultipleResizes(
  entries: Array<{
    target: Element;
    width?: number;
    height?: number;
    borderBoxWidth?: number;
    borderBoxHeight?: number;
  }>,
  observerIndex?: number
): void {
  const idx = observerIndex ?? mockObserverInstances.length - 1;
  const observer = mockObserverInstances[idx];

  if (!observer) {
    throw new Error(`No observer found at index ${idx}`);
  }

  const mockEntries = entries.map((e) =>
    createMockResizeEntry(e.target, {
      width: e.width,
      height: e.height,
      borderBoxWidth: e.borderBoxWidth,
      borderBoxHeight: e.borderBoxHeight,
    })
  );

  observer.callback(mockEntries, observer as unknown as ResizeObserver);
}

/**
 * Get the most recently created observer
 */
export function getLatestObserver(): MockResizeObserverInstance | undefined {
  return mockObserverInstances[mockObserverInstances.length - 1];
}

/**
 * Get observer at specific index
 */
export function getObserverAt(
  index: number
): MockResizeObserverInstance | undefined {
  return mockObserverInstances[index];
}

/**
 * Get all observer instances
 */
export function getAllObservers(): MockResizeObserverInstance[] {
  return [...mockObserverInstances];
}

/**
 * Clear all observer instances
 */
export function clearObserverInstances(): void {
  mockObserverInstances.length = 0;
}

/**
 * Check if element is being observed
 */
export function isElementObserved(
  element: Element,
  observerIndex?: number
): boolean {
  if (observerIndex !== undefined) {
    const observer = mockObserverInstances[observerIndex];
    return observer?.observedElements.has(element) ?? false;
  }

  return mockObserverInstances.some((observer) =>
    observer.observedElements.has(element)
  );
}

/**
 * Get the box option used for observing an element
 */
export function getObserveOptions(
  element: Element,
  observerIndex?: number
): ResizeObserverOptions | undefined {
  const idx = observerIndex ?? mockObserverInstances.length - 1;
  const observer = mockObserverInstances[idx];
  return observer?.observedElements.get(element);
}

// ============ Setup and Teardown ============

beforeEach(() => {
  clearObserverInstances();
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  clearObserverInstances();
  vi.unstubAllGlobals();
});
