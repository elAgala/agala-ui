## Context

The Calendar component currently displays events but does not allow users to interactively select time slots on the grid. In scheduling/booking UIs (e.g. gym appointments, doctor visits), users need to click or drag on empty time areas to indicate "I want a slot here." This is table-stakes behavior in calendars like Google Calendar, Outlook, and FullCalendar.

## Users & JTBD

- **App developers** building booking/scheduling interfaces need the Calendar to emit precise time ranges when users interact with the grid.
- **End users** need to visually select time slots by clicking or dragging on the calendar, even when events already exist in that area.

## Success criteria

Clicking or dragging on the Week/Day time grid emits a start/end time range. Month view day cells continue to emit `@day-click`. The interaction feels native and responsive.

## Scope

### In scope
- **Click-to-select** on Week/Day time grid: click any empty area → emits start/end snapped to interval
- **Drag-to-select-range** on Week/Day time grid: drag across multiple time slots → emits start/end on mouseup
- **Configurable snap interval** via `snapMinutes` prop (default 30)
- **Visual selection overlay** during drag (semi-transparent highlight)
- **Teams-like collision handling**: even when events exist, clicking the background gap between/overlapping events still triggers slot selection (not event selection)
- **Month view**: no changes — `@day-click` already satisfies "I clicked this day"
- **Keyboard**: Escape cancels active drag/selection

### Out of scope
- Persistent selection state (no `v-model:selection`)
- Multi-day range selection
- Touch gestures (swipe, pinch)
- Resizing existing events via drag
- Creating events inline (consumer handles via `@slot-select`)
- Snap visualization (grid lines already show hours)

## Constraints

- Zero runtime dependencies (peer `vue >=3.3.0` only) — existing constraint
- `<style scoped>` SFC, NO CSS Modules, NO Tailwind
- HSL tokens only
- Must work with existing event overlap positioning (events are `position: absolute`)
- Must not break existing `@select` (event click) or `@day-click` behavior
- Accessibility: selection overlay must not trap focus or interfere with screen readers

## Acceptance criteria

- [ ] Calendar shell accepts new optional prop `snapMinutes?: number` (default 30)
- [ ] Calendar shell emits new event `@slot-select` with payload `{ start: string, end: string }` (ISO datetimes)
- [ ] Day view: clicking on empty time grid area emits `@slot-select` with snapped 30-min range
- [ ] Day view: dragging from one time to another emits `@slot-select` with snapped range on mouseup
- [ ] Week view: same click/drag behavior per day column
- [ ] Selection overlay appears during drag with `--agala-primary` at 15% opacity
- [ ] Clicking directly on an existing event still emits `@select` (event click) — unchanged
- [ ] Clicking in the background gap/right edge near an event emits `@slot-select` (not `@select`)
- [ ] Month view unchanged — `@day-click` continues to emit ISO date on day cell click
- [ ] Escape key during drag cancels selection and removes overlay
- [ ] Build passes (`npm run build:lib`) and lint passes (0 errors)
- [ ] Skill file updated with `@slot-select` documentation

## Open questions

- Should the selection overlay use `pointer-events: none` so it doesn't block hover on events underneath? → **Decision: yes, overlay is decorative only**
- Should we expose a CSS custom property for selection color so consumers can theme it? → **Decision: use `--agala-primary` at 15% opacity, consistent with event hover states**
- What if drag starts on an event but ends on empty space? → **Decision: if mousedown target is an event, emit `@select`. Only emit `@slot-select` if mousedown target is grid background.**
