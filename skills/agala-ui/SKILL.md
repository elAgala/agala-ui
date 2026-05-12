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

**Key principles:**
- Scoped CSS in `.vue` SFCs only
- HSL design tokens (`--agala-primary`, etc.) via `tokens.css`
- Dark mode via `@media (prefers-color-scheme: dark)`
- Custom themes via `data-theme="forja"` attribute on `<html>`
- Icon system: internal `AgalaIcon` with `name` string prop (40+ icons, zero icon deps)
- Accessibility: focus rings, ARIA, keyboard nav
- Composables: `useSelectFilter`, `useChipDisplay`, `useKeyboardNav`, `useDropdownPosition`, `useMediaQuery`
- **Responsive by default** — Sidebar, Modal, Tabs, Pagination, and Navbar adapt to mobile/tablet viewports via CSS media queries (no custom CSS needed)
- **ColorPicker** — popover-based with saturation/luminance square, hue slider, presets, manual HEX input

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

**For imperative modals & toasts — add providers once at root:**

```vue
<template>
  <ModalProvider />
  <ToastProvider />
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
<Button variant="default" size="md" :loading="false" :disabled="false" icon>
  Label
</Button>
```
- `variant`: `default` | `secondary` | `outline` | `ghost` | `danger` | `link`
- `size`: `sm` | `md` | `lg` | `icon`
- `loading`, `disabled`, `block`, `icon`
- `class` prop accepted for overrides

### Input
```vue
<Input v-model="value" placeholder="…" size="md" type="text" icon-start icon-end error />
```
- `size`: `sm` | `md` | `lg`
- `iconStart`, `iconEnd` (shows search icon)
- `error`, `errorMessage`, `disabled`, `readonly`

### FormField
```vue
<FormField label="Email" helper="We won't spam." html-for="email" required :error="errorMsg">
  <Input id="email" v-model="email" />
</FormField>
```

### Select
```vue
<Select :options="[{ value: 'a', label: 'A' }]" v-model="selected" multiple searchable clearable />
```
- `options`: `{ value, label, subtitle?, group?, disabled? }[]`
- `multiple`, `searchable`, `clearable`, `maxSelections`
- `size`: `sm` | `md` | `lg`
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
<DatePicker v-model="date" placeholder="Pick a date" size="md" clearable min="2024-01-01" max="2024-12-31" />
```
- Dropdown teleports to body
- Uses `useDropdownPosition` with `width: 'auto'` so calendar expands to `280px` instead of being clipped to trigger width

### ColorPicker
```vue
<ColorPicker v-model="color" size="md" clearable placeholder="Pick a color" />
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
<Badge variant="default" size="md" dot>Label</Badge>
```
- `variant`: `default` | `secondary` | `outline` | `success` | `warning` | `danger`
- `size`: `sm` | `md`
- `dot` for pulse indicator

### Tag
```vue
<Tag label="React" variant="primary" size="md" removable @remove="…" />
```
- `variant`: `default` | `primary` | `secondary` | `success` | `warning` | `danger` | `outline`
- `size`: `sm` | `md`
- `removable`, `disabled`

### Checkbox
```vue
<Checkbox v-model="checked" label="Accept terms" :indeterminate="true" error />
```

### Toggle
```vue
<Toggle v-model="on" size="md" />
```
- `size`: `sm` | `md` | `lg`

### RadioGroup
```vue
<RadioGroup :options="[{ value: 'a', label: 'A' }]" v-model="value" orientation="vertical" />
```

### Textarea
```vue
<Textarea v-model="text" :rows="3" resize="vertical" />
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
</Table>
```

### Pagination
```vue
<Pagination v-model="page" :total="120" :page-size="10" :sibling-count="1" show-edges />
```
- **Responsive:** Below 640px, switches to compact mode showing only Prev / "Page X of Y" / Next instead of numbered buttons.

### Tabs
```vue
<Tabs :tabs="[{ value: 'a', label: 'Tab A' }]" v-model="activeTab">
  <template #panel-a>Content</template>
</Tabs>
```
- **Responsive:** Below 640px, tab list becomes horizontally scrollable with hidden scrollbar and edge fade indicators. Active tab auto-scrolls into view.

### Card
```vue
<Card padding="md" accent="top" accent-color="primary">
  <template #header>Title</template>
  <p>Content</p>
  <template #footer><Button>Action</Button></template>
</Card>
```
- `padding`: `none` | `sm` | `md` | `lg`
- `accent`: `top` | `left` | `right` | `bottom` — position of colored border segment
- `accentColor`: semantic token (`primary`, `secondary`, `muted`, `danger`, `warning`, `success`) or raw CSS color
- Accented side gets 4px solid color, other sides keep 1px default border
- `class` prop for consumer overrides

### Tooltip
```vue
<Tooltip content="Hello" placement="top" :delay="300">
  <Button>Hover me</Button>
