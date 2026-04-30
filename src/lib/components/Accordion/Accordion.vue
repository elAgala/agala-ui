<script setup lang="ts">
import { ref, provide } from 'vue'
import type { AccordionProps } from './types'

const props = withDefaults(defineProps<AccordionProps>(), {
  multiple: false,
})

const openItems = ref<string[]>([])

function toggle(value: string) {
  const isOpen = openItems.value.includes(value)
  if (isOpen) {
    openItems.value = openItems.value.filter(v => v !== value)
  } else if (props.multiple) {
    openItems.value = [...openItems.value, value]
  } else {
    openItems.value = [value]
  }
}

provide('agala-accordion', { openItems, toggle })
</script>

<template>
  <div :class="['accordion', props.class].filter(Boolean).join(' ')">
    <slot />
  </div>
</template>

<style scoped>
.accordion {
  display: flex;
  flex-direction: column;
  border: var(--agala-border-width) solid hsl(var(--agala-border));
  border-radius: var(--agala-radius-lg);
  overflow: hidden;
}
</style>
