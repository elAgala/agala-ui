<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { CalendarEvent } from './types'
import {
  getDayEvents,
  getEventPosition,
  detectOverlap,
  getHoursRange,
  isSameDay,
  toISODate,
  formatTimeLabel,
  parseISO,
  minutesFromMidnight,
} from './utils'

const props = withDefaults(defineProps<{
  events: CalendarEvent[]
  currentDate: string
  dayStart: string
  dayEnd: string
  class?: string
}>(), {
  events: () => [],
  currentDate: () => toISODate(new Date()),
  dayStart: '00:00',
  dayEnd: '24:00',
  class: '',
})

const emit = defineEmits<{
  select: [event: CalendarEvent]
  'day-click': [date: string]
}>()

// Token color map
const tokenColorMap: Record<string, string> = {
  primary: 'eventPrimary',
  danger: 'eventDanger',
  success: 'eventSuccess',
  warning: 'eventWarning',
  secondary: 'eventSecondary',
  accent: 'eventAccent',
}

// Current time
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// Hour height measurement
const firstRowRef = ref<HTMLElement | null>(null)
const hourHeight = ref(48)

function updateHourHeight() {
  if (firstRowRef.value) {
    hourHeight.value = firstRowRef.value.getBoundingClientRect().height
  }
}

function setFirstRowRef(el: Element | null) {
  if (el) firstRowRef.value = el as HTMLElement
}

onMounted(() => {
  updateHourHeight()
  window.addEventListener('resize', updateHourHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHourHeight)
})

// Computed data
const hours = computed(() => getHoursRange(props.dayStart, props.dayEnd))

const dayEvents = computed(() => getDayEvents(props.events, props.currentDate))
const allDayEvents = computed(() => dayEvents.value.filter(e => e.allDay))
const timedEvents = computed(() => dayEvents.value.filter(e => !e.allDay))

const overlapInfo = computed(() =>
  detectOverlap(timedEvents.value, props.currentDate),
)

const currentDateObj = computed(() => parseISO(`${props.currentDate}T00:00:00`))

const isToday = computed(() => {
  if (!currentDateObj.value) return false
  return isSameDay(currentDateObj.value, now.value)
})

const currentTimeTop = computed(() => {
  if (!isToday.value) return -1
  const nowMins = now.value.getHours() * 60 + now.value.getMinutes()
  const startMins = minutesFromMidnight(props.dayStart)
  const endMins = minutesFromMidnight(props.dayEnd)

  if (nowMins < startMins || nowMins > endMins) return -1

  return (nowMins - startMins) * (hourHeight.value / 60)
})

const positionedEvents = computed(() => {
  const result: Array<{
    event: CalendarEvent
    position: { top: number; height: number }
    overlap: { column: number; totalColumns: number } | undefined
  }> = []

  for (const event of timedEvents.value) {
    const position = getEventPosition(event, props.dayStart, props.dayEnd, hourHeight.value)
    if (position) {
      const overlap = overlapInfo.value.find(o => o.event.id === event.id)
      result.push({ event, position, overlap })
    }
  }

  return result
})

// Helpers
function eventClasses(event: CalendarEvent): string[] {
  const classes: string[] = ['event']
  if (event.color && tokenColorMap[event.color]) {
    classes.push(tokenColorMap[event.color])
  }
  return classes
}

function eventStyle(item: {
  event: CalendarEvent
  position: { top: number; height: number }
  overlap: { column: number; totalColumns: number } | undefined
}): Record<string, string> {
  const style: Record<string, string> = {}

  if (item.event.color && !tokenColorMap[item.event.color]) {
    style.backgroundColor = item.event.color
  }

  style.top = `${item.position.top}px`
  style.height = `${Math.max(item.position.height, 20)}px`

  if (item.overlap && item.overlap.totalColumns > 1) {
    const pct = 100 / item.overlap.totalColumns
    style.left = `${item.overlap.column * pct}%`
    style.width = `calc(${pct}% - 2px)`
  } else {
    style.left = '0'
    style.width = 'calc(100% - 2px)'
  }

  return style
}

function handleDayClick() {
  emit('day-click', props.currentDate)
}

function hourDate(hour: number): Date {
  return new Date(2000, 0, 1, hour, 0, 0)
}
</script>

