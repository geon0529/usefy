# @usefy/screen-recorder

## 0.2.1

## 0.2.0

### Patch Changes

- 17932a5: refactor(screen-recorder): migrate from Tailwind CSS to CSS Modules

  ### Changes

  - **Replaced Tailwind CSS with CSS Modules (SCSS)**

    - Migrated all components from Tailwind utility classes to `.module.scss` files
    - Created centralized design system with `_variables.scss` and `_mixins.scss`
    - Implemented custom esbuild plugin for SCSS module processing with class name scoping

  - **Build System Updates**

    - Added `sass` dependency for SCSS compilation
    - Removed `tailwind-merge` and `tailwindcss` dependencies
    - Custom CSS bundling in `tsup.config.ts` with automatic style injection

  - **Dark Mode Implementation**

    - Uses `:global(.dark)` selector pattern for theme-aware styles
    - Parent `.dark` class controls dark mode styling across all components

  - **CSS Output**
    - Standalone `dist/styles.css` file generated for manual import
    - CSS automatically injected into JS bundles for zero-config usage

  ### No Breaking Changes

  - All public APIs remain unchanged
  - Component props and behavior are identical
  - Drop-in replacement for existing installations

## 0.1.5

## 0.1.4

### Patch Changes

- fd66eb7: Fix unlimited duration recording, timer display, Re-record button, dark mode support, and update Storybook paths from Components to Kits

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
