<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { AgalaIcon } from '../AgalaIcon'
import { useDropdownPosition } from '../../composables/useDropdownPosition'
import type { DatePickerSize } from './types'

const props = withDefaults(defineProps<{
  modelValue?: string
  size?: DatePickerSize
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  placeholder?: string
  min?: string
  max?: string
  clearable?: boolean
  class?: string
}>(), {
  size: 'md',
  disabled: false,
  error: false,
  placeholder: 'Pick a date',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type ViewMode = 'days' | 'months' | 'years'

/* State */
const isOpen = ref(false)
const viewMode = ref<ViewMode>('days')
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())
const focusedDate = ref(props.modelValue || todayISO())
const focusedMonth = ref(new Date().getMonth())
const focusedYear = ref(new Date().getFullYear())
const hoverDay = ref('')
const hoverMonth = ref(-1)
const hoverYear = ref(-Infinity)
const wrapperRef = ref<HTMLDivElement>()
const triggerRef = ref<HTMLDivElement>()
const floatingRef = ref<HTMLDivElement>()
const yearListRef = ref<HTMLDivElement>()

const { dropdownStyle, recompute } = useDropdownPosition(triggerRef, { width: 'auto' })

/* Computed */
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const d = parseISO(props.modelValue)
  if (!d) return ''
  return formatDisplay(d)
})

const viewMonthLabel = computed(() => {
  if (viewMode.value === 'days') {
    return `${MONTH_LABELS[viewMonth.value]} ${viewYear.value}`
  }
  if (viewMode.value === 'months') {
    return `${viewYear.value}`
  }
  const list = yearList.value
  return `${list[0]} – ${list[list.length - 1]}`
})

const yearList = computed(() => {
  return Array.from({ length: 201 }, (_, i) => viewYear.value - 100 + i)
})

interface DayCell {
  dateISO: string
  dayNum: number
  currentMonth: boolean
  selected: boolean
  disabled: boolean
  focused: boolean
  today: boolean
  ariaLabel: string
}

const grid = computed((): DayCell[][] => {
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)
  const startDay = firstOfMonth.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()

  const days: DayCell[] = []
  const today = todayISO()

  // prev month padding
  const prevMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(viewYear.value, viewMonth.value - 1, prevMonthDays - i)
    days.push(makeCell(d, false, today))
  }

  // current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear.value, viewMonth.value, i)
    days.push(makeCell(d, true, today))
  }

  // next month padding (fill to 42 cells = 6 weeks)
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(viewYear.value, viewMonth.value + 1, i)
    days.push(makeCell(d, false, today))
  }

  // chunk into weeks
  const weeks: DayCell[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
})

const triggerRowCls = computed(() => [
  'triggerRow',
  `triggerRow${props.size.charAt(0).toUpperCase()}${props.size.slice(1)}`,
  isOpen.value ? 'triggerRowOpen' : undefined,
  props.disabled ? 'triggerRowDisabled' : undefined,
  props.error ? 'triggerRowError' : undefined,
].filter(Boolean).join(' '))

/* Helpers */
function makeCell(d: Date, currentMonth: boolean, todayISO: string): DayCell {
  const iso = toISO(d)
  const selected = props.modelValue === iso
  const disabled = isDisabled(iso)
  const focused = focusedDate.value === iso
  const today = iso === todayISO
  return {
    dateISO: iso,
    dayNum: d.getDate(),
    currentMonth,
    selected,
    disabled,
    focused,
    today,
    ariaLabel: d.toDateString(),
  }
}

function isDisabled(iso: string): boolean {
  if (props.min && iso < props.min) return true
  if (props.max && iso > props.max) return true
  return false
}

function isMonthDisabled(monthIndex: number): boolean {
  const year = viewYear.value
  const firstISO = toISO(new Date(year, monthIndex, 1))
  const lastISO = toISO(new Date(year, monthIndex + 1, 0))
  if (props.min && lastISO < props.min) return true
  if (props.max && firstISO > props.max) return true
  return false
}

function isYearDisabled(year: number): boolean {
  const firstISO = toISO(new Date(year, 0, 1))
  const lastISO = toISO(new Date(year, 11, 31))
  if (props.min && lastISO < props.min) return true
  if (props.max && firstISO > props.max) return true
  return false
}

function todayISO(): string {
  return toISO(new Date())
}