<template>
  <div class="dayView" role="region" aria-label="Calendar day view" :class="props.class">
    <!-- All-day header -->
    <div v-if="allDayEvents.length" class="allDayHeader">
      <div class="timeAxisLabel">All day</div>
      <div class="allDayEvents">
        <button
          v-for="event in allDayEvents"
          :key="event.id"
          class="allDayEvent"
          :class="event.color && tokenColorMap[event.color]"
          :style="event.color && !tokenColorMap[event.color] ? { backgroundColor: event.color } : {}"
          @click.stop="emit('select', event)"
        >
          {{ event.title }}
        </button>
      </div>
    </div>

    <!-- Time grid -->
    <div class="timeGrid">
      <!-- Time axis -->
      <div class="timeAxis">
        <div
          v-for="hour in hours"
          :key="hour"
          class="timeLabel"
        >
          {{ formatTimeLabel(hourDate(hour)) }}
        </div>
      </div>

      <!-- Day column -->
      <div class="dayColumn" @click="handleDayClick">
        <div
          v-for="(hour, index) in hours"
          :key="hour"
          class="hourRow"
          :ref="index === 0 ? setFirstRowRef : undefined"
        ></div>

        <!-- Current time line -->
        <div
          v-if="isToday && currentTimeTop >= 0"
          class="currentTimeLine"
          :style="{ top: `${currentTimeTop}px` }"
        ></div>

        <!-- Events -->
        <button
          v-for="item in positionedEvents"
          :key="item.event.id"
          :class="eventClasses(item.event)"
          :style="eventStyle(item)"
          @click.stop="emit('select', item.event)"
        >
          {{ item.event.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dayView {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: var(--agala-radius);
  background: hsl(var(--agala-background));
}

.allDayHeader {
  display: flex;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  min-height: 2.5rem;
}

.timeAxisLabel {
  width: 3.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-muted-foreground));
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
  background: hsl(var(--agala-background));
}

.allDayEvents {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.25rem;
  align-items: center;
  overflow: hidden;
}

.allDayEvent {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: var(--agala-radius-sm);
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  border: none;
  cursor: pointer;
  background: hsl(var(--agala-primary) / 0.15);
  color: hsl(var(--agala-primary));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.allDayEvent:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

.timeGrid {
  display: flex;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.timeAxis {
  width: 3.5rem;
  flex-shrink: 0;
  position: sticky;
  left: 0;
  background: hsl(var(--agala-background));
  z-index: 1;
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
}

.timeLabel {
  height: 3rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.25rem;
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-muted-foreground));
  box-sizing: border-box;
}

.dayColumn {
  flex: 1;
  position: relative;
  min-width: 0;
}

.hourRow {
  height: 3rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border) / 0.5);
  box-sizing: border-box;
}

.currentTimeLine {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: hsl(var(--agala-danger));
  z-index: 2;
  pointer-events: none;
}

.event {
  position: absolute;
  padding: 0.125rem 0.25rem;
  border-radius: var(--agala-radius-sm);
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  border: none;
  line-height: 1.25;
  box-sizing: border-box;
  background: hsl(var(--agala-primary) / 0.15);
  color: hsl(var(--agala-foreground));
}

.event:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

.eventPrimary {
  background: hsl(var(--agala-primary) / 0.15);
  color: hsl(var(--agala-primary));
}

.eventDanger {
  background: hsl(var(--agala-danger) / 0.15);
  color: hsl(var(--agala-danger));
}

.eventSuccess {
  background: hsl(var(--agala-success) / 0.15);
  color: hsl(var(--agala-success));
}

.eventWarning {
  background: hsl(var(--agala-warning) / 0.15);
  color: hsl(var(--agala-warning));
}

.eventSecondary {
  background: hsl(var(--agala-secondary) / 0.5);
  color: hsl(var(--agala-secondary-foreground));
}

.eventAccent {
  background: hsl(var(--agala-accent) / 0.5);
  color: hsl(var(--agala-accent-foreground));
}

@media (max-width: 639px) {
  .timeLabel,
  .hourRow {
    height: 2.5rem;
  }
}

@media (min-width: 640px) and (max-width: 767px) {
  .timeLabel,
  .hourRow {
    height: 2.75rem;
  }
}
</style>
