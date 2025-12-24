import { useEffect, useRef, useState } from 'react';

/**
 * Options for configuring the throttle behavior
 */
export interface UseThrottleOptions {
  /**
   * If true, the throttled value updates on the leading edge of the interval.
   * @default true
   */
  leading?: boolean;

  /**
   * If true, the throttled value updates on the trailing edge of the interval.
   * @default true
   */
  trailing?: boolean;
}

/**
 * Throttles a rapidly changing value to update at most once per specified interval.
 *
 * Useful for optimizing performance with high-frequency events like scroll, resize,
 * or mousemove by limiting how often a value propagates through your component tree.
 *
 * @template T - The type of value being throttled
 * @param value - The value to throttle
 * @param interval - The minimum time (in milliseconds) between updates
 * @param options - Configuration options for leading/trailing edge behavior
 * @returns The throttled value
 *
 * @example
 * // Basic scroll position throttling
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY);
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, []);
 *
 * @example
 * // Search input with trailing edge only
 * const [searchQuery, setSearchQuery] = useState('');
 * const throttledQuery = useThrottle(searchQuery, 300, { leading: false, trailing: true });
 *
 * useEffect(() => {
 *   if (throttledQuery) {
 *     performSearch(throttledQuery);
 *   }
 * }, [throttledQuery]);
 *
 * @example
 * // Window resize with leading edge only
 * const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 * const throttledWidth = useThrottle(windowWidth, 200, { leading: true, trailing: false });
 *
 * useEffect(() => {
 *   const handleResize = () => setWindowWidth(window.innerWidth);
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, []);
 */
export function useThrottle<T>(
  value: T,
  interval: number = 500,
  options: UseThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;

  // The current throttled value that will be returned
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // Timestamp of the last time the value changed (any call to this hook)
  const lastCallTimeRef = useRef<number>(0);

  // Timestamp of the last time we actually invoked/updated the throttled value
  const lastInvokeTimeRef = useRef<number>(0);

  // Timer ID for the trailing edge callback
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store the most recent value to use for trailing edge invocation
  const lastArgsRef = useRef<T>(value);

  // Context placeholder (for potential future use, maintains lodash-style throttle pattern)
  const lastThisRef = useRef<any>(undefined);

  // Flag indicating whether we should invoke on the trailing edge
  const trailingRef = useRef<boolean>(false);

  /**
   * Cleanup effect: Clear any pending timeout when the component unmounts
   * to prevent memory leaks and state updates on unmounted components
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /**
   * Main throttle logic effect: Runs whenever the value changes
   * Implements lodash-style throttle behavior with configurable leading/trailing edges
   */
  useEffect(() => {
    // Always store the latest value for potential trailing edge use
    lastArgsRef.current = value;

    const time = Date.now();
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    /**
     * Determine if we should invoke the throttled update immediately
     * Two conditions trigger immediate invocation:
     * 1. First call ever (lastInvokeTimeRef.current === 0)
     * 2. Enough time has passed since the last invocation (>= interval)
     */
    const shouldInvoke =
      lastInvokeTimeRef.current === 0 || // First call
      timeSinceLastInvoke >= interval; // Throttle interval has elapsed

    // Record this call time for future calculations
    lastCallTimeRef.current = time;

    if (shouldInvoke) {
      /**
       * LEADING EDGE BEHAVIOR
       * If leading is true, invoke immediately with the new value
       * This provides instant feedback when the value first changes
       */
      if (leading) {
        invokeFunc(time, value);
      } else {
        /**
         * If leading is disabled, we still update the last invoke time
         * to prevent the next change from triggering immediately
         * This ensures the throttle interval is respected
         */
        lastInvokeTimeRef.current = time;
      }

      /**
       * TRAILING EDGE SETUP
       * If trailing is enabled, schedule a trailing edge invocation
       * This ensures we capture the final value after changes stop
       */
      if (trailing) {
        trailingRef.current = true;
        startTimer(interval);
      }
    } else {
      /**
       * NOT YET TIME TO INVOKE
       * The throttle interval hasn't elapsed, so we can't invoke yet
       * However, we may need to set up or update the trailing edge callback
       */
      if (trailing) {
        // Mark that we need a trailing edge invocation
        trailingRef.current = true;

        /**
         * Only start a new timer if one isn't already running
         * Key difference from debounce: we DON'T reset the timer on each call
         * The timer continues from when it was first started
         */
        if (!timeoutRef.current) {
          const remainingTime = interval - timeSinceLastInvoke;
          startTimer(remainingTime);
        }
        // If a timer is already running, we let it continue without resetting
        // This is the core throttle behavior - updates are rate-limited, not delayed
      }
    }
  }, [value, interval, leading, trailing]);

  /**
   * Invoke the throttled update
   * Updates the throttled value state and resets trailing edge tracking
   *
   * @param time - Current timestamp
   * @param val - Value to update to
   */
  function invokeFunc(time: number, val: T) {
    lastInvokeTimeRef.current = time;
    trailingRef.current = false; // Clear trailing edge flag after invocation
    setThrottledValue(val);
  }

  /**
   * Start a timer for the trailing edge invocation
   * Prevents starting duplicate timers if one is already running
   *
   * @param wait - Time to wait before invoking (in milliseconds)
   */
  function startTimer(wait: number) {
    // Don't start a new timer if one is already running
    // This prevents timer accumulation and ensures consistent throttle behavior
    if (timeoutRef.current) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const time = Date.now();
      timeoutRef.current = null;

      /**
       * TRAILING EDGE INVOCATION
       * Only invoke if the trailing flag is set, meaning there were
       * value changes during the throttle interval that need to be captured
       * Uses the most recent value stored in lastArgsRef
       */
      if (trailingRef.current) {
        invokeFunc(time, lastArgsRef.current);
      }
    }, wait);
  }

  return throttledValue;
}
