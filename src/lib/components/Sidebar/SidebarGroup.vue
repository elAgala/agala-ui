<script setup lang="ts">
import { computed } from 'vue'
import type { SidebarGroupProps } from './types'

const props = defineProps<SidebarGroupProps>()

const cls = computed(() => [
  'sidebarGroup',
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div :class="cls">
    <span v-if="label" class="sidebarGroup__label">{{ label }}</span>
    <div class="sidebarGroup__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sidebarGroup {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem 0;
}

.sidebarGroup__label {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.625rem;
  font-weight: var(--agala-font-weight-semibold);
  letter-spacing: var(--agala-letter-spacing-wide);
  text-transform: uppercase;
  color: hsl(var(--agala-muted-foreground));
  line-height: 1;
  user-select: none;
}

.sidebarGroup__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
</style>
