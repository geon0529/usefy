---
"@usefy/use-resize-observer": patch
---

Fix duplicate onResize callback invocations

- Prevent redundant `observe()` calls when the same element is passed to ref callback
- Add `isObservingRef` guard to prevent duplicate observe calls in useEffect
- Split observer creation (mount-only) and enabled toggle handling into separate effects
- This fixes the issue where Debounced Callbacks count was incrementing without user interaction
