### useResizeObserver

**Purpose**: Detect and track element size changes in real-time using the ResizeObserver API with enterprise-grade features including debouncing, SSR compatibility, and performance optimizations.

**Key Features**:

- Real-time element dimension tracking (width, height, contentRect)
- Border-box and content-box sizing support
- Device pixel content box support for high-DPI displays
- Debounce/throttle options for performance optimization
- Round values option for consistent integer dimensions
- Callback-based and state-based observation modes
- Support for observing multiple elements simultaneously
- SSR-safe with graceful degradation
- TypeScript strict type safety
- Memory-efficient cleanup on unmount
- Ref callback pattern for flexible element binding

**API**:

```typescript
const {
  // Dimension State
  ref,              // Ref callback to attach to target element
  width,            // Current element width (px)
  height,           // Current element height (px)
  entry,            // Full ResizeObserverEntry object

  // Content Rect Details
  contentRect,      // DOMRectReadOnly with x, y, width, height, top, right, bottom, left

  // Border Box Size (if available)
  borderBoxSize,    // { inlineSize, blockSize } - includes padding and border

  // Content Box Size
  contentBoxSize,   // { inlineSize, blockSize } - content area only

  // Device Pixel Content Box (high-DPI)
  devicePixelContentBoxSize, // { inlineSize, blockSize } - in device pixels

  // Status
  isSupported,      // Whether ResizeObserver API is available
  isObserving,      // Whether currently observing an element

  // Actions
  observe,          // Manually observe a specific element
  unobserve,        // Stop observing a specific element
  disconnect,       // Disconnect all observations
} = useResizeObserver(options);
```

**Usage Example**:

```typescript
// Basic usage - track element dimensions
function ResponsiveComponent() {
  const { ref, width, height } = useResizeObserver();

  return (
    <div ref={ref}>
      Dimensions: {width}px x {height}px
    </div>
  );
}

// With debounce for performance
function DebouncedResize() {
  const { ref, width, height } = useResizeObserver({
    debounce: 100, // Update at most every 100ms
    onResize: ({ width, height }) => {
      console.log('Resized:', width, height);
    },
  });

  return <div ref={ref}>Debounced resize tracking</div>;
}

// Border-box sizing for accurate layout measurements
function AccurateLayout() {
  const { ref, borderBoxSize } = useResizeObserver({
    box: 'border-box',
  });

  return (
    <div ref={ref} style={{ padding: 20, border: '1px solid black' }}>
      Border box: {borderBoxSize?.inlineSize}px x {borderBoxSize?.blockSize}px
    </div>
  );
}

// High-DPI aware sizing for canvas/WebGL
function CanvasComponent() {
  const { ref, devicePixelContentBoxSize } = useResizeObserver({
    box: 'device-pixel-content-box',
  });

  return (
    <canvas
      ref={ref}
      width={devicePixelContentBoxSize?.inlineSize ?? 300}
      height={devicePixelContentBoxSize?.blockSize ?? 150}
    />
  );
}

// Callback-only mode (no state updates)
function CallbackOnlyMode() {
  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    // Direct DOM manipulation for animations
    entry.target.style.setProperty(
      '--aspect-ratio',
      String(entry.contentRect.width / entry.contentRect.height)
    );
  }, []);

  const { ref } = useResizeObserver({
    onResize: handleResize,
    updateState: false, // Disable state updates for maximum performance
  });

  return <div ref={ref}>Animation container</div>;
}

// Round values for consistent integer dimensions
function IntegerDimensions() {
  const { ref, width, height } = useResizeObserver({
    round: Math.round, // Can also use Math.floor, Math.ceil, or custom function
  });

  return <div ref={ref}>{width} x {height}</div>;
}

// Observe multiple elements
function MultipleElements() {
  const [sizes, setSizes] = useState<Map<Element, DOMRectReadOnly>>(new Map());
  const { observe, unobserve } = useResizeObserver({
    onResize: (entry) => {
      setSizes(prev => new Map(prev).set(entry.target, entry.contentRect));
    },
  });

  return (
    <div>
      <div ref={(el) => el && observe(el)}>Element 1</div>
      <div ref={(el) => el && observe(el)}>Element 2</div>
      <div ref={(el) => el && observe(el)}>Element 3</div>
    </div>
  );
}

// Responsive grid columns calculation
function ResponsiveGrid() {
  const { ref, width } = useResizeObserver();
  const columns = width ? Math.max(1, Math.floor(width / 200)) : 1;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {items.map(item => <GridItem key={item.id} {...item} />)}
    </div>
  );
}

// Chart container with resize handling
function ResponsiveChart() {
  const { ref, width, height } = useResizeObserver({
    debounce: 200,
    onResize: ({ width, height }) => {
      // Trigger chart re-render with new dimensions
      chartInstance.current?.resize(width, height);
    },
  });

  return (
    <div ref={ref} style={{ width: '100%', height: '400px' }}>
      <Chart width={width ?? 0} height={height ?? 0} data={data} />
    </div>
  );
}

// Handling unsupported environments
function SafeResizeComponent() {
  const { ref, width, height, isSupported } = useResizeObserver();

  if (!isSupported) {
    return <div>ResizeObserver not supported in this browser</div>;
  }

  return <div ref={ref}>{width} x {height}</div>;
}
```

**Implementation Points**:

- Use ResizeObserver API with proper cleanup via disconnect()
- Implement ref callback pattern for flexible element binding
- Support all box models: content-box, border-box, device-pixel-content-box
- SSR-safe with typeof window check and graceful degradation
- Optional debounce/throttle via setTimeout or requestAnimationFrame
- Memoize callbacks and options to prevent observer recreation
- Handle multiple entries in single callback (batched updates)
- Use useRef for observer instance to prevent memory leaks
- Provide both state-based and callback-only modes
- Round function option for integer dimensions
- TypeScript strict mode with full type inference
- Handle edge cases: element removal, rapid ref changes
- Consider React Strict Mode double-mount scenarios
- Polyfill detection and graceful fallback
- Cross-browser compatibility (modern browsers + Edge)

