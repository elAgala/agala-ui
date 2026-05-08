<script setup lang="ts">
import { computed } from 'vue'
import type { CardProps, CardPadding, CardAccent } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
})

const paddingMap: Record<CardPadding, string> = {
  none: 'padNone',
  sm:   'padSm',
  md:   'padMd',
  lg:   'padLg',
}

const semanticTokens = ['primary', 'secondary', 'muted', 'danger', 'warning', 'success'] as const

const resolvedAccentColor = computed(() => {
  if (!props.accent) return undefined
  const color = props.accentColor ?? 'primary'
  if ((semanticTokens as readonly string[]).includes(color)) {
    return `hsl(var(--agala-${color}))`
  }
  return color
})

const cls = computed(() => [
  'card',
  props.class,
].filter(Boolean).join(' '))

const bodyCls = computed(() => [
  'cardBody',
  paddingMap[props.padding],
].join(' '))

const cardStyle = computed(() => {
  if (!props.accent || !resolvedAccentColor.value) {
    return {}
  }

  const defaultColor = 'hsl(var(--agala-border))'
  const accentWidth = '4px'
  const defaultWidth = 'var(--agala-border-width, 1px)'

  const sides: CardAccent[] = ['top', 'right', 'bottom', 'left']
  const style: Record<string, string> = {}

  sides.forEach((side) => {
    const isAccent = props.accent === side
    const capitalized = side.charAt(0).toUpperCase() + side.slice(1)
    style[`border${capitalized}Width`] = isAccent ? accentWidth : defaultWidth
    style[`border${capitalized}Color`] = isAccent ? resolvedAccentColor.value : defaultColor
  })

  return style
})
</script>

<template>
  <div :class="cls" :style="cardStyle">
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