function toISO(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function parseISO(s: string): Date | null {
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function resetFocusedDateToMonth(year: number, month: number) {
  const t = new Date()
  if (t.getFullYear() === year && t.getMonth() === month) {
    const iso = toISO(t)
    if (!isDisabled(iso)) {
      focusedDate.value = iso
      return
    }
  }
  const lastDay = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= lastDay; i++) {
    const iso = toISO(new Date(year, month, i))
    if (!isDisabled(iso)) {
      focusedDate.value = iso
      return
    }
  }
  focusedDate.value = toISO(new Date(year, month, 1))
}

function selectDay(day: DayCell) {
  if (day.disabled) return
  emit('update:modelValue', day.dateISO)
  close()
}

function selectMonth(monthIndex: number) {
  if (isMonthDisabled(monthIndex)) return
  viewMonth.value = monthIndex
  viewMode.value = 'days'
  resetFocusedDateToMonth(viewYear.value, monthIndex)
  nextTick(() => {
    const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
    el?.focus({ preventScroll: true })
  })
}

function selectYear(year: number) {
  if (isYearDisabled(year)) return
  viewYear.value = year
  viewMode.value = 'months'
  focusedMonth.value = viewMonth.value
  nextTick(() => {
    const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
    el?.focus({ preventScroll: true })
  })
}

function clear() {
  emit('update:modelValue', '')
  close()
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function prevView() {
  if (viewMode.value === 'days') {
    prevMonth()
  } else if (viewMode.value === 'months') {
    viewYear.value--
  } else if (viewMode.value === 'years') {
    viewYear.value -= 20
    const list = yearList.value
    focusedYear.value = Math.max(list[0], Math.min(list[list.length - 1], focusedYear.value - 20))
  }
}

function nextView() {
  if (viewMode.value === 'days') {
    nextMonth()
  } else if (viewMode.value === 'months') {
    viewYear.value++
  } else if (viewMode.value === 'years') {
    viewYear.value += 20
    const list = yearList.value
    focusedYear.value = Math.max(list[0], Math.min(list[list.length - 1], focusedYear.value + 20))
  }
}

function open() {
  if (props.disabled) return
  isOpen.value = true
  viewMode.value = 'days'
  if (props.modelValue) {
    const d = parseISO(props.modelValue)
    if (d) {
      viewYear.value = d.getFullYear()
      viewMonth.value = d.getMonth()
      focusedDate.value = props.modelValue
      focusedMonth.value = d.getMonth()
      focusedYear.value = d.getFullYear()
    }
  } else {
    const t = new Date()
    viewYear.value = t.getFullYear()
    viewMonth.value = t.getMonth()
    focusedDate.value = todayISO()
    focusedMonth.value = t.getMonth()
    focusedYear.value = t.getFullYear()
  }
  nextTick(() => {
    requestAnimationFrame(() => recompute())
    const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
    el?.focus({ preventScroll: true })
  })
}

function close() {
  isOpen.value = false
  viewMode.value = 'days'
}

function handleTriggerClick() {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

function handleTriggerKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault()
      isOpen.value ? close() : open()
      break
    case 'ArrowDown':
      e.preventDefault()
      open()
      break
    case 'Escape':
      close()
      break
  }
}

function handleHeaderClick() {
  if (viewMode.value === 'days') {
    viewMode.value = 'months'
    focusedMonth.value = viewMonth.value
  } else if (viewMode.value === 'months') {
    viewMode.value = 'years'
    focusedYear.value = viewYear.value
  } else {
    viewMode.value = 'days'
    resetFocusedDateToMonth(viewYear.value, viewMonth.value)
  }
  nextTick(() => {
    const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
    el?.focus({ preventScroll: true })
  })
}

function handlePickerKeyDown(e: KeyboardEvent) {
  e.stopPropagation()
  if (!isOpen.value) return

  if (viewMode.value === 'days') {
    let d = parseISO(focusedDate.value) || new Date()
    let changed = false

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        d.setDate(d.getDate() - 1)
        changed = true
        break
      case 'ArrowRight':
        e.preventDefault()
        d.setDate(d.getDate() + 1)
        changed = true
        break
      case 'ArrowUp':
        e.preventDefault()
        d.setDate(d.getDate() - 7)
        changed = true
        break
      case 'ArrowDown':
        e.preventDefault()
        d.setDate(d.getDate() + 7)
        changed = true
        break
      case 'Home':
        e.preventDefault()
        d.setDate(1)
        changed = true
        break
      case 'End':
        e.preventDefault()
        d.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())
        changed = true
        break
      case 'PageUp':
        e.preventDefault()
        d.setMonth(d.getMonth() - 1)
        changed = true
        break
      case 'PageDown':
        e.preventDefault()
        d.setMonth(d.getMonth() + 1)
        changed = true
        break
      case 'Enter':
      case ' ': {
        e.preventDefault()
        const iso = toISO(d)
        if (!isDisabled(iso)) {
          emit('update:modelValue', iso)
          close()
        }
        return
      }
      case 'Escape':
        close()
        return
    }

    if (changed) {
      focusedDate.value = toISO(d)
      viewYear.value = d.getFullYear()
      viewMonth.value = d.getMonth()
      nextTick(() => {
        const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
        el?.focus({ preventScroll: true })
      })
    }
    return
  }

  if (viewMode.value === 'months') {
    let m = focusedMonth.value
    let changed = false

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        m--
        if (m < 0) m = 11
        changed = true
        break
      case 'ArrowRight':
        e.preventDefault()
        m++
        if (m > 11) m = 0
        changed = true
        break
      case 'ArrowUp':
        e.preventDefault()
        m -= 3
        if (m < 0) m = 0
        changed = true
        break
      case 'ArrowDown':
        e.preventDefault()
        m += 3
        if (m > 11) m = 11
        changed = true
        break
      case 'Home':
        e.preventDefault()
        m = 0
        changed = true
        break
      case 'End':
        e.preventDefault()
        m = 11
        changed = true
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        selectMonth(m)
        return
      case 'Escape':
        e.preventDefault()
        viewMode.value = 'days'
        resetFocusedDateToMonth(viewYear.value, viewMonth.value)
        nextTick(() => {
          const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
          el?.focus({ preventScroll: true })
        })
        return
    }

    if (changed) {
      focusedMonth.value = m
      nextTick(() => {
        const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
        el?.focus({ preventScroll: true })
      })
    }
    return
  }

  if (viewMode.value === 'years') {
    const list = yearList.value
    let y = focusedYear.value
    let changed = false

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        y--
        changed = true
        break
      case 'ArrowDown':
        e.preventDefault()
        y++
        changed = true
        break
      case 'PageUp':
        e.preventDefault()
        y -= 10
        changed = true
        break
      case 'PageDown':
        e.preventDefault()
        y += 10
        changed = true
        break
      case 'Home':
        e.preventDefault()
        y = list[0]
        changed = true
        break
      case 'End':
        e.preventDefault()
        y = list[list.length - 1]
        changed = true
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        selectYear(y)
        return
      case 'Escape':
        e.preventDefault()
        viewMode.value = 'months'
        nextTick(() => {
          const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
          el?.focus({ preventScroll: true })
        })
        return
    }

    if (changed) {
      if (y < list[0]) y = list[0]
      if (y > list[list.length - 1]) y = list[list.length - 1]
      focusedYear.value = y
      nextTick(() => {
        const el = wrapperRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
        el?.focus({ preventScroll: true })
        el?.scrollIntoView({ block: 'center', behavior: 'auto' })
      })
    }
    return
  }
}

