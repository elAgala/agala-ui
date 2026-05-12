<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
  formatEventTimeRange,
  minutesToTimeString,
} from './utils'
import { useGridSelection } from '../../composables/useGridSelection'

const props = withDefaults(defineProps<{
  events: CalendarEvent[]
  currentDate: string
  dayStart: string
  dayEnd: string
  snapMinutes?: number
  class?: string
}>(), {
  events: () => [],
  currentDate: () => toISODate(new Date()),
  dayStart: '00:00',
  dayEnd: '24:00',
  snapMinutes: 30,
  class: '',
})

const emit = defineEmits<{
  select: [event: CalendarEvent]
  'day-click': [date: string]
  'slot-select': [payload: { start: string; end: string }]
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
const dayColumnRef = ref<HTMLDivElement>()
const hourHeight = ref(48)

function measureHourHeight() {
  if (!dayColumnRef.value) return
  const firstRow = dayColumnRef.value.querySelector('.hourRow') as HTMLElement | null
  if (firstRow) {
    hourHeight.value = firstRow.getBoundingClientRect().height
  }
}

onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(() => {
      measureHourHeight()
    })
  })
  window.addEventListener('resize', measureHourHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', measureHourHeight)
})

watch(() => [props.dayStart, props.dayEnd], () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      measureHourHeight()
    })
  })
})

// Grid selection
const gridSelection = useGridSelection({
  containerRef: dayColumnRef,
  hourHeightRef: hourHeight,
  snapMinutes: props.snapMinutes,
  dayStart: props.dayStart,
  dayEnd: props.dayEnd,
})

function handleMouseDown(e: MouseEvent) {
  // If clicking on an event, let the event handle it
  if ((e.target as HTMLElement).closest('.event')) return
  gridSelection.startSelection(e)
}

function onMouseUp() {
  const range = gridSelection.endSelection()
  if (range) {
    const date = props.currentDate
    const startTime = minutesToTimeString(range.startMinutes)
    const endTime = minutesToTimeString(range.endMinutes)
    emit('slot-select', {
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
    })
  }
}

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
    style.backgroundColor = `${item.event.color}20`
    style.color = item.event.color
    style.borderLeft = `3px solid ${item.event.color}`
  }

  style.top = `${item.position.top}px`
  style.height = `${Math.max(item.position.height, 28)}px`

  if (item.overlap && item.overlap.totalColumns > 1) {
    const pct = 100 / item.overlap.totalColumns
    style.left = `${item.overlap.column * pct + 0.5}%`
    style.width = `calc(${pct}% - 1%)`
  } else {
    style.left = '0.5%'
    style.width = 'calc(99%)'
  }

  return style
}

function hourDate(hour: number): Date {
  return new Date(2000, 0, 1, hour, 0, 0)
}

function eventShowTime(height: number): boolean {
  return height >= 28
}

function eventShowSubtitle(height: number): boolean {
  return height >= 40
}

function formatSelectionTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const d = new Date(2000, 0, 1, h, m)
  return formatTimeLabel(d)
}
</script>

