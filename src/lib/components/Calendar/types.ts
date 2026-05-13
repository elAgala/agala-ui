export type CalendarView = 'month' | 'week' | 'day' | 'list'

export interface CalendarEvent {
  id: string
  title: string
  subtitle?: string
  start: string // ISO 8601 datetime, e.g. "2024-01-15T09:30:00"
  end: string   // ISO 8601 datetime
  allDay?: boolean
  color?: string // token name ('primary'|'danger'|'success'|'warning'|'secondary'|'accent') or CSS color
}

export interface SlotSelectPayload {
  start: string // ISO 8601 datetime
  end: string   // ISO 8601 datetime
}

export interface CalendarProps {
  events?: CalendarEvent[]
  view?: CalendarView
  currentDate?: string // ISO date, e.g. "2024-01-15"
  dayStart?: string    // "HH:MM", default "00:00"
  dayEnd?: string      // "HH:MM", default "24:00"
  snapMinutes?: number // default 30
  availableViews?: CalendarView[]
  hideHeader?: boolean
  class?: string
}

export interface CalendarEmits {
  'update:view': [view: CalendarView]
  'update:currentDate': [date: string]
  select: [event: CalendarEvent]
  'day-click': [date: string] // ISO date
  'slot-select': [payload: SlotSelectPayload]
}
