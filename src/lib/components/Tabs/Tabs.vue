<script setup lang="ts">
import { computed } from 'vue'
import type { TabsProps, TabItem } from './types'

let _id = 0

const props = withDefaults(defineProps<TabsProps>(), {})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uid = `tabs-${++_id}`

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
    <div class="tabList" role="tablist" aria-orientation="horizontal">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :id="`${uid}-tab-${tab.value}`"
        :aria-controls="`${uid}-panel-${tab.value}`"
        :aria-selected="modelValue === tab.value"
        :disabled="tab.disabled"
        :tabindex="modelValue === tab.value ? 0 : -1"
        :class="tabCls(tab)"
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
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  gap: 0;
}

.tabBtn {
  position: relative;
  padding: 0.625rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: calc(-1 * var(--agala-border-width));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  font-weight: var(--agala-font-weight-medium);
  color: hsl(var(--agala-muted-foreground));
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
  color: hsl(var(--agala-primary));
  border-bottom-color: hsl(var(--agala-primary));
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
</style>
