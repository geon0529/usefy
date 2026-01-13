import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type {
  UseResizeObserverOptions,
  UseResizeObserverReturn,
  ResizeEntry,
  OnResizeCallback,
  OnErrorCallback,
  ResizeObserverBoxOptions,
} from "./types";
import {
  isResizeObserverSupported,
  toResizeEntry,
  extractSize,
  createInitialResizeEntry,
  createNoopRef,
  validateOptions,
  hasSizeChanged,
} from "./utils";

/**
 * React hook for observing element size changes using ResizeObserver API.
 *
 * Features:
 * - Real-time element size tracking (width, height)
 * - Support for border-box, content-box, device-pixel-content-box
 * - Debounce/Throttle options for performance optimization
 * - Custom rounding function for dimension values
 * - Callback and state-based modes
 * - SSR compatible with graceful degradation
 * - TypeScript support with full type inference
 *
 * @param options - Configuration options for the observer
 * @returns Object containing dimensions, ref callback, and control methods
 *
 * @example
 * ```tsx
 * // Basic usage - track element dimensions
 * function Component() {
 *   const { ref, width, height } = useResizeObserver();
 *   return (
 *     <div ref={ref}>
 *       Size: {width}px x {height}px
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With debounce for performance
 * function DebouncedComponent() {
 *   const { ref, width, height } = useResizeObserver({
 *     debounce: 100,
 *     onResize: (entry) => console.log('Resized:', entry),
 *   });
 *   return <div ref={ref}>{width} x {height}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Border-box sizing
 * function BorderBoxComponent() {
 *   const { ref, borderBoxSize } = useResizeObserver({
 *     box: 'border-box',
 *   });
 *   return (
 *     <div ref={ref} style={{ padding: 20 }}>
 *       Border: {borderBoxSize?.inlineSize} x {borderBoxSize?.blockSize}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Callback-only mode (no state updates)
 * function CallbackOnlyComponent() {
 *   const { ref } = useResizeObserver({
 *     updateState: false,
 *     onResize: (entry) => {
 *       // Direct DOM manipulation for animations
 *       entry.target.style.setProperty('--width', `${entry.contentRect.width}px`);
 *     },
 *   });
 *   return <div ref={ref}>Animation container</div>;
 * }
 * ```
 */