</Tooltip>
```

### DropdownMenu
```vue
<DropdownMenu :items="[{ label: 'Edit', icon: 'pencil', onClick: () => {} }]" placement="bottom-start">
  <template #trigger><Button>Actions</Button></template>
</DropdownMenu>
```

### Modal (Declarative)
```vue
<Modal v-model:open="isOpen" title="Title" size="md" :dismissible="true" :escape-closes="true">
  <p>Content</p>
  <template #footer="{ close }">
    <Button @click="close">Cancel</Button>
  </template>
</Modal>
```
- `size`: `sm` | `md` | `lg` | `xl` | `full`
- **Responsive:** Below 640px, `sm/md/lg/xl` automatically shrink to `calc(100vw - 2rem)` with reduced padding. `full` unchanged.

### Modal (Imperative)
```vue
<!-- App.vue root -->
<ModalProvider />
```

```ts
import { modalManager } from '@el-agala/ui'

const result = await modalManager.open(MyDialogComponent, {
  props: { message: 'Delete?' },
  size: 'sm',
  dismissible: true,
})
if (result.confirmed) { /* … */ }
```

### Toast
```vue
<!-- App.vue root -->
<ToastProvider />
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
<Drawer :open="isOpen" @close="isOpen = false" title="Title" placement="right" size="384px">
  <p>Content</p>
  <template #footer="{ close }">
    <Button @click="close">Close</Button>
  </template>
</Drawer>
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
<Progress :value="65" color="primary" size="md" />
<Progress indeterminate />
<Progress variant="circular" :value="65" color="success" size="lg" />
```
- `color`: `primary` | `success` | `warning` | `danger`
- `size`: `sm` | `md` | `lg`

### Avatar
```vue
<Avatar src="https://…" alt="Name" fallback="JD" size="md" />
```
- `size`: `xs` | `sm` | `md` | `lg` | `xl`

### Skeleton
```vue
<Skeleton variant="line" width="60%" />
<Skeleton variant="rect" height="6rem" />
<Skeleton variant="circle" width="2.5rem" height="2.5rem" />
```

### Accordion
```vue
<Accordion :multiple="true">
  <AccordionItem value="1" title="Question">Answer</AccordionItem>
</Accordion>
```

### Stat
```vue
<Stat label="Members" value="2,841" :trend="12.5" trend-label="vs last month" />
```

### EmptyState
```vue
<EmptyState title="No data" description="Get started by adding your first item.">
  <template #action><Button>Add item</Button></template>
</EmptyState>
```

### Navbar
```vue
<Navbar>
  <template #brand>Logo</template>
  <Button variant="ghost">Link</Button>
  <template #actions><Button>Action</Button></template>
</Navbar>
```

### Sidebar
```vue
<Sidebar v-model:collapsed="collapsed" v-model:open="sidebarOpen" :responsive="true">
  <template #header>
    <span>Brand</span>
    <Button @click="collapsed = !collapsed">☰</Button>
  </template>

  <SidebarGroup label="Section">
    <SidebarItem icon="home" label="Dashboard" active />
    <SidebarItem icon="users" label="Members" badge="248" />
    <SidebarItem icon="bell" label="Alerts" dot dot-variant="danger" />
  </SidebarGroup>

  <template #footer>
    <Avatar fallback="JD" size="sm" />
    <span>Jane Doe</span>
  </template>
</Sidebar>
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
<SidebarToggle :aria-expanded="sidebarOpen" aria-controls="sidebar-id" @click="sidebarOpen = !sidebarOpen" />
```
- Ghost icon button with `panel-left` icon
- `ariaExpanded`, `ariaControls`, `ariaLabel` props
- Emits `click`
- Place inside `Navbar` to toggle mobile sidebar Drawer

### DevEnvBanner
```vue
<DevEnvBanner text="ATENCIÓN: Esto es un ambiente inestable de desarrollo" />
```
- Simple dismissible warning banner
- Uses warning theme colors
- Close button removes banner from DOM (no parent state needed)
- `text` prop to override default message
- `class` prop for consumer overrides
- Use as sibling of `<Navbar>` in app layout

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
Fixed positioning with scroll handling (teleports to body).

```ts
import { useDropdownPosition } from '@el-agala/ui'

const { dropdownStyle, recompute } = useDropdownPosition(triggerRef, {
  width: 'trigger' // 'trigger' | 'auto'
})
```

**Options:**
- `width`: `'trigger'` (default) — sets `width: ${rect.width}px` on dropdown to match trigger
- `width`: `'auto'` — skips width, lets CSS handle it (useful for DatePicker where calendar needs 280px)

**Usage pattern inside component:**
```ts
const { dropdownStyle, recompute } = useDropdownPosition(triggerRef, { width: 'auto' })

