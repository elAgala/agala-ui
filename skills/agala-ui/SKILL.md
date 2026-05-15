---
name: agala-ui
description: >
  Expert knowledge of @el-agala/ui — a zero-dependency Vue 3 component library
  with 30+ components, HSL design tokens, theming, and accessibility.
  Auto-triggered when the user mentions "agala", "el-agala/ui", "agala ui",
  or asks to build UI with these components.
---

# Agala UI — Complete Component Reference

> Copy-paste this entire block into any AI assistant to teach it how to use `@el-agala/ui`.

---

## Overview

`@el-agala/ui` is a **zero-dependency** Vue 3 component library (peer-dep: `vue >=3.3.0`). It ships as a single ESM bundle with CSS injected. All components use `<style scoped>` with HSL design tokens. No Tailwind, no CSS Modules.

**Naming convention:** All components are exported with the `Agala` prefix — `AgalaButton`, `AgalaCard`, `AgalaStat`, etc. This prevents conflicts with native HTML elements (`<dialog>`, `<details>`, `<search>`) and makes components instantly recognizable in templates. Import individually:

```ts
import { AgalaButton, AgalaCard } from '@el-agala/ui'
```

Or register all globally via plugin:

```ts
import { AgalaUI } from '@el-agala/ui'
app.use(AgalaUI)
// Then use <AgalaButton>, <AgalaCard>, etc. anywhere
```

**Key principles:**
- Scoped CSS in `.vue` SFCs only
- HSL design tokens (`--agala-primary`, etc.) via `tokens.css`
- Dark mode via `@media (prefers-color-scheme: dark)`
- Custom themes via `data-theme="forja"` attribute on `<html>`
- Icon system: internal `AgalaIcon` with `name` string prop (40+ icons, zero icon deps)
- Accessibility: focus rings, ARIA, keyboard nav
- Composables: `useSelectFilter`, `useChipDisplay`, `useKeyboardNav`, `useDropdownPosition`, `usePopoverBehavior`, `useMediaQuery`
- **Responsive by default** — Sidebar, Modal, Tabs, Pagination, and Navbar adapt to mobile/tablet viewports via CSS media queries (no custom CSS needed)
- **Alert** — inline contextual messages with 4 semantic variants, optional title, dismissible, flat mode
- **ColorPicker** — popover-based with saturation/luminance square, hue slider, presets, manual HEX input
- **SegmentedControl** — pill-style single-select toggle group with ARIA radiogroup, keyboard nav, per-option variant colors, sizes sm/md/lg matching Button
- **Charts** — companion package `@el-agala/charts` provides ECharts-based BaseChart component (8 chart types, theme integration). See the `agala-charts` skill.
- **Layout primitives** — Stack, HStack, VStack (flex containers with gap/align/justify), Spacer (flex spacer), Center (centers both axes), Divider (separator with optional label)

---

## Installation

```bash
npm install @el-agala/ui vue
```

**Setup in `main.ts`:**

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

**Optional CSS reset:**
```ts
import '@el-agala/ui/reset.css'
```

