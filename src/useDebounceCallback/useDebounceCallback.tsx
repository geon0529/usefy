import { useCallback, useEffect, useRef } from "react";

/**
 * Options for useDebounceCallback hook
 */
export interface UseDebounceCallbackOptions {
  /**
   * Maximum time the debounced callback can be delayed
   * If the debounced function is invoked repeatedly, it will be called
   * at most once per maxWait milliseconds
   * @default undefined (no maximum)
   */
  maxWait?: number;
  /**
   * Whether to invoke the callback on the leading edge
   * If true, the callback is invoked immediately on the first call,
   * then subsequent calls within the delay period are debounced
   * @default false
   */
  leading?: boolean;
  /**
   * Whether to invoke the callback on the trailing edge
   * If true, the callback is invoked after the delay period has elapsed
   * since the last call
   * @default true
   */
  trailing?: boolean;
}

/**
 * Return type for useDebounceCallback hook
 */
export interface DebouncedFunction<T extends (...args: never[]) => any> {
  /**
   * The debounced function
   */
  (...args: Parameters<T>): void;
  /**
   * Cancels any pending invocations
   */
  cancel: () => void;
  /**
   * Immediately invokes any pending invocations
   */
  flush: () => void;
}

/**
 * Creates a debounced version of a callback function that delays invoking the callback
 * until after a specified delay period has elapsed since the last time it was called.
 *
 * @template T - The type of the callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @param options - Additional options for controlling debounce behavior
 * @returns A debounced function with cancel and flush methods
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const handleSearch = useDebounceCallback((term: string) => {
 *     console.log('Searching for:', term);
 *     api.search(term);
 *   }, 500);
 *
 *   return (
 *     <input
 *       type="text"
 *       onChange={(e) => handleSearch(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With leading edge invocation
 * const debouncedClick = useDebounceCallback(
 *   () => console.log('Clicked'),
 *   300,
 *   { leading: true }
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With cancel and flush methods
 * function Form() {
 *   const debouncedSave = useDebounceCallback(
 *     (data: FormData) => api.save(data),
 *     1000
 *   );
 *
 *   return (
 *     <>
 *       <input onChange={(e) => debouncedSave({ value: e.target.value })} />
 *       <button onClick={debouncedSave.cancel}>Cancel Save</button>
 *       <button onClick={debouncedSave.flush}>Save Now</button>
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With maximum wait time
 * const debouncedResize = useDebounceCallback(
 *   () => console.log('Window resized'),
 *   500,
 *   { maxWait: 2000 }
 * );
 * ```
 */
export function useDebounceCallback<T extends (...args: never[]) => any>(
  callback: T,
  delay: number = 500,
  options: UseDebounceCallbackOptions = {}
): DebouncedFunction<T> {
  const { maxWait, leading = false, trailing = true } = options;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const lastInvokeTimeRef = useRef<number>(0);
  const firstCallTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);
  const callbackRef = useRef<T>(callback);
  const leadingInvokedRef = useRef<boolean>(false);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (maxWaitTimeoutRef.current !== undefined) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = undefined;
    }
  }, []);

  const invokeFunction = useCallback(() => {
    const args = lastArgsRef.current;
    if (args !== undefined) {
      lastInvokeTimeRef.current = Date.now();
      lastArgsRef.current = undefined;
      firstCallTimeRef.current = 0;
      leadingInvokedRef.current = false;

      clearTimeouts();

      // Invoke callback after clearing state to prevent issues if callback throws
      callbackRef.current(...args);
    }
  }, [clearTimeouts]);

  const cancel = useCallback(() => {
    clearTimeouts();
    lastArgsRef.current = undefined;
    firstCallTimeRef.current = 0;
    leadingInvokedRef.current = false;
  }, [clearTimeouts]);

  const flush = useCallback(() => {
    if (lastArgsRef.current !== undefined) {
      invokeFunction();
    }
  }, [invokeFunction]);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const isFirstCall = firstCallTimeRef.current === 0;
      const timeSinceFirstCall = isFirstCall
        ? 0
        : now - firstCallTimeRef.current;

      // Store the latest arguments
      lastArgsRef.current = args;

      // Clear existing timeouts
      clearTimeouts();

      // Track first call time for maxWait
      if (isFirstCall) {
        firstCallTimeRef.current = now;
      }

      // Check if maxWait has been exceeded
      const maxWaitExceeded =
        maxWait !== undefined && !isFirstCall && timeSinceFirstCall >= maxWait;

      // Handle leading edge invocation - only on first call of a debounce cycle
      const shouldInvokeLeading =
        leading && isFirstCall && !leadingInvokedRef.current;

      if (maxWaitExceeded) {
        // MaxWait exceeded - invoke immediately
        invokeFunction();
        return;
      }

      if (shouldInvokeLeading) {
        // Leading edge - invoke immediately
        leadingInvokedRef.current = true;
        lastInvokeTimeRef.current = now;
        firstCallTimeRef.current = 0;

        clearTimeouts();

        // Invoke with current args but keep them for potential trailing call
        const currentArgs = args;
        lastArgsRef.current = trailing ? args : undefined;
        callbackRef.current(...currentArgs);

        // If trailing is enabled, set up timeout for trailing call
        if (trailing) {
          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = undefined;
            invokeFunction();
          }, delay);
        } else {
          lastArgsRef.current = undefined;
          leadingInvokedRef.current = false;
        }

        return;
      }

      // Set up trailing timeout
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = undefined;
          invokeFunction();
        }, delay);
      }

      // Set up maxWait timeout
      if (maxWait !== undefined && maxWait > 0) {
        const timeUntilMaxWait = maxWait - timeSinceFirstCall;

        if (timeUntilMaxWait > 0) {
          maxWaitTimeoutRef.current = setTimeout(() => {
            maxWaitTimeoutRef.current = undefined;
            invokeFunction();
          }, timeUntilMaxWait);
        }
      }
    },
    [delay, maxWait, leading, trailing, invokeFunction, clearTimeouts]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  // Attach cancel and flush methods to the debounced function
  const result = debouncedFunction as DebouncedFunction<T>;
  result.cancel = cancel;
  result.flush = flush;

  return result;
}