// On open — must wrap recompute() in requestAnimationFrame inside nextTick
// so getBoundingClientRect() reads after browser layout/composite phase
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    requestAnimationFrame(() => recompute())
    // focus with preventScroll to avoid browser auto-scroll to fixed-position element
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

3. **Teleports** — Modal, Drawer, Toast, DropdownMenu, and Select/DatePicker/CreatableSelect dropdowns use `<Teleport to="body">`. `--agala-z-dropdown: 1050` > `--agala-z-modal: 1000` ensures dropdowns stack above modal backdrop.

4. **Type imports** — Use `import type { ... }` due to `verbatimModuleSyntax`.

5. **Barrel exports** — Components export as `default`. Named re-exports in `lib/index.ts` use `export { default as Name } from './Component.vue'`.

6. **`class` prop** — Every component accepts `class?: string` for consumer overrides.

7. **No CSS Modules / Tailwind** — Never use utility classes or `:module` styles.

8. **v-model** — Most inputs support `v-model`. For uncontrolled usage, use `:model-value` + `@update:model-value`.

9. **Select in Modals** — Select dropdowns are teleported to body to escape modal overflow clipping. Works out of the box via `useDropdownPosition`.

10. **CreatableSelect ID handling** — Component emits `@create` with text only. Parent is responsible for assigning IDs and pushing to options array. Component auto-selects newly created text.

11. **Dropdown positioning** — Never use `computed()` for `getBoundingClientRect()`. Element ref identity is stable → Vue caches stale coordinates. Use `ref` + imperative `recompute()` after `nextTick()` + `requestAnimationFrame()`.

12. **Dropdown width** — `useDropdownPosition` with `width: 'trigger'` sets inline `width: ${rect.width}px`. For content wider than trigger (DatePicker calendar), use `width: 'auto'` so CSS `width: 280px` applies.

13. **Focus scroll** — When focusing teleported `position: fixed` elements, always use `focus({ preventScroll: true })` to prevent browser auto-scroll.

14. **Containing blocks** — `position: fixed` is relative to viewport UNLESS an ancestor has `transform`, `perspective`, or `filter`. If forja-app or consumer applies these to `<body>`/modal ancestors, dropdown coordinates will be wrong.

15. **Responsive Sidebar** — `Sidebar` is responsive by default (`responsive` prop defaults to `true`). On tablet (640–768px) it auto-collapses to 64px regardless of the `collapsed` prop. On mobile (<640px) it hides completely — use `v-model:open` + `SidebarToggle` to show it as a Drawer.

16. **Responsive layout is CSS-only** — All responsive behavior (Sidebar width, Modal sizing, Tabs scroll, Pagination compact) uses CSS `@media` queries. The `useMediaQuery` composable exists only for JS enhancements like scrolling active tabs into view. Never use it for layout.

17. **Breakpoint tokens** — `--agala-breakpoint-sm: 640px` and `--agala-breakpoint-md: 768px` are exposed as CSS custom properties for documentation/JS reference only. Component media queries hardcode these values; they cannot be consumed via `var()` inside `@media` rules.

18. **Table responsive** — `Table` does not have built-in responsive column hiding. Wrap it in a container with `overflow-x: auto` for horizontal scrolling on mobile, or use custom CSS to hide less important columns.

19. **Calendar event colors** — `color` prop accepts token names (`primary`, `danger`, `success`, `warning`, `secondary`, `accent`) OR arbitrary CSS color strings. Token names apply a subtle transparent background + colored text + left border. Arbitrary colors use `color-mix` for background transparency. The consumer is responsible for contrast in both light and dark modes when using arbitrary colors.

20. **Calendar event times** — `start` and `end` must be ISO 8601 strings (e.g. `2024-05-15T09:00:00`). The component does not handle recurring events or multi-day spanning events in v1. Events must start and end on the same calendar day.

21. **Calendar "+N more"** — In month view, cells show max 3 event indicators. Clicking `+N more` emits `@day-click` with the date so the consumer can switch to day view or open a modal to see all events.

22. **Calendar list view** — Not designed for "available slots" browsing. Pass free time slots as fake `CalendarEvent` objects with `color: 'success'` if you want to use it for booking, but a custom component is usually better for that UX.

---

## File Structure (consumer view)

```
node_modules/@el-agala/ui/
  dist/
    agala-ui.es.js     ← ESM bundle (CSS injected)
    index.d.ts         ← TypeScript declarations
    reset.css          ← Optional global CSS reset
```

```ts
// Recommended import style
import { Button, Input, ModalProvider, modalManager } from '@el-agala/ui'
import type { ButtonProps, ModalResult } from '@el-agala/ui'
```
