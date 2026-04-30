<script setup lang="ts">
import type { EmptyStateProps } from './types'

const props = defineProps<EmptyStateProps>()
</script>

<template>
  <div :class="['emptyState', props.class].filter(Boolean).join(' ')">
    <div v-if="$slots.icon" class="emptyIcon">
      <slot name="icon" />
    </div>
    <div v-else class="emptyIcon emptyIconDefault" aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>

    <p class="emptyTitle">{{ title }}</p>
    <p v-if="description" class="emptyDescription">{{ description }}</p>

    <div v-if="$slots.action" class="emptyAction">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.5rem;
}

.emptyIcon {
  margin-bottom: 0.5rem;
}

.emptyIconDefault {
  color: hsl(var(--agala-muted-foreground));
  opacity: 0.5;
}

.emptyTitle {
  margin: 0;
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-lg);
  font-weight: var(--agala-font-weight-semibold);
  color: hsl(var(--agala-foreground));
}

.emptyDescription {
  margin: 0;
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  color: hsl(var(--agala-muted-foreground));
  max-width: 36ch;
  line-height: var(--agala-line-height-relaxed);
}

.emptyAction {
  margin-top: 0.75rem;
}
</style>