**Options Interface**:

```typescript
interface UseResizeObserverOptions<T extends Element = Element> {
  // Box Model
  box?: ResizeObserverBoxOptions; // 'content-box' | 'border-box' | 'device-pixel-content-box'

  // Performance
  debounce?: number;              // Debounce delay in ms
  throttle?: number;              // Throttle interval in ms (alternative to debounce)

  // Value Processing
  round?: (value: number) => number; // Function to round dimension values

  // Callbacks
  onResize?: (entry: ResizeObserverEntry) => void;
  onError?: (error: Error) => void;

  // Behavior
  updateState?: boolean;          // Whether to update React state (default: true)
  enabled?: boolean;              // Enable/disable observation (default: true)

  // Initial Values
  initialWidth?: number;
  initialHeight?: number;
}
```

**Return Types**:

```typescript
interface UseResizeObserverReturn<T extends Element = Element> {
  // Ref
  ref: (element: T | null) => void;

  // Dimensions (may be undefined until first observation)
  width: number | undefined;
  height: number | undefined;

  // Full Entry
  entry: ResizeObserverEntry | undefined;

  // Detailed Sizes
  contentRect: DOMRectReadOnly | undefined;
  borderBoxSize: ResizeObserverSize | undefined;
  contentBoxSize: ResizeObserverSize | undefined;
  devicePixelContentBoxSize: ResizeObserverSize | undefined;

  // Status
  isSupported: boolean;
  isObserving: boolean;

  // Actions
  observe: (element: T) => void;
  unobserve: (element: T) => void;
  disconnect: () => void;
}

interface ResizeObserverSize {
  inlineSize: number;
  blockSize: number;
}
```

**Browser Compatibility**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Feature                           │ Chrome │ Firefox │ Safari │ Edge │ IE  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ResizeObserver                    │ ✅ 64+  │ ✅ 69+   │ ✅ 13.1+│ ✅ 79+│ ❌  │
│ content-box                       │ ✅ 64+  │ ✅ 69+   │ ✅ 13.1+│ ✅ 79+│ ❌  │
│ border-box                        │ ✅ 84+  │ ✅ 92+   │ ✅ 15.4+│ ✅ 84+│ ❌  │
│ device-pixel-content-box          │ ✅ 84+  │ ✅ 93+   │ ❌       │ ✅ 84+│ ❌  │
│ borderBoxSize/contentBoxSize      │ ✅ 84+  │ ✅ 92+   │ ✅ 15.4+│ ✅ 84+│ ❌  │
└─────────────────────────────────────────────────────────────────────────────┘
✅ Supported  ❌ Not Supported

Notes:
- Safari does not support device-pixel-content-box
- Older browsers may need resize-observer-polyfill
- borderBoxSize/contentBoxSize return arrays in spec (use [0] for single element)
```

**Server-Side Rendering (SSR) Compatibility**:

```typescript
// SSR Detection & Handling
function useResizeObserver<T extends Element = Element>(
  options?: UseResizeObserverOptions<T>
): UseResizeObserverReturn<T> {
  // 1. Check for browser environment
  const isSupported = typeof window !== 'undefined' &&
                      typeof ResizeObserver !== 'undefined';

  // 2. Return safe defaults for SSR
  if (!isSupported) {
    return {
      ref: () => {},
      width: options?.initialWidth,
      height: options?.initialHeight,
      entry: undefined,
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

  // 3. Client-side implementation...
}

// Framework Considerations:
// - Next.js: Works with App Router and Pages Router
// - Remix: Safe for server-side loaders
// - Gatsby: No window access during build
```

**Advanced Features**:

- Multiple element observation with single hook instance
- Custom rounding functions for dimension values
- Performance mode with callback-only (no state updates)
- Debounce/throttle integration for high-frequency resize events
- Device pixel ratio awareness for canvas/WebGL applications
- Error boundary integration for graceful failure handling
- Debug mode with console logging of resize events
- Integration with CSS custom properties for responsive design
- Support for CSS container queries polyfill integration
- Memory-efficient observation map for multiple elements

**Testing Considerations**:

- Mock ResizeObserver for unit tests
- Test all box model options (content-box, border-box, device-pixel-content-box)
- Verify debounce/throttle timing behavior
- Test SSR environment (window undefined)
- Test rapid element mounting/unmounting
- Test multiple elements observation
- Test cleanup on component unmount
- Test ref callback stability (no infinite loops)
- Test with React Strict Mode (double mount)
- Cross-browser testing for size array format differences
- Test round function with various rounding strategies
- Performance tests for high-frequency resize events

**Milestones**:

1. **Core Implementation**
   - Basic ResizeObserver integration
   - Ref callback pattern
   - Width/height state management
   - SSR compatibility
   - Cleanup on unmount

2. **Box Model Support**
   - content-box (default)
   - border-box
   - device-pixel-content-box
   - Cross-browser size array handling

3. **Performance Optimizations**
   - Debounce option
   - Throttle option
   - Callback-only mode (updateState: false)
   - Memoization of observer and callbacks

4. **Advanced Features**
   - Multiple element observation
   - Round function option
   - Error handling and callbacks
   - Enable/disable toggle

5. **Testing & Documentation**
   - Comprehensive unit tests (90%+ coverage)
   - Storybook stories with all use cases
   - Storybook interaction tests
   - TypeScript type safety verification
