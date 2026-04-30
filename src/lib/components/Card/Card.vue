<script setup lang="ts">
import { computed } from 'vue'
import type { CardProps, CardPadding } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
})

const paddingMap: Record<CardPadding, string> = {
  none: 'padNone',
  sm:   'padSm',
  md:   'padMd',
  lg:   'padLg',
}

const cls = computed(() => [
  'card',
  props.class,
].filter(Boolean).join(' '))

const bodyCls = computed(() => [
  'cardBody',
  paddingMap[props.padding],
].join(' '))
</script>

<template>
  <div :class="cls">
    <div v-if="$slots.header" class="cardHeader">
      <slot name="header" />
    </div>

    <div :class="bodyCls">
      <slot />
    </div>

    <div v-if="$slots.footer" class="cardFooter">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: hsl(var(--agala-card));
  color: hsl(var(--agala-card-foreground));
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: var(--agala-radius-lg);
  box-shadow: var(--agala-shadow-sm);
  display: flex;
  flex-direction: column;
}

.cardHeader {
  padding: 1rem 1.25rem;
  border-bottom: var(--agala-border-width) solid hsl(var(--agala-border));
  font-weight: var(--agala-font-weight-semibold);
  font-size: var(--agala-font-size-base);
  color: hsl(var(--agala-card-foreground));
}

.cardFooter {
  padding: 0.875rem 1.25rem;
  border-top: var(--agala-border-width) solid hsl(var(--agala-border));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Padding variants applied to body */
.padNone { padding: 0; }
.padSm   { padding: 0.75rem; }
.padMd   { padding: 1.25rem; }
.padLg   { padding: 2rem; }
</style>
