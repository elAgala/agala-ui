<script setup lang="ts">
import { computed } from 'vue'
import type { SidebarProps } from './types'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
  width: '240px',
  collapsedWidth: '64px',
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const currentWidth = computed(() => props.collapsed ? props.collapsedWidth : props.width)

const cls = computed(() => [
  'sidebar',
  props.collapsed ? 'sidebarCollapsed' : undefined,
  props.class,
].filter(Boolean).join(' '))

function toggle() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <aside :class="cls" :style="{ width: currentWidth }">
    <div v-if="$slots.header" class="sidebarHeader">
      <slot name="header" :collapsed="collapsed" :toggle="toggle" />
    </div>

    <nav class="sidebarNav">
      <slot :collapsed="collapsed" :toggle="toggle" />
    </nav>

    <div v-if="$slots.footer" class="sidebarFooter">
      <slot name="footer" :collapsed="collapsed" :toggle="toggle" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: hsl(var(--agala-card));
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
  overflow: hidden;
  flex-shrink: 0;
  transition: width var(--agala-transition-base);
}

.sidebarHeader {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: var(--agala-navbar-height, 3.5rem);
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  flex-shrink: 0;
  overflow: hidden;
}

.sidebarNav {
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebarFooter {
  padding: 0.75rem;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
  flex-shrink: 0;
  overflow: hidden;
}
</style>
