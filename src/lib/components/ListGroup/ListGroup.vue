<script setup lang="ts">
import { computed } from 'vue'
import type { ListGroupProps } from './types'

const props = withDefaults(defineProps<ListGroupProps>(), {
  gap: '0',
  borderless: false,
  dividers: true,
  variant: 'divided',
  class: '',
})

const rootCls = computed(() => [
  'listGroup',
  props.borderless ? 'listGroupBorderless' : undefined,
  props.dividers ? undefined : 'listGroupNoDividers',
  props.variant === 'cards' ? 'listGroupCards' : undefined,
  props.class,
].filter(Boolean).join(' '))

const rootStyle = computed(() => ({
  gap: props.gap !== '0' ? props.gap : undefined,
}))
</script>

<template>
  <div :class="rootCls" :style="rootStyle" role="list">
    <slot />
  </div>
</template>

<style scoped>
.listGroup {
  display: flex;
  flex-direction: column;
  border: var(--agala-list-group-border, 1px solid hsl(var(--agala-border)));
  border-radius: var(--agala-list-group-radius, var(--agala-radius));
  overflow: hidden;
  padding: var(--agala-list-group-padding, 0);
  background: var(--agala-list-group-bg, transparent);
}

.listGroupBorderless {
  border: none;
  border-radius: 0;
}

.listGroupNoDividers :deep(.listItem) {
  border-bottom: none;
}

.listGroupNoDividers .listItem:last-child {
  border-bottom: none;
}

.listGroupCards {
  border: none;
  background: transparent;
  padding: 0;
  gap: 4px;
}
.listGroupCards :deep(.listItem) {
  border: 1px solid hsl(var(--agala-border));
  border-radius: var(--agala-radius);
  background: hsl(var(--agala-card));
  box-shadow: var(--agala-shadow-xs);
  border-bottom: 1px solid hsl(var(--agala-border));
}
</style>