<template>
  <div
    class="dayView"
    :class="[props.class, { isSelecting: gridSelection.isSelecting.value }]"
    role="region"
    aria-label="Calendar day view"
  >
    <!-- All-day header -->
    <div v-if="allDayEvents.length" class="allDayHeader">
      <div class="timeAxisLabel">All day</div>
      <div class="allDayEvents">
        <button
          v-for="event in allDayEvents"
          :key="event.id"
          class="allDayEvent"
          :class="event.color && tokenColorMap[event.color]"
          :style="event.color && !tokenColorMap[event.color] ? {
            backgroundColor: `${event.color}20`,
            color: event.color,
            borderLeft: `3px solid ${event.color}`,
          } : {}"
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
      <div
        ref="dayColumnRef"
        class="dayColumn"
        @mousedown="handleMouseDown"
        @mouseup="onMouseUp"
      >
        <div
          v-for="hour in hours"
          :key="hour"
          class="hourRow"
        ></div>

        <!-- Selection overlay -->
        <div
          v-if="gridSelection.selectionStyle.value"
          class="selectionOverlay"
          aria-hidden="true"
          :style="gridSelection.selectionStyle.value"
        >
          <span
            v-if="gridSelection.selectionRange.value"
            class="selectionLabel selectionLabelStart"
          >
            {{ formatSelectionTime(gridSelection.selectionRange.value.startMinutes) }}
          </span>
          <span
            v-if="gridSelection.selectionRange.value && gridSelection.selectionRange.value.endMinutes - gridSelection.selectionRange.value.startMinutes >= 40"
            class="selectionLabel selectionLabelEnd"
          >
            {{ formatSelectionTime(gridSelection.selectionRange.value.endMinutes) }}
          </span>
        </div>

        <!-- Current time line -->
        <div
          v-if="isToday && currentTimeTop >= 0"
          class="currentTimeLine"
          :style="{ top: `${currentTimeTop}px` }"
        >
          <div class="currentTimeDot"></div>
        </div>

        <!-- Events -->
        <button
          v-for="item in positionedEvents"
          :key="item.event.id"
          :class="eventClasses(item.event)"
          :style="eventStyle(item)"
          @click.stop="emit('select', item.event)"
        >
          <div class="eventContent">
            <div v-if="eventShowTime(item.position.height)" class="eventTime">
              {{ formatEventTimeRange(item.event) }}
            </div>
            <div class="eventTitle">{{ item.event.title }}</div>
            <div v-if="eventShowSubtitle(item.position.height) && item.event.subtitle" class="eventSubtitle">
              {{ item.event.subtitle }}
            </div>
          </div>
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
  background: hsl(var(--agala-background));
}

.dayView.isSelecting {
  cursor: crosshair;
}

.allDayHeader {
  display: flex;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  min-height: 2.5rem;
  flex-shrink: 0;
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
  background: hsl(var(--agala-primary) / 0.12);
  color: hsl(var(--agala-primary));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  border-left: 3px solid hsl(var(--agala-primary));
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
  user-select: none;
}

.hourRow {
  height: 3rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border) / 0.5);
  box-sizing: border-box;
}

.selectionOverlay {
  position: absolute;
  left: 2px;
  right: 2px;
  background: hsl(var(--agala-primary) / 0.15);
  border: 2px dashed hsl(var(--agala-primary) / 0.5);
  border-radius: var(--agala-radius-sm);
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 4px;
  box-sizing: border-box;
}

.selectionLabel {
  font-size: 0.625rem;
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-primary));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

.selectionLabelEnd {
  align-self: flex-start;
}

.currentTimeLine {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: hsl(var(--agala-danger));
  z-index: 5;
  pointer-events: none;
}

.currentTimeDot {
  position: absolute;
  left: -5px;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: hsl(var(--agala-danger));
}

.event {
  position: absolute;
  padding: 0.125rem 0.375rem;
  border-radius: var(--agala-radius-sm);
  font-size: 0.6875rem;
  font-weight: var(--agala-font-weight-medium);
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  border: none;
  line-height: 1.25;
  box-sizing: border-box;
  background: hsl(var(--agala-primary) / 0.12);
  color: hsl(var(--agala-foreground));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

.eventContent {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  overflow: hidden;
}

.eventTime {
  font-size: 0.625rem;
  font-weight: var(--agala-font-weight-semibold);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.eventTitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: var(--agala-font-weight-semibold);
}

.eventSubtitle {
  font-size: 0.625rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.eventPrimary { background-color: hsl(var(--agala-primary) / 0.12); color: hsl(var(--agala-primary)); border-left: 3px solid hsl(var(--agala-primary)); }
.eventDanger { background-color: hsl(var(--agala-danger) / 0.12); color: hsl(var(--agala-danger)); border-left: 3px solid hsl(var(--agala-danger)); }
.eventSuccess { background-color: hsl(var(--agala-success) / 0.12); color: hsl(var(--agala-success)); border-left: 3px solid hsl(var(--agala-success)); }
.eventWarning { background-color: hsl(var(--agala-warning) / 0.15); color: hsl(var(--agala-warning)); border-left: 3px solid hsl(var(--agala-warning)); }
.eventSecondary { background-color: hsl(var(--agala-secondary) / 0.5); color: hsl(var(--agala-secondary-foreground)); border-left: 3px solid hsl(var(--agala-secondary-foreground) / 0.5); }
.eventAccent { background-color: hsl(var(--agala-accent) / 0.5); color: hsl(var(--agala-accent-foreground)); border-left: 3px solid hsl(var(--agala-accent-foreground) / 0.5); }

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
