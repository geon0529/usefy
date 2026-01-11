# @usefy/components

## 0.1.4

### Patch Changes

- fd66eb7: Fix unlimited duration recording, timer display, Re-record button, dark mode support, and update Storybook paths from Components to Kits
- Updated dependencies [fd66eb7]
  - @usefy/memory-monitor@0.1.4

## 0.1.3

### Patch Changes

- e2a04ba: ### @usefy/screen-recorder

  - Fix unlimited duration recording with `maxDuration={Infinity}`
  - Fix timer display showing "Infinity:NaN" for unlimited recordings
  - Fix Re-record button to immediately start new recording
  - Fix dark mode in preview modal (explicit theme prop support)
  - Add `theme` prop for explicit light/dark mode control

  ### @usefy/kits

  - Re-export ScreenRecorder with unlimited duration fix
  - @usefy/memory-monitor@0.1.3

## 0.1.2

### Patch Changes

- 2a91a40: update README.md
- Updated dependencies [2a91a40]
  - @usefy/memory-monitor@0.1.2

## 0.1.1

### Patch Changes

- 1db7b09: feat(memory-monitor): Add dynamic historySize control in Settings tab

  ### Changes

  **@usefy/use-memory-monitor**

  - Added `resize()` method to `CircularBuffer` for dynamic capacity changes
  - When shrinking buffer, keeps most recent items and discards oldest
  - Hook now detects `historySize` prop changes and resizes buffer accordingly via `useEffect`

  **@usefy/memory-monitor**

  - Added `historySize` to `PanelSettings` type with constraints (10-200 samples, default: 50)
  - Added `HISTORY_SIZE_LIMITS` constant for min/max/default values
  - Added "Memory Trend" section in Settings tab with History Size slider
  - Settings are persisted to localStorage automatically

  **ThresholdSlider component**

  - Added `suffix` prop for customizable value display (e.g., "50 samples" instead of "50%")

- f691328: update README.md
- 3df45f8: update README.md
- Updated dependencies [1db7b09]
- Updated dependencies [f691328]
- Updated dependencies [3df45f8]
  - @usefy/memory-monitor@0.1.1

## 0.0.38

### Patch Changes

- a5586b3: init @usefy/components
- Updated dependencies [a5586b3]
  - @usefy/button@0.0.38
