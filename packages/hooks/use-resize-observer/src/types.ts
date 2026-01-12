/**
 * ResizeObserver box options type
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe#box
 */
export type ResizeObserverBoxOptions =
  | "content-box"
  | "border-box"
  | "device-pixel-content-box";

/**
 * Extended ResizeObserverEntry with additional convenience properties
 */
export interface ResizeEntry {
  /** Original ResizeObserverEntry */
  readonly entry: ResizeObserverEntry;
  /** Target element being observed */
  readonly target: Element;
  /** Content rect (DOMRectReadOnly) */
  readonly contentRect: DOMRectReadOnly;
  /** Border box size array */
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  /** Content box size array */
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  /** Device pixel content box size array (if supported) */
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

/**
 * Callback invoked when element size changes
 */
export type OnResizeCallback = (entry: ResizeEntry) => void;

/**
 * Callback invoked when an error occurs
 */
export type OnErrorCallback = (error: Error) => void;

/**
 * Options for useResizeObserver hook
 *
 * @example
 * ```tsx
 * const { ref, width, height } = useResizeObserver({
 *   box: 'border-box',
 *   debounce: 100,
 *   onResize: (entry) => console.log('Resized:', entry),
 * });
 * ```
 */
export interface UseResizeObserverOptions<T extends Element = Element> {
  /**
   * Which box model to observe
   * - 'content-box': Content area only (default)
   * - 'border-box': Includes padding and border
   * - 'device-pixel-content-box': Content area in device pixels (high-DPI)
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;

  /**
   * Debounce delay in milliseconds.
   * Cannot be used together with throttle.
   */
  debounce?: number;

  /**
   * Throttle interval in milliseconds.
   * Cannot be used together with debounce.
   */
  throttle?: number;

  /**
   * Function to round dimension values
   * @default Math.round
   */
  round?: (value: number) => number;

  /**
   * Callback invoked when element size changes
   */
  onResize?: OnResizeCallback;

  /**
   * Callback invoked when an error occurs
   */
  onError?: OnErrorCallback;

  /**
   * Whether to update React state on resize.
   * Set to false for callback-only mode (better performance).
   * @default true
   */
  updateState?: boolean;

  /**
   * Whether observation is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Initial width value (useful for SSR)
   */
  initialWidth?: number;

  /**
   * Initial height value (useful for SSR)
   */
  initialHeight?: number;
}

/**
 * Return type for useResizeObserver hook
 *
 * @example
 * ```tsx
 * const {
 *   ref,
 *   width,
 *   height,
 *   isSupported,
 *   isObserving,
 * } = useResizeObserver();
 * ```
 */
export interface UseResizeObserverReturn<T extends Element = Element> {
  /**
   * Ref callback to attach to target element
   *
   * @example
   * ```tsx
   * <div ref={ref}>Content</div>
   * ```
   */
  ref: (element: T | null) => void;

  /**
   * Current element width in pixels.
   * Undefined until first observation.
   */
  width: number | undefined;

  /**
   * Current element height in pixels.
   * Undefined until first observation.
   */
  height: number | undefined;

  /**
   * Latest ResizeEntry with full observation data
   */
  entry: ResizeEntry | undefined;

  /**
   * Content rect from the latest observation
   */
  contentRect: DOMRectReadOnly | undefined;

  /**
   * First border box size from the latest observation
   */
  borderBoxSize: ResizeObserverSize | undefined;

  /**
   * First content box size from the latest observation
   */
  contentBoxSize: ResizeObserverSize | undefined;

  /**
   * First device pixel content box size from the latest observation
   * (undefined if not supported by browser)
   */
  devicePixelContentBoxSize: ResizeObserverSize | undefined;

  /**
   * Whether ResizeObserver API is supported
   */
  isSupported: boolean;

  /**
   * Whether currently observing an element
   */
  isObserving: boolean;

  /**
   * Manually start observing an element
   */
  observe: (element: T) => void;

  /**
   * Manually stop observing an element
   */
  unobserve: (element: T) => void;

  /**
   * Disconnect all observations
   */
  disconnect: () => void;
}
