# Confetti Component Specification

## Overview

**Package Name:** `@usefy/confetti`
**Version:** `0.1.0`
**Status:** Draft
**Created:** 2026-01-11
**Author:** usefy team

---

## 1. Executive Summary

### 1.1 Purpose

`Confetti` is a React component for creating delightful celebration effects. It provides an easy-to-use API for triggering confetti animations on user achievements, successful actions, or any moment worth celebrating.

### 1.2 Target Users

- Frontend Developers (adding celebration UX)
- Product Teams (engagement features)
- Game Developers (reward feedback)
- E-commerce (purchase celebration)

### 1.3 Key Value Propositions

1. **Simple API**: `confetti.fire()` - one line to celebrate
2. **Zero Config**: Beautiful defaults out of the box
3. **Highly Customizable**: Colors, shapes, physics, duration
4. **Lightweight**: No heavy dependencies, pure canvas-based
5. **React-First**: Hooks and component API, proper cleanup

### 1.4 Use Cases

| Scenario | Example |
|----------|---------|
| Purchase Complete | Order confirmation page celebration |
| Achievement Unlocked | Gamification reward feedback |
| Form Success | Sign-up completion, survey done |
| Goal Reached | Progress bar hitting 100% |
| Special Events | Birthday, anniversary, holidays |
| Game Win | Level complete, high score |

---

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Confetti Effects

| Feature | Description | Priority |
|---------|-------------|----------|
| Basic Burst | Confetti explosion from a point | P0 |
| Cannon | Directional confetti shot | P0 |
| Rain | Confetti falling from top | P1 |
| Fireworks | Multiple bursts with delay | P1 |
| Continuous | Ongoing celebration effect | P2 |
| Custom Origin | Fire from specific element/position | P0 |

#### 2.1.2 Particle Customization

| Feature | Description | Priority |
|---------|-------------|----------|
| Colors | Custom color palette | P0 |
| Shapes | Rectangle, circle, star, emoji, custom SVG | P0 |
| Count | Number of particles | P0 |
| Size | Particle size range | P1 |
| Velocity | Initial speed and spread | P1 |
| Gravity | Fall speed | P1 |
| Rotation | Spin while falling | P1 |
| Opacity | Fade out effect | P1 |

#### 2.1.3 Animation Control

| Feature | Description | Priority |
|---------|-------------|----------|
| Duration | How long particles stay visible | P0 |
| Easing | Animation timing function | P2 |
| Wind | Horizontal drift | P2 |
| Collision | Bounce off screen edges | P3 |

#### 2.1.4 Integration

| Feature | Description | Priority |
|---------|-------------|----------|
| Imperative API | `confetti.fire()` from anywhere | P0 |
| Component API | `<Confetti trigger={...} />` | P0 |
| Hook API | `useConfetti()` for fine control | P0 |
| Element Target | Fire from button/element position | P1 |
| Portal Support | Render in document.body | P0 |

### 2.2 Presets

Pre-configured celebration styles:

```typescript
const presets = {
  // Default burst - balanced for most use cases
  default: { particleCount: 100, spread: 70, origin: { y: 0.6 } },

  // Realistic confetti cannon
  cannon: { particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } },

  // Subtle celebration
  subtle: { particleCount: 30, spread: 50, gravity: 0.8 },

  // Over-the-top party
  party: { particleCount: 200, spread: 100, startVelocity: 45 },

  // Stars only
  stars: { shapes: ['star'], colors: ['#FFD700', '#FFA500'] },

  // Emoji celebration
  emoji: { shapes: ['🎉', '🎊', '✨', '🌟'], scalar: 2 },

  // Pride colors
  pride: { colors: ['#E40303', '#FF8C00', '#FFED00', '#008026', '#24408E', '#732982'] },

  // Snow effect
  snow: { shapes: ['circle'], colors: ['#fff'], gravity: 0.3, drift: 2 },

  // Fireworks (multiple bursts)
  fireworks: { /* multi-burst config */ },
};
```

---

## 3. Technical Specifications

### 3.1 Component API

