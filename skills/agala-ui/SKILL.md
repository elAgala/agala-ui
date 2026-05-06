---
name: agala-ui
description: >
  Expert knowledge of @el-agala/ui — a zero-dependency Vue 3 component library
  with 25+ components, HSL design tokens, theming, and accessibility.
  Use when building UI with Agala components, theming, or referencing the design system.
---

# Agala UI — Complete Component Reference

## Overview

`@el-agala/ui` is a **zero-dependency** Vue 3 component library (peer-dep: `vue >=3.3.0`). It ships as a single ESM bundle with CSS injected. All components use `<style scoped>` with HSL design tokens. No Tailwind, no CSS Modules.

**Key principles:**
- Scoped CSS in `.vue` SFCs only
- HSL design tokens (`--agala-primary`, etc.) via `tokens.css`
- Dark mode via `prefers-color-scheme: dark`
- Custom themes via `data-theme="forja"` attribute on `<html>`
- Icon system: internal `AgalaIcon` with `name` string prop (40+ icons, zero icon deps)
- Accessibility: focus rings, ARIA, keyboard nav

---

## Installation

```bash
npm install @el-agala/ui vue
```

**Setup in `main.ts`:**

```ts
import { createApp } from 'vue'
import App from './App.vue'

// CSS is auto-injected by the build, but for SSR or Vite optimization you may import explicitly:
// import '@el-agala/ui/dist/index.css'

createApp(App).mount('#app')
```

**For imperative modals & toasts — add providers once at root:**

```vue
<!-- App.vue -->
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

### DatePicker
```vue
<DatePicker v-model="date" placeholder="Pick a date" size="md" clearable min="2024-01-01" max="2024-12-31" />
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

### Tabs
```vue
<Tabs :tabs="[{ value: 'a', label: 'Tab A' }]" v-model="activeTab">
  <template #panel-a>Content</template>
</Tabs>
```

### Card
```vue
<Card padding="md">
  <template #header>Title</template>
  <p>Content</p>
  <template #footer><Button>Action</Button></template>
</Card>
```

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
<Sidebar v-model:collapsed="collapsed">
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

1. **Icons** — Use `AgalaIcon` with `name` string, NOT slots. Available names: `search`, `mail`, `eye`, `user`, `users`, `flag`, `chevron`, `chevron-left`, `chevron-right`, `chevron-up`, `check`, `x`, `calendar`, `clock`, `refresh`, `minus`, `check-circle`, `alert-triangle`, `alert-circle`, `info`, `more-vertical`, `more-horizontal`, `arrow-up`, `arrow-down`, `trending-up`, `trending-down`, `home`, `bell`, `settings`, `menu`, `panel-left`, `pencil`, `trash`, `plus`, `filter`, `building`, `document`, `credit-card`, `lock`, `sign-out`, `chart-bar`, `archive`, `inbox`, `key`, `spinner`.

2. **ModalProvider / ToastProvider** — Must be mounted once at app root. Imperative modals/toasts won't work without them.

3. **Teleports** — Modal, Drawer, Toast, and DropdownMenu use `<Teleport to="body">`. No z-index issues.

4. **Type imports** — Use `import type { ... }` due to `verbatimModuleSyntax`.

5. **Barrel exports** — Components export as `default`. Named re-exports in `lib/index.ts` use `export { default as Name } from './Component.vue'`.

6. **`class` prop** — Every component accepts `class?: string` for consumer overrides.

7. **No CSS Modules / Tailwind** — Never use utility classes or `:module` styles.

8. **v-model** — Most inputs support `v-model`. For uncontrolled usage, use `:model-value` + `@update:model-value`.

---

## File Structure (consumer view)

```
node_modules/@el-agala/ui/
  dist/
    agala-ui.es.js     ← ESM bundle (CSS injected)
    index.d.ts         ← TypeScript declarations
```

```ts
// Recommended import style
import { Button, Input, ModalProvider, modalManager } from '@el-agala/ui'
import type { ButtonProps, ModalResult } from '@el-agala/ui'
```
