---
"@usefy/use-memory-monitor": patch
"@usefy/memory-monitor": patch
"@usefy/hooks": patch
"@usefy/kits": patch
---

feat(memory-monitor): Add dynamic historySize control in Settings tab

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