```typescript
interface ConfettiProps {
  /**
   * Trigger the confetti effect
   * - true: fire once
   * - number: fire on change (like signal)
   */
  trigger?: boolean | number;

  /**
   * Preset configuration name
   */
  preset?: keyof typeof presets;

  /**
   * Number of confetti particles
   * @default 100
   */
  particleCount?: number;

  /**
   * Spread angle in degrees
   * @default 70
   */
  spread?: number;

  /**
   * Launch angle in degrees (0 = right, 90 = up)
   * @default 90
   */
  angle?: number;

  /**
   * Initial velocity of particles
   * @default 30
   */
  startVelocity?: number;

  /**
   * Gravity pull (0 = no gravity, 1 = normal)
   * @default 1
   */
  gravity?: number;

  /**
   * Horizontal drift (-1 to 1)
   * @default 0
   */
  drift?: number;

  /**
   * How long particles stay visible (ms)
   * @default 3000
   */
  duration?: number;

  /**
   * Particle colors (hex, rgb, hsl)
   * @default ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
   */
  colors?: string[];

  /**
   * Particle shapes
   * @default ['square', 'circle']
   */
  shapes?: Array<'square' | 'circle' | 'star' | string>;

  /**
   * Size multiplier
   * @default 1
   */
  scalar?: number;

  /**
   * Origin point (0-1 relative to viewport)
   * @default { x: 0.5, y: 0.5 }
   */
  origin?: { x?: number; y?: number };

  /**
   * Z-index of the canvas
   * @default 9999
   */
  zIndex?: number;

  /**
   * Disable pointer events on canvas
   * @default true
   */
  disablePointerEvents?: boolean;

  /**
   * Use window resize for canvas size
   * @default true
   */
  resize?: boolean;

  /**
   * Callback when animation completes
   */
  onComplete?: () => void;
}
```

### 3.2 Hook API

```typescript
interface UseConfettiOptions extends Omit<ConfettiProps, 'trigger'> {}

interface UseConfettiReturn {
  /**
   * Fire confetti with optional override options
   */
  fire: (options?: Partial<UseConfettiOptions>) => void;

  /**
   * Fire confetti from a specific element
   */
  fireFrom: (element: HTMLElement, options?: Partial<UseConfettiOptions>) => void;

  /**
   * Fire a preset
   */
  firePreset: (preset: keyof typeof presets) => void;

  /**
   * Stop all active confetti
   */
  clear: () => void;

  /**
   * Whether confetti is currently animating
   */
  isAnimating: boolean;

  /**
   * Canvas ref (for advanced usage)
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

function useConfetti(options?: UseConfettiOptions): UseConfettiReturn;
```

### 3.3 Imperative API (Global)

```typescript
// Global confetti object (for quick usage)
import { confetti } from '@usefy/confetti';

// Basic fire
confetti.fire();

// With options
confetti.fire({ particleCount: 200, spread: 100 });

// From element
confetti.fireFrom(buttonElement);

// Preset
confetti.firePreset('party');

// Clear all
confetti.clear();

// Reset to defaults
confetti.reset();
```

### 3.4 Exported Types

```typescript
export interface ConfettiOptions {
  particleCount: number;
  spread: number;
  angle: number;
  startVelocity: number;
  gravity: number;
  drift: number;
  duration: number;
  colors: string[];
  shapes: Shape[];
  scalar: number;
  origin: Origin;
  zIndex: number;
}

export interface Origin {
  x: number;
  y: number;
}

export type Shape = 'square' | 'circle' | 'star' | string;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: Shape;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
}

export type PresetName = keyof typeof presets;
```

### 3.5 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.0.0 \|\| ^19.0.0 | Peer dependency |
| `react-dom` | ^18.0.0 \|\| ^19.0.0 | Portal rendering |

**No external dependencies** - pure canvas implementation.

### 3.6 Browser Support

| Browser | Support Level | Notes |
|---------|--------------|-------|
| Chrome 66+ | Full | requestAnimationFrame, Canvas2D |
| Firefox 63+ | Full | |
| Safari 13.1+ | Full | |
| Edge 79+ | Full | |
| SSR | Safe | No-op on server |

---

