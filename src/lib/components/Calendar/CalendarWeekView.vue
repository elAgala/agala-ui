<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { CalendarEvent } from './types'
import {
  getWeekDays,
  getDayEvents,
  getEventPosition,
  detectOverlap,
  getHoursRange,
  isSameDay,
  toISODate,
  formatTimeLabel,
  parseISO,
  parseTime,
} from './utils'

const props = withDefaults(defineProps<{
  events: CalendarEvent[]
  currentDate: string
  dayStart?: string
  dayEnd?: string
}>(), {
  dayStart: '00:00',
  dayEnd: '24:00',
})

const emit = defineEmits<{
  select: [event: CalendarEvent]
  'day-click': [date: string]
}>()

/* ─── Responsive hour height ─── */
const hourHeight = ref(48)

function updateHourHeight() {
  if (typeof window === 'undefined') return
  if (window.innerWidth < 768) {
    hourHeight.value = 40
  } else if (window.innerWidth < 1024) {
    hourHeight.value = 44
  } else {
    hourHeight.value = 48
  }
}

onMounted(() => {
  updateHourHeight()
  window.addEventListener('resize', updateHourHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHourHeight)
})

/* ─── Week days ─── */
const weekDays = computed(() => {
  const date = parseISO(`${props.currentDate}T00:00:00`)
  if (!date) return []
  return getWeekDays(date)
})

/* ─── Hours ─── */
const hours = computed(() => getHoursRange(props.dayStart, props.dayEnd))

/* ─── Current time ─── */
const now = ref(new Date())
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timeInterval = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

const currentTimeData = computed(() => {
  const dayIndex = weekDays.value.findIndex(day => isSameDay(day, now.value))
  if (dayIndex === -1) return null

  const start = parseTime(props.dayStart)
  const end = parseTime(props.dayEnd)
  const dayStartMins = start.hours * 60 + start.minutes
  const dayEndMins = end.hours * 60 + end.minutes
  const currentMins = now.value.getHours() * 60 + now.value.getMinutes()

  if (currentMins < dayStartMins || currentMins >= dayEndMins) return null

  return {
    top: (currentMins - dayStartMins) * (hourHeight.value / 60),
    dayIndex,
  }
})

/* ─── All-day events ─── */
const allDayEventsByDay = computed(() => {
  return weekDays.value.map(day => {
    const dateStr = toISODate(day)
    return getDayEvents(props.events, dateStr).filter(e => e.allDay)
  })
})

/* ─── Timed events ─── */
const timedEventsList = computed(() => props.events.filter(e => !e.allDay))

