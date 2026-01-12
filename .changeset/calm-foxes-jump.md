---
"@usefy/memory-monitor": minor
"@usefy/kits": minor
---

feat(memory-monitor): add `mode="headless"` for production monitoring without UI

### New Feature

Added `mode="headless"` option to MemoryMonitor component, enabling production monitoring without UI while keeping the same component API.

### Usage

```tsx
<MemoryMonitor
  // Easy environment switching with same API
  mode={process.env.NODE_ENV === 'development' ? 'always' : 'headless'}
  onWarning={(data) => analytics.track('memory_warning', data)}
  onCritical={(data) => alertService.send(data)}
  onLeakDetected={(analysis) => Sentry.captureMessage('Leak', analysis)}
/>
```

### Mode Comparison

| Mode | UI | Monitoring | Use Case |
|------|:---:|:----------:|----------|
| `development` | Dev only | Active | Default for dev |
| `production` | Prod only | Active | Debug in prod |
| `always` | Always | Active | Demo/testing |
| `headless` | Never | Active | Production callbacks |
| `never` | Never | Disabled | Completely off |

### Benefits

- **Same API**: No need to switch between component and hook for dev/prod
- **Easy environment switching**: Just change the `mode` prop
- **Callbacks work the same**: `onWarning`, `onCritical`, `onLeakDetected`, `onAutoGC`
- **Backward compatible**: `useMemoryMonitorHeadless` hook is still available for advanced use cases