function cellCls(day: DayCell): string {
  return [
    'dayCell',
    !day.currentMonth ? 'dayCellOther' : undefined,
    day.selected ? 'dayCellSelected' : undefined,
    day.today ? 'dayCellToday' : undefined,
    day.disabled ? 'dayCellDisabled' : undefined,
    day.focused && !day.selected ? 'dayCellFocused' : undefined,
    hoverDay.value === day.dateISO && !day.disabled && !day.selected ? 'dayCellHover' : undefined,
  ].filter(Boolean).join(' ')
}

function monthCellCls(m: number): string {
  const selected = viewMonth.value === m
  const disabled = isMonthDisabled(m)
  const today = new Date().getMonth() === m && new Date().getFullYear() === viewYear.value
  const focused = focusedMonth.value === m
  return [
    'monthCell',
    selected ? 'monthCellSelected' : undefined,
    today ? 'monthCellToday' : undefined,
    disabled ? 'monthCellDisabled' : undefined,
    focused && !selected ? 'monthCellFocused' : undefined,
    hoverMonth.value === m && !disabled && !selected ? 'monthCellHover' : undefined,
  ].filter(Boolean).join(' ')
}

function yearCellCls(year: number): string {
  const selected = viewYear.value === year
  const disabled = isYearDisabled(year)
  const today = new Date().getFullYear() === year
  const focused = focusedYear.value === year
  return [
    'yearCell',
    selected ? 'yearCellSelected' : undefined,
    today ? 'yearCellToday' : undefined,
    disabled ? 'yearCellDisabled' : undefined,
    focused && !selected ? 'yearCellFocused' : undefined,
    hoverYear.value === year && !disabled && !selected ? 'yearCellHover' : undefined,
  ].filter(Boolean).join(' ')
}

