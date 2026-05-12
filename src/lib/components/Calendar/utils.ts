import type { CalendarEvent } from './types'
import { parseDate, formatISODate, formatTime, isSameDay } from '../../composables/useDateUtils'

// Re-export date utils for convenience
export { parseDate as parseISO, formatISODate as toISODate, formatTime as formatTimeLabel, isSameDay }

export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(':').map(Number)
  return { hours: h || 0, minutes: m || 0 }
}

export function minutesFromMidnight(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr)
  return hours * 60 + minutes
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function getHoursRange(dayStart: string, dayEnd: string): number[] {
  const start = parseTime(dayStart)
  const end = parseTime(dayEnd)
  const hours: number[] = []

  for (let h = start.hours; h < end.hours; h++) {
    hours.push(h)
  }

  return hours
}

export function getDayEvents(events: CalendarEvent[], date: string): CalendarEvent[] {
  const dayStart = parseDate(`${date}T00:00:00`)
  const dayEnd = parseDate(`${date}T23:59:59`)
  if (!dayStart || !dayEnd) return []

  return events.filter(event => {
    const eventStart = parseDate(event.start)
    const eventEnd = parseDate(event.end)
    if (!eventStart || !eventEnd) return false
    return eventStart <= dayEnd && eventEnd >= dayStart
  })
}

export function toISODateTime(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`
}

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

export function getWeekDays(date: Date): Date[] {
  const sunday = startOfWeek(date)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    days.push(addDays(sunday, i))
  }
  return days
}

export function getEventPosition(
  event: CalendarEvent,
  dayStart: string,
  dayEnd: string,
  hourHeight: number,
): { top: number; height: number } | null {
  const start = parseDate(event.start)
  const end = parseDate(event.end)
  if (!start || !end) return null

  const dayStartMins = minutesFromMidnight(dayStart)
  const dayEndMins = minutesFromMidnight(dayEnd)
  const eventStartMins = start.getHours() * 60 + start.getMinutes()
  const eventEndMins = end.getHours() * 60 + end.getMinutes()

  // Event is completely outside visible range
  if (eventEndMins <= dayStartMins || eventStartMins >= dayEndMins) {
    return null
  }

  const visibleStartMins = Math.max(eventStartMins, dayStartMins)
  const visibleEndMins = Math.min(eventEndMins, dayEndMins)

  const top = (visibleStartMins - dayStartMins) * (hourHeight / 60)
  const height = Math.max((visibleEndMins - visibleStartMins) * (hourHeight / 60), 20)

  return { top, height }
}

export function detectOverlap(
  events: CalendarEvent[],
  date: string,
): Array<{ event: CalendarEvent; column: number; totalColumns: number }> {
  const dayEvents = getDayEvents(events, date)
  if (dayEvents.length === 0) return []

  // Sort by start time
  const parsed = dayEvents
    .map(event => {
      const start = parseDate(event.start)
      const end = parseDate(event.end)
      if (!start || !end) return null
      const startMins = start.getHours() * 60 + start.getMinutes()
      const endMins = end.getHours() * 60 + end.getMinutes()
      return { event, startMins, endMins }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.startMins - b.startMins)

  if (parsed.length === 0) return []

  // Group overlapping events into clusters
  const clusters: Array<typeof parsed> = []
  let currentCluster: typeof parsed = [parsed[0]]
  let clusterEnd = parsed[0].endMins

  for (let i = 1; i < parsed.length; i++) {
    const item = parsed[i]
    if (item.startMins < clusterEnd) {
      // Overlaps with current cluster
      currentCluster.push(item)
      clusterEnd = Math.max(clusterEnd, item.endMins)
    } else {
      // New cluster
      clusters.push(currentCluster)
      currentCluster = [item]
      clusterEnd = item.endMins
    }
  }
  clusters.push(currentCluster)

  // Assign columns within each cluster
  const result: Array<{ event: CalendarEvent; column: number; totalColumns: number }> = []

  for (const cluster of clusters) {
    const columns: number[] = [] // end time of each column

    for (const item of cluster) {
      // Find first column that doesn't overlap
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        if (columns[i] <= item.startMins) {
          columns[i] = item.endMins
          result.push({ event: item.event, column: i, totalColumns: columns.length })
          placed = true
          break
        }
      }

      if (!placed) {
        columns.push(item.endMins)
        result.push({ event: item.event, column: columns.length - 1, totalColumns: columns.length })
      }
    }

    // Update totalColumns for all items in this cluster
    const totalColumns = columns.length
    for (let i = result.length - cluster.length; i < result.length; i++) {
      result[i].totalColumns = totalColumns
    }
  }

  return result
}

/** Format event time range like "9:00 AM – 10:30 AM" */
export function formatEventTimeRange(event: CalendarEvent): string {
  const start = parseDate(event.start)
  const end = parseDate(event.end)
  if (!start || !end) return ''

  if (event.allDay) return 'All day'

  return `${formatTime(start)} – ${formatTime(end)}`
}

/** Format a short time label for events in month view */
export function formatEventTime(event: CalendarEvent): string {
  const start = parseDate(event.start)
  if (!start) return ''
  return formatTime(start)
}

/** Snap minutes to nearest interval boundary */
export function snapToInterval(minutes: number, interval: number): number {
  if (interval <= 0) return minutes
  return Math.floor(minutes / interval) * interval
}

/** Convert total minutes to HH:MM string */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