## 4. Architecture

### 4.1 Package Structure

```
confetti/
├── src/
│   ├── index.ts                 # Public exports
│   ├── Confetti.tsx             # Main component
│   ├── useConfetti.ts           # Hook implementation
│   ├── types.ts                 # Type definitions
│   ├── constants.ts             # Defaults, presets
│   │
│   ├── core/
│   │   ├── ConfettiCanvas.ts    # Canvas manager class
│   │   ├── Particle.ts          # Particle physics
│   │   ├── shapes.ts            # Shape renderers
│   │   └── physics.ts           # Motion calculations
│   │
│   ├── utils/
│   │   ├── colors.ts            # Color parsing/manipulation
│   │   ├── random.ts            # Random number utilities
│   │   └── element.ts           # Element position helpers
│   │
│   └── global.ts                # Global confetti instance
│
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── SPEC.md
└── README.md
```

### 4.2 Core Classes

```typescript
class ConfettiCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;

  constructor(options: CanvasOptions);

  fire(options: ConfettiOptions): void;
  clear(): void;
  destroy(): void;

  private createParticles(options: ConfettiOptions): Particle[];
  private animate(): void;
  private updateParticle(particle: Particle, deltaTime: number): void;
  private drawParticle(particle: Particle): void;
  private isParticleVisible(particle: Particle): boolean;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: Shape;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  lifetime: number;
  maxLifetime: number;

  update(gravity: number, drift: number, deltaTime: number): void;
  isAlive(): boolean;
}
```

### 4.3 Data Flow

```
User Action (button click)
        │
        ▼
┌──────────────────┐
│   useConfetti    │ ◄── Options/Preset
│   or <Confetti>  │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  ConfettiCanvas  │ ◄── Create/reuse canvas
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Create Particles │ ◄── Apply physics params
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Animation Loop   │ ◄── requestAnimationFrame
│ - Update physics │
│ - Draw particles │
│ - Remove dead    │
└──────────────────┘
        │
        ▼
  onComplete callback
```

---

## 5. Usage Examples

### 5.1 Basic Usage

```tsx
import { Confetti, useConfetti } from '@usefy/confetti';

// Component API
function PurchaseSuccess() {
  return (
    <div>
      <h1>Order Complete!</h1>
      <Confetti trigger={true} />
    </div>
  );
}

// Hook API
function AchievementUnlocked() {
  const { fire } = useConfetti();

  return (
    <button onClick={() => fire()}>
      Claim Reward
    </button>
  );
}
```

### 5.2 Fire from Element

```tsx
function CelebrationButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { fireFrom } = useConfetti();

  const handleClick = () => {
    if (buttonRef.current) {
      fireFrom(buttonRef.current, { particleCount: 50 });
    }
  };

  return (
    <button ref={buttonRef} onClick={handleClick}>
      Click Me!
    </button>
  );
}
```

### 5.3 Presets

```tsx
import { confetti } from '@usefy/confetti';

// Quick global usage
confetti.firePreset('party');
confetti.firePreset('stars');
confetti.firePreset('emoji');
```

### 5.4 Custom Shapes (Emoji)

```tsx
<Confetti
  trigger={celebrate}
  shapes={['🎉', '🎊', '🥳', '✨']}
  scalar={2}
  particleCount={50}
/>
```

### 5.5 Fireworks Effect

```tsx
function Fireworks() {
  const { fire } = useConfetti();

  const launchFireworks = () => {
    // Multiple bursts with delays
    const colors = [['#ff0', '#f0f'], ['#0ff', '#0f0'], ['#f00', '#ff0']];

    colors.forEach((colorSet, i) => {
      setTimeout(() => {
        fire({
          particleCount: 80,
          spread: 100,
          origin: { x: 0.2 + i * 0.3, y: 0.5 },
          colors: colorSet,
        });
      }, i * 300);
    });
  };

  return <button onClick={launchFireworks}>Launch Fireworks</button>;
}
```

### 5.6 Snow Effect

```tsx
function SnowEffect() {
  return (
    <Confetti
      trigger={true}
      preset="snow"
      particleCount={200}
      duration={10000}
      origin={{ y: 0 }}
      gravity={0.3}
      drift={1}
    />
  );
}
```