const timedEventsByDay = computed(() => {
  return weekDays.value.map(day => {
    const dateStr = toISODate(day)
    const overlapInfo = detectOverlap(
      timedEventsList.value,
      dateStr,
    )

    return overlapInfo
      .map(({ event, column, totalColumns }) => {
        const position = getEventPosition(
          event,
          props.dayStart,
          props.dayEnd,
          hourHeight.value,
        )
        if (!position) return null

        const start = parseISO(event.start)
        const end = parseISO(event.end)
        const duration = start && end
          ? (end.getTime() - start.getTime()) / 60000
          : 0

        return {
          event,
          ...position,
          column,
          totalColumns,
          isShort: duration < 30,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  })
})

/* ─── Helpers ─── */
const tokenColors = ['primary', 'danger', 'success', 'warning', 'secondary', 'accent']

function getEventClasses(event: CalendarEvent, isShort: boolean): string[] {
  const classes = ['event']
  if (event.color && tokenColors.includes(event.color)) {
    classes.push(
      `event${event.color.charAt(0).toUpperCase() + event.color.slice(1)}`,
    )
  }
  if (isShort) classes.push('eventShort')
  return classes
}

function getEventStyle(
  event: CalendarEvent,
  top: number,
  height: number,
  column: number,
  totalColumns: number,
): Record<string, string> {
  const style: Record<string, string> = {
    top: `${top}px`,
    height: `${Math.max(height, 20)}px`,
    left: `${(column / totalColumns) * 100 + 0.5}%`,
    width: `${(1 / totalColumns) * 100 - 1}%`,
  }
  if (event.color && !tokenColors.includes(event.color)) {
    style.backgroundColor = `${event.color}20`
    style.color = event.color
    style.borderLeft = `3px solid ${event.color}`
  }
  return style
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
  })
}

function formatHourLabel(hour: number): string {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  return formatTimeLabel(d)
}

function handleDayClick(day: Date) {
  emit('day-click', toISODate(day))
}

function handleEventClick(event: CalendarEvent, e: MouseEvent) {
  e.stopPropagation()
  emit('select', event)
}

function getAllDayEventClasses(event: CalendarEvent): string[] {
  const classes = ['allDayEvent']
  if (event.color && tokenColors.includes(event.color)) {
    classes.push(
      `event${event.color.charAt(0).toUpperCase() + event.color.slice(1)}`,
    )
  }
  return classes
}

function getAllDayEventStyle(event: CalendarEvent): Record<string, string> | undefined {
  if (event.color && !tokenColors.includes(event.color)) {
    return {
      backgroundColor: `${event.color}20`,
      color: event.color,
      borderLeft: `3px solid ${event.color}`,
    }
  }
  return undefined
}
</script>

<template>
  <div class="weekView" role="region">
    <div class="scrollWrapper">
      <!-- Time axis column -->
      <div class="timeAxisCol">
        <div class="corner"></div>
        <div class="allDayLabel"></div>
        <div class="hourLabels">
          <div
            v-for="hour in hours"
            :key="hour"
            class="hourLabel"
          >
            {{ formatHourLabel(hour) }}
          </div>
          <div
            v-if="currentTimeData"
            class="currentTimeDot"
            :style="{ top: `${currentTimeData.top}px` }"
          />
        </div>
      </div>

      <!-- Day columns -->
      <div
        v-for="(day, dayIndex) in weekDays"
        :key="toISODate(day)"
        class="dayCol"
        :class="{ dayColToday: isSameDay(day, now) }"
      >
        <div class="dayHeader">
          {{ formatDayHeader(day) }}
        </div>

        <div class="allDayCell">
          <button
            v-for="event in allDayEventsByDay[dayIndex]"
            :key="event.id"
            type="button"
            class="allDayEvent"
            :class="getAllDayEventClasses(event)"
            :style="getAllDayEventStyle(event)"
            tabindex="0"
            @click="handleEventClick(event, $event)"
          >
            {{ event.title }}
          </button>
        </div>

        <div
          class="dayGrid"
          :style="{ minHeight: `${hours.length * hourHeight}px` }"
          @click="handleDayClick(day)"
        >
          <div
            v-for="hour in hours"
            :key="hour"
            class="hourRow"
          />

          <button
            v-for="eventInfo in timedEventsByDay[dayIndex]"
            :key="eventInfo.event.id"
            type="button"
            class="event"
            :class="getEventClasses(eventInfo.event, eventInfo.isShort)"
            :style="getEventStyle(
              eventInfo.event,
              eventInfo.top,
              eventInfo.height,
              eventInfo.column,
              eventInfo.totalColumns,
            )"
            tabindex="0"
            @click="handleEventClick(eventInfo.event, $event)"
          >
            <span class="eventTitle">{{ eventInfo.event.title }}</span>
            <span
              v-if="eventInfo.event.subtitle && !eventInfo.isShort"
              class="eventSubtitle"
            >
              {{ eventInfo.event.subtitle }}
            </span>
          </button>

          <div
            v-if="currentTimeData && currentTimeData.dayIndex === dayIndex"
            class="currentTimeLine"
            :style="{ top: `${currentTimeData.top}px` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weekView {
  font-family: var(--agala-font-sans);
  color: hsl(var(--agala-foreground));
  background: hsl(var(--agala-background));
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: var(--agala-radius);
  overflow: hidden;
}

.scrollWrapper {
  display: flex;
  overflow-x: auto;
}

/* ─── Time axis column ─── */
.timeAxisCol {
  width: 3.5rem;
  flex-shrink: 0;
  position: sticky;
  left: 0;
  z-index: 3;
  background: hsl(var(--agala-background));
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
}

.corner {
  height: 2.5rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  position: sticky;
  top: 0;
  background: hsl(var(--agala-background));
  z-index: 4;
}

