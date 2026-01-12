---
"@usefy/screen-recorder": patch
"@usefy/kits": patch
---

refactor(screen-recorder): migrate from Tailwind CSS to CSS Modules

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
