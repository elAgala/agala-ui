<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import type { AccordionItemProps } from './types'

const props = defineProps<AccordionItemProps>()

const accordion = inject<{
  openItems: Ref<string[]>
  toggle: (value: string) => void
} | null>('agala-accordion', null)

const isOpen = computed(() => !!accordion?.openItems.value.includes(props.value))

function handleClick() {
  if (!props.disabled) accordion?.toggle(props.value)
}
</script>

<template>
  <div :class="['item', disabled ? 'itemDisabled' : undefined].filter(Boolean).join(' ')">
    <button
      type="button"
      class="trigger"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="handleClick"
    >
      <span class="triggerTitle">{{ title }}</span>
      <span :class="['chevron', isOpen ? 'chevronOpen' : undefined].filter(Boolean).join(' ')" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>

    <div class="panel" :style="{ gridTemplateRows: isOpen ? '1fr' : '0fr' }" role="region">
      <div class="panelInner">
        <div class="panelContent">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
}

.item:last-child {
  border-bottom: none;
}

.itemDisabled {
  opacity: 0.5;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  font-weight: var(--agala-font-weight-medium);
  color: hsl(var(--agala-foreground));
  text-align: left;
  transition: background-color var(--agala-transition-fast);
  outline: none;
}

.trigger:hover:not(:disabled) {
  background-color: hsl(var(--agala-muted));
}

.trigger:focus-visible {
  outline: 2px solid hsl(var(--agala-ring));
  outline-offset: -2px;
}

.trigger:disabled {
  cursor: not-allowed;
}

.triggerTitle {
  flex: 1;
}

.chevron {
  flex-shrink: 0;
  color: hsl(var(--agala-muted-foreground));
  transition: transform var(--agala-transition-base);
}

.chevronOpen {
  transform: rotate(180deg);
}

/* CSS grid trick for smooth height animation — no JS height calc needed */
.panel {
  display: grid;
  transition: grid-template-rows var(--agala-transition-base);
}

.panelInner {
  min-height: 0;
  overflow: hidden;
}

.panelContent {
  padding: 0 1.25rem 1rem;
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  color: hsl(var(--agala-muted-foreground));
  line-height: var(--agala-line-height-relaxed);
}
</style>
