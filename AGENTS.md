Agata UI - Agent Instructions

## Project Overview

**Agata UI** (`@agala/ui`) is a Vue 3 component library with atomic design tokens and zero dependencies except Vue.

- **Tech stack:** Vue 3 + TypeScript + Vite + scoped CSS (NO CSS Modules)
- **Style system:** Semantic CSS custom properties (design tokens) in HSL format, with built-in dark mode support
- **Purpose:** Provide clean, reusable, fully accessible UI primitives
- **Current phase:** Active development — 25+ components exist

## Repository Structure

```
src/
├── lib/
│   ├── tokens.css                # Global design tokens
│   ├── index.ts                  # Public API
│   ├── components/
│   │   ├── AgalaIcon/            # Internal icon component (not exported)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── FormField/
│   │   ├── Select/
│   │   └── Modal/
│   │       ├── Modal.vue
│   │       ├── ModalManager.ts   # Singleton with reactive()
│   │       └── ModalProvider.vue # Teleport wrapper
│   └── ...
├── playground/
│   └── Playground.vue            # Dev demo page
├── main.ts                       # createApp entry
└── index.css                     # Global reset
```

## Architecture & Conventions

### Component Structure
Every component is a `.vue` SFC with:
- Template — vanilla HTML with Vue directives
- Script — `setup lang="ts"` + explicit imports
- Style — `scoped`, plain classes, NO CSS Modules

### Styling System (CRITICAL)
- **NO utility CSS frameworks** (no Tailwind, no UnoCSS)
- Use **scoped CSS** in each `.vue` SFC
- Use **HSL token values** everywhere:
  ```css
  color: hsl(var(--agala-primary));
  background: hsl(var(--agala-primary) / 0.9);
  ```
- Import `tokens.css` once via `src/lib/index.ts`
- Dark mode handled via `@media (prefers-color-scheme: dark)` in tokens

### Icons
- Internal `AgalaIcon` component accepts an `IconName` prop string
- No slot for icons in components — use boolean props:
  - Button: `icon?: boolean` (shows search icon)
  - Input: `iconStart?: boolean`, `iconEnd?: boolean` (shows search icon)
- Icons are line-art SVGs from Lucide/X set rendered inline

### Component API Patterns
- Props declared as `interface` with defaults via `withDefaults(defineProps(), {...})`
- Emits declared via `defineEmits()` for v-model support
- Variant/size maps are plain objects mapped to CSS classes in template
- `class` prop accepted for consumer overrides
- Vue-native patterns: `ref`, `computed`, `watch`, `Teleport`, `slots`, `provide/inject`

## Build & Publish

### Scripts
```bash
npm run dev          # Vite dev server
npm run build:lib    # vue-tsc + vite build
npm run preview      # Preview production build
npm run lint         # ESLint with vue-eslint
```

### Build Output
- `dist/agala-ui.es.js` — ESM only
- `dist/index.d.ts` — Type declarations
- CSS injected into JS (via `vite-plugin-lib-inject-css`)

### Package Config
- `peerDependencies`: `vue >=3.3.0`
- `files`: `["dist"]` only
- ESM only exports

## Accessibility Standards
- Focus rings using `box-shadow` with `--agala-ring` token
- ARIA attributes where applicable (e.g., `aria-invalid`, `role="combobox"`, `aria-expanded`, `aria-selected`)
- Keyboard navigation (Arrow keys, Enter, Space, Escape, Tab, Home/End)
- SVG icons always have `aria-hidden="true"`
- Disabled states: `pointer-events: none; opacity: 0.5;` in CSS + native `disabled`/`aria-disabled` in HTML

## Dev Environment Notes
- **Vite library mode** project
- `Playground.vue` uses all components via relative imports for dev only
- `dist/` is gitignored but published to npm via `files: ["dist"]`

---
*Last updated: 2026-05-06*