.allDayLabel {
  min-height: 2.5rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  position: sticky;
  top: 2.5rem;
  background: hsl(var(--agala-background));
  z-index: 4;
}

.hourLabels {
  position: relative;
}

.hourLabel {
  height: 3rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-muted-foreground));
  box-sizing: border-box;
}

/* ─── Day columns ─── */
.dayCol {
  flex: 1;
  min-width: 7.5rem;
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
  display: flex;
  flex-direction: column;
}

.dayCol:last-child {
  border-right: none;
}

.dayHeader {
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  background: hsl(var(--agala-muted) / 0.3);
  position: sticky;
  top: 0;
  z-index: 2;
}

.dayColToday .dayHeader {
  background: hsl(var(--agala-primary) / 0.1);
  color: hsl(var(--agala-primary));
  font-weight: var(--agala-font-weight-semibold);
}

.allDayCell {
  min-height: 2.5rem;
  max-height: 5rem;
  overflow-y: auto;
  padding: 0.25rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  position: sticky;
  top: 2.5rem;
  background: hsl(var(--agala-background));
  z-index: 2;
}

.dayGrid {
  flex: 1;
  position: relative;
}

.hourRow {
  height: 3rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border) / 0.4);
  box-sizing: border-box;
}

/* ─── Events ─── */
.event {
  position: absolute;
  border: none;
  border-radius: var(--agala-radius-sm);
  padding: 0.125rem 0.25rem;
  font-size: var(--agala-font-size-sm);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  z-index: 1;
}

.event:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

.eventTitle {
  font-weight: var(--agala-font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
}

.eventSubtitle {
  font-size: var(--agala-font-size-sm);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
}

.eventShort {
  font-size: 0;
  padding: 0;
  min-height: 2px;
  border-radius: 1px;
}

.eventShort .eventTitle,
.eventShort .eventSubtitle {
  display: none;
}

/* ─── All-day event chips ─── */
.allDayEvent {
  border: none;
  border-radius: var(--agala-radius-sm);
  padding: 0.125rem 0.25rem;
  font-size: var(--agala-font-size-sm);
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 100%;
}

.allDayEvent:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

/* ─── Token color classes ─── */
.eventPrimary {
  background-color: hsl(var(--agala-primary) / 0.12);
  color: hsl(var(--agala-primary));
  border-left: 3px solid hsl(var(--agala-primary));
}

.eventDanger {
  background-color: hsl(var(--agala-danger) / 0.12);
  color: hsl(var(--agala-danger));
  border-left: 3px solid hsl(var(--agala-danger));
}

.eventSuccess {
  background-color: hsl(var(--agala-success) / 0.12);
  color: hsl(var(--agala-success));
  border-left: 3px solid hsl(var(--agala-success));
}

.eventWarning {
  background-color: hsl(var(--agala-warning) / 0.15);
  color: hsl(var(--agala-warning));
  border-left: 3px solid hsl(var(--agala-warning));
}

.eventSecondary {
  background-color: hsl(var(--agala-secondary) / 0.5);
  color: hsl(var(--agala-secondary-foreground));
  border-left: 3px solid hsl(var(--agala-secondary-foreground) / 0.5);
}

.eventAccent {
  background-color: hsl(var(--agala-accent) / 0.5);
  color: hsl(var(--agala-accent-foreground));
  border-left: 3px solid hsl(var(--agala-accent-foreground) / 0.5);
}

/* ─── Current time indicator ─── */
.currentTimeLine {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: hsl(var(--agala-danger));
  z-index: 2;
  pointer-events: none;
}

.currentTimeDot {
  position: absolute;
  right: 0.25rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: hsl(var(--agala-danger));
  transform: translateY(-50%);
  z-index: 4;
}

/* ─── Tablet ─── */
@media (max-width: 1023px) {
  .hourLabel {
    height: 2.75rem;
  }

  .hourRow {
    height: 2.75rem;
  }
}

/* ─── Mobile ─── */
@media (max-width: 767px) {
  .hourLabel {
    height: 2.5rem;
  }

  .hourRow {
    height: 2.5rem;
  }

  .scrollWrapper {
    scroll-snap-type: x mandatory;
    scroll-padding-left: 3.5rem;
  }

  .dayCol {
    scroll-snap-align: start;
  }
}
</style>
