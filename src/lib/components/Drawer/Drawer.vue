<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import AgalaIcon from '../AgalaIcon/AgalaIcon.vue'
import type { DrawerProps, DrawerPlacement } from './types'

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  size: '384px',
  dismissible: true,
  escapeCloses: true,
})

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed(() => props.open)

const placementClasses = computed(() => {
  const map: Record<DrawerPlacement, string> = {
    left: 'drawer--left',
    right: 'drawer--right',
    top: 'drawer--top',
    bottom: 'drawer--bottom',
  }
  return map[props.placement]
})

const sizeStyle = computed(() => {
  const isHorizontal = props.placement === 'left' || props.placement === 'right'
  return isHorizontal ? { width: props.size } : { height: props.size }
})

function close() {
  if (props.dismissible) emit('close')
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.escapeCloses && props.dismissible) {
    e.stopPropagation()
    close()
  }
}

watch(isOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onMounted(() => {
  if (isOpen.value && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="open"
        class="drawer-backdrop"
        tabindex="-1"
        @click="onBackdropClick"
        @keydown="onKeydown"
      >
        <Transition :name="`drawer-slide-${placement}`">
          <div
            v-if="open"
            class="drawer"
            :class="[placementClasses, props.class]"
            :style="sizeStyle"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            @keydown="onKeydown"
          >
            <div v-if="$slots.header || title || dismissible" class="drawer__header">
              <slot name="header">
                <h2 v-if="title" class="drawer__title">{{ title }}</h2>
                <span v-else />
              </slot>
              <button
                v-if="dismissible"
                type="button"
                class="drawer__close"
                aria-label="Close drawer"
                @click="close"
              >
                <AgalaIcon name="x" :size="16" />
              </button>
            </div>

            <div class="drawer__body">
              <slot />
            </div>

            <div v-if="$slots.footer" class="drawer__footer">
              <slot name="footer" :close="close" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--agala-z-modal);
  background: hsl(var(--agala-overlay) / 0.4);
  display: flex;
}

.drawer {
  display: flex;
  flex-direction: column;
  background: hsl(var(--agala-card));
  box-shadow: var(--agala-shadow-lg);
  overflow: hidden;
  outline: none;
}

.drawer--left {
  margin-right: auto;
  border-right: var(--agala-border-width) solid hsl(var(--agala-border));
  height: 100%;
}

.drawer--right {
  margin-left: auto;
  border-left: var(--agala-border-width) solid hsl(var(--agala-border));
  height: 100%;
}

.drawer--top {
  margin-bottom: auto;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  width: 100%;
}

.drawer--bottom {
  margin-top: auto;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
  width: 100%;
}

.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  flex-shrink: 0;
}

.drawer__title {
  margin: 0;
  font-size: var(--agala-font-size-lg);
  font-weight: var(--agala-font-weight-semibold);
  line-height: var(--agala-line-height-normal);
  color: hsl(var(--agala-foreground));
}

.drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-muted-foreground));
  cursor: pointer;
  transition: background var(--agala-transition-fast), color var(--agala-transition-fast);
  flex-shrink: 0;
}

.drawer__close:hover {
  background: hsl(var(--agala-accent));
  color: hsl(var(--agala-foreground));
}

.drawer__body {
  flex: 1;
  padding: 1rem 1.25rem;
  overflow-y: auto;
}

.drawer__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
  flex-shrink: 0;
}

/* ── Transitions ── */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity var(--agala-transition-base);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

/* Slide from right */
.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: transform var(--agala-transition-base);
}

.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  transform: translateX(100%);
}

/* Slide from left */
.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
  transition: transform var(--agala-transition-base);
}

.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

/* Slide from top */
.drawer-slide-top-enter-active,
.drawer-slide-top-leave-active {
  transition: transform var(--agala-transition-base);
}

.drawer-slide-top-enter-from,
.drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

/* Slide from bottom */
.drawer-slide-bottom-enter-active,
.drawer-slide-bottom-leave-active {
  transition: transform var(--agala-transition-base);
}

.drawer-slide-bottom-enter-from,
.drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
