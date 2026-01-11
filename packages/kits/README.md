<p align="center">
  <img src="https://raw.githubusercontent.com/mirunamu00/usefy/master/assets/logo.png" alt="usefy logo" width="180" />
</p>

<h1 align="center">@usefy/kits</h1>

<p align="center">
  <strong>A collection of production-ready React feature kits for modern applications</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@usefy/kits" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/v/@usefy/kits.svg?style=flat-square&color=007acc" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@usefy/kits" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/dm/@usefy/kits.svg?style=flat-square&color=007acc" alt="npm downloads" />
  </a>
  <a href="https://bundlephobia.com/package/@usefy/kits" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/bundlephobia/minzip/@usefy/kits?style=flat-square&color=007acc" alt="bundle size" />
  </a>
  <a href="https://github.com/mirunamu00/usefy/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/l/@usefy/kits.svg?style=flat-square&color=007acc" alt="license" />
  </a>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#packages">Packages</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a>
</p>

<p align="center">
  <a href="https://mirunamu00.github.io/usefy/" target="_blank" rel="noopener noreferrer">
    <strong>View Storybook Demo</strong>
  </a>
</p>

---

> **Pre-release Notice**: This project is currently in version `0.x.x` (alpha/beta stage). APIs may change between minor versions. While fully functional and tested, please use with caution in production environments.
>
> **Actively Developing**: New kits are being added regularly. Stay tuned for more feature-rich components!

---

## Overview

**@usefy/kits** is a collection of production-ready feature kits designed for modern React applications. Unlike simple hooks, kits are complete UI components with built-in functionality, designed to be dropped into your application with minimal configuration.

### Why @usefy/kits?

- **Complete Solutions** — Ready-to-use components with UI, state management, and logic bundled together
- **Enterprise-Grade** — Built for production use with comprehensive testing and documentation
- **Tree Shakeable** — Import only the kits you need to optimize bundle size
- **TypeScript First** — Complete type safety with full autocomplete support
- **SSR Compatible** — Works seamlessly with Next.js, Remix, and other SSR frameworks
- **Highly Customizable** — Extensive props and callbacks for integration with your app
- **Well Documented** — Detailed documentation with practical examples
- **Interactive Demos** — Try all kits in action with our Storybook playground

---

## Installation

### All-in-One Package

Install all kits at once:

```bash
# npm
npm install @usefy/kits

# yarn
yarn add @usefy/kits

# pnpm
pnpm add @usefy/kits
```

### Individual Packages

You can also install only the kits you need:

```bash
# Example: Install only memory-monitor
pnpm add @usefy/memory-monitor
```

### Peer Dependencies

All packages require React 18 or 19:

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

Some kits may have additional peer dependencies (e.g., `recharts` for memory-monitor).

---

## Packages

### Available Kits

| Kit                                                                                                                                   | Description                                                    | npm                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a href="https://www.npmjs.com/package/@usefy/memory-monitor" target="_blank" rel="noopener noreferrer">@usefy/memory-monitor</a>     | Enterprise-grade real-time browser memory monitoring panel     | <a href="https://www.npmjs.com/package/@usefy/memory-monitor" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@usefy/memory-monitor.svg?style=flat-square&color=007acc" alt="npm version" /></a> |

---

## Quick Start

### Using the All-in-One Package

```tsx
import { MemoryMonitor } from "@usefy/kits";

function App() {
  return (
    <div>
      <h1>My Application</h1>

      {/* Add memory monitoring panel */}
      <MemoryMonitor
        mode="development"
        position="right"
        onWarning={(data) => console.warn("Memory warning:", data)}
        onLeakDetected={(analysis) => console.warn("Leak detected:", analysis)}
      />
    </div>
  );
}
```

### Using Individual Packages

```tsx
import { MemoryMonitor } from "@usefy/memory-monitor";

function App() {
  return (
    <div>
      <h1>My Application</h1>
      <MemoryMonitor mode="development" />
    </div>
  );
}
```

---

## Features

### MemoryMonitor

<details>
<summary><strong>MemoryMonitor</strong> — Real-time browser memory monitoring with slide-in panel UI</summary>

```tsx
import { MemoryMonitor, useMemoryMonitorHeadless } from "@usefy/kits";

// Full UI Panel
<MemoryMonitor
  mode="development"           // 'development' | 'production' | 'always' | 'never'
  position="right"             // 'right' | 'left'
  defaultOpen={false}

  // Thresholds
  warningThreshold={70}        // Warning at 70% usage
  criticalThreshold={90}       // Critical at 90% usage

  // Auto-GC
  enableAutoGC={true}
  autoGCThreshold={85}

  // Leak Detection
  enableLeakDetection={true}
  leakSensitivity="medium"     // 'low' | 'medium' | 'high'

  // Callbacks
  onWarning={(data) => sendToAnalytics("memory_warning", data)}
  onCritical={(data) => sendAlert("memory_critical", data)}
  onLeakDetected={(analysis) => captureException(analysis)}
  onAutoGC={(data) => console.log("GC triggered")}
/>

// Headless Mode (no UI, just monitoring)
const {
  memory,
  severity,
  isLeakDetected,
  trend,
  requestGC,
} = useMemoryMonitorHeadless({
  interval: 1000,
  onWarning: (data) => analytics.track("memory_warning"),
});
```

**Key Features:**
- Real-time memory gauge visualization
- Memory history chart with trend analysis
- Snapshot system with comparison
- HTML report generation
- 5-factor leak detection algorithm
- Auto-GC trigger with cooldown
- Keyboard shortcuts (Ctrl+Shift+M)
- Dark mode support
- Settings persistence to localStorage

Perfect for debugging memory leaks, monitoring production apps, and performance optimization.

</details>

---

## Kits vs Hooks

| Aspect | @usefy/hooks | @usefy/kits |
| ------ | ------------ | ----------- |
| **What** | Individual React hooks | Complete feature components |
| **UI** | No UI, logic only | Built-in UI with customization |
| **Complexity** | Simple, single-purpose | Complex, multi-feature |
| **Use Case** | Building blocks | Ready-to-use solutions |
| **Example** | `useToggle`, `useDebounce` | `MemoryMonitor` |

---

## Browser Support

| Browser | Version          |
| ------- | ---------------- |
| Chrome  | 66+              |
| Firefox | 63+              |
| Safari  | 13.1+            |
| Edge    | 79+              |

Note: Some features may have limited support in non-Chromium browsers (e.g., `performance.memory` API).

---

## Related Links

- <a href="https://www.npmjs.com/org/usefy" target="_blank" rel="noopener noreferrer">npm Organization</a>
- <a href="https://github.com/mirunamu00/usefy" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
- <a href="https://github.com/mirunamu00/usefy/blob/master/packages/kits/CHANGELOG.md" target="_blank" rel="noopener noreferrer">Changelog</a>
- <a href="https://github.com/mirunamu00/usefy/issues" target="_blank" rel="noopener noreferrer">Issue Tracker</a>
- <a href="https://www.npmjs.com/package/@usefy/hooks" target="_blank" rel="noopener noreferrer">@usefy/hooks</a> — React hooks collection

---

## License

MIT © <a href="https://github.com/mirunamu00" target="_blank" rel="noopener noreferrer">mirunamu</a>

---

<p align="center">
  <sub>Built with care by the usefy team</sub>
</p>

<p align="center">
  <a href="https://github.com/mirunamu00/usefy" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/github/stars/mirunamu00/usefy?style=social" alt="GitHub stars" />
  </a>
</p>
