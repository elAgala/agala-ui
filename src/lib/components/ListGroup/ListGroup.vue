<script setup lang="ts">
import { computed } from 'vue'
import type { ListGroupProps } from './types'

const props = withDefaults(defineProps<ListGroupProps>(), {
  gap: '0',
  class: '',
})

const rootStyle = computed(() => ({
  gap: props.gap !== '0' ? props.gap : undefined,
}))
</script>

<template>
  <div :class="['listGroup', $props.class]" :style="rootStyle" role="list">
    <slot />
  </div>
</template>

<style scoped>
.listGroup {
  display: flex;
  flex-direction: column;
  border: 1px solid hsl(var(--agala-border));
  border-radius: var(--agala-radius);
  overflow: hidden;
  padding: 0;
}
</style>
