<script setup lang="ts">
import { computed } from 'vue'
import type { StatProps } from './types'

const props = defineProps<StatProps>()

const trendDir = computed(() => {
  if (props.trend === undefined || props.trend === 0) return 'neutral'
  return props.trend > 0 ? 'up' : 'down'
})

const trendCls = computed(() => {
  if (trendDir.value === 'up')   return 'trendUp'
  if (trendDir.value === 'down') return 'trendDown'
  return 'trendNeutral'
})

const trendSign = computed(() => {
  if (props.trend === undefined) return ''
  return props.trend > 0 ? '+' : ''
})
</script>

<template>
  <div :class="['stat', props.class].filter(Boolean).join(' ')">
    <span class="statLabel">{{ label }}</span>
    <span class="statValue">{{ value }}</span>
    <div v-if="trend !== undefined" :class="['trend', trendCls]">
      <svg
        v-if="trendDir !== 'neutral'"
        class="trendIcon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline v-if="trendDir === 'up'"   points="18 15 12 9 6 15" />
        <polyline v-else                      points="6 9 12 15 18 9" />
      </svg>
      <span class="trendText">{{ trendSign }}{{ trend }}%<template v-if="trendLabel">&ensp;{{ trendLabel }}</template></span>
    </div>
  </div>
</template>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  background-color: hsl(var(--agala-card));
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: var(--agala-radius-lg);
  box-shadow: var(--agala-shadow-sm);
}

.statLabel {
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
  color: hsl(var(--agala-muted-foreground));
  letter-spacing: var(--agala-letter-spacing-wide);
  text-transform: uppercase;
}

.statValue {
  font-family: var(--agala-font-sans);
  font-size: 1.875rem;
  font-weight: var(--agala-font-weight-bold);
  color: hsl(var(--agala-foreground));
  line-height: 1;
  margin: 0.25rem 0;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.trendIcon {
  flex-shrink: 0;
}

.trendText {
  font-family: var(--agala-font-sans);
  font-size: var(--agala-font-size-sm);
  font-weight: var(--agala-font-weight-medium);
}

.trendUp   { color: hsl(var(--agala-success)); }
.trendDown { color: hsl(var(--agala-danger)); }
.trendNeutral { color: hsl(var(--agala-muted-foreground)); }
</style>