**Plain HTML (no bundler) with importmap:**
```html
<link rel="stylesheet" href="node_modules/@el-agala/ui/dist/index.css">
<script type="importmap">{
  "imports": {
    "vue": "node_modules/vue/dist/vue.esm-browser.js",
    "@el-agala/ui": "node_modules/@el-agala/ui/dist/agala-ui.browser.js"
  }
}</script>
```
Uses `agala-ui.browser.js` which has no `import './index.css'` statement (browsers don't support CSS imports in ES modules). CSS is linked separately via `<link rel="stylesheet">`.

**For imperative modals & toasts — add providers once at root:**

```vue
<template>
  <AgalaModalProvider />
  <AgalaToastProvider />
  <RouterView />
</template>

<script setup lang="ts">
import { ModalProvider, ToastProvider } from '@el-agala/ui'
</script>
```

---

## Theming

### Default tokens (excerpt)

```css
:root {
  --agala-primary: 239 84% 57%;
  --agala-primary-foreground: 0 0% 100%;
  --agala-background: 0 0% 100%;
  --agala-foreground: 240 10% 3.9%;
  --agala-card: 0 0% 100%;
  --agala-muted: 240 4.8% 95.9%;
  --agala-muted-foreground: 240 3.8% 46.1%;
  --agala-border: 240 5.9% 90%;
  --agala-input: 240 5.9% 90%;
  --agala-input-background: unset;  /* falls back to --agala-background */
  --agala-danger: 0 84.2% 60.2%;
  --agala-success: 142 71% 45%;
  --agala-warning: 43 96% 50%;
  --agala-radius: 0.5rem;
  --agala-z-modal: 1000;
  --agala-z-dropdown: 1050;
}
```

### Dark mode
Automatic via `@media (prefers-color-scheme: dark)` in `tokens.css`.

### Component-level tokens

Every component exposes its key CSS values as `--agala-<component>-*` custom properties with fallbacks to the default tokens. This allows theming without `!important`.

```css
/* Card */
--agala-card-radius: var(--agala-radius-lg);
--agala-card-bg: hsl(var(--agala-card));
--agala-card-border: var(--agala-border-width) solid hsl(var(--agala-border));
--agala-card-shadow: var(--agala-shadow-sm);
--agala-card-padding: 0;
--agala-card-header-padding: 1rem 1.25rem;
--agala-card-header-border: var(--agala-border-width) solid hsl(var(--agala-border));
--agala-card-body-padding: 0;
--agala-card-footer-padding: 0.875rem 1.25rem;

/* Button */
--agala-btn-radius: calc(var(--agala-radius) - 2px);
--agala-btn-gap: 0.35rem;
--agala-btn-height: 2.25rem;
--agala-btn-padding-sm: 0 0.75rem;
--agala-btn-padding-md: 0 1rem;
--agala-btn-padding-lg: 0 1.5rem;

/* Input */
--agala-input-radius: calc(var(--agala-radius) - 2px);
--agala-input-bg: hsl(var(--agala-input-background, var(--agala-background)));
--agala-input-border: hsl(var(--agala-input));
--agala-input-padding: 0 0.75rem;
--agala-input-height-sm: var(--agala-height-sm);
--agala-input-height-md: var(--agala-height-md);
--agala-input-height-lg: var(--agala-height-lg);
--agala-input-icon-color: hsl(var(--agala-muted-foreground));

/* Alert */
--agala-alert-padding: 0.75rem 1rem;
--agala-alert-radius: calc(var(--agala-radius) - 2px);
--agala-alert-border-width: 4px;
--agala-alert-gap: 0.75rem;
--agala-alert-icon-size: 1rem;
--agala-alert-title-size: var(--agala-font-size-base);
--agala-alert-body-size: var(--agala-font-size-sm);
--agala-alert-flat-padding: 0.25rem 0;

/* Badge */
--agala-badge-padding: 0.125rem 0.5rem;
--agala-badge-padding-sm: 0.0625rem 0.375rem;
--agala-badge-radius: 999px;
--agala-badge-font-size: 0.625rem;
--agala-badge-font-size-sm: 0.5625rem;

/* ListGroup */
--agala-list-group-border: 1px solid hsl(var(--agala-border));
--agala-list-group-radius: var(--agala-radius);
--agala-list-group-padding: 0;
--agala-list-item-padding: 0.75rem 1rem;
--agala-list-item-gap: 0.75rem;
--agala-list-item-bg: hsl(var(--agala-card));
--agala-list-item-hover-bg: hsl(var(--agala-muted));
--agala-list-item-border: 1px solid hsl(var(--agala-border));
--agala-list-badge-bg: hsl(var(--agala-primary) / 0.1);
--agala-list-badge-color: hsl(var(--agala-primary));

/* Stat */
--agala-stat-padding: 1rem;
--agala-stat-gap: 0.25rem;
--agala-stat-bg: hsl(var(--agala-card));
--agala-stat-border: 1px solid hsl(var(--agala-border));
--agala-stat-radius: var(--agala-radius);
--agala-stat-shadow: none;
--agala-stat-label-transform: uppercase;
--agala-stat-label-size: var(--agala-font-size-sm);
--agala-stat-label-weight: var(--agala-font-weight-medium);
--agala-stat-label-color: hsl(var(--agala-muted-foreground));
--agala-stat-value-size: 1.5rem;
--agala-stat-value-weight: var(--agala-font-weight-bold);
--agala-stat-value-color: hsl(var(--agala-foreground));
--agala-stat-trend-size: var(--agala-font-size-sm);

/* Table */
--agala-table-border: 1px solid hsl(var(--agala-border));
--agala-table-radius: var(--agala-radius);
--agala-table-header-bg: hsl(var(--agala-muted));
--agala-table-header-font-size: var(--agala-font-size-sm);
--agala-table-header-weight: var(--agala-font-weight-semibold);
--agala-table-header-color: hsl(var(--agala-muted-foreground));
--agala-table-header-cell-padding: 0.75rem 1rem;
--agala-table-row-border: 1px solid hsl(var(--agala-border));
--agala-table-row-hover-bg: hsl(var(--agala-accent));
--agala-table-cell-padding: 0.75rem 1rem;
--agala-table-cell-size: var(--agala-font-size-base);
--agala-table-cell-color: hsl(var(--agala-foreground));
--agala-table-cell-line-height: var(--agala-line-height-normal);
--agala-table-footer-bg: hsl(var(--agala-muted));
--agala-table-footer-padding: 0.625rem 1rem;
--agala-table-footer-border: 1px solid hsl(var(--agala-border));
--agala-table-empty-padding: 2rem 1rem;
--agala-table-empty-color: hsl(var(--agala-muted-foreground));

/* Tabs */
--agala-tab-gap: 0;
--agala-tab-list-padding: 0;
--agala-tab-list-border: 1px solid hsl(var(--agala-border));
--agala-tab-padding: 0.625rem 1rem;
--agala-tab-font-size: var(--agala-font-size-base);
--agala-tab-font-weight: var(--agala-font-weight-medium);
--agala-tab-inactive-color: hsl(var(--agala-muted-foreground));
--agala-tab-active-color: hsl(var(--agala-primary));
--agala-tab-active-border: 2px solid hsl(var(--agala-primary));

/* FormField */
--agala-field-gap: 0.25rem;
--agala-field-label-size: var(--agala-font-size-sm);
--agala-field-label-weight: var(--agala-font-weight-medium);
--agala-field-label-color: hsl(var(--agala-foreground));
--agala-field-helper-size: var(--agala-font-size-sm);
--agala-field-helper-color: hsl(var(--agala-muted-foreground));
--agala-field-error-size: var(--agala-font-size-sm);
--agala-field-error-color: hsl(var(--agala-danger));
--agala-field-required-color: hsl(var(--agala-danger));

/* Calendar */
--agala-calendar-header-padding: 0.75rem 1rem;
--agala-calendar-header-border: 1px solid hsl(var(--agala-border));
--agala-calendar-title-size: var(--agala-font-size-lg);
--agala-calendar-title-weight: var(--agala-font-weight-semibold);
--agala-calendar-views-gap: 0.25rem;

/* Avatar */
--agala-avatar-radius: 50%;
--agala-avatar-bg: hsl(var(--agala-primary));
--agala-avatar-color: hsl(var(--agala-primary-foreground));
--agala-avatar-border: none;

/* Tag */
--agala-tag-padding: 0.1875rem 0.5rem;
--agala-tag-radius: 99px;
--agala-tag-font-size: 0.6875rem;
--agala-tag-gap: 0.25rem;
--agala-tag-height: 1.5rem;

/* Sidebar */
--agala-sidebar-bg: hsl(var(--agala-card));
--agala-sidebar-border: 1px solid hsl(var(--agala-border));
--agala-sidebar-header-padding: 1rem;
--agala-sidebar-nav-padding: 0.5rem 0.75rem;
--agala-sidebar-footer-padding: 0.75rem;
--agala-sidebar-footer-border: 1px solid hsl(var(--agala-border));

/* Navbar */
--agala-navbar-padding: 0 1rem;
--agala-navbar-height: 3.5rem;
--agala-navbar-bg: hsl(var(--agala-card));
--agala-navbar-border: 1px solid hsl(var(--agala-border));
--agala-navbar-shadow: none;
--agala-navbar-brand-size: var(--agala-font-size-lg);
--agala-navbar-brand-weight: var(--agala-font-weight-semibold);

/* Progress */
--agala-progress-track-bg: hsl(var(--agala-muted));
--agala-progress-bar-radius: 99px;
--agala-progress-linear-height: 0.5rem;
--agala-progress-linear-height-sm: 0.375rem;
--agala-progress-linear-height-lg: 0.75rem;
--agala-progress-circle-stroke-width: 4;

/* EmptyState */
--agala-empty-padding: 2.5rem 1rem;
--agala-empty-gap: 0.75rem;
--agala-empty-icon-size: 2.5rem;
--agala-empty-icon-color: hsl(var(--agala-muted-foreground));
--agala-empty-title-size: var(--agala-font-size-lg);
--agala-empty-title-weight: var(--agala-font-weight-semibold);
--agala-empty-description-size: var(--agala-font-size-sm);
--agala-empty-description-max-width: 24rem;

/* SegmentedControl */
--agala-seg-height: 2.25rem;
--agala-seg-padding: 0 14px;
--agala-seg-border: hsl(var(--agala-border));
--agala-seg-inactive-color: hsl(var(--agala-muted-foreground));
--agala-seg-active-bg: hsl(var(--agala-primary));
--agala-seg-active-color: hsl(var(--agala-primary-foreground));
--agala-seg-font-size-sm: 0.813rem;
--agala-seg-font-size-md: 0.875rem;
--agala-seg-font-size-lg: 1rem;
```

Override any of these in your theme to customize individual components:
```css
html[data-theme="forja"] {
  --agala-btn-radius: 4px;
  --agala-card-shadow: none;
  --agala-input-border: 240 5% 20%;
}
```

### Custom theme (e.g., Forja gym brand)
Create a CSS file and set `data-theme="forja"` on `<html>`:

```css
html[data-theme="forja"] {
  --agala-primary: 12 100% 56%;   /* orange */
  --agala-background: 240 5% 4%;
  --agala-card: 240 4% 8%;
  --agala-font-sans: 'Barlow', system-ui, sans-serif;
  --agala-radius: 4px;
}
```

---

## Component API Reference

### Button
```vue
<AgalaButton variant="default" size="md" :loading="false" :disabled="false" icon>
  Label
</AgalaButton>
```
- `variant`: `default` | `secondary` | `outline` | `ghost` | `danger` | `link`
- `size`: `sm` | `md` | `lg` | `icon`
- `loading`, `disabled`, `block`, `icon`
- `class` prop accepted for overrides

### Input
```vue
<AgalaInput v-model="value" placeholder="…" size="md" type="text" icon-start icon-end error />
```
- `size`: `sm` | `md` | `lg`
- `iconStart`, `iconEnd` (shows search icon)
- `error`, `errorMessage`, `disabled`, `readonly`

### FormField
```vue
<AgalaFormField label="Email" helper="We won't spam." html-for="email" required :error="errorMsg">
  <AgalaInput id="email" v-model="email" />
</AgalaFormField>
```

### Select
```vue
<AgalaSelect :options="[{ value: 'a', label: 'A' }]" v-model="selected" multiple searchable clearable />
```
- `options`: `{ value, label, subtitle?, group?, disabled? }[]`
- `multiple`, `searchable`, `clearable`, `maxSelections`
- `size`: `sm` | `md` | `lg`
- `loading` — disables trigger and shows spinner in dropdown while open
- `onSearch: (query: string) => void` — when provided, disables client-side filtering and fires callback on each keystroke for server-side search. Consumer manages debounce, min chars, and fetch; updates `options` with results
- Dropdown teleports to body to escape modal stacking context
- Uses `useDropdownPosition` with default `width: 'trigger'`

### CreatableSelect
```vue
<CreatableSelect
  v-model="selectedTags"
  :options="[{ value: 'js', label: 'JavaScript' }]"
  id-key="value"
  label-key="label"
  placeholder="Search or create..."
  :creatable="true"
  :debounce="300"
  @create="handleCreate"
  @search="handleSearch"
/>
```
- Multi-select with chips
- Type to filter existing options
- Shows "Crear 'texto'" option when no match and `creatable` is true
- Press Enter to create → emits `@create` with the text (parent assigns ID)
- **Auto-selects on create**: newly created text is automatically added to selected values
- Backspace removes last chip
- `idKey`: property for value (default: `'value'`)
- `labelKey`: property for display (default: `'label'`)
- `debounce`: ms delay for `@search` emit (default: 300)
- `maxDisplayed`: max chips shown before "+N more" (default: 3)
- Uses `useDropdownPosition` with default `width: 'trigger'`

### DatePicker
```vue
<AgalaDatePicker v-model="date" placeholder="Pick a date" size="md" clearable min="2024-01-01" max="2024-12-31" />
```
- Dropdown teleports to body
- Uses `useDropdownPosition` with `width: 'auto'` so calendar expands to `280px` instead of being clipped to trigger width

### ColorPicker
```vue
<AgalaColorPicker v-model="color" size="md" clearable placeholder="Pick a color" />
```
- Popover mode: trigger shows color swatch + hex text + chevron
- Saturation/luminance square + hue slider for visual color selection
- Preset grid: theme semantic tokens (read from CSS at runtime) + curated 24-color palette
- Manual HEX input using the library's Input component (inside popover)
- `v-model` with HEX string (`"#ff6600"`)
- `size`: `sm` | `md` | `lg`
- `clearable`, `error`, `errorMessage`, `disabled`, `placeholder`, `class`
- Popover teleports to body, uses `useDropdownPosition` with `width: 'auto'`
- Zero new dependencies — hand-rolled color math (hex↔rgb↔hsl↔hsb)
- **Edge cases:** Empty state shows checkered swatch + placeholder. Invalid hex shows Input error. Escape reverts to last committed value.

### Calendar
```vue
<Calendar
  v-model:view="calendarView"
  v-model:currentDate="calendarDate"
  :events="events"
  :snap-minutes="30"
  @select="handleEventSelect"
  @day-click="handleDayClick"
  @slot-select="handleSlotSelect"
/>
```
- **Four view modes**: `month` | `week` | `day` | `list`
- `events`: `CalendarEvent[]` with `id`, `title`, `subtitle`, `start` (ISO), `end` (ISO), `allDay?`, `color?`
- `color`: token name (`primary`, `danger`, `success`, `warning`, `secondary`, `accent`) OR arbitrary CSS color string
- `dayStart` / `dayEnd`: visible hour range for week/day views (default `"00:00"` / `"24:00"`)
- `v-model:view`: controls active view
- `v-model:currentDate`: controls focused/visible date
- `snapMinutes`: interval for time-slot snapping (default 30)
- `@select(event)`: clicked an event
- `@day-click(date)`: clicked a day cell (ISO date string)
- `@slot-select({ start, end })`: clicked or dragged on Week/Day time grid to select a time slot (ISO datetimes)
- **Slots**: `#event` (scoped, overrides event rendering), `#empty-day` (custom empty cell content), `#header` (override entire header)
- **Responsive**: month grid adapts cell size, week view scrolls horizontally on mobile, list view uses compact cards
- **Current time**: red indicator line shown in all views
- **Keyboard**: arrow keys navigate month grid, Enter selects, Escape clears focus
- **Slot selection**: click or drag on Week/Day time grid to select time slots. Snaps to `snapMinutes` interval. Visual overlay during drag.

```ts
import type { CalendarEvent, CalendarView } from '@el-agala/ui'

const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: 'Team Standup',
    subtitle: 'Daily sync',
    start: '2024-05-15T09:00:00',
    end: '2024-05-15T09:30:00',
    color: 'primary' // or '#8b5cf6' for arbitrary colors
  },
  {
    id: '2',
    title: 'Holiday',
    start: '2024-05-15T00:00:00',
    end: '2024-05-15T23:59:59',
    allDay: true,
    color: 'danger'
  }
])
```

### Badge
```vue
<AgalaBadge variant="default" size="md" dot>Label</AgalaBadge>
```
- `variant`: `default` | `secondary` | `outline` | `success` | `warning` | `danger`
- `size`: `sm` | `md`
- `dot` for pulse indicator

### Tag
```vue
<AgalaTag label="React" variant="primary" size="md" removable @remove="…" />
```
- `variant`: `default` | `primary` | `secondary` | `success` | `warning` | `danger` | `outline`
- `size`: `sm` | `md`
- `removable`, `disabled`

### Checkbox
```vue
<AgalaCheckbox v-model="checked" label="Accept terms" :indeterminate="true" error />
```

### Toggle
```vue
<AgalaToggle v-model="on" size="md" />
```
- `size`: `sm` | `md` | `lg`

### RadioGroup
```vue
<AgalaRadioGroup :options="[{ value: 'a', label: 'A' }]" v-model="value" orientation="vertical" />
```

### SegmentedControl
```vue
<SegmentedControl
  v-model="selected"
  :options="[
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ]"
  size="md"
/>
```
- `options`: `{ value, label, variant?, disabled? }[]` — required
- `modelValue`: string — v-model
- `size`: `sm` | `md` | `lg` (default `md`, heights and padding match Button: 2rem/2.25rem/2.5rem, padding 0.75rem/1rem/1.5rem)
- `disabled`: boolean — disables entire group
- `variant` per option: `'primary' | 'danger' | 'success' | 'warning' | 'info'` — overrides active state background (`info` maps to `--agala-accent`)
- Keyboard: ArrowLeft/ArrowRight cycle, Home/End jump, roving tabindex (radiogroup ARIA 1.2)
- Disabled options skipped in keyboard nav, rendered at `opacity: 0.4`
- First option left-rounded, last right-rounded, middle square, only-child full pill
- `class` prop accepted

### Textarea
```vue
<AgalaTextarea v-model="text" :rows="3" resize="vertical" />
```
- `resize`: `none` | `vertical` | `horizontal` | `both`

### Table
```vue
<Table
  :columns="[{ key: 'name', label: 'Name', sortable: true }]"
  :rows="[{ name: 'Alice' }]"
  selectable
  v-model:selected-rows="selected"
  v-model:sort-key="sortKey"
  v-model:sort-dir="sortDir"
>
  <template #cell-name="{ row }"><strong>{{ row.name }}</strong></template>
  <template #footer>…</template>
</AgalaTable>
```

### Pagination
```vue
<AgalaPagination v-model="page" :total="120" :page-size="10" :sibling-count="1" show-edges />
```
- **Responsive:** Below 640px, switches to compact mode showing only Prev / "Page X of Y" / Next instead of numbered buttons.

### Tabs
```vue
<AgalaTabs :tabs="[{ value: 'a', label: 'Tab A' }]" v-model="activeTab">
  <template #panel-a>Content</template>
</AgalaTabs>
```
- **Responsive:** Below 640px, tab list becomes horizontally scrollable with hidden scrollbar and edge fade indicators. Active tab auto-scrolls into view.

### Card
```vue
<AgalaCard padding="md" accent="top" accent-color="primary">
  <template #header>Title</template>
  <p>Content</p>
  <template #footer><AgalaButton>Action</AgalaButton></template>
</AgalaCard>
```
- `padding`: `none` | `sm` | `md` | `lg`
- `accent`: `top` | `left` | `right` | `bottom` — position of colored border segment
- `accentColor`: semantic token (`primary`, `secondary`, `muted`, `danger`, `warning`, `success`) or raw CSS color
- Accented side gets 4px solid color, other sides keep 1px default border
- `class` prop for consumer overrides

### Tooltip
```vue
<AgalaTooltip content="Hello" placement="top" :delay="300">
  <AgalaButton>Hover me</AgalaButton>
</AgalaTooltip>
```

### DropdownMenu
```vue
<AgalaDropdownMenu :items="[{ label: 'Edit', icon: 'pencil', onClick: () => {} }]" placement="bottom-start">
  <template #trigger><AgalaButton>Actions</AgalaButton></template>
</AgalaDropdownMenu>
```

### Modal (Declarative)
```vue
<AgalaModal v-model:open="isOpen" title="Title" size="md" :dismissible="true" :escape-closes="true">
  <p>Content</p>
  <template #footer="{ close }">
    <AgalaButton @click="close">Cancel</AgalaButton>
  </template>
</AgalaModal>
```
- `size`: `sm` | `md` | `lg` | `xl` | `full`
- **Responsive:** Below 640px, `sm/md/lg/xl` automatically shrink to `calc(100vw - 2rem)` with reduced padding. `full` unchanged.

### Modal (Imperative)
```vue
<!-- App.vue root -->
<AgalaModalProvider />
```

```ts
import { modalManager } from '@el-agala/ui'

const result = await modalManager.open(MyDialogComponent, {
  props: { message: 'Delete?' },
  title: 'Confirm deletion',
  size: 'sm',
  dismissible: true,
})
if (result.confirmed) { /* … */ }
```

### Toast
```vue
<!-- App.vue root -->
<AgalaToastProvider />
```

```ts
import { toastManager } from '@el-agala/ui'

toastManager.show({
  message: 'Saved!',
  variant: 'success',      // default | success | warning | danger
  duration: 4000,          // ms, 0 = persistent
  action: { label: 'Undo', onClick: () => {} }
})
```

### Drawer
```vue
<AgalaDrawer :open="isOpen" @close="isOpen = false" title="Title" placement="right" size="384px">
  <p>Content</p>
  <template #footer="{ close }">
    <AgalaButton @click="close">Close</AgalaButton>
  </template>
</AgalaDrawer>
```
- `placement`: `left` | `right` | `top` | `bottom`

### FileUpload
```vue
<FileUpload
  v-model="files"
  multiple
  accept="image/*,.pdf"
  :max-size="2 * 1024 * 1024"
  :max-files="5"
  @change="onChange"
  @remove="onRemove"
  @error="onError"
/>
```

### Progress
```vue
<AgalaProgress :value="65" color="primary" size="md" />
<AgalaProgress indeterminate />
<AgalaProgress variant="circular" :value="65" color="success" size="lg" />
```
- `color`: `primary` | `success` | `warning` | `danger`
- `size`: `sm` | `md` | `lg`

### Avatar
```vue
<AgalaAvatar src="https://…" alt="Name" fallback="JD" size="md" />
```
- `size`: `xs` | `sm` | `md` | `lg` | `xl`

### Skeleton
```vue
<AgalaSkeleton variant="line" width="60%" />
<AgalaSkeleton variant="rect" height="6rem" />
<AgalaSkeleton variant="circle" width="2.5rem" height="2.5rem" />
```

### Accordion
```vue
<AgalaAccordion :multiple="true">
  <AgalaAccordionItem value="1" title="Question">Answer</AgalaAccordionItem>
</AgalaAccordion>
```

### Stack / HStack / VStack
```vue
<AgalaVStack gap="1rem">
  <AgalaHStack gap="0.5rem" align="center">
    <span>Item</span>
    <AgalaSpacer />
    <AgalaBadge>Label</AgalaBadge>
  </AgalaHStack>
  <AgalaDivider />
  <p>Content below</p>
</AgalaVStack>
```
- `Stack`: flex container, `direction` (vertical/horizontal), `gap` (any CSS), `align`, `justify`, `wrap`, `as` (tag)
- `HStack`: horizontal stack (same props, no direction)
- `VStack`: vertical stack (same props, no direction)
- `Spacer`: flex spacer, pushes siblings apart (`flex: 1`)
- `Center`: centers children both axes
- `Divider`: separator, `orientation` (horizontal/vertical), `label`, `label-position`

### ListGroup / ListGroupItem
```vue
<AgalaListGroup>
  <AgalaListGroupItem icon="user" label="Profile" subtitle="Edit info" badge="3" @click="..." />
  <AgalaListGroupItem label="Delete" variant="danger" />
</AgalaListGroup>
```
- `ListGroup`: wrapper with border and radius, `gap` prop for spacing between items
- `ListGroupItem`: `label` (required), `subtitle`, `icon` (AgalaIcon name), `badge`, `badgeVariant`, `variant` (default/danger), `disabled`
- Chevron indicator on right when clickable
- Slots: `#leading` (before content, replaces icon), `#default` (replaces label+subtitle), `#trailing` (replaces badge+chevron)
- Emits `click` (disabled items don't emit)

**With gap (separated items):**
```vue
<AgalaListGroup gap="6px">
  <AgalaListGroupItem icon="user" label="Profile" style="border-radius: var(--agala-radius-sm)" />
  <AgalaListGroupItem icon="settings" label="Settings" style="border-radius: var(--agala-radius-sm)" />
</AgalaListGroup>
```

**With slots (custom dot + trailing badge):**
```vue
<AgalaListGroup>
  <AgalaListGroupItem>
    <template #leading>
      <span style="width:8px;height:8px;border-radius:50%;background:hsl(var(--agala-danger));flex-shrink:0" />
    </template>
    <div>
      <strong>Alergias</strong>
      <p style="margin:0;font-size:0.75rem;color:hsl(var(--agala-muted-foreground))">Penicilina, Ibuprofeno</p>
    </div>
    <template #trailing>
      <AgalaBadge variant="danger">2</AgalaBadge>
    </template>
  </AgalaListGroupItem>
</AgalaListGroup>
```

### Alert
```vue
<AgalaAlert variant="info" title="Heads up" dismissible>
  Your session expires in 5 minutes.
</AgalaAlert>

<AgalaAlert variant="success" flat>Changes saved.</AgalaAlert>
```
- `variant`: `info` | `success` | `warning` | `danger`
- `title`: optional bold header text
- Default slot: description/body content
- `dismissible`: shows × button, click removes from DOM (internal `v-if`, no emit)
- `flat`: minimal icon+text mode — no background, no border, no title, compact padding
- Auto-matched icons: info→`info`, success→`check-circle`, warning→`alert-triangle`, danger→`alert-circle`
- `role="alert"`, `aria-atomic="true"`, dismiss button has `aria-label="Dismiss alert"`
- `class` prop for consumer overrides

### Stat
```vue
<AgalaStat label="Members" value="2,841" :trend="12.5" trend-label="vs last month" />
```

### EmptyState
```vue
<AgalaEmptyState title="No data" description="Get started by adding your first item.">
  <template #action><AgalaButton>Add item</AgalaButton></template>
</AgalaEmptyState>
```

### Navbar
```vue
<AgalaNavbar>
  <template #brand>Logo</template>
  <AgalaButton variant="ghost">Link</AgalaButton>
  <template #actions><AgalaButton>Action</AgalaButton></template>
</AgalaNavbar>
```

### Sidebar
```vue
<AgalaSidebar v-model:collapsed="collapsed" v-model:open="sidebarOpen" :responsive="true">
  <template #header>
    <span>Brand</span>
    <AgalaButton @click="collapsed = !collapsed">☰</AgalaButton>
  </template>

  <AgalaSidebarGroup label="Section">
    <AgalaSidebarItem icon="home" label="Dashboard" active />
    <AgalaSidebarItem icon="users" label="Members" badge="248" />
    <AgalaSidebarItem icon="bell" label="Alerts" dot dot-variant="danger" />
  </AgalaSidebarGroup>

  <template #footer>
    <AgalaAvatar fallback="JD" size="sm" />
    <span>Jane Doe</span>
  </template>
</AgalaSidebar>
```
- `SidebarItem`: `icon`, `label`, `active`, `badge`, `badgeVariant`, `dot`, `dotVariant`, `disabled`
- `SidebarGroup`: `label`
- **Responsive behavior (always on, `responsive` prop defaults to `true`):**
  - Desktop (>768px): full width (default 240px), `collapsed` prop controls collapse
  - Tablet (640–768px): auto-collapses to 64px icon-only via CSS. `collapsed` prop ignored. Smooth transition.
  - Mobile (<640px): hidden. Use `v-model:open` to show as a left `Drawer` (280px)
- On mobile, place a `SidebarToggle` in your `Navbar` to control `open`

### SidebarToggle
```vue
<AgalaSidebarToggle :aria-expanded="sidebarOpen" aria-controls="sidebar-id" @click="sidebarOpen = !sidebarOpen" />
```
- Ghost icon button with `panel-left` icon
- `ariaExpanded`, `ariaControls`, `ariaLabel` props
- Emits `click`
- Place inside `Navbar` to toggle mobile sidebar Drawer

### DevEnvBanner
```vue
<AgalaDevEnvBanner text="ATENCIÓN: Esto es un ambiente inestable de desarrollo" />
```
- Simple dismissible warning banner
- Uses warning theme colors
- Close button removes banner from DOM (no parent state needed)
- `text` prop to override default message
- `class` prop for consumer overrides
- Use as sibling of `<AgalaNavbar>` in app layout

---

## Structural Variants

Several components offer `variant` or `layout` props that change DOM structure, not just CSS:

### Stat
```vue
<AgalaStat label="Turnos" value="7" layout="row" icon="calendar" iconBg="primary" />
```
- `layout`: `vertical` (default, card) | `row` (icon + label/value side by side) | `inline` (label: value text pair)
- `icon`, `iconBg`: optional icon with colored circle background (primary/danger/success/warning/info)

### Card
```vue
<AgalaCard header-variant="compact">
  <template #header>Uppercase title</template>
</AgalaCard>
```
- `headerVariant`: `default` | `compact` (smaller padding, uppercase bold muted text)

### Badge
```vue
<AgalaBadge variant="subtle" color="primary">Active</AgalaBadge>
```
- `variant`: `default` | `secondary` | `outline` | `subtle` | `success` | `warning` | `danger`
- `subtle`: light background + colored text, no border (new)

### ListGroup
```vue
<AgalaListGroup variant="cards" gap="4px">
  <AgalaListGroupItem label="Item" radius="sm" />
</AgalaListGroup>
```
- `variant`: `divided` (default, connected items) | `cards` (separated items with individual border/radius/shadow)
- `gap`: spacing between items when variant="cards"

### Tabs
```vue
<AgalaTabs variant="pills" :tabs="tabs" v-model="active" />
```
- `variant`: `underline` (default, bottom-border) | `pills` (filled bg + radius, toolbar style)

### Table
```vue
<AgalaTable variant="clean" :columns="cols" :rows="data" />
```
- `variant`: `default` | `clean` (no outer border, transparent header) | `minimal` (no borders, just row hover)

### Input
```vue
<AgalaInput icon-end="x" icon-end-actionable @icon-end-click="clear" />
```
- `iconEndActionable`: marks the right icon as clickable, emits `icon-end-click`

---

## Composables (Reusable)

Available at `src/lib/composables/`:

### useSelectFilter
Filters options by query text, case-insensitive.
```ts
import { useSelectFilter } from '@el-agala/ui'
// Used internally by Select and CreatableSelect
```

### useChipDisplay
Renders chips from selected values + options.
```ts
import { useChipDisplay } from '@el-agala/ui'
// Used internally by Select and CreatableSelect
```

### useKeyboardNav
Arrow/Enter/Escape/Backspace/Tab/Home/End handlers.
```ts
import { useKeyboardNav } from '@el-agala/ui'
// Used internally by Select and CreatableSelect
```

### useMediaQuery
SSR-safe wrapper around `window.matchMedia` for JS enhancements only.

```ts
import { useMediaQuery } from '@el-agala/ui'

const { matches: isMobile } = useMediaQuery('(max-width: 639px)')
```

**Critical:** Use only for JS enhancements (e.g. scrolling active tab into view). Never use for layout decisions — all layout responsive behavior is CSS-only via `@media` queries.

### useDropdownPosition
Fixed positioning with collision detection (horizontal flip + vertical flip). Uses `position: fixed` to escape overflow containers.

```ts
import { useDropdownPosition } from '@el-agala/ui'

const { dropdownStyle, recompute } = useDropdownPosition(
  triggerRef,
  floatingRef?,   // optional: pass the dropdown ref for two-pass measurement
  { width: 'trigger' } // 'trigger' | 'auto'
)
```

**Parameters:**
- `triggerRef`: `Ref<HTMLElement | undefined>` — the trigger element used for initial position
- `floatingRef?`: `Ref<HTMLElement | null | undefined>` — optional. When provided, enables two-pass collision detection (second pass measures actual dropdown height and flips vertical if overflowing viewport)
- `opts.width`: `'trigger'` (default) — sets `width: ${rect.width}px` on dropdown to match trigger
- `opts.width`: `'auto'` — skips inline width, lets CSS handle it (useful for DatePicker where calendar needs 280px)

**Collision detection (automatic when `floatingRef` is passed):**
- **Horizontal flip:** if dropdown overflows right viewport edge, right-aligns (aligns right edge with trigger's right edge) or shifts left to stay within 8px margin
- **Vertical flip:** on second pass (via `requestAnimationFrame`), if dropdown overflows below viewport, repositions above trigger with 4px gap. If above also overflows, clamps to viewport with 8px margin.

**Usage pattern inside component:**
```ts
const floatingRef = ref<HTMLDivElement>()
const { dropdownStyle, recompute } = useDropdownPosition(triggerRef, floatingRef, { width: 'auto' })

// On open — must wrap recompute() in requestAnimationFrame inside nextTick
// so getBoundingClientRect() reads after browser layout/composite phase
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    requestAnimationFrame(() => recompute())
    searchInputRef.value?.focus({ preventScroll: true })
    window.addEventListener('scroll', closeOnScroll, true)
    window.addEventListener('resize', recompute)
  } else {
    window.removeEventListener('scroll', closeOnScroll, true)
    window.removeEventListener('resize', recompute)
  }
})
```

**Returns:** `{ dropdownStyle: Ref<CSSProperties>, recompute: () => void }`

**Critical rules:**
- Never use `computed()` for `getBoundingClientRect()` — element reference identity is stable, so Vue caches stale coordinates
- Always call `recompute()` imperatively after `nextTick()` + `requestAnimationFrame()`
- Call `recompute()` on `resize` events while dropdown is open
- `position: fixed` teleported to `<body>` is relative to viewport UNLESS an ancestor has `transform`, `perspective`, or `filter`
- Pass `floatingRef` to enable two-pass collision detection. Without it, only first-pass positioning applies (no vertical flip).

### usePopoverBehavior
Shared click-outside + scroll-close + resize-reposition behavior for popover components.

```ts
import { usePopoverBehavior } from '@el-agala/ui'

usePopoverBehavior(isOpen, wrapperRef, floatingRef, () => close(), recompute)
```

**Parameters:**
- `isOpen`: `Ref<boolean>` — controls when listeners are active
- `wrapperRef`: `Ref<HTMLElement | null>` — trigger/wrapper element (click outside target)
- `floatingRef`: `Ref<HTMLElement | null>` — the floating popover element
- `close`: `() => void` — callback to close the popover
- `recompute`: `() => void` — callback to recompute position (from `useDropdownPosition`)

**What it handles:**
- `mousedown` outside both wrapper and floating element → calls `close()`
- `scroll` (capture phase) on any element not inside floating element → calls `close()`
- `resize` on window → calls `recompute()` to reposition

**Usage pattern:**
```ts
const isOpen = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const { dropdownStyle, recompute } = useDropdownPosition(triggerRef)

// All behavior in one line — replaces ~23 lines of manual event wiring
usePopoverBehavior(isOpen, wrapperRef, floatingRef, () => close(), recompute)
```

**Used by:** Select, CreatableSelect, DatePicker, ColorPicker.
- Select/CreatableSelect add a separate `watch(isOpen)` for search input focus
- DatePicker/ColorPicker use it standalone

**Critical:** Must be called in `<script setup>`, not inside callbacks. The composable manages its own `watch(isOpen)` internally — do NOT wrap it in another reactive context.

### useDateUtils
Date formatting and parsing utilities (powered by `date-fns`).

```ts
import {
  parseDate,
  formatISODate,
  formatISODateTime,
  formatTime,
  formatTime24,
  formatDateLabel,
  formatMonthYear,
  formatFullDate,
  isSameDay,
  isToday,
  startOfWeek,
  addDays,
  getMonthGrid,
  getWeekDays,
} from '@el-agala/ui'

// Parse ISO string
const date = parseDate('2024-05-15T09:00:00') // Date | null

// Formatters
formatTime(date)        // "9:00 AM"
formatTime24(date)      // "09:00"
formatDateLabel(date)   // "Monday, May 15"
formatMonthYear(date)   // "May 2024"
formatFullDate(date)    // "May 15, 2024"
formatISODate(date)     // "2024-05-15"

// Utilities
isToday(date)           // boolean
isSameDay(a, b)         // boolean
getWeekDays(date)       // Date[] (7 days starting Sunday)
getMonthGrid(date)      // Date[] (42 days = 6 weeks)
```

---

## Imperative Patterns

### Confirm dialog (one-liner)
```ts
const confirmed = await modalManager.open(ConfirmDialog, {
  props: { message: 'Delete this?' },
  size: 'sm',
}).then(r => r.confirmed)
```

### Toast with action
```ts
toastManager.show({
  message: 'Export ready',
  variant: 'success',
  action: { label: 'Download', onClick: () => download() }
})
```

---

## Styling Conventions

### Scoped CSS in components
```vue
<style scoped>
.myThing {
  color: hsl(var(--agala-primary));
  background: hsl(var(--agala-primary) / 0.1);
  border-radius: var(--agala-radius);
}
</style>
```

### Global overrides
```css
:root {
  --agala-primary: 25 95% 53%; /* rebrand to orange */
}
```

### Dark mode override
```css
@media (prefers-color-scheme: dark) {
  :root {
    --agala-primary: 25 95% 60%;
  }
}
```

---

## Common Gotchas

1. **Icons** — Use `AgalaIcon` with `name` string, NOT slots. Available names: `search`, `mail`, `eye`, `user`, `users`, `flag`, `chevron`, `chevron-left`, `chevron-right`, `chevron-up`, `check`, `x`, `calendar`, `clock`, `refresh`, `minus`, `check-circle`, `alert-triangle`, `alert-circle`, `info`, `more-vertical`, `more-horizontal`, `arrow-up`, `arrow-down`, `trending-up`, `trending-down`, `home`, `bell`, `settings`, `menu`, `panel-left`, `pencil`, `trash`, `plus`, `filter`, `building`, `document`, `credit-card`, `lock`, `sign-out`, `chart-bar`, `archive`, `inbox`, `key`, `spinner`, `grid`, `columns`, `list`.

2. **ModalProvider / ToastProvider** — Must be mounted once at app root. Imperative modals/toasts won't work without them.

3. **Teleports** — Modal, Drawer, Toast, DropdownMenu, Select, DatePicker, ColorPicker, and CreatableSelect all use `<Teleport to="body">`. `--agala-z-dropdown: 1050` > `--agala-z-modal: 1000` ensures dropdowns stack above modal backdrop.

4. **Type imports** — Use `import type { ... }` due to `verbatimModuleSyntax`.

5. **Barrel exports** — Components export as `default`. Named re-exports in `lib/index.ts` use `export { default as Name } from './Component.vue'`.

6. **`class` prop** — Every component accepts `class?: string` for consumer overrides.

7. **No CSS Modules / Tailwind** — Never use utility classes or `:module` styles.

8. **v-model** — Most inputs support `v-model`. For uncontrolled usage, use `:model-value` + `@update:model-value`.

9. **Select in Modals** — Select dropdowns are teleported to body to escape modal overflow clipping. Works out of the box via `useDropdownPosition`.

10. **CreatableSelect ID handling** — Component emits `@create` with text only. Parent is responsible for assigning IDs and pushing to options array. Component auto-selects newly created text.

11. **Select async search** — Pass `:onSearch="fn"` to enable server-side search. When set, internal client-side filtering is disabled — the consumer owns `options` and updates them from the `onSearch` callback. Debounce, minimum query length, and abort logic are the consumer's responsibility.

12. **Dropdown positioning** — Never use `computed()` for `getBoundingClientRect()`. Element ref identity is stable → Vue caches stale coordinates. Use `ref` + imperative `recompute()` after `nextTick()` + `requestAnimationFrame()`.

13. **Dropdown width** — `useDropdownPosition` with `width: 'trigger'` sets inline `width: ${rect.width}px`. For content wider than trigger (DatePicker calendar), use `width: 'auto'` so CSS `width: 280px` applies.

14. **Collision detection** — `useDropdownPosition(triggerRef, floatingRef)` enables automatic collision detection. Horizontal: right-aligns or shifts if overflowing viewport edge (8px margin). Vertical: flips above trigger if insufficient space below. Second pass via `requestAnimationFrame` measures actual dropdown height. No visual flicker — correction happens before paint.

15. **Focus scroll** — When focusing teleported `position: fixed` elements, always use `focus({ preventScroll: true })` to prevent browser auto-scroll.

16. **Containing blocks** — `position: fixed` is relative to viewport UNLESS an ancestor has `transform`, `perspective`, or `filter`. If forja-app or consumer applies these to `<body>`/modal ancestors, dropdown coordinates will be wrong.

17. **Responsive Sidebar** — `Sidebar` is responsive by default (`responsive` prop defaults to `true`). On tablet (640–768px) it auto-collapses to 64px regardless of the `collapsed` prop. On mobile (<640px) it hides completely — use `v-model:open` + `SidebarToggle` to show it as a Drawer.

18. **Responsive layout is CSS-only** — All responsive behavior (Sidebar width, Modal sizing, Tabs scroll, Pagination compact) uses CSS `@media` queries. The `useMediaQuery` composable exists only for JS enhancements like scrolling active tabs into view. Never use it for layout.

19. **Breakpoint tokens** — `--agala-breakpoint-sm: 640px` and `--agala-breakpoint-md: 768px` are exposed as CSS custom properties for documentation/JS reference only. Component media queries hardcode these values; they cannot be consumed via `var()` inside `@media` rules.

20. **Table responsive** — `Table` does not have built-in responsive column hiding. Wrap it in a container with `overflow-x: auto` for horizontal scrolling on mobile, or use custom CSS to hide less important columns.

21. **Calendar event colors** — `color` prop accepts token names (`primary`, `danger`, `success`, `warning`, `secondary`, `accent`) OR arbitrary CSS color strings. Token names apply a subtle transparent background + colored text + left border. Arbitrary colors use `color-mix` for background transparency. The consumer is responsible for contrast in both light and dark modes when using arbitrary colors.

22. **Calendar event times** — `start` and `end` must be ISO 8601 strings (e.g. `2024-05-15T09:00:00`). The component does not handle recurring events or multi-day spanning events in v1. Events must start and end on the same calendar day.

23. **Calendar "+N more"** — In month view, cells show max 3 event indicators. Clicking `+N more` emits `@day-click` with the date so the consumer can switch to day view or open a modal to see all events.

24. **Calendar list view** — Not designed for "available slots" browsing. Pass free time slots as fake `CalendarEvent` objects with `color: 'success'` if you want to use it for booking, but a custom component is usually better for that UX.

---

## File Structure (consumer view)

```
node_modules/@el-agala/ui/
  dist/
    agala-ui.es.js       ← ESM bundle (with CSS import, for bundlers)
    agala-ui.browser.js  ← ESM bundle (no CSS import, for plain HTML)
    index.css            ← Extracted styles
    index.d.ts           ← TypeScript declarations
    reset.css            ← Optional global CSS reset
```

```ts
// Recommended import style
import { Button, Input, ModalProvider, modalManager } from '@el-agala/ui'
import type { ButtonProps, ModalResult } from '@el-agala/ui'
```
