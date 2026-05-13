<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useMediaQuery } from '../../composables/useMediaQuery'
import type { TabsProps, TabItem } from './types'

let idCounter = 0

const props = withDefaults(defineProps<TabsProps>(), {})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

idCounter += 1
const uid = `tabs-${idCounter}`

const { matches: isMobile } = useMediaQuery('(max-width: 639px)')
const activeTabRef = ref<HTMLElement | null>(null)
const tabListRef = ref<HTMLElement | null>(null)

function setActiveTabRef(el: Element | null) {
  activeTabRef.value = el as HTMLElement | null
}
const hasOverflow = ref(false)

function checkOverflow() {
  if (tabListRef.value) {
    hasOverflow.value = tabListRef.value.scrollWidth > tabListRef.value.clientWidth
  }
}

onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOverflow)
})

watch(() => props.tabs, checkOverflow, { deep: true })

watch(() => props.modelValue, () => {
  if (isMobile.value) {
    nextTick(() => {
      activeTabRef.value?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }
})

const enabledTabs = computed(() => props.tabs.filter(t => !t.disabled))

function select(tab: TabItem) {
  if (!tab.disabled) emit('update:modelValue', tab.value)
}

function handleKeyDown(e: KeyboardEvent, currentValue: string) {
  const tabs = enabledTabs.value
  const idx = tabs.findIndex(t => t.value === currentValue)
  if (idx === -1) return

  let next = -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    next = (idx + 1) % tabs.length
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    next = (idx - 1 + tabs.length) % tabs.length
  } else if (e.key === 'Home') {
    e.preventDefault()
    next = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    next = tabs.length - 1
  }

  if (next !== -1) emit('update:modelValue', tabs[next].value)
}

function tabCls(tab: TabItem) {
  return [
    'tabBtn',
    props.modelValue === tab.value ? 'tabBtnActive' : undefined,
    tab.disabled ? 'tabBtnDisabled' : undefined,
  ].filter(Boolean).join(' ')
}
</script>

<template>
  <div :class="['tabs', props.class].filter(Boolean).join(' ')">
    <div
      ref="tabListRef"
      :class="['tabList', { 'tabList--scrollable': hasOverflow }]"
      role="tablist"
      aria-orientation="horizontal"
    >
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :id="`${uid}-tab-${tab.value}`"
        :aria-controls="`${uid}-panel-${tab.value}`"
        :aria-selected="modelValue === tab.value"
        :disabled="tab.disabled"
        :tabindex="modelValue === tab.value ? 0 : -1"
        :class="tabCls(tab)"
        :ref="modelValue === tab.value ? setActiveTabRef : undefined"
        role="tab"
        type="button"
        @click="select(tab)"
        @keydown="handleKeyDown($event, tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      v-if="$slots[`panel-${modelValue}`]"
      :id="`${uid}-panel-${modelValue}`"
      :aria-labelledby="`${uid}-tab-${modelValue}`"
      class="tabPanel"
      role="tabpanel"
      tabindex="0"
    >
      <slot :name="`panel-${modelValue}`" />
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Tab strip */
.tabList {
  display: flex;
  border-bottom: var(--agala-tab-list-border, var(--agala-border-width) solid hsl(var(--agala-border)));
  gap: var(--agala-tab-gap, 0);
  padding: var(--agala-tab-list-padding, 0);
}

.tabBtn {
  position: relative;
  padding: var(--agala-tab-padding, 0.625rem 1rem);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: calc(-1 * var(--agala-border-width));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-tab-font-size, var(--agala-font-size-base));
  font-weight: var(--agala-tab-font-weight, var(--agala-font-weight-medium));
  color: var(--agala-tab-inactive-color, hsl(var(--agala-muted-foreground)));
  cursor: pointer;
  white-space: nowrap;
  transition:
    color var(--agala-transition-fast),
    border-color var(--agala-transition-fast);
  outline: none;
}

.tabBtn:hover:not(.tabBtnDisabled):not(.tabBtnActive) {
  color: hsl(var(--agala-foreground));
}

.tabBtn:focus-visible {
  outline: 2px solid hsl(var(--agala-ring));
  outline-offset: -2px;
  border-radius: var(--agala-radius-sm) var(--agala-radius-sm) 0 0;
}

.tabBtnActive {
  color: var(--agala-tab-active-color, hsl(var(--agala-primary)));
  border-bottom: var(--agala-tab-active-border, 2px solid hsl(var(--agala-primary)));
}

.tabBtnDisabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Tab panel */
.tabPanel {
  padding-top: 1.25rem;
  outline: none;
}

.tabPanel:focus-visible {
  outline: 2px solid hsl(var(--agala-ring));
  outline-offset: 2px;
  border-radius: var(--agala-radius-sm);
}

@media (max-width: 639px) {
  .tabList {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .tabList::-webkit-scrollbar {
    display: none;
  }

  .tabList.tabList--scrollable {
    mask-image: linear-gradient(to right, transparent, black 0.75rem, black calc(100% - 0.75rem), transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 0.75rem, black calc(100% - 0.75rem), transparent);
  }

  .tabBtn {
    flex-shrink: 0;
  }
}
</style>
