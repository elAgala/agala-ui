<script setup lang="ts">
import { computed, inject, unref } from 'vue'
import type { SidebarGroupProps } from './types'

const props = defineProps<SidebarGroupProps>()

const injected = inject('sidebar-collapsed', false)
const isCollapsed = computed(() => unref(injected))

const cls = computed(() => [
  'sidebarGroup',
  isCollapsed.value ? 'sidebarGroup--collapsed' : undefined,
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div :class="cls">
    <span v-if="label && !isCollapsed" class="sidebarGroup__label">{{ label }}</span>
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

.sidebarGroup--collapsed {
  align-items: center;
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

.sidebarGroup--collapsed .sidebarGroup__content {
  align-items: center;
}
</style>
