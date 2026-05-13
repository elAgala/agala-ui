<script setup lang="ts">
import { computed } from 'vue'
import type { StackProps } from './types'

const props = withDefaults(defineProps<StackProps>(), {
  direction: 'vertical',
  gap: '0.5rem',
  align: 'stretch',
  wrap: false,
  as: 'div',
  class: '',
})

const style = computed(() => ({
  display: 'flex',
  flexDirection: (props.direction === 'horizontal' ? 'row' : 'column') as 'row' | 'column',
  gap: props.gap,
  alignItems: props.align,
  justifyContent: props.justify,
  flexWrap: (props.wrap ? 'wrap' : undefined) as 'wrap' | undefined,
}))
</script>

<template>
  <component :is="as" :class="$props.class" :style="style">
    <slot />
  </component>
</template>
