<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressProps, ProgressSize, ProgressColor } from './types'

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  variant: 'linear',
  size: 'md',
  color: 'primary',
  indeterminate: false,
})

/* ── Linear ── */
const linearHeights: Record<ProgressSize, string> = {
  sm: 'var(--agala-progress-linear-height-sm, 0.25rem)',
  md: 'var(--agala-progress-linear-height, 0.5rem)',
  lg: 'var(--agala-progress-linear-height-lg, 0.75rem)',
}

const linearHeight = computed(() => linearHeights[props.size])
const clampedValue  = computed(() => Math.min(100, Math.max(0, props.value ?? 0)))

/* ── Circular ── */
const circularSizes: Record<ProgressSize, number> = { sm: 32, md: 48, lg: 64 }
const circleSize   = computed(() => circularSizes[props.size])
const radius       = computed(() => (circleSize.value - 4) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() =>
  props.indeterminate ? 0 : circumference.value * (1 - clampedValue.value / 100),
)

/* ── Color token ── */
const colorVar: Record<ProgressColor, string> = {
  primary: 'var(--agala-primary)',
  success: 'var(--agala-success)',
  warning: 'var(--agala-warning)',
  danger:  'var(--agala-danger)',
}
const trackColor = computed(() => `hsl(${colorVar[props.color]})`)
</script>

<template>
  <!-- Linear -->
  <div
    v-if="variant === 'linear'"
    :class="['progressLinear', indeterminate ? 'progressIndeterminate' : undefined, props.class].filter(Boolean).join(' ')"
    :style="{ height: linearHeight }"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="progressBar"
      :style="{
        width: indeterminate ? '40%' : `${clampedValue}%`,
        backgroundColor: trackColor,
      }"
    />
  </div>

  <!-- Circular -->
  <svg
    v-else
    :class="['progressCircular', indeterminate ? 'progressCircularIndeterminate' : undefined, props.class].filter(Boolean).join(' ')"
    :width="circleSize"
    :height="circleSize"
    :viewBox="`0 0 ${circleSize} ${circleSize}`"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <circle
      class="circleTrack"
      :cx="circleSize / 2"
      :cy="circleSize / 2"
      :r="radius"
      fill="none"
      :stroke-width="`var(--agala-progress-circle-stroke-width, 4)`"
    />
    <circle
      class="circleFill"
      :cx="circleSize / 2"
      :cy="circleSize / 2"
      :r="radius"
      fill="none"
      :stroke-width="`var(--agala-progress-circle-stroke-width, 4)`"
      :stroke="trackColor"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="strokeDashoffset"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
/* ── Linear ── */
.progressLinear {
  width: 100%;
  border-radius: var(--agala-progress-bar-radius, 9999px);
  background: var(--agala-progress-track-bg, hsl(var(--agala-muted)));
  overflow: hidden;
}

.progressBar {
  height: 100%;
  border-radius: var(--agala-progress-bar-radius, 9999px);
  transition: width var(--agala-transition-base);
}

@keyframes indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.progressIndeterminate .progressBar {
  animation: indeterminate 1.4s infinite ease-in-out;
}

/* ── Circular ── */
.progressCircular {
  display: block;
  transform: rotate(-90deg);
}

.circleTrack {
  stroke: hsl(var(--agala-muted));
}

.circleFill {
  transition: stroke-dashoffset var(--agala-transition-base);
}

@keyframes spin {
  from { transform: rotate(-90deg); }
  to   { transform: rotate(270deg); }
}

.progressCircularIndeterminate {
  animation: spin 1.2s linear infinite;
  transform-origin: center;
}
</style>
