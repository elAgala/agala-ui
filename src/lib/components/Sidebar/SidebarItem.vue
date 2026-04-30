<script setup lang="ts">
import { computed } from 'vue'
import AgalaIcon from '../AgalaIcon/AgalaIcon.vue'
import type { SidebarItemProps } from './types'

const props = withDefaults(defineProps<SidebarItemProps>(), {
  badgeVariant: 'default',
  dotVariant: 'primary',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cls = computed(() => [
  'sidebarItem',
  props.active && 'sidebarItem--active',
  props.disabled && 'sidebarItem--disabled',
  props.class,
].filter(Boolean).join(' '))

const badgeCls = computed(() => [
  'sidebarItem__badge',
  `sidebarItem__badge--${props.badgeVariant}`,
].join(' '))

const dotCls = computed(() => [
  'sidebarItem__dot',
  `sidebarItem__dot--${props.dotVariant}`,
].join(' '))

function onClick(e: MouseEvent) {
  if (!props.disabled) emit('click', e)
}
</script>

<template>
  <button
    type="button"
    :class="cls"
    :disabled="disabled"
    :aria-current="active ? 'page' : undefined"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="sidebarItem__icon">
      <slot name="icon" />
    </span>
    <span v-else-if="icon" class="sidebarItem__icon">
      <AgalaIcon :name="icon" :size="18" />
    </span>

    <span class="sidebarItem__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="badge !== undefined" :class="badgeCls">
      {{ badge }}
    </span>

    <span v-if="dot" :class="dotCls" aria-hidden="true" />
  </button>
</template>

<style scoped>
.sidebarItem {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: hsl(var(--agala-foreground));
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-base);
  font-weight: var(--agala-font-weight-normal);
  line-height: var(--agala-line-height-normal);
  text-align: left;
  cursor: pointer;
  transition: background var(--agala-transition-fast), color var(--agala-transition-fast);
  position: relative;
  overflow: hidden;
}

.sidebarItem:hover:not(:disabled):not(.sidebarItem--active) {
  background: hsl(var(--agala-accent));
  color: hsl(var(--agala-accent-foreground));
}

.sidebarItem--active {
  background: hsl(var(--agala-accent));
  color: hsl(var(--agala-accent-foreground));
  font-weight: var(--agala-font-weight-medium);
}

.sidebarItem--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.375rem;
  bottom: 0.375rem;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: hsl(var(--agala-primary));
}

.sidebarItem--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.sidebarItem__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: hsl(var(--agala-muted-foreground));
  transition: color var(--agala-transition-fast);
}

.sidebarItem:hover:not(:disabled) .sidebarItem__icon,
.sidebarItem--active .sidebarItem__icon {
  color: hsl(var(--agala-foreground));
}

.sidebarItem__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebarItem__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.125rem;
  padding: 0 0.375rem;
  border-radius: var(--agala-radius-sm);
  font-size: 0.625rem;
  font-weight: var(--agala-font-weight-semibold);
  line-height: 1;
  letter-spacing: 0.02em;
}

.sidebarItem__badge--default {
  background: hsl(var(--agala-muted));
  color: hsl(var(--agala-muted-foreground));
}

.sidebarItem__badge--warning {
  background: hsl(var(--agala-warning));
  color: hsl(var(--agala-warning-foreground));
}

.sidebarItem__badge--danger {
  background: hsl(var(--agala-danger));
  color: hsl(var(--agala-danger-foreground));
}

.sidebarItem__badge--success {
  background: hsl(var(--agala-success));
  color: hsl(var(--agala-success-foreground));
}

.sidebarItem__dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.sidebarItem__dot--primary {
  background: hsl(var(--agala-primary));
}

.sidebarItem__dot--danger {
  background: hsl(var(--agala-danger));
}

.sidebarItem__dot--warning {
  background: hsl(var(--agala-warning));
}

.sidebarItem__dot--success {
  background: hsl(var(--agala-success));
}
</style>
