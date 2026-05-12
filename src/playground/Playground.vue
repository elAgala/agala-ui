<script setup lang="ts">
import { ref, h, watch } from 'vue'
import { Button, Input, FormField, Select, CreatableSelect, DatePicker, ColorPicker, Modal, ModalProvider, modalManager, Badge, Checkbox, Toggle, Avatar, ToastProvider, toastManager, Textarea, DropdownMenu, Table, Tabs, Card, Tooltip, RadioGroup, Navbar, Sidebar, SidebarItem, SidebarGroup, SidebarToggle, Accordion, AccordionItem, Skeleton, Stat, EmptyState, Progress, Tag, Pagination, Drawer, FileUpload, DevEnvBanner, Calendar, Alert } from '../lib'

import { BaseChart } from '../../packages/charts/src/index'
import { useMediaQuery } from '../lib/composables/useMediaQuery'
import AgalaIcon from '../lib/components/AgalaIcon/AgalaIcon.vue'
import type { TableColumn, TabItem, CalendarEvent, CalendarView } from '../lib'

/* ─── Theme ─── */
type Theme = 'default' | 'forja' | 'custom'
const activeTheme = ref<Theme>('default')
const themeTesterOpen = ref(false)
const customThemeCss = ref(`/* Paste your custom theme CSS here */
:root {
  --agala-primary: 200 90% 50%;
}`)
const customStyleEl = ref<HTMLStyleElement | null>(null)

function applyCustomTheme() {
  activeTheme.value = 'custom'
  document.documentElement.removeAttribute('data-theme')
  if (customStyleEl.value) {
    customStyleEl.value.textContent = customThemeCss.value
  } else {
    const el = document.createElement('style')
    el.textContent = customThemeCss.value
    document.head.appendChild(el)
    customStyleEl.value = el
  }
}

function resetCustomTheme() {
  activeTheme.value = 'default'
  document.documentElement.removeAttribute('data-theme')
  if (customStyleEl.value) {
    customStyleEl.value.textContent = ''
  }
}

watch(activeTheme, (t) => {
  if (t === 'forja') {
    document.documentElement.setAttribute('data-theme', 'forja')
    if (customStyleEl.value) customStyleEl.value.textContent = ''
  } else if (t !== 'custom') {
    document.documentElement.removeAttribute('data-theme')
    if (customStyleEl.value) customStyleEl.value.textContent = ''
  }
}, { immediate: true })

/* ─── Button state ─── */
const loading = ref(false)

/* ─── Select state ─── */
const singleUser = ref('')
const multiTags = ref<string[]>([])
const searchCountry = ref('')
const maxTags = ref<string[]>([])

/* ─── CreatableSelect state ─── */
const creatableTags = ref<string[]>([])
const creatableSearch = ref('')
const emptyTags = ref<string[]>([])
const emptyOptions = ref<Array<{value: string, label: string}>>([])

const SKILLS = ref([
  { value: 'skill-js', label: 'JavaScript' },
  { value: 'skill-ts', label: 'TypeScript' },
  { value: 'skill-vue', label: 'Vue.js' },
  { value: 'skill-react', label: 'React' },
  { value: 'skill-node', label: 'Node.js' },
  { value: 'skill-python', label: 'Python' },
])

function handleCreateSkill(text: string) {
  const newId = `skill-${Date.now()}`
  SKILLS.value.push({ value: newId, label: text })
  // Component auto-selects; parent only adds to options
}

function handleSearchSkill(q: string) {
  creatableSearch.value = q
}

function handleCreateEmpty(text: string) {
  const newId = `empty-${Date.now()}`
  emptyOptions.value.push({ value: newId, label: text })
  // Component auto-selects; parent only adds to options
}

/* ─── DatePicker state ─── */
const pickedDate = ref('')
const minDate = ref('')
const maxDate = ref('')

/* ─── ColorPicker state ─── */
const pickedColor = ref('')

/* ─── Modal state ─── */
const basicOpen = ref(false)
const selectInModalOpen = ref(false)

/* ─── Select in modal test ─── */
const gymMembers = [
  { value: '1', label: 'Juan Pérez', subtitle: 'Plan: Premium' },
  { value: '2', label: 'María García', subtitle: 'Plan: Basic' },
  { value: '3', label: 'Carlos López', subtitle: 'Plan: Elite' },
  { value: '4', label: 'Ana Rodríguez', subtitle: 'Plan: Premium' },
  { value: '5', label: 'Pedro Sánchez', subtitle: 'Plan: Basic' },
  { value: '6', label: 'Laura Torres', subtitle: 'Plan: Elite' },
  { value: '7', label: 'Jorge Díaz', subtitle: 'Plan: Premium' },
  { value: '8', label: 'Sofia Moreno', subtitle: 'Plan: Basic' },
]
const selectedMember = ref('')

/* ─── CreatableSelect + DatePicker in modal test ─── */
const modalSkills = ref([
  { value: 'ms-js', label: 'JavaScript' },
  { value: 'ms-ts', label: 'TypeScript' },
  { value: 'ms-vue', label: 'Vue.js' },
])
const modalSelectedSkills = ref<string[]>([])
const modalClassDate = ref('')

function handleModalCreateSkill(text: string) {
  const newId = `ms-${Date.now()}`
  modalSkills.value.push({ value: newId, label: text })
}

/* ─── Checkbox state ─── */
const cbBasic = ref(false)
const cbError = ref(false)
const cbIndeterminate = ref(false)

/* ─── Toggle state ─── */
const tgBasic = ref(false)
const tgSm = ref(false)
const tgLg = ref(true)

/* ─── Textarea state ─── */
const textareaValue = ref('')

/* ─── Progress state ─── */
const progressValue = ref(65)

/* ─── Sidebar state ─── */
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const { matches: isMobileViewport } = useMediaQuery('(max-width: 639px)')
const { matches: isDesktopViewport } = useMediaQuery('(min-width: 768px)')

/* ─── Tag state ─── */
const tagList = ref([
  { label: 'React', variant: 'primary' as const },
  { label: 'Vue', variant: 'success' as const },
  { label: 'Svelte', variant: 'warning' as const },
  { label: 'Angular', variant: 'danger' as const },
])

/* ─── Pagination state ─── */
const currentPage = ref(1)

/* ─── Drawer state ─── */
const drawerOpen = ref(false)
const drawerPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right')

function openDrawer(placement: 'left' | 'right' | 'top' | 'bottom') {
  drawerPlacement.value = placement
  drawerOpen.value = true
}

/* ─── FileUpload state ─── */
const uploadedFiles = ref<InstanceType<typeof FileUpload>['$props']['modelValue']>([])

/* ─── Tabs state ─── */
const activeTab = ref('overview')
const TABS: TabItem[] = [
  { value: 'overview',     label: 'Overview' },
  { value: 'members',      label: 'Members' },
  { value: 'billing',      label: 'Billing' },
  { value: 'analytics',    label: 'Analytics' },
  { value: 'activity',     label: 'Activity' },
  { value: 'security',     label: 'Security' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'help',         label: 'Help' },
  { value: 'settings',     label: 'Settings', disabled: true },
]

/* ─── RadioGroup state ─── */
const radioOrientation = ref('horizontal')
const radioNotify = ref('email')
const radioError = ref('')
const NOTIFY_OPTIONS = [
  { value: 'email',  label: 'Email notifications' },
  { value: 'push',   label: 'Push notifications' },
  { value: 'sms',    label: 'SMS', disabled: true },
]

/* ─── Table state ─── */
const tableSelected = ref<string[]>([])
const tableSortKey = ref('')
const tableSortDir = ref<'asc' | 'desc'>('asc')
const tableLoading = ref(false)

const TABLE_COLUMNS: TableColumn[] = [
  { key: 'name',   label: 'Member',  sortable: true },
  { key: 'plan',   label: 'Plan',    sortable: true, width: '120px' },
  { key: 'status', label: 'Status',  width: '110px', align: 'center' },
  { key: 'joined', label: 'Joined',  sortable: true, width: '130px' },
  { key: 'actions',label: '',        width: '48px',  align: 'center' },
]