/* click outside + scroll close + resize reposition */
watch(isOpen, (open) => {
  if (!open) return
  const handleClick = (e: MouseEvent) => {
    if (!wrapperRef.value?.contains(e.target as Node) && !floatingRef.value?.contains(e.target as Node)) {
      close()
    }
  }
  const handleScroll = (e: Event) => {
    if (!floatingRef.value?.contains(e.target as Node)) {
      close()
    }
  }
  const handleResize = () => recompute()
  document.addEventListener('mousedown', handleClick)
  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)
  watch(isOpen, (newOpen) => {
    if (!newOpen) {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, { once: true })
})

watch(viewMode, (mode) => {
  if (mode === 'years') {
    nextTick(() => {
      const el = yearListRef.value?.querySelector('[tabindex="0"]') as HTMLElement | null
      el?.scrollIntoView({ block: 'center', behavior: 'auto' })
    })
  }
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="wrapper"
    :class="$props.class"
  >
    <div ref="triggerRef" :class="triggerRowCls" @click="handleTriggerClick" @keydown="handleTriggerKeyDown" tabindex="0" role="combobox" :aria-expanded="isOpen" aria-haspopup="grid" aria-controls="agala-date-grid" :aria-disabled="disabled">
      <span class="triggerLabel">
        <AgalaIcon name="calendar" :size="14" />
        <span :class="displayValue ? 'triggerValue' : 'triggerPlaceholder'">
          {{ displayValue || placeholder }}
        </span>
      </span>
      <span class="chevron" :class="isOpen ? 'chevronOpen' : undefined" aria-hidden="true">
        <AgalaIcon name="chevron" :size="14" />
      </span>
    </div>

    <div v-if="isOpen" ref="floatingRef" class="dropdown" :style="dropdownStyle" id="agala-date-grid" role="grid" aria-label="Calendar" @keydown="handlePickerKeyDown">
      <div class="header">
        <button type="button" class="navBtn" @click="prevView" :aria-label="viewMode === 'days' ? 'Previous month' : viewMode === 'months' ? 'Previous year' : 'Previous 20 years'">
          <AgalaIcon name="chevron" :size="14" />
        </button>
        <button type="button" class="monthLabel headerLabelBtn" @click="handleHeaderClick" aria-live="polite">
          {{ viewMonthLabel }}
        </button>
        <button type="button" class="navBtn navBtnNext" @click="nextView" :aria-label="viewMode === 'days' ? 'Next month' : viewMode === 'months' ? 'Next year' : 'Next 20 years'">
          <AgalaIcon name="chevron" :size="14" />
        </button>
      </div>

      <template v-if="viewMode === 'days'">
        <div class="weekdays" role="row">
          <div v-for="d in WEEKDAYS" :key="d" class="weekday" role="columnheader" :aria-label="d">
            {{ d }}
          </div>
        </div>

        <div class="days" role="rowgroup">
          <div v-for="(week, wi) in grid" :key="wi" class="week" role="row">
            <button
              v-for="day in week"
              :key="day.dateISO"
              type="button"
              :role="'gridcell'"
              :aria-selected="day.selected"
              :aria-disabled="day.disabled"
              :aria-label="day.ariaLabel"
              :class="cellCls(day)"
              :tabindex="day.focused ? 0 : -1"
              @click="selectDay(day)"
              @mouseenter="hoverDay = day.dateISO"
              @mouseleave="hoverDay = ''"
            >
              {{ day.dayNum }}
            </button>
          </div>
        </div>
      </template>

      <div v-if="viewMode === 'months'" class="monthGrid" role="grid" aria-label="Months">
        <div v-for="row in [ [0,1,2], [3,4,5], [6,7,8], [9,10,11] ]" :key="row[0]" class="monthRow" role="row">
          <button
            v-for="m in row"
            :key="m"
            type="button"
            role="gridcell"
            :class="monthCellCls(m)"
            :tabindex="focusedMonth === m ? 0 : -1"
            :aria-selected="viewMonth === m"
            :aria-disabled="isMonthDisabled(m)"
            @click="selectMonth(m)"
            @mouseenter="hoverMonth = m"
            @mouseleave="hoverMonth = -1"
          >
            {{ MONTH_LABELS[m].slice(0, 3) }}
          </button>
        </div>
      </div>

      <div
        v-if="viewMode === 'years'"
        ref="yearListRef"
        class="yearList"
        role="listbox"
        aria-label="Years"
      >
        <button
          v-for="year in yearList"
          :key="year"
          type="button"
          role="option"
          :class="yearCellCls(year)"
          :tabindex="focusedYear === year ? 0 : -1"
          :aria-selected="viewYear === year"
          :aria-disabled="isYearDisabled(year)"
          @click="selectYear(year)"
          @mouseenter="hoverYear = year"
          @mouseleave="hoverYear = -Infinity"
        >
          {{ year }}
        </button>
      </div>

      <div v-if="clearable && modelValue" class="footer">
        <button type="button" class="clearBtn" @click="clear">
          Clear
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ── Trigger ── */
.triggerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  border: var(--agala-border-width) solid hsl(var(--agala-input));
  border-radius: calc(var(--agala-radius) - 2px);
  background-color: hsl(var(--agala-background));
  color: hsl(var(--agala-foreground));
  cursor: pointer;
  transition: border-color var(--agala-transition-fast), box-shadow var(--agala-transition-fast);
  outline: none;
}

.triggerRow:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-background)), 0 0 0 4px hsl(var(--agala-ring));
}

