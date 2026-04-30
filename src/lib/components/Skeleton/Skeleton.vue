<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps, SkeletonVariant } from './types'

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'line',
})

const defaults: Record<SkeletonVariant, { width: string; height: string }> = {
  line:   { width: '100%',   height: '1rem' },
  circle: { width: '2.5rem', height: '2.5rem' },
  rect:   { width: '100%',   height: '8rem' },
}

const w = computed(() => props.width  ?? defaults[props.variant].width)
const h = computed(() => props.height ?? defaults[props.variant].height)

const cls = computed(() => [
  'skeleton',
  props.variant === 'circle' ? 'skeletonCircle' : undefined,
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div :class="cls" :style="{ width: w, height: h }" aria-hidden="true" />
</template>

<style scoped>
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  border-radius: var(--agala-radius-sm);
  background: linear-gradient(
    90deg,
    hsl(var(--agala-muted))       25%,
    hsl(var(--agala-muted) / 0.5) 50%,
    hsl(var(--agala-muted))       75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeletonCircle {
  border-radius: 50%;
}
</style>