const TABLE_ROWS = [
  { id: '1', name: 'Alice Johnson',  plan: 'Pro',    status: 'active',   joined: '2024-01-15' },
  { id: '2', name: 'Bob Smith',      plan: 'Starter', status: 'active',  joined: '2024-03-02' },
  { id: '3', name: 'Charlie Davis',  plan: 'Pro',    status: 'paused',   joined: '2023-11-08' },
  { id: '4', name: 'Diana Prince',   plan: 'Elite',  status: 'active',   joined: '2024-02-20' },
  { id: '5', name: 'Evan Wright',    plan: 'Starter', status: 'expired', joined: '2023-08-14' },
]

const statusVariant = (s: string) =>
  s === 'active' ? 'success' : s === 'paused' ? 'warning' : 'danger'

/* ─── Calendar state ─── */
const calendarView = ref<CalendarView>('month')
const calendarDate = ref(toISODate(new Date()))
const selectedEvent = ref<CalendarEvent | null>(null)
const clickedDay = ref<string | null>(null)
const selectedSlot = ref<{ start: string; end: string } | null>(null)

function toISODate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDaysToDate(d: Date, days: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

const today = new Date()

function makeDatetime(date: Date, hour: number, minute: number): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(hour).padStart(2, '0')
  const min = String(minute).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}:00`
}

const calendarEvents = ref<CalendarEvent[]>([
  /* yesterday */
  { id: '1', title: 'Design Review', subtitle: 'Figma walkthrough', start: makeDatetime(addDaysToDate(today, -1), 10, 0), end: makeDatetime(addDaysToDate(today, -1), 11, 30), color: 'primary' },
  /* today */
  { id: '2', title: 'Team Standup', subtitle: 'Daily sync', start: makeDatetime(today, 9, 0), end: makeDatetime(today, 9, 30), color: 'primary' },
  { id: '3', title: 'Lunch with Client', start: makeDatetime(today, 12, 0), end: makeDatetime(today, 13, 30), color: 'success' },
  { id: '4', title: 'Sprint Planning', subtitle: 'Q3 roadmap', start: makeDatetime(today, 14, 0), end: makeDatetime(today, 15, 30), color: 'warning' },
  { id: '5', title: 'Holiday', start: makeDatetime(today, 0, 0), end: makeDatetime(today, 23, 59), allDay: true, color: 'danger' },
  /* tomorrow */
  { id: '6', title: '1:1 with Manager', subtitle: 'Career growth', start: makeDatetime(addDaysToDate(today, 1), 11, 0), end: makeDatetime(addDaysToDate(today, 1), 11, 45), color: 'secondary' },
  { id: '7', title: 'Code Review', start: makeDatetime(addDaysToDate(today, 1), 15, 0), end: makeDatetime(addDaysToDate(today, 1), 16, 0), color: '#8b5cf6' },
  /* future */
  { id: '8', title: 'Product Launch', subtitle: 'Marketing kickoff', start: makeDatetime(addDaysToDate(today, 2), 10, 0), end: makeDatetime(addDaysToDate(today, 2), 12, 0), color: 'accent' },
  { id: '9', title: 'Conference', start: makeDatetime(addDaysToDate(today, 3), 0, 0), end: makeDatetime(addDaysToDate(today, 3), 23, 59), allDay: true, color: 'success' },
  { id: '10', title: 'Backend Sync', start: makeDatetime(addDaysToDate(today, 3), 13, 0), end: makeDatetime(addDaysToDate(today, 3), 14, 0), color: 'danger' },
  { id: '11', title: 'User Testing', subtitle: 'Usability session', start: makeDatetime(addDaysToDate(today, 4), 9, 30), end: makeDatetime(addDaysToDate(today, 4), 11, 0), color: 'primary' },
  { id: '12', title: 'All-hands', start: makeDatetime(addDaysToDate(today, 4), 16, 0), end: makeDatetime(addDaysToDate(today, 4), 17, 0), color: 'warning' },
  { id: '13', title: 'Release Party', start: makeDatetime(addDaysToDate(today, 5), 18, 0), end: makeDatetime(addDaysToDate(today, 5), 21, 0), color: '#ec4899' },
  { id: '14', title: 'Quarterly Review', subtitle: 'Board presentation', start: makeDatetime(addDaysToDate(today, 6), 10, 0), end: makeDatetime(addDaysToDate(today, 6), 11, 30), color: 'secondary' },
])

/* ─── Demo data ─── */
const USERS = [
  { value: 'user-1', label: 'Alice Johnson', subtitle: 'Admin' },
  { value: 'user-2', label: 'Bob Smith', subtitle: 'Editor' },
  { value: 'user-3', label: 'Charlie Davis', subtitle: 'Viewer', disabled: true },
  { value: 'user-4', label: 'Diana Prince', subtitle: 'Admin' },
  { value: 'user-5', label: 'Evan Wright', subtitle: 'Editor' },
]

const COUNTRIES = [
  { value: 'us', label: 'United States', group: 'Americas' },
  { value: 'ca', label: 'Canada', group: 'Americas' },
  { value: 'mx', label: 'Mexico', group: 'Americas' },
  { value: 'gb', label: 'United Kingdom', group: 'Europe' },
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'jp', label: 'Japan', group: 'Asia' },
  { value: 'kr', label: 'South Korea', group: 'Asia' },
]

const TAGS = [
  { value: 'tag-react', label: 'React' },
  { value: 'tag-vue', label: 'Vue' },
  { value: 'tag-svelte', label: 'Svelte' },
  { value: 'tag-angular', label: 'Angular' },
  { value: 'tag-solid', label: 'Solid' },
  { value: 'tag-next', label: 'Next.js' },
  { value: 'tag-node', label: 'Node.js' },
  { value: 'tag-rust', label: 'Rust' },
]

const variants = ['default', 'secondary', 'outline', 'ghost', 'danger', 'link'] as const
const sizes = ['sm', 'md', 'lg'] as const
const modalSizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full']

/* ─── Modal demos ─── */
function openConfirmDialog() {
  modalManager.open(ConfirmDialog, { props: { message: 'This action cannot be undone.' }, size: 'sm' })
    .then((result) => {
      if (result.confirmed) alert('Confirmed!')
    })
}

function openFormDialog() {
  modalManager.open(FormDialog, { props: { reason: '' }, size: 'md' })
    .then((result) => {
      if (result.confirmed) alert('Form submitted!')
      else alert('Cancelled.')
    })
}

function openAckDialog() {
  modalManager.open(AckDialog, { size: 'sm', dismissible: false, escapeCloses: false })
    .then(() => alert('You acknowledged it!'))
}

/* ─── Demo dialog components ─── */
const ConfirmDialog = {
  props: ['message'],
  setup(props: { message: string }) {
    return () => h('p', { style: { margin: 0 } }, props.message)
  },
}

const FormDialog = {
  props: ['reason'],
  setup() {
    return { reason: ref('') }
  },
  render() {
    return h('div', [
      h('p', { style: { margin: '0 0 1rem' } }, 'Why are you leaving?'),
      h('input', {
        value: this.reason,
        style: { width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
        onInput: (e: Event) => { this.reason = (e.target as HTMLInputElement).value },
      }),
    ])
  },
}

const AckDialog = {
  setup() {
    return () => h('p', { style: { margin: 0 } },
      'Escape and outside-click are disabled. You must click the button below.')
  },
}
</script>

<template>
  <ModalProvider />
  <ToastProvider />

  <div class="themebar">
    <span class="themebar__label">Theme</span>
    <div class="themebar__pills">
      <button
        v-for="t in (['default', 'forja'] as const)"
        :key="t"
        class="themebar__pill"
        :class="{ 'themebar__pill--active': activeTheme === t }"
        @click="activeTheme = t as Theme"
      >
        {{ t.charAt(0).toUpperCase() + t.slice(1) }}
      </button>
    </div>
  </div>

  <!-- ─── Theme Tester ─── -->
  <section class="themeTester">
    <div class="themeTester__header">
      <h2 style="margin: 0">🎨 Theme Tester</h2>
      <Button
        variant="ghost"
        size="sm"
        style="margin-left: auto"
        @click="themeTesterOpen = !themeTesterOpen"
      >
        {{ themeTesterOpen ? 'Hide' : 'Show' }}
      </Button>
    </div>
    <Transition name="themeTester-slide">
      <div v-show="themeTesterOpen" class="themeTester__body">
        <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
          Paste custom CSS variables below and click <strong>Apply</strong> to see all components update instantly.
        </p>
        <div class="stack" style="max-width: 640px">
          <Textarea
            v-model="customThemeCss"
            :rows="8"
            resize="vertical"
            placeholder="/* Paste your custom theme CSS here */\n:root {\n  --agala-primary: 200 90% 50%;\n  --agala-background: 0 0% 98%;\n  --agala-card: 0 0% 100%;\n  /* … */\n}"
          />
          <div class="row" style="margin-bottom: 0">
            <Button variant="primary" icon @click="applyCustomTheme">
              <template #icon><AgalaIcon name="refresh" :size="14" /></template>
              Apply Custom Theme
            </Button>
            <Button variant="outline" @click="resetCustomTheme">Reset to Default</Button>
            <span v-if="activeTheme === 'custom'" class="muted" style="font-size: 0.75rem; margin-left: auto">
              ✅ Custom theme active
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </section>

  <div class="playground">
    <header>
      <h1>Agala UI</h1>
      <p>Elegant, modern, themable components. Toggle dark mode on your OS to switch palettes.</p>
    </header>

    <nav class="playground-nav">
      <a href="#btn">Button</a>
      <a href="#input">Input</a>
      <a href="#formfield">FormField</a>
      <a href="#select">Select</a>
      <a href="#creatable">Creatable</a>
      <a href="#datepicker">DatePicker</a>
      <a href="#calendar">Calendar</a>
      <a href="#colorpicker">ColorPicker</a>
      <a href="#modal">Modal</a>
      <a href="#badge">Badge</a>
      <a href="#checkbox">Checkbox</a>
      <a href="#toggle">Toggle</a>
      <a href="#avatar">Avatar</a>
      <a href="#toast">Toast</a>
      <a href="#textarea">Textarea</a>
      <a href="#dropdown">Dropdown</a>
      <a href="#table">Table</a>
      <a href="#tabs">Tabs</a>
      <a href="#card">Card</a>
      <a href="#tooltip">Tooltip</a>
      <a href="#radio">Radio</a>
      <a href="#navbar">Navbar</a>
      <a href="#sidebar">Sidebar</a>
      <a href="#accordion">Accordion</a>
      <a href="#skeleton">Skeleton</a>
      <a href="#stat">Stat</a>
      <a href="#progress">Progress</a>
      <a href="#tag">Tag</a>
      <a href="#pagination">Pagination</a>
      <a href="#drawer">Drawer</a>
      <a href="#fileupload">File</a>
      <a href="#alert">Alert</a>
      <a href="#charts">Charts</a>
    </nav>

    <!-- ─── DevEnvBanner ─── -->
    <section id="banner">
      <h2>DevEnvBanner</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">Close button removes the banner from the DOM. Refresh to reset.</p>
      <div class="stack" style="gap: 0">
        <DevEnvBanner />
        <DevEnvBanner text="Custom: Preview environment — data resets daily." class="custom-banner" />
      </div>
    </section>

    <!-- ─── Button ─── -->
    <section id="btn">
      <h2>Button — Variants</h2>
      <div class="row">
        <Button v-for="v in variants" :key="v" :variant="v">
          {{ v.charAt(0).toUpperCase() + v.slice(1) }}
        </Button>
      </div>
    </section>

    <section>
      <h2>Button — Sizes</h2>
      <div class="row">
        <Button v-for="s in sizes" :key="s" :size="s">{{ s.toUpperCase() }} button</Button>
      </div>
    </section>

    <section>
      <h2>Button — Icon</h2>
      <div class="row">
        <Button icon>Search</Button>
        <Button variant="outline" icon>Email</Button>
        <Button variant="ghost" icon>Ghost</Button>
        <Button size="icon" icon aria-label="Search" />
      </div>
    </section>

    <section>
      <h2>Button — States</h2>
      <div class="row">
        <Button disabled>Disabled</Button>
        <Button loading>Saving</Button>
        <Button
          :loading="loading"
          @click="loading = true; setTimeout(() => loading = false, 2000)"
        >
          {{ loading ? 'Working…' : 'Click to load' }}
        </Button>
        <Button block>Block</Button>
      </div>
    </section>

    <!-- ─── Input ─── -->
    <section id="input">
      <h2>Input — Default</h2>
      <div class="stack" style="max-width: 400px">
        <Input placeholder="Small" size="sm" />
        <Input placeholder="Medium (default)" />
        <Input placeholder="Large" size="lg" />
      </div>
    </section>

    <section>
      <h2>Input — With Icons</h2>
      <div class="stack" style="max-width: 400px">
        <Input placeholder="Search…" icon-start />
        <Input placeholder="you@example.com" icon-start />
        <Input placeholder="Password" type="password" icon-end />
      </div>
    </section>

    <section>
      <h2>Input — States</h2>
      <div class="stack" style="max-width: 400px">
        <Input placeholder="Disabled" disabled />
        <Input placeholder="Read-only" readonly value="me@agala.dev" />
        <Input placeholder="With error" error error-message="This field is required." />
      </div>
    </section>

    <!-- ─── FormField ─── -->
    <section id="formfield">
      <h2>FormField</h2>
      <div class="stack" style="max-width: 400px">
        <FormField label="Username" helper="Choose a unique username." html-for="user" required>
          <Input id="user" placeholder="agala" />
        </FormField>
        <FormField label="Email" helper="We'll never share your email." html-for="email2">
          <Input id="email2" placeholder="you@example.com" icon-start />
        </FormField>
        <FormField label="Password" error="Password must be at least 8 characters." html-for="pass" required>
          <Input id="pass" type="password" placeholder="••••••••" icon-end error />
        </FormField>
        <FormField label="Disabled field" disabled>
          <Input placeholder="Can't type here" disabled />
        </FormField>
      </div>
    </section>

    <!-- ─── Select ─── -->
    <section id="select">
      <h2>Select — Single</h2>
      <div class="stack" style="max-width: 400px">
        <Select :options="USERS" placeholder="Pick a user" v-model="singleUser" clearable />
        <Select :options="USERS" placeholder="Small" size="sm" />
        <Select :options="USERS" placeholder="Large" size="lg" />
      </div>
    </section>

    <section>
      <h2>Select — Multi-select</h2>
      <div class="stack" style="max-width: 400px">
        <Select :options="TAGS" placeholder="Pick tags (chips)" multiple clearable v-model="multiTags" />
      </div>
    </section>

    <section>
      <h2>Select — Searchable + Grouped</h2>
      <div class="stack" style="max-width: 400px">
        <Select :options="COUNTRIES" placeholder="Search countries…" searchable clearable v-model="searchCountry" />
      </div>
    </section>

    <section>
      <h2>Select — Max 3 selections</h2>
      <div class="stack" style="max-width: 400px">
        <Select :options="TAGS" placeholder="Pick up to 3 tags" multiple clearable :max-selections="3" v-model="maxTags" />
      </div>
    </section>

    <section>
      <h2>Select — Error + Disabled</h2>
      <div class="stack" style="max-width: 400px">
        <Select :options="USERS" placeholder="Something went wrong" error error-message="You must select at least one user." />
        <Select :options="USERS" placeholder="Disabled" disabled />
        <Select :options="[]" placeholder="Empty options" />
      </div>
    </section>

    <section>
      <h2>Select — Width Test (Flex Row)</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Two selects in a flex row with fixed widths — neither should stretch beyond its assigned width.
      </p>
      <div class="row" style="gap: 0.5rem; max-width: 400px; border: 1px dashed hsl(var(--agala-border)); padding: 0.5rem; border-radius: var(--agala-radius)">
        <Select :options="USERS" placeholder="180px" style="width: 180px" clearable />
        <Select :options="TAGS" placeholder="Flex:1" multiple clearable style="flex: 1" />
      </div>
    </section>

    <!-- ─── CreatableSelect ─── -->
    <section id="creatable">
      <h2>CreatableSelect — Basic</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Type to filter. When no match exists and creatable is true, a "Crear" option appears at the top.
        Press Enter on it to emit the <code>create</code> event with the typed text.
      </p>
      <div class="stack" style="max-width: 400px">
        <CreatableSelect
          v-model="creatableTags"
          :options="SKILLS"
          placeholder="Pick or create skills…"
          @create="handleCreateSkill"
          @search="handleSearchSkill"
        />
        <p class="muted" style="font-size: 0.75rem; margin: 0">
          Selected: {{ creatableTags.join(', ') || '—' }} · Last search query: {{ creatableSearch || '—' }}
        </p>
      </div>
    </section>

    <section>
      <h2>CreatableSelect — Disabled + Empty</h2>
      <div class="stack" style="max-width: 400px">
        <CreatableSelect :options="SKILLS" placeholder="Disabled select" disabled />
        <CreatableSelect
          v-model="emptyTags"
          :options="emptyOptions"
          placeholder="No options available"
          @create="handleCreateEmpty"
        />
      </div>
    </section>

    <!-- ─── DatePicker ─── -->
    <section id="datepicker">
      <h2>DatePicker — Sizes</h2>
      <div class="stack" style="max-width: 320px">
        <DatePicker v-model="pickedDate" size="sm" placeholder="Small" />
        <DatePicker v-model="pickedDate" size="md" placeholder="Medium (default)" />
        <DatePicker v-model="pickedDate" size="lg" placeholder="Large" />
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Selected: {{ pickedDate || '—' }}</p>
      <p class="muted" style="margin-top: 0.25rem; font-size: 0.875rem">Click the header to switch between day, month, and year views for fast navigation.</p>
    </section>

    <section>
      <h2>DatePicker — Clearable + Min/Max</h2>
      <div class="stack" style="max-width: 320px">
        <DatePicker v-model="pickedDate" clearable placeholder="Pick a date (clearable)" />
        <DatePicker v-model="minDate" :min="pickedDate || undefined" placeholder="Min = selected above" clearable />
        <DatePicker v-model="maxDate" :max="pickedDate || undefined" placeholder="Max = selected above" clearable />
      </div>
    </section>

    <section>
      <h2>DatePicker — Error + Disabled</h2>
      <div class="stack" style="max-width: 320px">
        <DatePicker placeholder="Error state" error error-message="Please select a valid date." />
        <DatePicker placeholder="Disabled" disabled />
      </div>
    </section>

    <!-- ─── Calendar ─── -->
    <section id="calendar">
      <h2>Calendar</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Interactive calendar with month, week, day, and list views. Click events or days to see debug info below.
      </p>
      <div style="height: 600px; border: 1px solid hsl(var(--agala-border)); border-radius: var(--agala-radius-lg); overflow: hidden">
        <Calendar
          v-model:view="calendarView"
          v-model:currentDate="calendarDate"
          :events="calendarEvents"
          @select="event => { selectedEvent = event; console.log('Selected event:', event.title) }"
          @day-click="date => { clickedDay = date; console.log('Clicked day:', date) }"
          @slot-select="slot => { selectedSlot = slot; console.log('Selected slot:', slot) }"
        />
      </div>
      <div style="margin-top: 0.75rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.25rem 1rem">
        <p class="muted" style="margin: 0; font-size: 0.875rem">Selected view: {{ calendarView }}</p>
        <p class="muted" style="margin: 0; font-size: 0.875rem">Current date: {{ calendarDate }}</p>
        <p class="muted" style="margin: 0; font-size: 0.875rem">Last selected event: {{ selectedEvent?.title || 'none' }}</p>
        <p class="muted" style="margin: 0; font-size: 0.875rem">Last clicked day: {{ clickedDay || 'none' }}</p>
        <p class="muted" style="margin: 0; font-size: 0.875rem">Last slot: {{ selectedSlot ? `${selectedSlot.start} → ${selectedSlot.end}` : 'none' }}</p>
      </div>
    </section>

    <!-- ═══════════════════ COLORPICKER ═══════════════════ -->
    <section>
      <h2>ColorPicker — Sizes</h2>
      <div class="stack" style="max-width: 320px">
        <ColorPicker v-model="pickedColor" size="sm" placeholder="Small" />
        <ColorPicker v-model="pickedColor" size="md" placeholder="Medium" />
        <ColorPicker v-model="pickedColor" size="lg" placeholder="Large" />
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Selected: {{ pickedColor || '—' }}</p>

      <h2>ColorPicker — Clearable + Error + Disabled</h2>
      <div class="stack" style="max-width: 320px">
        <ColorPicker v-model="pickedColor" clearable placeholder="Pick a color (clearable)" />
        <ColorPicker placeholder="Error state" error error-message="Please select a valid color." />
        <ColorPicker placeholder="Disabled" disabled />
      </div>
    </section>

    <!-- ─── Dark Mode ─── -->
    <section id="dark">
      <h2>Dark Mode</h2>
      <p class="muted">Toggle your OS dark mode preference to watch the tokens switch automatically.</p>
    </section>

    <!-- ═══════════════════ MODAL (Responsive) ═══════════════════ -->
    <section>
      <h2>Modal — Declarative</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Shrinks to near-full-width on viewports below 640 px automatically.
      </p>
      <div class="row">
        <Button @click="basicOpen = true">Open Basic Modal</Button>
      </div>
      <Modal :open="basicOpen" @close="basicOpen = false" title="Hello Modal">
        <p style="margin: 0 0 1rem">
          This is a fully declarative modal. You control its state with <code>v-model:open</code> or <code>open</code> and <code>@close</code> props.
        </p>
        <p class="muted" style="font-size: 0.875rem; margin: 0">
          Try pressing Escape, clicking outside, or the X button.
        </p>
        <template #footer="{ close }">
          <Button variant="outline" size="sm" @click="close">Close</Button>
          <Button size="sm" @click="basicOpen = false">Save Changes</Button>
        </template>
      </Modal>
    </section>

    <section>
      <h2>Dropdowns in Modal (positioning test)</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Open modal → scroll down → test Select, CreatableSelect, and DatePicker dropdowns. All should appear <strong>above the footer</strong>, not clipped.
      </p>
      <div class="row">
        <Button @click="selectInModalOpen = true">Open Modal with Select</Button>
      </div>
      <Modal :open="selectInModalOpen" @close="selectInModalOpen = false" title="Dropdown Positioning Test">
        <!-- Lots of content to force scrolling -->
        <p>Configuración de la clase de spinning del día lunes.</p>
        <p class="muted">Este contenido está aquí para forzar que el modal tenga scroll y el Select quede cerca del footer.</p>
        <div style="height: 150px; background: hsl(var(--agala-muted) / 0.3); border-radius: 8px; margin: 1rem 0; display: flex; align-items: center; justify-content: center; color: hsl(var(--agala-muted-foreground))">
          Placeholder de contenido adicional
        </div>
        <p>Más contenido para asegurar que hay scroll...</p>
        <p class="muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Aquí viene el Select cerca del footer:</p>
        
        <!-- Select near footer - this is the test case -->
        <Select
          v-model="selectedMember"
          :options="gymMembers"
          placeholder="Selecciona un instructor..."
          searchable
          style="margin-bottom: 1rem"
        />

        <p class="muted">Aquí viene el CreatableSelect cerca del footer:</p>
        <CreatableSelect
          v-model="modalSelectedSkills"
          :options="modalSkills"
          placeholder="Pick or create skills…"
          @create="handleModalCreateSkill"
          style="margin-bottom: 1rem"
        />

        <p class="muted">Aquí viene el DatePicker cerca del footer:</p>
        <DatePicker
          v-model="modalClassDate"
          placeholder="Pick a class date…"
          style="margin-bottom: 1rem; max-width: 320px"
        />

        <p class="muted">Más contenido después del select...</p>
        <p>Otra línea de contenido para llenar el modal.</p>
        
        <template #footer="{ close }">
          <Button variant="outline" size="sm" @click="close">Cancelar</Button>
          <Button size="sm" @click="selectInModalOpen = false">Confirmar</Button>
        </template>
      </Modal>
    </section>

    <section>
      <h2>Modal — Sizes</h2>
      <div class="row">
        <Button v-for="sz in modalSizes" :key="sz" variant="outline" size="sm" @click="basicOpen = true">
          {{ sz.toUpperCase() }}
        </Button>
      </div>
      <p class="muted">In real usage you'd wire each to its own state.</p>
    </section>

    <section>
      <h2>Modal — Imperative</h2>
      <div class="row">
        <Button variant="outline" @click="openConfirmDialog">Confirm Dialog</Button>
        <Button variant="outline" @click="openFormDialog">Custom Form</Button>
        <Button variant="outline" @click="openAckDialog">Forced Acknowledge</Button>
      </div>
      <p class="muted">
        Uses <code>modalManager.open()</code> — no Vue state needed. Returns a <code>Promise&lt;ModalResult&gt;</code>.
      </p>
    </section>

    <!-- ═══════════════════ BADGE ═══════════════════ -->
    <section>
      <h2>Badge — Variants</h2>
      <div class="row">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
      </div>
    </section>

    <section>
      <h2>Badge — Sizes + Dot</h2>
      <div class="row">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="danger" dot>Critical</Badge>
        <Badge variant="warning" dot size="sm">Pending</Badge>
      </div>
    </section>

    <!-- ═══════════════════ CHECKBOX ═══════════════════ -->
    <section>
      <h2>Checkbox</h2>
      <div class="stack" style="max-width: 320px">
        <Checkbox v-model="cbBasic" label="Accept terms and conditions" />
        <Checkbox v-model="cbError" label="Error state" :error="true" />
        <Checkbox v-model="cbIndeterminate" label="Indeterminate (select all)" :indeterminate="true" />
        <Checkbox label="Disabled unchecked" :disabled="true" />
        <Checkbox label="Disabled checked" :model-value="true" :disabled="true" />
      </div>
      <p class="muted" style="margin-top: 0.75rem; font-size: 0.875rem">cbBasic: {{ cbBasic }}</p>
    </section>

    <!-- ═══════════════════ TOGGLE ═══════════════════ -->
    <section>
      <h2>Toggle — Sizes</h2>
      <div class="row" style="align-items: center; gap: 1.5rem">
        <div class="row" style="align-items: center; gap: 0.5rem; margin: 0">
          <Toggle v-model="tgSm" size="sm" />
          <span style="font-size: 0.875rem">Small</span>
        </div>
        <div class="row" style="align-items: center; gap: 0.5rem; margin: 0">
          <Toggle v-model="tgBasic" size="md" />
          <span style="font-size: 0.875rem">Medium</span>
        </div>
        <div class="row" style="align-items: center; gap: 0.5rem; margin: 0">
          <Toggle v-model="tgLg" size="lg" />
          <span style="font-size: 0.875rem">Large</span>
        </div>
        <div class="row" style="align-items: center; gap: 0.5rem; margin: 0">
          <Toggle :model-value="true" :disabled="true" />
          <span style="font-size: 0.875rem">Disabled</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ AVATAR ═══════════════════ -->
    <section>
      <h2>Avatar — Sizes</h2>
      <div class="row" style="align-items: flex-end">
        <Avatar size="xs" fallback="XS" />
        <Avatar size="sm" fallback="SM" />
        <Avatar size="md" fallback="MD" />
        <Avatar size="lg" fallback="LG" />
        <Avatar size="xl" fallback="XL" />
      </div>
    </section>

    <section>
      <h2>Avatar — Fallbacks</h2>
      <div class="row" style="align-items: center">
        <Avatar src="https://i.pravatar.cc/150?img=1" alt="Alice" size="md" />
        <Avatar src="https://i.pravatar.cc/150?img=2" alt="Bob" size="md" />
        <Avatar fallback="JD" size="md" />
        <Avatar fallback="AB" size="md" />
        <Avatar size="md" />
        <Avatar src="https://broken.url/img.png" fallback="ER" size="md" />
      </div>
      <p class="muted" style="font-size: 0.875rem; margin-top: 0.5rem">Last avatar has a broken src — falls back to initials.</p>
    </section>

    <!-- ═══════════════════ TOAST ═══════════════════ -->
    <section>
      <h2>Toast</h2>
      <div class="row">
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'Everything looks good.' })">
          Default
        </Button>
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'Your changes have been saved.', variant: 'success' })">
          Success
        </Button>
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'Your subscription expires in 3 days.', variant: 'warning' })">
          Warning
        </Button>
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'Payment failed. Please retry.', variant: 'danger' })">
          Danger
        </Button>
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'File uploaded successfully.', variant: 'success', action: { label: 'View', onClick: () => alert('Viewing!') } })">
          With Action
        </Button>
        <Button variant="outline" size="sm"
          @click="toastManager.show({ message: 'This toast will stay until dismissed.', duration: 0 })">
          Persistent
        </Button>
      </div>
      <p class="muted" style="font-size: 0.875rem">Toasts appear bottom-right. Default auto-dismiss after 4s.</p>
    </section>

    <!-- ═══════════════════ TEXTAREA ═══════════════════ -->
    <section>
      <h2>Textarea</h2>
      <div class="stack" style="max-width: 480px">
        <FormField label="Notes" html-for="ta1" helper="Resize vertically by default.">
          <Textarea id="ta1" v-model="textareaValue" placeholder="Write something…" />
        </FormField>
        <FormField label="Fixed height" html-for="ta2">
          <Textarea id="ta2" :rows="2" resize="none" placeholder="No resize, 2 rows" />
        </FormField>
        <FormField label="Error state" html-for="ta3" error="This field is required.">
          <Textarea id="ta3" placeholder="Required field" error error-message="" />
        </FormField>
        <Textarea placeholder="Disabled textarea" :disabled="true" />
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Value: {{ textareaValue || '—' }}</p>
    </section>

    <!-- ═══════════════════ DROPDOWN MENU ═══════════════════ -->
    <section>
      <h2>DropdownMenu</h2>
      <div class="row">
        <DropdownMenu
          :items="[
            { label: 'View profile', icon: 'user', onClick: () => toastManager.show({ message: 'View profile', variant: 'default' }) },
            { label: 'Edit',         icon: 'search', onClick: () => toastManager.show({ message: 'Edit clicked' }) },
            { separator: true },
            { label: 'Delete',       icon: 'x', variant: 'danger', onClick: () => toastManager.show({ message: 'Deleted!', variant: 'danger' }) },
          ]"
          placement="bottom-start"
        >
          <template #trigger>
            <Button variant="outline" size="sm">Actions</Button>
          </template>
        </DropdownMenu>

        <DropdownMenu
          :items="[
            { label: 'Edit row', icon: 'search' },
            { label: 'Duplicate', icon: 'flag' },
            { separator: true },
            { label: 'Archive', icon: 'x', disabled: true },
            { separator: true },
            { label: 'Delete', icon: 'x', variant: 'danger', onClick: () => toastManager.show({ message: 'Row deleted', variant: 'danger' }) },
          ]"
          placement="bottom-end"
        >
          <template #trigger>
            <Button size="icon" variant="ghost" aria-label="Row actions" icon />
          </template>
        </DropdownMenu>
      </div>
      <p class="muted" style="font-size: 0.875rem">Left: bottom-start, Right: bottom-end (kebab trigger). Arrow keys + Enter navigate.</p>
    </section>

    <!-- ═══════════════════ TABLE ═══════════════════ -->
    <section>
      <h2>Table</h2>
      <div class="row" style="margin-bottom: 0.75rem">
        <Button
          variant="outline"
          size="sm"
          :loading="tableLoading"
          @click="tableLoading = !tableLoading"
        >
          {{ tableLoading ? 'Stop loading' : 'Toggle loading' }}
        </Button>
        <span v-if="tableSelected.length" class="muted" style="font-size: 0.875rem">
          {{ tableSelected.length }} row(s) selected
        </span>
      </div>

      <Table
        :columns="TABLE_COLUMNS"
        :rows="TABLE_ROWS"
        :loading="tableLoading"
        selectable
        v-model:selected-rows="tableSelected"
        v-model:sort-key="tableSortKey"
        v-model:sort-dir="tableSortDir"
        @row-click="row => toastManager.show({ message: `Clicked: ${row.name}` })"
      >
        <template #cell-name="{ row }">
          <div style="display: flex; align-items: center; gap: 0.5rem">
            <Avatar :fallback="String(row.name).slice(0, 2)" size="sm" />
            <span style="font-weight: 500">{{ row.name }}</span>
          </div>
        </template>

        <template #cell-plan="{ value }">
          <Badge variant="secondary" size="sm">{{ value }}</Badge>
        </template>

        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(String(value))" dot size="sm">{{ value }}</Badge>
        </template>

        <template #cell-actions>
          <DropdownMenu
            :items="[
              { label: 'View', icon: 'user' },
              { label: 'Edit', icon: 'search' },
              { separator: true },
              { label: 'Delete', icon: 'x', variant: 'danger', onClick: () => toastManager.show({ message: 'Deleted', variant: 'danger' }) },
            ]"
            placement="bottom-end"
          >
            <template #trigger>
              <Button size="icon" variant="ghost" aria-label="Row actions" icon />
            </template>
          </DropdownMenu>
        </template>

        <template #footer>
          <span class="muted" style="font-size: 0.875rem">Showing {{ TABLE_ROWS.length }} of {{ TABLE_ROWS.length }} members</span>
          <div style="display: flex; gap: 0.5rem">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </template>
      </Table>

      <p class="muted" style="margin-top: 0.75rem; font-size: 0.875rem">
        Sort key: <strong>{{ tableSortKey || '—' }}</strong> {{ tableSortDir }} · Selected IDs: {{ tableSelected.join(', ') || '—' }}
      </p>
    </section>

    <!-- ═══════════════════ STAT ═══════════════════ -->
    <section>
      <h2>Stat</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem">
        <Stat label="Total Members" value="2,841" :trend="12.5" trend-label="vs last month" />
        <Stat label="Active Now"    value="184"   :trend="3.2"  trend-label="vs yesterday" />
        <Stat label="Churn Rate"    value="2.4%"  :trend="-0.8" trend-label="vs last month" />
        <Stat label="MRR"           value="$18,420" :trend="0" trend-label="no change" />
      </div>
    </section>

    <!-- ═══════════════════ EMPTY STATE ═══════════════════ -->
    <section>
      <h2>EmptyState</h2>
      <Card style="max-width: 480px">
        <EmptyState
          title="No members found"
          description="Try adjusting your search or filters, or invite new members to get started."
        >
          <template #action>
            <Button size="sm">Invite member</Button>
          </template>
        </EmptyState>
      </Card>
    </section>

    <!-- ═══════════════════ PROGRESS ═══════════════════ -->
    <section>
      <h2>Progress — Linear</h2>
      <div class="stack" style="max-width: 480px; gap: 1rem">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: hsl(var(--agala-muted-foreground))">Value: {{ progressValue }}% — drag to change</p>
          <input type="range" min="0" max="100" v-model.number="progressValue" style="width: 100%; margin-bottom: 0.75rem" />
          <div class="stack" style="gap: 0.625rem">
            <Progress :value="progressValue" color="primary" size="sm" />
            <Progress :value="progressValue" color="success" size="md" />
            <Progress :value="progressValue" color="warning" size="lg" />
            <Progress :value="progressValue" color="danger"  size="md" />
          </div>
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: hsl(var(--agala-muted-foreground))">Indeterminate</p>
          <Progress indeterminate />
        </div>
      </div>

      <h2 style="margin-top: 2rem">Progress — Circular</h2>
      <div class="row" style="align-items: center; gap: 1.5rem">
        <Progress variant="circular" :value="progressValue" color="primary" size="sm" />
        <Progress variant="circular" :value="progressValue" color="success" size="md" />
        <Progress variant="circular" :value="progressValue" color="warning" size="lg" />
        <Progress variant="circular" :value="progressValue" color="danger"  size="lg" />
        <Progress variant="circular" indeterminate size="md" />
      </div>
    </section>

    <!-- ═══════════════════ TAG ═══════════════════ -->
    <section>
      <h2>Tag — Variants</h2>
      <div class="row" style="flex-wrap: wrap">
        <Tag label="Default" />
        <Tag label="Primary" variant="primary" />
        <Tag label="Secondary" variant="secondary" />
        <Tag label="Success" variant="success" />
        <Tag label="Warning" variant="warning" />
        <Tag label="Danger" variant="danger" />
        <Tag label="Outline" variant="outline" />
      </div>

      <h2 style="margin-top: 1.5rem">Tag — Sizes + Removable</h2>
      <div class="row" style="flex-wrap: wrap">
        <Tag
          v-for="(t, i) in tagList"
          :key="t.label"
          :label="t.label"
          :variant="t.variant"
          removable
          @remove="tagList.splice(i, 1)"
        />
        <Tag label="Small" size="sm" removable />
        <Tag label="Disabled" disabled removable />
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Click the × to remove. Removable tags emit a <code>remove</code> event.</p>
    </section>

    <!-- ═══════════════════ PAGINATION (Responsive) ═══════════════════ -->
    <section>
      <h2>Pagination — Responsive</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Switches to compact mode (Prev / "Page X of Y" / Next) on viewports below 640 px.
      </p>
      <div class="row">
        <Pagination v-model="currentPage" :total="120" :page-size="10" />
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Current page: <strong>{{ currentPage }}</strong> of 12</p>

      <h2 style="margin-top: 1.5rem">Pagination — Compact (forced)</h2>
      <div class="row">
        <Pagination v-model="currentPage" :total="500" :page-size="10" :sibling-count="0" :show-edges="false" />
      </div>
    </section>

    <!-- ═══════════════════ DRAWER ═══════════════════ -->
    <section>
      <h2>Drawer — Placements</h2>
      <div class="row">
        <Button variant="outline" @click="openDrawer('left')">Left</Button>
        <Button variant="outline" @click="openDrawer('right')">Right</Button>
        <Button variant="outline" @click="openDrawer('top')">Top</Button>
        <Button variant="outline" @click="openDrawer('bottom')">Bottom</Button>
      </div>
      <Drawer
        :open="drawerOpen"
        :placement="drawerPlacement"
        :title="`${drawerPlacement.charAt(0).toUpperCase() + drawerPlacement.slice(1)} Drawer`"
        @close="drawerOpen = false"
      >
        <p style="margin: 0 0 1rem">This is a slide-in drawer from the <strong>{{ drawerPlacement }}</strong>.</p>
        <p class="muted" style="font-size: 0.875rem; margin: 0">Press Escape, click the backdrop, or the X button to close.</p>
        <template #footer="{ close }">
          <Button variant="outline" size="sm" @click="close">Cancel</Button>
          <Button size="sm" @click="drawerOpen = false">Save</Button>
        </template>
      </Drawer>
    </section>

    <!-- ═══════════════════ FILE UPLOAD ═══════════════════ -->
    <section>
      <h2>FileUpload</h2>
      <div class="stack" style="max-width: 480px">
        <FileUpload
          v-model="uploadedFiles"
          multiple
          accept="image/*,.pdf"
          :max-size="2 * 1024 * 1024"
          :max-files="5"
          label="Upload documents"
          helper="Images and PDFs up to 2 MB, max 5 files"
          @change="files => toastManager.show({ message: `${files.length} file(s) added`, variant: 'default' })"
          @remove="file => toastManager.show({ message: `Removed ${file.name}`, variant: 'default' })"
          @error="msg => toastManager.show({ message: msg, variant: 'danger' })"
        />
      </div>
    </section>

    <!-- ═══════════════════ NAVBAR (Responsive) ═══════════════════ -->
    <section>
      <h2>Navbar — Responsive</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Brand text truncates with ellipsis on narrow viewports.
      </p>
      <div style="border: 1px solid hsl(var(--agala-border)); border-radius: var(--agala-radius-lg); overflow: hidden">
        <Navbar>
          <template #brand>
            My Very Long Application Name
          </template>
          <Button variant="ghost" size="sm">Dashboard</Button>
          <Button variant="ghost" size="sm">Members</Button>
          <Button variant="ghost" size="sm">Settings</Button>
          <template #actions>
            <Button variant="outline" size="sm">Upgrade</Button>
            <Avatar fallback="JD" size="sm" />
          </template>
        </Navbar>
        <div style="padding: 1.25rem; font-size: 0.875rem; color: hsl(var(--agala-muted-foreground)); border-top: 1px solid hsl(var(--agala-border));">
          Page content goes here. Resize to &lt;640 px to see the brand name truncate with ellipsis.
        </div>
      </div>
    </section>

    <!-- ═══════════════════ SIDEBAR (Responsive) ═══════════════════ -->
    <section>
      <h2>Sidebar — Responsive</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Auto-collapses to icon-only on tablet (640–768 px). Hidden on mobile (&lt;640 px) — use the toggle to open the Drawer.
      </p>
      <div style="border: 1px solid hsl(var(--agala-border)); border-radius: var(--agala-radius-lg); overflow: hidden">
        <Navbar>
          <template #brand>
            <SidebarToggle
              v-if="isMobileViewport"
              aria-controls="responsive-sidebar"
              :aria-expanded="sidebarOpen"
              @click="sidebarOpen = !sidebarOpen"
            />
            <Button
              v-else-if="isDesktopViewport"
              variant="ghost"
              size="icon"
              :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
              :aria-expanded="!sidebarCollapsed"
              aria-controls="responsive-sidebar"
              @click="sidebarCollapsed = !sidebarCollapsed"
            >
              <AgalaIcon name="panel-left" :size="18" />
            </Button>
            <span style="font-weight: 600; font-size: 0.875rem; margin-left: 0.5rem">My App</span>
          </template>
          <Button variant="ghost" size="sm">Dashboard</Button>
          <Button variant="ghost" size="sm">Members</Button>
          <template #actions>
            <Avatar fallback="JD" size="sm" />
          </template>
        </Navbar>
        <div style="display: flex; height: 420px; border-top: 1px solid hsl(var(--agala-border));">
          <Sidebar
            id="responsive-sidebar"
            :responsive="true"
            v-model:collapsed="sidebarCollapsed"
            v-model:open="sidebarOpen"
          >
            <!-- No #header when paired with Navbar — app identity lives in Navbar #brand -->

            <SidebarGroup label="Operación">
              <SidebarItem icon="home" label="Panel" active />
              <SidebarItem icon="users" label="Socios" badge="248" />
              <SidebarItem icon="key" label="Accesos" dot dot-variant="danger" />
              <SidebarItem icon="calendar" label="Agenda" />
              <SidebarItem icon="clock" label="Horarios" />
            </SidebarGroup>

            <SidebarGroup label="Comercial">
              <SidebarItem icon="document" label="Planes" />
              <SidebarItem icon="refresh" label="Renovaciones" badge="59" badge-variant="danger" />
              <SidebarItem icon="bell" label="Notificaciones" />
              <SidebarItem icon="credit-card" label="Pagos" />
              <SidebarItem icon="chart-bar" label="Reportes" />
            </SidebarGroup>

            <SidebarGroup label="Sistema">
              <SidebarItem icon="settings" label="Configuración" />
              <SidebarItem icon="user" label="Perfil" />
            </SidebarGroup>

            <template #footer="{ collapsed }">
              <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; padding: 0 0.25rem">
                <Avatar fallback="MA" size="sm" style="flex-shrink: 0" />
                <div v-if="!collapsed" style="display: flex; flex-direction: column; min-width: 0">
                  <span style="font-size: 0.75rem; font-weight: 600; white-space: nowrap">Mariana Acosta</span>
                  <span class="muted" style="font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap">Owner</span>
                </div>
              </div>
            </template>
          </Sidebar>
          <div style="flex: 1; padding: 1.25rem; font-size: 0.875rem; color: hsl(var(--agala-muted-foreground))">
            Main content area. Resize the viewport to see responsive behavior:
            <ul style="margin: 0.5rem 0; padding-left: 1.25rem">
              <li><strong>Desktop (&gt;768 px):</strong> full sidebar with optional manual collapse.</li>
              <li><strong>Tablet (640–768 px):</strong> auto-collapses to icon-only (64 px).</li>
              <li><strong>Mobile (&lt;640 px):</strong> sidebar hidden; use the toggle to open the Drawer.</li>
            </ul>
          </div>
        </div>
      </div>
      <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Collapsed: {{ sidebarCollapsed }} · Drawer open: {{ sidebarOpen }}</p>
    </section>

    <!-- ═══════════════════ ACCORDION ═══════════════════ -->
    <section>
      <h2>Accordion — Single open</h2>
      <Accordion style="max-width: 560px">
        <AccordionItem value="q1" title="What is Agala UI?">
          A zero-dependency Vue 3 component library with full design token theming. Drop it into any project and
          customize every color, radius, shadow, and font via CSS custom properties.
        </AccordionItem>
        <AccordionItem value="q2" title="Does it support dark mode?">
          Yes. All tokens respond to <code>prefers-color-scheme: dark</code> automatically. You can also force a
          theme by setting <code>data-theme</code> on the root element.
        </AccordionItem>
        <AccordionItem value="q3" title="Can I use a custom theme?">
          Absolutely. Override any token in your project's CSS. The Forja theme above is an example — one CSS file
          changes the entire look of the library.
        </AccordionItem>
        <AccordionItem value="q4" title="Disabled item (cannot open)" :disabled="true">
          This content is unreachable.
        </AccordionItem>
      </Accordion>

      <h2 style="margin-top: 2rem">Accordion — Multiple open</h2>
      <Accordion :multiple="true" style="max-width: 560px">
        <AccordionItem value="a" title="Section A">Content for section A. Multiple items can be open simultaneously.</AccordionItem>
        <AccordionItem value="b" title="Section B">Content for section B. Click any header to toggle independently.</AccordionItem>
        <AccordionItem value="c" title="Section C">Content for section C.</AccordionItem>
      </Accordion>
    </section>

    <!-- ═══════════════════ SKELETON ═══════════════════ -->
    <section>
      <h2>Skeleton — Variants</h2>
      <div class="stack" style="max-width: 480px; gap: 0.75rem">
        <Skeleton variant="line" />
        <Skeleton variant="line" width="60%" />
        <Skeleton variant="line" width="80%" />
        <Skeleton variant="rect" height="6rem" />
        <div style="display: flex; align-items: center; gap: 0.75rem">
          <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem">
            <Skeleton variant="line" width="50%" />
            <Skeleton variant="line" width="75%" />
          </div>
        </div>
      </div>
      <p class="muted" style="margin-top: 0.75rem; font-size: 0.875rem">Shimmer animation. Use inside Table's loading state, Card loading states, or anywhere content is pending.</p>
    </section>

    <!-- ═══════════════════ TABS (Responsive) ═══════════════════ -->
    <section>
      <h2>Tabs — Responsive</h2>
      <p class="muted" style="margin: 0 0 0.75rem; font-size: 0.875rem">
        Horizontal scroll on viewports below 640 px. Many tabs are shown below to exercise scrolling.
      </p>
      <Tabs :tabs="TABS" v-model="activeTab">
        <template #panel-overview>
          <Card>
            <template #header>Overview</template>
            <p style="margin: 0">This is the overview panel. Rendered inside a Card for demonstration.</p>
          </Card>
        </template>
        <template #panel-members>
          <p style="margin: 0">Members panel content goes here.</p>
        </template>
        <template #panel-billing>
          <p style="margin: 0">Billing panel — invoices, payment methods, etc.</p>
        </template>
        <template #panel-analytics>
          <p style="margin: 0">Analytics panel — charts, metrics, and trends.</p>
        </template>
        <template #panel-activity>
          <p style="margin: 0">Activity panel — recent events and logs.</p>
        </template>
        <template #panel-security>
          <p style="margin: 0">Security panel — 2FA, sessions, and audit logs.</p>
        </template>
        <template #panel-integrations>
          <p style="margin: 0">Integrations panel — connected apps and webhooks.</p>
        </template>
        <template #panel-help>
          <p style="margin: 0">Help panel — documentation and support links.</p>
        </template>
      </Tabs>
      <p class="muted" style="margin-top: 0.75rem; font-size: 0.875rem">Active tab: <strong>{{ activeTab }}</strong> · "Settings" is disabled.</p>
    </section>

    <!-- ═══════════════════ CARD ═══════════════════ -->
    <section>
      <h2>Card — Padding Variants</h2>
      <div class="row" style="align-items: flex-start">
        <Card padding="sm" style="width: 180px">
          <template #header>Small</template>
          <p style="margin: 0; font-size: 0.875rem">padding: sm</p>
        </Card>
        <Card padding="md" style="width: 180px">
          <template #header>Medium</template>
          <p style="margin: 0; font-size: 0.875rem">padding: md (default)</p>
        </Card>
        <Card padding="lg" style="width: 180px">
          <template #header>Large</template>
          <p style="margin: 0; font-size: 0.875rem">padding: lg</p>
        </Card>
      </div>
      <h2 style="margin-top: 1.5rem">Card — With Footer</h2>
      <Card style="max-width: 360px">
        <template #header>Delete account</template>
        <p style="margin: 0; font-size: 0.875rem; color: hsl(var(--agala-muted-foreground))">
          This action is permanent and cannot be undone.
        </p>
        <template #footer>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="danger" size="sm">Delete</Button>
        </template>
      </Card>

      <h2 style="margin-top: 1.5rem">Card — Accent Borders</h2>
      <div class="row" style="align-items: flex-start">
        <Card accent="top" accent-color="primary" style="width: 180px">
          <template #header>Top Primary</template>
          <p style="margin: 0; font-size: 0.875rem">accent: top</p>
        </Card>
        <Card accent="left" accent-color="danger" style="width: 180px">
          <template #header>Left Danger</template>
          <p style="margin: 0; font-size: 0.875rem">accent: left</p>
        </Card>
        <Card accent="bottom" accent-color="success" style="width: 180px">
          <template #header>Bottom Success</template>
          <p style="margin: 0; font-size: 0.875rem">accent: bottom</p>
        </Card>
        <Card accent="right" accent-color="warning" style="width: 180px">
          <template #header>Right Warning</template>
          <p style="margin: 0; font-size: 0.875rem">accent: right</p>
        </Card>
        <Card accent="top" accent-color="#8b5cf6" style="width: 180px">
          <template #header>Custom Hex</template>
          <p style="margin: 0; font-size: 0.875rem">accentColor: #8b5cf6</p>
        </Card>
      </div>
    </section>

    <!-- ═══════════════════ TOOLTIP ═══════════════════ -->
    <section>
      <h2>Tooltip — Placements</h2>
      <div class="row" style="gap: 2rem; justify-content: center; padding: 3rem 0">
        <Tooltip content="Top tooltip" placement="top">
          <Button variant="outline" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" placement="bottom">
          <Button variant="outline" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" placement="left">
          <Button variant="outline" size="sm">Left</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" placement="right">
          <Button variant="outline" size="sm">Right</Button>
        </Tooltip>
        <Tooltip content="Appears after 600ms" :delay="600">
          <Button variant="outline" size="sm">Slow (600ms)</Button>
        </Tooltip>
      </div>
      <p class="muted" style="font-size: 0.875rem">Hover or focus any button. Delay defaults to 300ms.</p>
    </section>

    <!-- ═══════════════════ RADIO GROUP ═══════════════════ -->
    <section>
      <h2>RadioGroup</h2>
      <div class="row" style="align-items: flex-start; gap: 3rem">
        <div>
          <p style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600">Vertical (default)</p>
          <RadioGroup
            :options="NOTIFY_OPTIONS"
            v-model="radioNotify"
          />
          <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Selected: {{ radioNotify }}</p>
        </div>
        <div>
          <p style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600">Horizontal</p>
          <RadioGroup
            :options="[
              { value: 'h', label: 'Horizontal' },
              { value: 'v', label: 'Vertical' },
            ]"
            v-model="radioOrientation"
            orientation="horizontal"
          />
          <p class="muted" style="margin-top: 0.5rem; font-size: 0.875rem">Selected: {{ radioOrientation }}</p>
        </div>
        <div>
          <p style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600">Error state</p>
          <RadioGroup
            :options="[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]"
            v-model="radioError"
            :error="true"
          />
        </div>
        <div>
          <p style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 600">Disabled</p>
          <RadioGroup
            :options="[{ value: 'x', label: 'Option X' }, { value: 'y', label: 'Option Y' }]"
            model-value="x"
            :disabled="true"
          />
        </div>
      </div>
    </section>

    <!-- ─── Alert ─── -->
    <section id="alert">
      <h2>Alert — Variants</h2>
      <div class="stack" style="max-width: 600px">
        <Alert variant="info">This is an informational message.</Alert>
        <Alert variant="success">Your changes have been saved successfully.</Alert>
        <Alert variant="warning">Your session will expire in 5 minutes.</Alert>
        <Alert variant="danger">An error occurred while processing your request.</Alert>
      </div>

      <h2 style="margin-top: 1.5rem">Alert — With Title</h2>
      <div class="stack" style="max-width: 600px">
        <Alert variant="info" title="Did you know?">
          You can customize the entire look of your dashboard using the theme settings.
        </Alert>
        <Alert variant="success" title="All good!">
          Your profile has been updated and changes are now live.
        </Alert>
        <Alert variant="warning" title="Heads up">
          You have used 85% of your storage quota. Consider upgrading your plan.
        </Alert>
        <Alert variant="danger" title="Update failed">
          The system encountered an unexpected error. Please try again later.
        </Alert>
      </div>

      <h2 style="margin-top: 1.5rem">Alert — Dismissible</h2>
      <div class="stack" style="max-width: 600px">
        <Alert variant="info" title="Welcome back!" dismissible>
          You have 3 new notifications waiting for you.
        </Alert>
        <Alert variant="warning" dismissible>
          This alert can be dismissed by clicking the × button.
        </Alert>
      </div>

      <h2 style="margin-top: 1.5rem">Alert — Flat (icon + text, minimal)</h2>
      <div class="stack" style="max-width: 600px">
        <Alert variant="info" flat>New updates are available.</Alert>
        <Alert variant="success" flat>Changes saved.</Alert>
        <Alert variant="warning" flat>Session expires in 5 minutes.</Alert>
        <Alert variant="danger" flat>Connection lost. Reconnecting…</Alert>
      </div>
    </section>

    <!-- ─── Charts (from @el-agala/charts) ─── -->
    <section>
      <h2>Charts — BaseChart</h2>
      <div class="charts-grid" style="max-width: 900px">
        <div class="chart-item" style="background: hsl(var(--agala-card)); border-radius: var(--agala-radius); padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600;">Line</h3>
          <BaseChart
            type="line"
            :labels="['Jan','Feb','Mar','Apr','May','Jun']"
            :datasets="[{ name: 'Revenue', data: [1200, 1900, 1500, 2100, 1800, 2400], smooth: true, areaStyle: true }]"
            :height="250"
          />
        </div>
        <div class="chart-item" style="background: hsl(var(--agala-card)); border-radius: var(--agala-radius); padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600;">Bar</h3>
          <BaseChart
            type="bar"
            :labels="['Mon','Tue','Wed','Thu','Fri','Sat','Sun']"
            :datasets="[{ name: 'Check-ins', data: [45, 52, 38, 61, 48, 72, 80] }]"
            :height="250"
          />
        </div>
        <div class="chart-item" style="background: hsl(var(--agala-card)); border-radius: var(--agala-radius); padding: 1rem;">
          <h3 style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600;">Pie</h3>
          <BaseChart
            type="pie"
            :labels="['Active','Inactive','Pending']"
            :datasets="[{ data: [65, 20, 15] }]"
            :height="250"
          />
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.playground {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  font-family: var(--agala-font-sans);
  color: hsl(var(--agala-foreground));
}

.playground > header {
  margin-bottom: 3rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: var(--agala-letter-spacing-tight);
  margin: 0 0 0.5rem;
}

.playground > header > p {
  color: hsl(var(--agala-muted-foreground));
  margin: 0;
}

h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem;
}


section {
  margin-bottom: 3rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.muted {
  color: hsl(var(--agala-muted-foreground));
}

/* ─── Playground Nav ─── */
.playground-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid hsl(var(--agala-border));
}
.playground-nav a {
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--agala-muted-foreground));
  text-decoration: none;
  padding: 0.125rem 0.375rem;
  border-radius: var(--agala-radius-sm);
  transition: color var(--agala-transition-fast), background var(--agala-transition-fast);
}
.playground-nav a:hover {
  color: hsl(var(--agala-foreground));
  background: hsl(var(--agala-muted));
}
.playground-nav a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--agala-ring));
}

/* ─── Charts grid ─── */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

@media (max-width: 640px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

/* ─── Theme switcher bar ─── */
.themebar {
  position: fixed;
  top: 1rem;
  right: 1.5rem;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  background: hsl(var(--agala-card));
  border: 1px solid hsl(var(--agala-border));
  border-radius: calc(var(--agala-radius) + 4px);
  box-shadow: var(--agala-shadow-md);
  transition: background var(--agala-transition-base), border-color var(--agala-transition-base);
}

.themebar__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: hsl(var(--agala-muted-foreground));
  user-select: none;
}

.themebar__pills {
  display: flex;
  gap: 0.25rem;
}

.themebar__pill {
  padding: 0.25rem 0.625rem;
  border: 1px solid transparent;
  border-radius: calc(var(--agala-radius));
  font-family: var(--agala-font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--agala-muted-foreground));
  background: transparent;
  cursor: pointer;
  transition: all var(--agala-transition-fast);
}

.themebar__pill:hover {
  color: hsl(var(--agala-foreground));
  background: hsl(var(--agala-accent));
}

.themebar__pill--active {
  background: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
  border-color: transparent;
}

/* ─── Theme Tester ─── */
.themeTester {
  position: sticky;
  top: 0;
  z-index: 998;
  background: hsl(var(--agala-card));
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  padding: 1.5rem 1.5rem;
  box-shadow: var(--agala-shadow-sm);
}

.themeTester h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}
</style>
