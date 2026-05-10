<script setup lang="ts">
import { computed, provide } from 'vue'
import Drawer from '../Drawer/Drawer.vue'
import { useMediaQuery } from '../../composables/useMediaQuery'
import type { SidebarProps } from './types'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
  width: '240px',
  collapsedWidth: '64px',
  responsive: true,
  open: false,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'update:open': [value: boolean]
}>()

const { matches: isTablet } = useMediaQuery(`(max-width: 767px)`)
const { matches: isMobile } = useMediaQuery(`(max-width: 639px)`)

const isCollapsed = computed(() => {
  if (!props.responsive) return props.collapsed
  if (isMobile.value) return true
  if (isTablet.value) return true
  return props.collapsed
})

const currentWidth = computed(() => {
  if (!props.responsive) return props.collapsed ? props.collapsedWidth : props.width
  // CSS media queries will override width for tablet/mobile
  return props.collapsed ? props.collapsedWidth : props.width
})

const cls = computed(() => [
  'sidebar',
  props.responsive ? 'sidebarResponsive' : undefined,
  isCollapsed.value ? 'sidebarCollapsed' : undefined,
  props.class,
].filter(Boolean).join(' '))

function toggle() {
  emit('update:collapsed', !props.collapsed)
}

function onDrawerClose() {
  emit('update:open', false)
}

provide('sidebar-collapsed', isCollapsed)
</script>

<template>
  <aside :class="cls" :style="{ '--sidebar-width': currentWidth }">
    <div v-if="$slots.header" class="sidebarHeader">
      <slot name="header" :collapsed="isCollapsed" :toggle="toggle" />
    </div>

    <nav class="sidebarNav">
      <slot :collapsed="isCollapsed" :toggle="toggle" />
    </nav>

    <div v-if="$slots.footer" class="sidebarFooter">
      <slot name="footer" :collapsed="isCollapsed" :toggle="toggle" />
    </div>
  </aside>

  <Drawer
    v-if="responsive"
    :open="open"
    placement="left"
    size="280px"
    @close="onDrawerClose"
  >
    <nav class="sidebarNav drawerNav">
      <slot :collapsed="false" :toggle="toggle" />
    </nav>
  </Drawer>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: var(--sidebar-width, 240px);
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

.drawerNav {
  padding: 0.5rem;
}

.sidebarFooter {
  padding: 0.75rem;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
  flex-shrink: 0;
  overflow: hidden;
}

/* Tablet: auto-collapse to 64px */
@media (max-width: 767px) {
  .sidebar.sidebarResponsive {
    width: 64px !important;
  }
}

/* Mobile: hide sidebar, Drawer takes over */
@media (max-width: 639px) {
  .sidebar.sidebarResponsive {
    display: none;
  }
}
</style>
