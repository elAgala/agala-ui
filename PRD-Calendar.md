## Context

The `@el-agala/ui` component library currently has a `DatePicker` for selecting single dates, but no full calendar for viewing and interacting with scheduled events/appointments. Apps built with the library (e.g. gym management, booking systems) need a calendar that displays events across month, week, day, and list views, with color-coded appointments and a current-time indicator.

## Users & JTBD

- **App developers** using `@el-agala/ui` need a declarative Calendar component to render schedules without writing complex date-math and layout logic from scratch.
- **End users** need to view upcoming appointments, see what's happening today, and click events for more detail.

## Success criteria

Calendar component ships with month/week/day/list views, renders events with color coding, shows current-time indicator in all views, and passes build + lint + a11y checks.

## Scope

### In scope
- Four view modes: **Month**, **Week**, **Day**, **List**
- Event display with title, subtitle, start/end time
- **All-day** events and **hour-based** events (minute-level precision)
- Color coding: design-token variants + arbitrary CSS colors
- Current-time indicator in all views
- Responsive layout (full-page widget, collapses gracefully on mobile)
- Event click (`@select`) and day click (`@day-click`) emits
- Optional scoped slots: `#event`, `#empty-day`, `#header`
- Keyboard navigation (arrow keys, Enter to select, Escape)
- View switcher UI (tabs or button group)

### Out of scope
- Drag-and-drop event repositioning
- Event resizing
- Multi-day spanning events
- Built-in event creation/editing form (consumer handles via `@day-click` / `@select`)
- Recurring event logic
- External calendar sync (iCal, Google Calendar)

## Constraints

- Zero runtime dependencies (peer `vue >=3.3.0` only)
- `<style scoped>` SFC, NO CSS Modules, NO Tailwind
- HSL tokens only; dark mode via `@media (prefers-color-scheme: dark)`
- ESM-only build
- Must pass `npm run lint` (0 errors) and `npm run build:lib`
- Accessibility: focus rings, ARIA grid/row/cell roles where applicable, keyboard navigation
- Date math must be locale-aware but not depend on `Intl.DateTimeFormat` polyfills

## Acceptance criteria

- [ ] `Calendar` component renders a month grid with 7 columns, weekday headers, and day cells
- [ ] Month view shows all-day events as colored bars and timed events as colored dots or compact bars
- [ ] Week view shows 7 day columns with hourly time slots; events positioned by start/end time
- [ ] Day view shows a single-column time grid (e.g. 06:00–22:00) with events positioned by time
- [ ] List view shows events in chronological order grouped by date, with relative time labels
- [ ] Today's date is visually distinct in month/week/day views
- [ ] Current time is indicated by a horizontal line (week/day) or highlight (month) or separator (list)
- [ ] Clicking an event emits `@select` with the event object
- [ ] Clicking an empty day cell emits `@day-click` with the ISO date string
- [ ] View can be controlled via `v-model:view` prop
- [ ] Responsive: on mobile (<768px), month view uses compact cells; week view horizontally scrolls or falls back to day view; list view remains usable
- [ ] Event colors support token names (`'primary'`, `'danger'`, `'success'`, `'warning'`, `'secondary'`, `'accent'`) and arbitrary CSS color strings
- [ ] Optional `#event` scoped slot allows consumers to override event rendering
- [ ] Optional `#empty-day` scoped slot allows custom empty-cell content
- [ ] Keyboard: Tab moves focus between days/events; Arrow keys navigate grid; Enter selects; Escape clears focus
- [ ] Build passes (`npm run build:lib`) and lint passes (0 errors)

## Open questions

- Should week view on mobile (<768px) horizontally scroll or auto-switch to day view? → **Decision: horizontal scroll with swipe gesture hint, but consumer can override via `v-model:view`**
- Should the component export helper types (`CalendarEvent`, `CalendarView`) from `src/lib/index.ts`? → **Decision: yes, follow existing barrel pattern**
