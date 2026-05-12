import {
  format,
  parseISO as dfnsParseISO,
  isSameDay as dfnsIsSameDay,
  startOfWeek as dfnsStartOfWeek,
  addDays as dfnsAddDays,
  isToday as dfnsIsToday,
} from 'date-fns'

/** Parse an ISO date/datetime string to a Date object */
export function parseDate(iso: string): Date | null {
  try {
    const d = dfnsParseISO(iso)
    if (isNaN(d.getTime())) return null
    return d
  } catch {
    return null
  }
}

/** Format a Date as ISO date string (YYYY-MM-DD) */
export function formatISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** Format a Date as ISO datetime string (YYYY-MM-DDTHH:MM:SS) */
export function formatISODateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}

/** Format time as "9:30 AM" */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a')
}

/** Format time as "09:30" */
export function formatTime24(date: Date): string {
  return format(date, 'HH:mm')
}

/** Format date as "Monday, Jan 15" */
export function formatDateLabel(date: Date): string {
  return format(date, 'EEEE, MMM d')
}

/** Format date as "January 2024" */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy')
}

/** Format date as "January 15, 2024" */
export function formatFullDate(date: Date): string {
  return format(date, 'MMMM d, yyyy')
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return dfnsIsSameDay(a, b)
}

/** Check if date is today */
export function isToday(date: Date): boolean {
  return dfnsIsToday(date)
}

/** Get Sunday of the week containing date */
export function startOfWeek(date: Date): Date {
  return dfnsStartOfWeek(date, { weekStartsOn: 0 })
}

/** Add days to a date */
export function addDays(date: Date, days: number): Date {
  return dfnsAddDays(date, days)
}

/** Get array of dates for a month grid (42 days = 6 weeks) */
export function getMonthGrid(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startDay = firstOfMonth.getDay()

  const days: Date[] = []
  const prevMonthDays = new Date(year, month, 0).getDate()

  for (let i = startDay - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i))
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
}

/** Get array of 7 dates for the week containing date */
export function getWeekDays(date: Date): Date[] {
  const sunday = startOfWeek(date)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    days.push(addDays(sunday, i))
  }
  return days
}