---

## 6. Development Milestones

### Phase 1: Core Engine

- [ ] Project setup (package.json, tsconfig, tsup, vitest)
- [ ] Type definitions
- [ ] ConfettiCanvas class (canvas management)
- [ ] Particle class (physics simulation)
- [ ] Basic shapes (square, circle)
- [ ] Animation loop with requestAnimationFrame

### Phase 2: React Integration

- [ ] useConfetti hook
- [ ] Confetti component
- [ ] Portal rendering
- [ ] Cleanup on unmount
- [ ] fire() and fireFrom() APIs

### Phase 3: Customization

- [ ] All particle options (colors, sizes, velocity, etc.)
- [ ] Star shape
- [ ] Emoji/text support
- [ ] Presets system
- [ ] Global confetti instance

### Phase 4: Polish

- [ ] onComplete callback
- [ ] Performance optimization
- [ ] SSR safety
- [ ] Unit tests (90%+ coverage)
- [ ] Storybook stories
- [ ] Documentation

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
describe('Confetti', () => {
  describe('useConfetti', () => {
    it('should fire confetti on fire()');
    it('should fire from element position');
    it('should apply preset options');
    it('should clear all particles');
    it('should clean up on unmount');
  });

  describe('Confetti component', () => {
    it('should fire on trigger change');
    it('should render canvas in portal');
    it('should call onComplete when done');
  });

  describe('ConfettiCanvas', () => {
    it('should create particles with correct count');
    it('should apply physics correctly');
    it('should remove dead particles');
    it('should stop animation when empty');
  });

  describe('Particle', () => {
    it('should update position based on velocity');
    it('should apply gravity');
    it('should reduce opacity over time');
  });
});
```

### 7.2 Visual Tests

- Storybook stories for all presets
- Interactive playground with controls

---

## 8. Performance Considerations

### 8.1 Rendering Optimization

- Use `requestAnimationFrame` for smooth 60fps
- Batch particle updates before drawing
- Use object pooling for particles (reuse instead of create/destroy)
- Limit max particles (configurable, default 500)

### 8.2 Memory Management

- Clean up particles that leave viewport
- Destroy canvas on unmount
- Cancel animation frame on clear/destroy
- Avoid closure allocations in hot paths

### 8.3 Bundle Size Target

- **< 5KB gzipped** (no dependencies)
- Tree-shakeable exports
- Dead code elimination friendly

---

## 9. Comparison with Existing Libraries

| Feature | canvas-confetti | react-confetti | @usefy/confetti |
|---------|-----------------|----------------|-----------------|
| React-first | No | Yes | Yes |
| Hooks API | No | Limited | Full |
| TypeScript | Partial | Yes | Full |
| Presets | No | No | Yes |
| Fire from element | Manual | No | Built-in |
| Emoji support | No | No | Yes |
| Bundle size | ~4KB | ~8KB | ~5KB (target) |
| Active maintenance | Low | Low | Active |

---

## 10. Success Criteria

### 10.1 Functional

- [ ] fire() triggers confetti animation
- [ ] fireFrom() fires from element position
- [ ] All presets work correctly
- [ ] Emoji shapes render properly
- [ ] Animation completes and cleans up
- [ ] Works with SSR (no-op on server)

### 10.2 Non-Functional

- [ ] 90%+ test coverage
- [ ] < 5KB bundle size (gzipped)
- [ ] 60fps animation performance
- [ ] No memory leaks
- [ ] TypeScript strict mode

---

## 11. Open Questions

1. **Custom SVG shapes**: Should we support custom SVG paths for shapes?
2. **Audio support**: Optional celebration sounds? (probably scope creep)
3. **Accessibility**: Should we add `prefers-reduced-motion` support to disable animations?
4. **Mobile performance**: Reduce particle count on low-end devices automatically?

---

## 12. References

- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Popular vanilla JS library
- [react-confetti](https://github.com/alampros/react-confetti) - React wrapper
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

*Document Version: 1.0*
*Last Updated: 2026-01-11*