.triggerRow:hover:not(.triggerRowDisabled) {
  border-color: hsl(var(--agala-border));
}

.triggerRowOpen {
  border-color: hsl(var(--agala-ring));
  box-shadow: 0 0 0 1px hsl(var(--agala-background)), 0 0 0 3px hsl(var(--agala-ring) / 0.2);
}

.triggerRowDisabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: hsl(var(--agala-muted));
}

.triggerRowError {
  border-color: hsl(var(--agala-danger));
}
.triggerRowError:focus-visible {
  border-color: hsl(var(--agala-danger));
  box-shadow: 0 0 0 1px hsl(var(--agala-background)), 0 0 0 3px hsl(var(--agala-danger) / 0.2);
}

.triggerRowSm { height: var(--agala-height-sm); padding: 0 0.5rem; font-size: var(--agala-font-size-sm); border-radius: var(--agala-radius-sm); }
.triggerRowMd { height: var(--agala-height-md); padding: 0 0.625rem; }
.triggerRowLg { height: var(--agala-height-lg); padding: 0 0.875rem; font-size: var(--agala-font-size-lg); border-radius: var(--agala-radius-lg); }

.triggerLabel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.triggerValue {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.triggerPlaceholder {
  color: hsl(var(--agala-muted-foreground));
}

.chevron {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: hsl(var(--agala-muted-foreground));
  transition: transform var(--agala-transition-fast);
}

.chevronOpen {
  transform: rotate(180deg);
}

/* ── Dropdown ── */
.dropdown {
  z-index: var(--agala-z-dropdown);
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: hsl(var(--agala-popover));
  color: hsl(var(--agala-popover-foreground));
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: calc(var(--agala-radius) - 2px);
  box-shadow: var(--agala-shadow-md);
  overflow: hidden;
  padding: 0.5rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
}

.monthLabel {
  font-size: var(--agala-font-size-base);
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-foreground));
}

.headerLabelBtn {
  font-size: var(--agala-font-size-base);
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-foreground));
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--agala-radius-sm);
  transition: background-color var(--agala-transition-fast);
}
.headerLabelBtn:hover {
  background-color: hsl(var(--agala-muted));
}

.navBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-muted-foreground));
  cursor: pointer;
  transition: color var(--agala-transition-fast), background-color var(--agala-transition-fast);
}

.navBtn:hover {
  color: hsl(var(--agala-foreground));
  background-color: hsl(var(--agala-muted));
}

.navBtnNext {
  transform: rotate(180deg);
}

/* Weekdays */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
  padding: 0.25rem 0;
}

.weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.75rem;
  font-size: 0.6875rem;
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-muted-foreground));
  text-transform: uppercase;
  user-select: none;
}

/* Days grid */
.days {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.125rem;
}

.dayCell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-foreground));
  font-size: var(--agala-font-size-sm);
  font-family: var(--agala-font-sans);
  cursor: pointer;
  transition: background-color var(--agala-transition-fast), color var(--agala-transition-fast);
}

.dayCell:hover:not(.dayCellDisabled):not(.dayCellSelected) {
  background-color: hsl(var(--agala-accent));
  color: hsl(var(--agala-accent-foreground));
}

.dayCell:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.dayCellOther {
  color: hsl(var(--agala-muted-foreground));
  opacity: 0.6;
}

.dayCellToday {
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-primary));
}

.dayCellToday:not(.dayCellSelected) {
  box-shadow: inset 0 0 0 1.5px hsl(var(--agala-primary) / 0.4);
}

.dayCellSelected {
  background-color: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
  font-weight: var(--agala-font-weight-medium);
}

.dayCellSelected:hover {
  background-color: hsl(var(--agala-primary) / 0.9);
}

.dayCellDisabled {
  cursor: default;
  opacity: 0.35;
  pointer-events: none;
}

.dayCellFocused:not(.dayCellSelected) {
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.dayCellHover:not(.dayCellDisabled):not(.dayCellSelected):not(.dayCellFocused) {
  background-color: hsl(var(--agala-accent));
}

/* Month grid */
.monthGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.125rem;
  padding: 0.25rem 0;
}

.monthRow {
  display: contents;
}

.monthCell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-foreground));
  font-size: var(--agala-font-size-sm);
  font-family: var(--agala-font-sans);
  cursor: pointer;
  transition: background-color var(--agala-transition-fast), color var(--agala-transition-fast);
}

.monthCell:hover:not(.monthCellDisabled):not(.monthCellSelected) {
  background-color: hsl(var(--agala-accent));
  color: hsl(var(--agala-accent-foreground));
}

.monthCell:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.monthCellSelected {
  background-color: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
  font-weight: var(--agala-font-weight-medium);
}

.monthCellSelected:hover {
  background-color: hsl(var(--agala-primary) / 0.9);
}

.monthCellDisabled {
  cursor: default;
  opacity: 0.35;
  pointer-events: none;
}

.monthCellToday {
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-primary));
}

.monthCellFocused:not(.monthCellSelected) {
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.monthCellHover:not(.monthCellDisabled):not(.monthCellSelected):not(.monthCellFocused) {
  background-color: hsl(var(--agala-accent));
}

/* Year list */
.yearList {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow-y: auto;
  max-height: 240px;
  padding: 0.125rem;
}

.yearCell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 100%;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-foreground));
  font-size: var(--agala-font-size-sm);
  font-family: var(--agala-font-sans);
  cursor: pointer;
  transition: background-color var(--agala-transition-fast), color var(--agala-transition-fast);
}

.yearCell:hover:not(.yearCellDisabled):not(.yearCellSelected) {
  background-color: hsl(var(--agala-accent));
  color: hsl(var(--agala-accent-foreground));
}

.yearCell:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.yearCellSelected {
  background-color: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
  font-weight: var(--agala-font-weight-medium);
}

.yearCellSelected:hover {
  background-color: hsl(var(--agala-primary) / 0.9);
}

.yearCellDisabled {
  cursor: default;
  opacity: 0.35;
  pointer-events: none;
}

.yearCellToday {
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-primary));
}

.yearCellFocused:not(.yearCellSelected) {
  box-shadow: 0 0 0 2px hsl(var(--agala-ring) / 0.3);
}

.yearCellHover:not(.yearCellDisabled):not(.yearCellSelected):not(.yearCellFocused) {
  background-color: hsl(var(--agala-accent));
}

/* Footer */
.footer {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
}

.clearBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-muted-foreground));
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  cursor: pointer;
  transition: color var(--agala-transition-fast), background-color var(--agala-transition-fast);
}

.clearBtn:hover {
  color: hsl(var(--agala-danger));
  background-color: hsl(var(--agala-danger) / 0.05);
}

/* Error */
.errorMessage {
  font-size: var(--agala-font-size-sm);
  color: hsl(var(--agala-danger));
  line-height: var(--agala-line-height-normal);
  margin: 0;
  padding-top: 0.25rem;
}
</style>
