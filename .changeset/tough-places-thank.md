---
"@usefy/use-memory-monitor": patch
"@usefy/usefy": patch
---

### Features
- **Improved `requestGC` function**: Now attempts to call `globalThis.gc()` directly when available (Chrome with `--expose-gc` flag or Node.js), falling back to memory pressure hint if not available. Added descriptive console logging in dev mode.

### Documentation
- Added `requestGC` to API Reference table in README
- Added "Garbage Collection Request" section with usage example and platform-specific commands for enabling direct GC in Chrome (Windows/macOS/Linux)

### Bug Fixes
- **Fixed RadialBarChart gauge accumulation bug in Storybook**: The mini gauge in the Usage card was incorrectly filling to 100% over time. Added `PolarAngleAxis` with `domain={[0, 100]}` to properly constrain the value range, ensuring the gauge accurately reflects the actual usage percentage.
