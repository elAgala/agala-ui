<script setup lang="ts">
import { computed } from 'vue'
import type { BadgeVariant, BadgeSize } from './types'

const props = withDefaults(defineProps<{
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  class?: string
}>(), {
  variant: 'default',
  size: 'md',
  dot: false,
})

const variantMap: Record<BadgeVariant, string> = {
  default:   'badgeDefault',
  secondary: 'badgeSecondary',
  outline:   'badgeOutline',
  success:   'badgeSuccess',
  warning:   'badgeWarning',
  danger:    'badgeDanger',
}

const sizeMap: Record<BadgeSize, string> = {
  sm: 'badgeSm',
  md: 'badgeMd',
}

const cls = computed(() => [
  'badge',
  variantMap[props.variant],
  sizeMap[props.size],
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <span :class="cls">
    <span v-if="dot" class="dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  border: var(--agala-border-width) solid transparent;
  font-family: var(--agala-font-sans);
  font-weight: var(--agala-font-weight-medium);
  white-space: nowrap;
  line-height: 1;
}

.badgeSm { padding: 0.1875rem 0.5rem; font-size: var(--agala-font-size-sm); }
.badgeMd { padding: 0.25rem 0.625rem; font-size: var(--agala-font-size-base); }

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
</style>
