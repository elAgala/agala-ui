<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeVariant, BadgeSize } from './types'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  color?: string
  class?: string
}>(), {
  variant: 'default',
  size: 'md',
  dot: false,
  color: '',
})

const variantMap: Record<BadgeVariant, string> = {
  default:   'badgeDefault',
  secondary: 'badgeSecondary',
  outline:   'badgeOutline',
  subtle:    'badgeSubtle',
  success:   'badgeSuccess',
  warning:   'badgeWarning',
  danger:    'badgeDanger',
}

const sizeMap: Record<BadgeSize, string> = {
  sm: 'badgeSm',
  md: 'badgeMd',
}

const colorStyle = computed(() => {
  if (!props.color) return undefined
  return {
    backgroundColor: props.color + '1A',
    color: props.color,
  }
})

const cls = computed(() => [
  'badge',
  variantMap[props.variant],
  sizeMap[props.size],
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <span :class="cls" :style="colorStyle">
    <span v-if="dot" class="dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: var(--agala-badge-radius, 9999px);
  border: var(--agala-border-width) solid transparent;
  font-family: var(--agala-font-sans);
  font-weight: var(--agala-font-weight-medium);
  white-space: nowrap;
  line-height: 1;
  padding: var(--agala-badge-padding, 0.125rem 0.5rem);
  font-size: var(--agala-badge-font-size, 0.625rem);
}

.badgeSm { font-size: var(--agala-badge-font-size-sm, 0.5625rem); padding: var(--agala-badge-padding-sm, 0.0625rem 0.375rem); }
.badgeMd { font-size: var(--agala-badge-font-size, 0.625rem); padding: var(--agala-badge-padding, 0.125rem 0.5rem); }

/* Dot */
.dot {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.8;
  flex-shrink: 0;
}

/* Variants */
.badgeDefault {
  background-color: hsl(var(--agala-primary));
  color: hsl(var(--agala-primary-foreground));
}

.badgeSecondary {
  background-color: hsl(var(--agala-secondary));
  color: hsl(var(--agala-secondary-foreground));
}

.badgeOutline {
  background-color: transparent;
  border-color: hsl(var(--agala-border));
  color: hsl(var(--agala-foreground));
}

.badgeSuccess {
  background-color: hsl(var(--agala-success) / 0.15);
  color: hsl(var(--agala-success));
  border-color: hsl(var(--agala-success) / 0.3);
}

.badgeWarning {
  background-color: hsl(var(--agala-warning) / 0.15);
  color: hsl(var(--agala-warning));
  border-color: hsl(var(--agala-warning) / 0.3);
}

.badgeDanger {
  background-color: hsl(var(--agala-danger) / 0.15);
  color: hsl(var(--agala-danger));
  border-color: hsl(var(--agala-danger) / 0.3);
}

.badgeSubtle {
  background: hsl(var(--agala-primary) / 0.08);
  color: hsl(var(--agala-primary));
  border: none;
}
.badgeSubtle.badgeSecondary { background: hsl(var(--agala-secondary) / 0.3); color: hsl(var(--agala-secondary-foreground)); }
.badgeSubtle.badgeSuccess { background: hsl(var(--agala-success) / 0.08); color: hsl(var(--agala-success)); }
.badgeSubtle.badgeWarning { background: hsl(var(--agala-warning) / 0.1); color: hsl(var(--agala-warning)); }
.badgeSubtle.badgeDanger { background: hsl(var(--agala-danger) / 0.08); color: hsl(var(--agala-danger)); }
</style>
