<script setup lang="ts">
import { computed } from 'vue'
import type { DividerProps } from './types'

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  labelPosition: 'center',
  class: '',
})

const isHorizontal = computed(() => props.orientation === 'horizontal')
const rootCls = computed(() => [
  'divider',
  isHorizontal.value ? 'dividerH' : 'dividerV',
  props.class,
].filter(Boolean).join(' '))
</script>

<template>
  <div :class="rootCls" role="separator" :aria-orientation="orientation">
    <template v-if="label">
      <span v-if="labelPosition !== 'start'" class="dividerLine" />
      <span class="dividerLabel">{{ label }}</span>
      <span v-if="labelPosition !== 'end'" class="dividerLine" />
    </template>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  border: none;
  color: hsl(var(--agala-muted-foreground));
  font-size: var(--agala-font-size-sm);
  white-space: nowrap;
}

.dividerH {
  width: 100%;
  gap: 0.75rem;
}

.dividerV {
  flex-direction: column;
  height: 100%;
  align-self: stretch;
  gap: 0.5rem;
}

.dividerLine {
  flex: 1;
  background: hsl(var(--agala-border));
}

.dividerH .dividerLine {
  height: 1px;
}

.dividerV .dividerLine {
  width: 1px;
}

.dividerLabel {
  flex-shrink: 0;
  line-height: 1;
}
</style>
