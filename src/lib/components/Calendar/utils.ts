import type { CalendarEvent } from './types'

export function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(':').map(Number)
  return { hours: h || 0, minutes: m || 0 }
}

export function minutesFromMidnight(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr)
  return hours * 60 + minutes
}

export function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
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

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
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
  const dayStart = parseISO(`${date}T00:00:00`)
  const dayEnd = parseISO(`${date}T23:59:59`)
  if (!dayStart || !dayEnd) return []

  return events.filter(event => {
    const eventStart = parseISO(event.start)
    const eventEnd = parseISO(event.end)
    if (!eventStart || !eventEnd) return false
    return eventStart <= dayEnd && eventEnd >= dayStart
  })
}

export function parseISO(iso: string): Date | null {
  const [datePart, timePart] = iso.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  if (!y || !m || !d) return null

  let hours = 0
  let minutes = 0
  let seconds = 0

  if (timePart) {
    const cleanTime = timePart.replace('Z', '').split('.')[0]
    const [h, min, s] = cleanTime.split(':').map(Number)
    if (h !== undefined && min !== undefined) {
      hours = h
      minutes = min
      seconds = s || 0
    }
  }

  const date = new Date(y, m - 1, d, hours, minutes, seconds)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

export function toISODate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
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
  const start = parseISO(event.start)
  const end = parseISO(event.end)
  if (!start || !end) return null

  const dayStartMins = minutesFromMidnight(dayStart)
  const dayEndMins = minutesFromMidnight(dayEnd)
  const eventStartMins = start.getHours() * 60 + start.getMinutes()
  const eventEndMins = end.getHours() * 60 + end.getMinutes()

  if (eventEndMins <= dayStartMins || eventStartMins >= dayEndMins) {
    return null
  }

  const visibleStartMins = Math.max(eventStartMins, dayStartMins)
  const visibleEndMins = Math.min(eventEndMins, dayEndMins)

  const top = (visibleStartMins - dayStartMins) * (hourHeight / 60)
  const height = (visibleEndMins - visibleStartMins) * (hourHeight / 60)

  return { top, height }
}

export function detectOverlap(
  events: CalendarEvent[],
  date: string,
): Array<{ event: CalendarEvent; column: number; totalColumns: number }> {
  const dayEvents = getDayEvents(events, date)

  const parsed = dayEvents
    .map(event => {
      const start = parseISO(event.start)
      const end = parseISO(event.end)
      if (!start || !end) return null
      const startMins = start.getHours() * 60 + start.getMinutes()
      const endMins = end.getHours() * 60 + end.getMinutes()
      return { event, startMins, endMins }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (parsed.length === 0) return []

  // Build overlap adjacency (including self)
  const adj = parsed.map((a, i) =>
    parsed.reduce<Set<number>>((set, b, j) => {
      if (i === j || (a.startMins < b.endMins && b.startMins < a.endMins)) {
        set.add(j)
      }
      return set
    }, new Set()),
  )

  // Merge connected components
  let components = adj
  let changed = true
  while (changed) {
    changed = false
    const merged: Array<Set<number>> = []

    for (const comp of components) {
      const target = merged.find(m =>
        Array.from(comp).some(idx => m.has(idx)),
      )
      if (target) {
        comp.forEach(idx => target.add(idx))
        changed = true
      } else {
        merged.push(new Set(comp))
      }
    }
    components = merged
  }

  // Assign columns greedily within each cluster
  const result: Array<{ event: CalendarEvent; column: number; totalColumns: number }> = []

  for (const component of components) {
    const cluster = Array.from(component)
      .map(idx => parsed[idx])
      .sort((a, b) => a.startMins - b.startMins)

    const columnEndTimes: number[] = []
    const clusterResult: Array<{ event: CalendarEvent; column: number; totalColumns: number }> = []

    for (const item of cluster) {
      const availableCol = columnEndTimes.findIndex(end => end <= item.startMins)
      if (availableCol !== -1) {
        columnEndTimes[availableCol] = item.endMins
        clusterResult.push({ event: item.event, column: availableCol, totalColumns: 0 })
      } else {
        columnEndTimes.push(item.endMins)
        clusterResult.push({ event: item.event, column: columnEndTimes.length - 1, totalColumns: 0 })
      }
    }

    const totalColumns = columnEndTimes.length
    clusterResult.forEach(item => { item.totalColumns = totalColumns })
    result.push(...clusterResult)
  }

  return result
}
