<script setup lang="ts">
import { computed } from 'vue'
import AgalaIcon from '../AgalaIcon/AgalaIcon.vue'
import type { TagProps } from './types'

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'default',
  size: 'md',
  removable: false,
  color: '',
})

const emit = defineEmits<{
  remove: []
  click: []
}>()

const colorStyle = computed(() => {
  if (!props.color) return undefined
  return {
    backgroundColor: props.color + '1A',
    color: props.color,
  }
})

const cls = computed(() => [
  'tag',
  `tag--${props.variant}`,
  `tag--${props.size}`,
  props.removable && 'tag--removable',
  props.disabled && 'tag--disabled',
  props.class,
].filter(Boolean).join(' '))

function onRemove(e: MouseEvent) {
  e.stopPropagation()
  if (!props.disabled) emit('remove')
}

function onClick() {
  if (!props.disabled) emit('click')
}
</script>

<template>
  <span
    :class="cls"
    :style="colorStyle"
    role="button"
    tabindex="0"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <slot>
      <span class="tag__label">{{ label }}</span>
    </slot>

    <button
      v-if="removable"
      type="button"
      class="tag__remove"
      :disabled="disabled"
      :aria-label="`Remove ${label || 'tag'}`"
      @click="onRemove"
    >
      <AgalaIcon name="x" :size="12" />
    </button>
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--agala-tag-gap, 0.375rem);
  max-width: 100%;
  padding: var(--agala-tag-padding, 0.1875rem 0.5rem);
  border-radius: var(--agala-tag-radius, 99px);
  font-size: var(--agala-tag-font-size, 0.6875rem);
  font-family: var(--agala-font-sans);
  font-weight: var(--agala-font-weight-medium);
  line-height: 1;
  white-space: nowrap;
  cursor: default;
  transition: background var(--agala-transition-fast), color var(--agala-transition-fast), box-shadow var(--agala-transition-fast);
  user-select: none;
  vertical-align: middle;
}

.tag--sm {
  height: var(--agala-tag-height, 1.375rem);
  padding: 0 0.5rem;
  font-size: var(--agala-tag-font-size-sm, 0.6875rem);
  gap: 0.25rem;
}

.tag--md {
  height: var(--agala-tag-height, 1.625rem);
  padding: 0 0.625rem;
  font-size: var(--agala-tag-font-size, 0.75rem);
  gap: 0.375rem;
}

.tag--default {
  background: hsl(var(--agala-muted));
  color: hsl(var(--agala-muted-foreground));
}

.tag--primary {
  background: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
}

.tag--secondary {
  background: hsl(var(--agala-secondary));
  color: hsl(var(--agala-secondary-foreground));
}

.tag--success {
  background: hsl(var(--agala-success));
  color: hsl(var(--agala-success-foreground));
}

.tag--warning {
  background: hsl(var(--agala-warning));
  color: hsl(var(--agala-warning-foreground));
}

.tag--danger {
  background: hsl(var(--agala-danger));
  color: hsl(var(--agala-danger-foreground));
}

.tag--outline {
  background: transparent;
  color: hsl(var(--agala-foreground));
  box-shadow: inset 0 0 0 1px hsl(var(--agala-border));
}

.tag--outline:hover:not(.tag--disabled) {
  background: hsl(var(--agala-accent));
}

.tag__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag--removable {
  padding-right: 0.25rem;
}

.tag--removable.tag--sm {
  padding-right: 0.125rem;
}

.tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: var(--agala-radius-sm);
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--agala-transition-fast), background var(--agala-transition-fast);
}

.tag__remove:hover {
  opacity: 1;
  background: rgb(0 0 0 / 0.1);
}

.tag--disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