export function useResizeObserver<T extends Element = Element>(
  options: UseResizeObserverOptions<T> = {}
): UseResizeObserverReturn<T> {
  const {
    box = "content-box",
    debounce,
    throttle,
    round = Math.round,
    onResize,
    onError,
    updateState = true,
    enabled = true,
    initialWidth,
    initialHeight,
  } = options;

  // ============ Validation ============
  validateOptions(debounce, throttle);

  // ============ SSR Check ============
  const isSupported = isResizeObserverSupported();

  // ============ Refs ============
  const observerRef = useRef<ResizeObserver | null>(null);
  const targetRef = useRef<T | null>(null);
  const onResizeRef = useRef<OnResizeCallback | undefined>(onResize);
  const onErrorRef = useRef<OnErrorCallback | undefined>(onError);
  const debounceRef = useRef<number | undefined>(debounce);
  const throttleRef = useRef<number | undefined>(throttle);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastThrottleTimeRef = useRef<number>(0);
  const isObservingRef = useRef<boolean>(false);
  const prevSizeRef = useRef<{ width: number; height: number } | null>(null);

  // Update refs on each render to get latest values
  onResizeRef.current = onResize;
  onErrorRef.current = onError;
  debounceRef.current = debounce;
  throttleRef.current = throttle;

  // ============ State ============
  const [state, setState] = useState<{
    width: number | undefined;
    height: number | undefined;
    entry: ResizeEntry | undefined;
  }>(() => ({
    width: initialWidth,
    height: initialHeight,
    entry: createInitialResizeEntry(initialWidth, initialHeight),
  }));

  const [isObserving, setIsObserving] = useState<boolean>(false);

  // ============ Handle Resize (Core Logic) ============
  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      // Process all entries (for multiple element observation)
      for (const entry of entries) {
        try {
          const resizeEntry = toResizeEntry(entry);

          // Call onResize callback for each entry
          if (onResizeRef.current) {
            onResizeRef.current(resizeEntry);
          }
        } catch (error) {
          if (onErrorRef.current) {
            onErrorRef.current(error as Error);
          }
        }
      }

      // Update state with the last entry (for single element mode via ref)
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry) return;

      try {
        const resizeEntry = toResizeEntry(lastEntry);
        const { width, height } = extractSize(lastEntry, box, round);

        // Update state if enabled and size changed
        if (updateState) {
          const prevSize = prevSizeRef.current;
          if (
            !prevSize ||
            hasSizeChanged(prevSize.width, prevSize.height, width, height)
          ) {
            prevSizeRef.current = { width, height };
            setState({ width, height, entry: resizeEntry });
          }
        }
      } catch (error) {
        if (onErrorRef.current) {
          onErrorRef.current(error as Error);
        }
      }
    },
    [box, round, updateState]
  );

  // ============ Process Resize (with Debounce/Throttle) ============
  const processResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      // Clear existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }

      // Use refs to get latest debounce/throttle values
      const debounceDelay = debounceRef.current ?? 0;
      const throttleInterval = throttleRef.current ?? 0;

      if (debounceDelay > 0) {
        // Debounce mode
        debounceTimeoutRef.current = setTimeout(() => {
          handleResize(entries);
          debounceTimeoutRef.current = null;
        }, debounceDelay);
      } else if (throttleInterval > 0) {
        // Throttle mode
        const now = Date.now();
        const timeSinceLastCall = now - lastThrottleTimeRef.current;

        if (timeSinceLastCall >= throttleInterval) {
          lastThrottleTimeRef.current = now;
          handleResize(entries);
        } else if (!throttleTimeoutRef.current) {
          // Schedule trailing call
          throttleTimeoutRef.current = setTimeout(() => {
            lastThrottleTimeRef.current = Date.now();
            handleResize(entries);
            throttleTimeoutRef.current = null;
          }, throttleInterval - timeSinceLastCall);
        }
      } else {
        // No debounce/throttle - immediate execution
        handleResize(entries);
      }
    },
    [handleResize]  // Remove debounce/throttle from deps - use refs instead
  );

  // ============ Observer Callback ============
  const observerCallbackRef = useRef<(entries: ResizeObserverEntry[]) => void>(
    (entries) => processResize(entries)
  );
  observerCallbackRef.current = (entries) => processResize(entries);

  // ============ Create Observer ============
  const createObserver = useCallback(() => {
    if (!isSupported) return;

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Create new observer with ref-based callback for stability
    observerRef.current = new ResizeObserver((entries) => {
      observerCallbackRef.current(entries);
    });

    // Observe current target if exists and enabled
    if (targetRef.current && enabled) {
      observerRef.current.observe(targetRef.current, { box });
      isObservingRef.current = true;
      setIsObserving(true);
    }
  }, [isSupported, enabled, box]);

  // ============ Ref Callback ============
  const setRef = useCallback(
    (node: T | null) => {
      const prevTarget = targetRef.current;

      // Unobserve previous target
      if (prevTarget && observerRef.current) {
        observerRef.current.unobserve(prevTarget);
      }

      targetRef.current = node;

      // Observe new target
      if (node && observerRef.current && enabled) {
        observerRef.current.observe(node, { box });
        isObservingRef.current = true;
        setIsObserving(true);
      } else {
        isObservingRef.current = false;
        setIsObserving(false);
      }
    },
    [box, enabled]
  );

  // ============ Manual Control Methods ============
  const observe = useCallback(
    (element: T) => {
      if (!isSupported) return;

      // Create observer if it doesn't exist yet
      if (!observerRef.current) {
        observerRef.current = new ResizeObserver((entries) => {
          observerCallbackRef.current(entries);
        });
      }

      observerRef.current.observe(element, { box });
      isObservingRef.current = true;
      setIsObserving(true);
    },
    [isSupported, box]
  );

  const unobserve = useCallback((element: T) => {
    if (!observerRef.current) return;
    observerRef.current.unobserve(element);
    // Check if still observing other elements
    // For simplicity, we set to false (single element mode)
    isObservingRef.current = false;
    setIsObserving(false);
  }, []);

  const disconnect = useCallback(() => {
    if (!observerRef.current) return;
    observerRef.current.disconnect();
    observerRef.current = null;
    isObservingRef.current = false;
    setIsObserving(false);
  }, []);

  // ============ Effect: Create Observer on Mount ============
  useEffect(() => {
    if (!isSupported) return;

    // Create observer with ref-based callback
    observerRef.current = new ResizeObserver((entries) => {
      observerCallbackRef.current(entries);
    });

    // Observe current target if exists and enabled
    if (targetRef.current && enabled) {
      observerRef.current.observe(targetRef.current, { box });
      isObservingRef.current = true;
      setIsObserving(true);
    }

    return () => {
      // Cleanup timeouts
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
        throttleTimeoutRef.current = null;
      }
      // Disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      isObservingRef.current = false;
    };
  }, [isSupported, enabled, box]);

  // ============ Effect: Handle enabled Toggle ============
  useEffect(() => {
    if (!isSupported || !observerRef.current || !targetRef.current) return;

    if (enabled) {
      observerRef.current.observe(targetRef.current, { box });
      isObservingRef.current = true;
      setIsObserving(true);
    } else {
      observerRef.current.unobserve(targetRef.current);
      isObservingRef.current = false;
      setIsObserving(false);
    }
  }, [enabled, box, isSupported]);

  // ============ Computed Values ============
  const computedValues = useMemo(
    () => ({
      contentRect: state.entry?.contentRect,
      borderBoxSize: state.entry?.borderBoxSize?.[0],
      contentBoxSize: state.entry?.contentBoxSize?.[0],
      devicePixelContentBoxSize: state.entry?.devicePixelContentBoxSize?.[0],
    }),
    [state.entry]
  );

  // ============ SSR Return ============
  if (!isSupported) {
    return {
      ref: createNoopRef<T>(),
      width: initialWidth,
      height: initialHeight,
      entry: createInitialResizeEntry(initialWidth, initialHeight),
      contentRect: undefined,
      borderBoxSize: undefined,
      contentBoxSize: undefined,
      devicePixelContentBoxSize: undefined,
      isSupported: false,
      isObserving: false,
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    };
  }

  // ============ Client Return ============
  return {
    ref: setRef,
    width: state.width,
    height: state.height,
    entry: state.entry,
    ...computedValues,
    isSupported,
    isObserving,
    observe,
    unobserve,
    disconnect,
  };
}
